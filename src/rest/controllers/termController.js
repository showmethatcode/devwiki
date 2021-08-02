const home = async (req, res) => {
  const { prisma } = req.context
  const terms = await prisma.term.findMany()
  
  res.send({
    ...terms
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