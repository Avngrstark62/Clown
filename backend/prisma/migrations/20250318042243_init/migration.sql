/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Follow` table. All the data in the column will be lost.
  - You are about to drop the column `bio` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `followersCount` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `followingCount` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profilePic` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Follow" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "bio",
DROP COLUMN "followersCount",
DROP COLUMN "followingCount",
DROP COLUMN "name",
DROP COLUMN "profilePic";
