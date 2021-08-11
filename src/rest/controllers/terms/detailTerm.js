const detailTerm = async (req, res) => {
  const { prisma } = req.context;
  const id = Number(req.params.id);

  const term = await prisma.term.findUnique({
    where: {
      id,
    },
    include: { termPointer: true },
  });

  const termRevision = await prisma.termRevision.findMany({
    where: {
      id: term.termPointer.termRevisionId,
      termId: id,
    },
  });

  res.send({
    term,
    termRevision,
  });
};

module.exports = detailTerm;
