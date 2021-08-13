const createTerm = async (req, res) => {
  try {
    const { prisma } = req.context;
    const { name, description, relatedTerm } = req.body;

    if (!name) {
      const error = new Error("용어 이름을 적어주세요.");
      error.statusCode = 400;
      throw error;
    }

    const foundTerm = await prisma.term.findUnique({
      where: {
        name,
      },
    });

    if (foundTerm) {
      const error = new Error("이미 있는 용어입니다.");
      error.statusCode = 400;
      throw error;
    }

    const term = await prisma.term.create({
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
        termId: term.id,
        termRevisionId: term.termRevision[0].id,
      },
    });

    const termRelated = await prisma.termRelated.create({
      data: {
        relatedTerm,
      },
    });

    console.log(termRelated);

    res.status(201).json({
      ...term,
      ...termRelated,
    });
  } catch (err) {
    res.status(err.statusCode).json({ message: err.message });
  }
};

module.exports = createTerm;
