const { prisma } = require("@prisma/client");

const home = async (req, res) => {
  const { prisma } = req.context;
  const is10Newest = [];

  const terms = await prisma.term.findMany({
    // 최근에 추가된 용어 10개 보내주기
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

const createTerm = async (req, res) => {
  const { prisma } = req.context;
  const { name, description } = req.body;

  const newTerm = await prisma.term.create({
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

  const newPointer = await prisma.termPointer.create({
    data: {
      termId: newTerm.id,
      termRevisionId: newTerm.termRevision[0].id,
    },
  });

  res.send({
    ...newTerm,
    ...newPointer,
  });
};

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
  const { prisma } = req.context;
  const id = Number(req.params.id);
  const { description } = req.body;

  const storeDescription = await prisma.termRevision.create({
    data: {
      description,
      termId: id,
    },
  });

  const updateTermPointer = await prisma.termPointer.update({
    where: {
      termId: id,
    },
    data: {
      termRevisionId: storeDescription.id,
    },
  });

  res.send({
    ...storeDescription,
    ...updateTermPointer,
  });
};

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

module.exports = {
  home,
  createTerm,
  detailTerm,
  getUpdateTerm,
  postUpdateTerm,
};
