const home = async (req, res) => {
  const { prisma } = req.context
  let is10Newest = []

  const terms = await prisma.term.findMany({
    take: 10,
    orderBy: {
      createdAt: "desc"
    }
  })

  for (let i = 0; i < terms.length; i++) {
    is10Newest.push(terms[i].name)
  }

  res.send({
    ...is10Newest
  })
}

const write = async (req, res) => {
  const { prisma } = req.context
  const { name, description } = req.body;

  const createdTerm = await prisma.term.create({
    data: {
      name,
      posts: {
        create: {
          description
        }
      }
    }
  })
  res.send({
    ...createdTerm,
  })
}

module.exports = {
  home,
  write
}