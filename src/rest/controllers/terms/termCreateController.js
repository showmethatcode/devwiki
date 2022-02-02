import { createTermSchema } from '../../validaitons/index.js'

export async function termCreateController(req, res) {
  const { prisma } = req.context
  const { name, description, termRelatedNames } = req.body
  const isValid = await createTermSchema.isValid(req.body)
  if (!isValid) {
    return res.status(400).send({
      message: 'invalid parameters',
    })
  }

  const termExists = await prisma.term.findUnique({ where: { name } })
  if (termExists) {
    return res.status(400).send({
      message: 'term has already existed',
    })
  }

  const result = await prisma.$transaction(async (prisma) => {
    const termCreated = await prisma.term.create({
      data: {
        name,
        revisions: {
          create: {
            description,
          },
        },
        ...(termRelatedNames?.length && {
          termChild: {
            connectOrCreate: termRelatedNames.map((name) => ({
              where: { name },
              create: {
                name,
                /**
                 * Create Revision for TermRelated
                 */
                revisions: { create: {} },
              },
            })),
          },
        }),
      },
      include: {
        revisions: {
          take: 1,
          orderBy: {
            id: 'desc',
          },
        },
        termChild: {
          include: {
            revisions: {
              take: 1,
              orderBy: { id: 'desc' },
              include: { termPointer: true },
            },
          },
        },
      },
    })

    const newRelatedTerms = termCreated.termChild.filter(
      (term) => !term.revisions[0].termPointer,
    )
    await Promise.all([
      prisma.termPointer.create({
        data: {
          termId: termCreated.id,
          revisionId: termCreated.revisions[0].id,
        },
      }),
      /**
       * Create pointer for TermRelated just created
       */
      ...newRelatedTerms.map((term) =>
        prisma.termPointer.create({
          data: { termId: term.id, revisionId: term.revisions[0].id },
        }),
      ),
    ])

    return termCreated
  })

  const payload = {
    term: {
      id: result.id,
      name: result.name,
      description: result.revisions[0].description,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      termsRelated: result.termChild.map((termRelated) => ({
        id: termRelated.id,
        name: termRelated.name,
      })),
    },
  }
  return res.status(201).json(payload)
}
