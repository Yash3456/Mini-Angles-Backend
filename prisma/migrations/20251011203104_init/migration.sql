-- DropForeignKey
ALTER TABLE "public"."Token" DROP CONSTRAINT "Token_Investor_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Token" DROP CONSTRAINT "Token_sme_id_fkey";

-- AlterTable
ALTER TABLE "public"."Token" ALTER COLUMN "sme_id" DROP NOT NULL,
ALTER COLUMN "Investor_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Token" ADD CONSTRAINT "Token_sme_id_fkey" FOREIGN KEY ("sme_id") REFERENCES "public"."SME"("uniq_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Token" ADD CONSTRAINT "Token_Investor_id_fkey" FOREIGN KEY ("Investor_id") REFERENCES "public"."Investor"("uniq_id") ON DELETE SET NULL ON UPDATE CASCADE;
