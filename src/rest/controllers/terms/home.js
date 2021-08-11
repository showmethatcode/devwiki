const getRecentTermList = async (req, res) => {
  const { prisma } = req.context;

  const terms = await prisma.term.findMany({
    take: 10,
    orderBy: {
      createdAt: "desc",
    },
  });

  const termNames = terms.map((term) => term.name);

  res.send({
    recentTermList: [...termNames],
  });
};

module.exports = getRecentTermList;
