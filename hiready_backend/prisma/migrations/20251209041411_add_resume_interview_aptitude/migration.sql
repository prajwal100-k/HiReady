/*
  Warnings:

  - You are about to drop the column `analyzedAt` on the `Interview` table. All the data in the column will be lost.
  - You are about to drop the column `analyzedAt` on the `Resume` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `AptitudeTest` table without a default value. This is not possible if the table is not empty.
  - Made the column `jobRole` on table `Interview` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "AptitudeTest" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Interview" DROP COLUMN "analyzedAt",
ADD COLUMN     "creativity" DOUBLE PRECISION,
ADD COLUMN     "timeManagement" DOUBLE PRECISION,
ALTER COLUMN "jobRole" SET NOT NULL,
ALTER COLUMN "transcript" DROP NOT NULL,
ALTER COLUMN "overallScore" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "confidenceScore" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "contentScore" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "technicalSkills" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "communication" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "problemSolving" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "confidence" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "technical" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "leadership" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "adaptability" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "teamwork" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Resume" DROP COLUMN "analyzedAt",
ALTER COLUMN "atsScore" SET DATA TYPE DOUBLE PRECISION;
