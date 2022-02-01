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
    include: { termChild: true },
  })
  if (!fetched) {
    return res.sendStatus(404)
  }
  const childNames = fetched?.termChild?.map((child) => child.name) ?? []
  const deleteTargetNames = childNames.filter(
    (name) => !termRelatedNames.includes(name),
  )
  const transactionResult = await prisma.$transaction(async (prisma) => {
    const { termChild: termsRelated } = await prisma.term.update({
      where: { id: termId },
      data: {
        ...(termRelatedNames && {
          termChild: {
            connectOrCreate: termRelatedNames.map((name) => ({
              where: { name },
              create: { name },
            })),
            disconnect: deleteTargetNames.map((name) => ({ name })),
          },
        }),
      },
      include: {
        termChild: true,
      },
    })

    const revision = await prisma.termRevision.create({
      data: {
        termId,
        description,
      },
      include: { term: true },
    })

    await prisma.termPointer.update({
      where: { termId },
      data: { revisionId: revision.id },
    })

    return {
      id: revision.term.id,
      name: revision.term.name,
      description: revision.description,
      termsRelated: termsRelated,
      createdAt: revision.term.createdAt,
      updatedAt: revision.term.updatedAt,
    }
  })

  return res.json({ term: transactionResult })
}
