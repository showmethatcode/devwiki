import { encodeCursor, decodeCursor } from '../../../utils/index.js'

export async function termListController(req, res) {
  const { prisma } = req.context
  const { cursor } = req.query

  const terms = await prisma.term.findMany({
    orderBy: { name: 'asc' },
    take: 20,
    ...(cursor && { skip: 1, cursor: decodeCursor(cursor) }),
  })

  res.json({
    ...(terms[terms.length - 1] && {
      cursor: encodeCursor({ id: terms[terms.length - 1].id }),
    }),
    terms,
  })
}
