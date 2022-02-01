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

  const transactionResult = await prisma.$transaction(async (prisma) => {
    const {
      id: termId,
      name: termName,
      revisions,
      createdAt,
      updatedAt,
      termChild: termsRelated,
    } = await prisma.term.create({
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
              create: { name },
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
        termChild: true,
      },
    })

    const [revision] = revisions
    await prisma.termPointer.create({
      data: { termId, revisionId: revision.id },
    })

    return {
      id: termId,
      termName,
      description,
      createdAt,
      updatedAt,
      termsRelated,
    }
  })

  return res.status(201).json({
    term: transactionResult,
  })
}
