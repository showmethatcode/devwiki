const { prisma } = require("@prisma/client");

const home = async (req, res) => {
  const { prisma } = req.context;
  let is10Newest = [];

  const terms = await prisma.term.findMany({
    take: 10,
    orderBy: {
      createdAt: "desc",
    },
  });

  for (let i = 0; i < terms.length; i++) {
    is10Newest.push(terms[i].name);
  }

  res.send({
    ...is10Newest,
  });
};

const termCreate = async (req, res) => {
  const { prisma } = req.context;
  const { name, description } = req.body;

  const createdTerm = await prisma.term.create({
    data: {
      name,
      termRevision: {
        create: {
          description,
        },
      },
    },
    include: { termRevision: true },
  });

  await prisma.termPointer.create({
    data: {
      termId: createdTerm.id,
      termRevisionId: createdTerm.termRevision[0].id,
    },
  });

  res.send({
    ...createdTerm,
  });
};

const termDetail = async (req, res) => {
  const { prisma } = req.context;
  const { id } = req.params;
  id = Number(id);
  const findTerm = await prisma.term.findUnique({
    where: {
      id: id,
    },
  });
};

module.exports = {
  home,
  termCreate,
  termDetail,
};
