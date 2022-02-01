export async function latestTermListController(req, res) {
  const { prisma } = req.context
  const latestTerms = await prisma.term.findMany({
    orderBy: { updatedAt: 'desc' },
    take: 20,
  })
  return res.json({ terms: latestTerms })
}
