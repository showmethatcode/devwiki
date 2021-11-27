export async function termUpdateController(req, res) {
  const { prisma } = req.context
  const termId = parseInt(req.params.id, 10)
  const { description } = req.body

  const transactionResult = await prisma.$transaction(async (prisma) => {
    const revision = await prisma.termRevision.create({
      data: { termId, description },
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
      createdAt: revision.term.createdAt,
      updatedAt: revision.term.updatedAt,
    }
  })

  res.json({ term: transactionResult })
}
