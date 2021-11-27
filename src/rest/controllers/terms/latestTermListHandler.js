export async function latestTermListHandler(req, res) {
  const { prisma } = req.context
  const latestTerms = await prisma.term.findMany()
  res.json({ terms: latestTerms })
}
