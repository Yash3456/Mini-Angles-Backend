/*
  Warnings:

  - A unique constraint covering the columns `[phone_number]` on the table `SME` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SME_phone_number_key" ON "public"."SME"("phone_number");
