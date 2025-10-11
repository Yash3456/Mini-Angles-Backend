-- CreateTable
CREATE TABLE "public"."SME" (
    "uniq_id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT,
    "company_email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "company_address" TEXT NOT NULL,
    "company_monthly_sales" DOUBLE PRECISION NOT NULL,
    "company_annual_sales" DOUBLE PRECISION NOT NULL,
    "google_id" TEXT,
    "role" TEXT NOT NULL DEFAULT 'Co-Founder',
    "aadhar" TEXT NOT NULL,
    "pan" TEXT NOT NULL,
    "collaterals" JSONB NOT NULL,
    "isverified" BOOLEAN NOT NULL,
    "company_GST_Number" TEXT NOT NULL,
    "balance_amount" DOUBLE PRECISION NOT NULL,
    "company_logo" TEXT NOT NULL,
    "company_description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SME_pkey" PRIMARY KEY ("uniq_id")
);

-- CreateTable
CREATE TABLE "public"."Investor" (
    "uniq_id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "monthly_income" DOUBLE PRECISION NOT NULL,
    "annual_family_income" DOUBLE PRECISION NOT NULL,
    "image_url" TEXT NOT NULL,
    "aadhar_card" TEXT NOT NULL,
    "pan_card" TEXT NOT NULL,
    "amount_invested" DOUBLE PRECISION NOT NULL,
    "google_id" TEXT,
    "isverified" BOOLEAN NOT NULL,
    "kyc_status" TEXT NOT NULL DEFAULT 'pending',
    "wallet_balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Investor_pkey" PRIMARY KEY ("uniq_id")
);

-- CreateTable
CREATE TABLE "public"."Token" (
    "id" SERIAL NOT NULL,
    "sme_id" INTEGER NOT NULL,
    "Investor_id" INTEGER NOT NULL,
    "access_token" TEXT NOT NULL,
    "refresh_token" TEXT,
    "expires_in" INTEGER NOT NULL,
    "token_type" TEXT NOT NULL DEFAULT 'Bearer',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Loan" (
    "uniq_id" SERIAL NOT NULL,
    "loan_amount" DOUBLE PRECISION NOT NULL,
    "loan_interest" DOUBLE PRECISION NOT NULL,
    "reciever_id" INTEGER NOT NULL,
    "investor_id" INTEGER,
    "emandate_amount" DOUBLE PRECISION NOT NULL,
    "estimate_date_of_repay" TIMESTAMP(3),
    "transaction_id" INTEGER,
    "platform" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "repayment_schedule" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Loan_pkey" PRIMARY KEY ("uniq_id")
);

-- CreateTable
CREATE TABLE "public"."Transaction" (
    "uniq_id" SERIAL NOT NULL,
    "transaction_amount" DOUBLE PRECISION NOT NULL,
    "transaction_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sender_id" INTEGER NOT NULL,
    "receiver_id" INTEGER NOT NULL,
    "sender_type" TEXT NOT NULL,
    "receiver_type" TEXT NOT NULL,
    "transaction_type" TEXT NOT NULL,
    "platform" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("uniq_id")
);

-- CreateTable
CREATE TABLE "public"."Investment" (
    "id" SERIAL NOT NULL,
    "investorId" INTEGER NOT NULL,
    "smeId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Investment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CompanyGrowth" (
    "id" SERIAL NOT NULL,
    "smeId" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "revenue" DOUBLE PRECISION NOT NULL,
    "profit" DOUBLE PRECISION,
    "valuation" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompanyGrowth_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SME_company_email_key" ON "public"."SME"("company_email");

-- CreateIndex
CREATE UNIQUE INDEX "SME_google_id_key" ON "public"."SME"("google_id");

-- CreateIndex
CREATE UNIQUE INDEX "Investor_email_key" ON "public"."Investor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Investor_google_id_key" ON "public"."Investor"("google_id");

-- AddForeignKey
ALTER TABLE "public"."Token" ADD CONSTRAINT "Token_sme_id_fkey" FOREIGN KEY ("sme_id") REFERENCES "public"."SME"("uniq_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Token" ADD CONSTRAINT "Token_Investor_id_fkey" FOREIGN KEY ("Investor_id") REFERENCES "public"."Investor"("uniq_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Loan" ADD CONSTRAINT "Loan_reciever_id_fkey" FOREIGN KEY ("reciever_id") REFERENCES "public"."SME"("uniq_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Loan" ADD CONSTRAINT "Loan_investor_id_fkey" FOREIGN KEY ("investor_id") REFERENCES "public"."Investor"("uniq_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Loan" ADD CONSTRAINT "Loan_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "public"."Transaction"("uniq_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Investment" ADD CONSTRAINT "Investment_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES "public"."Investor"("uniq_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Investment" ADD CONSTRAINT "Investment_smeId_fkey" FOREIGN KEY ("smeId") REFERENCES "public"."SME"("uniq_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CompanyGrowth" ADD CONSTRAINT "CompanyGrowth_smeId_fkey" FOREIGN KEY ("smeId") REFERENCES "public"."SME"("uniq_id") ON DELETE RESTRICT ON UPDATE CASCADE;
