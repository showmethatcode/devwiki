const getUpdateTerm = async (req, res) => {
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

const postUpdateTerm = async (req, res) => {
  try {
    const { prisma } = req.context;
    const { description } = req.body;
    const id = Number(req.params.id);

    const termRevision = await prisma.termRevision.create({
      data: {
        description,
        termId: id,
      },
    });

    const termPointer = await prisma.termPointer.update({
      where: {
        termId: id,
      },
      data: {
        termRevisionId: termRevision.id,
      },
    });

    res.send({
      ...termRevision,
      ...termPointer,
    });
  } catch (err) {}
};

module.exports = { getUpdateTerm, postUpdateTerm };
