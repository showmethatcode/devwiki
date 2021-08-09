-- CreateTable
CREATE TABLE "Term" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TermRevision" (
    "id" SERIAL NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "termId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TermPointer" (
    "id" SERIAL NOT NULL,
    "termId" INTEGER NOT NULL,
    "termRevisionId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Term.name_unique" ON "Term"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TermPointer.termId_unique" ON "TermPointer"("termId");

-- CreateIndex
CREATE UNIQUE INDEX "TermPointer.termRevisionId_unique" ON "TermPointer"("termRevisionId");

-- AddForeignKey
ALTER TABLE "TermRevision" ADD FOREIGN KEY ("termId") REFERENCES "Term"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TermPointer" ADD FOREIGN KEY ("termId") REFERENCES "Term"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TermPointer" ADD FOREIGN KEY ("termRevisionId") REFERENCES "TermRevision"("id") ON DELETE CASCADE ON UPDATE CASCADE;
