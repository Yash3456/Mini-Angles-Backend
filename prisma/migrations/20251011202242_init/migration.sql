/*
  Warnings:

  - You are about to drop the column `access_token` on the `Token` table. All the data in the column will be lost.
  - Made the column `refresh_token` on table `Token` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Token" DROP COLUMN "access_token",
ALTER COLUMN "refresh_token" SET NOT NULL;
