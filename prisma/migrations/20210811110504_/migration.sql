/*
  Warnings:

  - You are about to drop the column `name` on the `TermRelated` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TermRelated" DROP COLUMN "name",
ADD COLUMN     "relatedTerm" TEXT[];
