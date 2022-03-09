import { updateTermSchema } from '../../validaitons/index.js'
import _ from 'lodash'

export async function termUpdateController(req, res) {
  const { prisma } = req.context
  const termId = parseInt(req.params.id, 10)
  const { description, termRelatedNames } = req.body
  const isValid = await updateTermSchema.isValid(req.body)
  if (!isValid) {
    return res.sendStatus(400)
  }

  const fetched = await prisma.term.findUnique({
    where: { id: termId },
    include: {
      termChild: true,
      revisions: { take: 1, orderBy: { id: 'desc' } },
    },
  })
  if (!fetched) {
    return res.sendStatus(404)
  }
  const childNames = fetched?.termChild?.map((child) => child.name) || []
  const disconnectTargets = childNames.filter(
    (name) => !termRelatedNames.includes(name),
  )
  const descriptionFetched = fetched.revisions[0].description

  const result = await prisma.$transaction(async (prisma) => {
    const termUpdated = await prisma.term.update({
      where: { id: termId },
      data: {
        ...(description !== descriptionFetched && {
          revisions: {
            create: {
              description,
            },
          },
        }),
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
            disconnect: disconnectTargets.map((name) => ({ name })),
          },
        }),
      },
      include: {
        revisions: { take: 1, orderBy: { id: 'desc' } },
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

    const newRelatedTerms = termUpdated.termChild.filter(
      (term) => !term.revisions[0].termPointer,
    )
    const [revision] = termUpdated.revisions
    await Promise.all([
      prisma.termPointer.update({
        where: { termId },
        data: { revisionId: revision.id },
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

    return termUpdated
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
  return res.json(payload)
}
