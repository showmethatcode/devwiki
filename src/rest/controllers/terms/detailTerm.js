const detailTerm = async (req, res) => {
  const { prisma } = req.context;
  const id = Number(req.params.id);

  const term = await prisma.term.findUnique({
    where: {
      id,
    },
    include: { termPointer: true },
  });

  const termRevision = await prisma.term.findUnique({
    where: {
      id: term.termPointer.termRevisionId,
    }
  })

  res.send({
    term,
    termRevision,
  });
};

module.exports = detailTerm;
