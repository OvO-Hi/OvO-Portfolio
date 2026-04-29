-- CreateEnum
CREATE TYPE "SkillVisibility" AS ENUM ('AUTO', 'ALWAYS_SHOW', 'HIDDEN');

-- AlterTable
ALTER TABLE "Skill" ADD COLUMN     "visibility" "SkillVisibility" NOT NULL DEFAULT 'AUTO';
