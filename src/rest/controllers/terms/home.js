const getRecentTermList = async (req, res) => {
  const { prisma } = req.context;

  const terms = await prisma.term.findMany({
    take: 10,
    orderBy: {
      createdAt: "desc",
    },
  });

  res.send({
      ...terms
  });
};

module.exports = getRecentTermList;
