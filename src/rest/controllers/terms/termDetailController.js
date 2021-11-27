export async function termDetailController(req, res) {
  const { prisma } = req.context
  const { id } = req.params
  const pointer = await prisma.termPointer.findUnique({
    where: { termId: parseInt(id, 10) },
  })

  const [term, revision] = await Promise.all([
    prisma.term.findUnique({ where: { id: pointer.termId } }),
    prisma.termRevision.findUnique({
      where: { id: pointer.revisionId },
      select: { description: true },
    }),
  ])

  res.json({
    term: {
      id: term.id,
      name: term.name,
      description: revision.description,
      createdAt: term.createdAt,
      updatedAt: term.updatedAt,
    },
  })
}
