/*
  Warnings:

  - You are about to drop the column `token_type` on the `Token` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[password]` on the table `Investor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone_number]` on the table `Investor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[password]` on the table `SME` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Token" DROP COLUMN "token_type";

-- CreateIndex
CREATE UNIQUE INDEX "Investor_password_key" ON "public"."Investor"("password");

-- CreateIndex
CREATE UNIQUE INDEX "Investor_phone_number_key" ON "public"."Investor"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "SME_password_key" ON "public"."SME"("password");
