const createTerm = async (req, res) => {
  try {
    const { prisma } = req.context;
    const { name, description, relatedTerm } = req.body;
    
    const foundTerm = await prisma.term.findUnique({
      where: {
        name,
      },
    });

    if (!name || foundTerm) {
      const error = new Error("용어 이름이 작성되지 않았거나 이미 있는 용어입니다.");
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

    const termPointer = await prisma.termPointer.create({
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

    res.status(201).json({
      ...term,
      ...termPointer,
      ...termRelated,
    });
  } catch (err) {
    res.status(err.statusCode).json({ message: err.message });
  }
};

module.exports = createTerm;
