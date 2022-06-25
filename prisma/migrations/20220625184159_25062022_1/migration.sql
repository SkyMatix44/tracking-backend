/*
  Warnings:

  - Made the column `userId` on table `activity` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `projectId` to the `News` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `activity` DROP FOREIGN KEY `Activity_userId_fkey`;

-- AlterTable
ALTER TABLE `activity` MODIFY `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `news` ADD COLUMN `projectId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `new_password` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Activity` ADD CONSTRAINT `Activity_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `News` ADD CONSTRAINT `News_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
