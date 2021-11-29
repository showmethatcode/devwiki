import { encodeCursor, decodeCursor } from '../../../utils/index.js'

export async function revisionListController(req, res) {
  const { prisma } = req.context
  const termId = parseInt(req.params.id, 10)
  const { cursor } = req.query

  const { id, name, revisions } = await prisma.term.findUnique({
    where: { id: termId },
    select: {
      id: true,
      name: true,
      revisions: {
        select: {
          id: true,
          description: true,
          createdAt: true,
        },
        where: { termId },
        orderBy: { createdAt: 'desc' },
        take: 1,
        ...(cursor && { skip: 1, cursor: decodeCursor(cursor) }),
      },
    },
  })

  res.json({
    ...(revisions.length && {
      cursor: encodeCursor({ id: revisions[revisions.length - 1].id }),
    }),
    term: { id, name },
    revisions,
  })
}
