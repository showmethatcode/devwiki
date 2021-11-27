import { createTermSchema } from '../../validaitons/index.js'

export async function termCreateController(req, res) {
  const { prisma } = req.context
  const { name, description } = req.body
  const isValid = await createTermSchema.isValid(req.body)
  if (!isValid) {
    res.sendStatus(400)
  }

  const {
    id: termId,
    name: termName,
    revisions,
    createdAt,
    updatedAt,
  } = await prisma.term.upsert({
    where: {
      name,
    },
    create: {
      name,
      revisions: {
        create: {
          description,
        },
      },
    },
    update: {
      revisions: {
        create: {
          description,
        },
      },
    },
    include: {
      revisions: {
        take: 1,
      },
    },
  })
  const [revision] = revisions

  await prisma.termPointer.upsert({
    where: { termId },
    create: { termId, revisionId: revision.id },
    update: { termId, revisionId: revision.id },
  })

  res.status(201).json({
    term: {
      id: termId,
      termName,
      description,
      createdAt,
      updatedAt,
    },
  })
}
