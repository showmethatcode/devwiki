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

const writeTerm = async (req, res) => {
  const { prisma } = req.context;
  const { name, description } = req.body;

  const checkSameTerm = await prisma.term.findUnique({
    where: {
      name,
    },
  });

  console.log(checkSameTerm);

  const createTerm = await prisma.term.create({
    // 용어 생성과 동시에 내용 생성, termRevision 정보도 가져온다.
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

  console.log(createTerm);

  const createTermPointer = await prisma.termPointer.create({
    // 위에서 가져온 termRevision으로 termPointer에 있는 termRevisionId value 저장
    data: {
      termId: createTerm.id,
      termRevisionId: createTerm.termRevision[0].id,
    },
  });

  res.send({
    ...createTerm,
    ...createTermPointer,
  });
};

const getUpdateTerm = async (req, res) => {
  const { prisma } = req.context;
  const id = Number(req.params.id);

  const findTerm = await prisma.term.findUnique({
    // 업데이트 할 용어 가져오고, termPointer 정보도 가져온다.
    where: {
      id,
    },
    include: { termPointer: true },
  });

  const findTermRevision = await prisma.termRevision.findMany({
    // findTerm에서 가져온 termPointer 정보에 담겨있는 termRevisionId 값을 이용해 체크포인트로 저장된 description을 보내줌
    where: {
      id: findTerm.termPointer.termRevisionId,
      termId: id,
    },
  });

  const termName = findTerm.name;
  const termDescription = findTermRevision[0].description;

  res.send({
    termName,
    termDescription,
  });
};

const postUpdateTerm = async (req, res) => {
  const { prisma } = req.context;
  const id = Number(req.params.id);
  const { description } = req.body;

  const createDescription = await prisma.termRevision.create({
    // 같은 용어를 다루기에 params에서 id값 받아와 termId에 넣어준 후 request body에서 description 받아와 새로운 튜플 생성, 로그를 남겨야 하기에 update가 아닌 create 함
    data: {
      description,
      termId: id,
    },
  });

  const updateTermPointer = await prisma.termPointer.update({
    // termPointer는 현재 어떤 description을 사용하는지를 알 수 있는 체크포인트이기에 termRevisionId만 update 함
    where: {
      termId: id,
    },
    data: {
      termRevisionId: createDescription.id,
    },
  });

  res.send({
    ...createDescription,
    ...updateTermPointer,
  });
};

const detailTerm = async (req, res) => {
  const { prisma } = req.context;
  const id = Number(req.params.id);

  const findTerm = await prisma.term.findUnique({
    // 업데이트 할 용어 가져오고, termPointer 정보도 가져온다.
    where: {
      id,
    },
    include: { termPointer: true },
  });

  const findTermRevision = await prisma.termRevision.findMany({
    // findTerm에서 가져온 termPointer 정보에 담겨있는 termRevisionId 값을 이용해 체크포인트로 저장된 description을 보내줌
    where: {
      id: findTerm.termPointer.termRevisionId,
      termId: id,
    },
  });

  const termName = findTerm.name;
  const termDescription = findTermRevision[0].description;

  res.send({
    termName,
    termDescription,
  });
};

module.exports = {
  home,
  writeTerm,
  detailTerm,
  getUpdateTerm,
  postUpdateTerm,
};
