-- AlterTable
ALTER TABLE "Experience" ADD COLUMN     "projectId" TEXT;

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "linkedinUrl" TEXT;

-- CreateIndex
CREATE INDEX "Experience_projectId_idx" ON "Experience"("projectId");

-- AddForeignKey
ALTER TABLE "Experience" ADD CONSTRAINT "Experience_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
