import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'Libs/Database/src/database.service';
import { RedisService } from 'Libs/Redis/src';
import { RedisPubSubService } from 'Libs/Redis/src/redis-pubsub.service';
import { CreateSMEDto, SMELoginDTO, SMEResponse } from 'Libs/Common/DTO/SME.dto';
import {
  CreateInvestorDto,
  InvestorLoginDTO,
  InvestorResponse,
} from 'Libs/Common/DTO/Investor.dto';
import { Payload } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: DatabaseService,
    private readonly redis: RedisService,
    private readonly pubsub: RedisPubSubService,
    private readonly configsService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.pubsub.subscribe('cahce.Invalidation', (channel, message) => {
      try {
        const { pattern } = JSON.parse(message) as { pattern: string };
        this.redis.cacheInvalidate(pattern).catch((err) => {
          this.logger.error('Error in cache invalidation', err);
        });
      } catch (error) {
        this.logger.error('Error in cache invalidation subscription', error);
      }
    });
  }

  async generateRefreshToken(payload: {
    sub: number;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
  }): Promise<string> {
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configsService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configsService.get<string>('JWT_REFRESH_EXPIRY'),
    });

    await this.prisma.token.create({
      data: {
        sme_id: payload.sub,
        refresh_token: refreshToken,
        expires_in: 30 * 24 * 60 * 60,
      },
    });

    return refreshToken;
  }

  async createSME(createSMEDto: CreateSMEDto): Promise<SMEResponse> {
    try {
      const {
        first_name,
        last_name,
        company_email,
        password,
        phone_number,
        company_name,
        company_address,
        company_monthly_sales,
        company_annual_sales,
        google_id,
        role,
        Company_GST_Number,
        company_description,
        aadhar,
        pan,
        collaterals,
        company_logo,
        Balance_Amount,
        isverified,
      } = createSMEDto;

      let existingUser = await this.prisma.sME.findUnique({
        where: { phone_number },
      });

      if (existingUser) {
        throw new ConflictException(
          'User with this phone number already exists',
        );
      }

      let hashedPassword = await bcrypt.hash(password, 12);

      const newSMEUser = await this.prisma.sME.create({
        data: {
          first_name,
          last_name,
          company_email,
          password: hashedPassword,
          phone_number,
          company_name,
          company_address,
          company_monthly_sales,
          company_annual_sales,
          google_id,
          role,
          company_GST_Number: Company_GST_Number,
          company_description,
          aadhar,
          pan,
          collaterals: collaterals || ([] as Prisma.JsonValue),
          company_logo,
          balance_amount: Balance_Amount,
          isverified,
        },
      });

      const payload = {
        sub: newSMEUser.uniq_id,
        email: newSMEUser.company_email,
        first_name: newSMEUser.first_name,
        last_name: newSMEUser.last_name || '',
        role: 'sme',
      };

      const access_token = await this.jwtService.signAsync(payload);
      const refresh_token = await this.generateRefreshToken(payload);

      await this.redis.setJson(
        `user:${newSMEUser.uniq_id}`,
        {
          newSMEUser,
        },
        3600,
      );

      await this.pubsub.publishAuthEvent(
        'registered',
        newSMEUser.uniq_id.toString(),
        {
          email: newSMEUser.company_email,
          first_name: newSMEUser.first_name,
          last_name: newSMEUser.last_name || '',
          role: newSMEUser.role,
        },
      );

      this.logger.log(`SME user created with ID: ${newSMEUser.uniq_id}`);

      return {
        access_token,
        refresh_token,
        SME: {
          first_name: newSMEUser.first_name,
          last_name: newSMEUser.last_name || '',
          email: newSMEUser.company_email,
          phone_number: newSMEUser.phone_number,
          company_name: newSMEUser.company_name,
          company_address: newSMEUser.company_address,
          company_monthly_sales: newSMEUser.company_monthly_sales,
          company_annual_sales: newSMEUser.company_annual_sales,
          role: newSMEUser.role,
          balance_amount: newSMEUser.balance_amount,
          isverified: newSMEUser.isverified,
          company_logo: newSMEUser.company_logo,
          company_description: newSMEUser.company_description,
          company_GST_Number: newSMEUser.company_GST_Number,
          collaterals: newSMEUser.collaterals as string[],
        },
        expires_in: 30 * 24 * 60 * 60,
      };
    } catch (error) {
      this.logger.error('Error in creating SME', error);
      throw error;
    }
  }

  async createInvestor(
    createInvestorDto: CreateInvestorDto,
  ): Promise<InvestorResponse> {
    let {
      first_name,
      last_name,
      email,
      password,
      phone_number,
      monthly_income,
      annual_family_income,
      image_url,
      aadhar_card,
      pan_card,
      amount_invested,
      google_id,
      isverified,
    } = createInvestorDto;


    const existingInvestor = await this.prisma.investor.findUnique({
      where: { phone_number }
    });

    if(existingInvestor){
      throw new ConflictException('Investor with this phone number already exists');
    }

    let hashedPassword = await bcrypt.hash(password, 12);

    let newInvestor = await this.prisma.investor.create({
      data:{
        first_name,
        last_name,
        email,
        password: hashedPassword,
        phone_number,
        monthly_income,
        annual_family_income,
        image_url,
        aadhar_card,
        pan_card,
        amount_invested,
        google_id,
        isverified
      }
    });

    let payload = {
      sub: newInvestor.uniq_id,
      email: newInvestor.email,
      first_name: newInvestor.first_name,
      last_name: newInvestor.last_name || '',
      role: 'investor',
    }

    let access_token = await this.jwtService.signAsync(payload);
    let refresh_token = await this.generateRefreshToken(payload);

    await this.redis.setJson(`user:${newInvestor.uniq_id}`, {newInvestor}, 3600);
    await this.pubsub.publishAuthEvent('registered', newInvestor.uniq_id.toString(), {
      email: newInvestor.email,
      first_name: newInvestor.first_name,
      last_name: newInvestor.last_name || '',
      role: 'investor',
    });

    this.logger.log(`Investor user created with ID: ${newInvestor.uniq_id}`);

    return {
      access_token,
      refresh_token,
      Investor: {
        first_name: newInvestor.first_name,
        last_name: newInvestor.last_name || '',
        email: newInvestor.email,
        phone_number: newInvestor.phone_number,
        monthly_income: newInvestor.monthly_income,
        annual_family_income: newInvestor.annual_family_income,
        image_url: newInvestor.image_url,
        amount_invested: newInvestor.amount_invested,
        isverified: newInvestor.isverified
      },
      expires_in: 30 * 24 * 60 * 60
    };
  }

  async SMELogin(SMELoginDTO:SMELoginDTO): Promise<SMEResponse> {
   
    let { company_email, password, google_id } = SMELoginDTO;
    
    let hashedPassword = await bcrypt.hash(password, 12);

    let ManualUser = await this.prisma.sME.findUnique({
      where: { company_email, password: hashedPassword }
    }); 

    let GoogleUser = await this.prisma.sME.findUnique({
      where: { google_id }
    });

    if(!ManualUser || !GoogleUser){
      throw new ConflictException('User with this email does not exist');
    } 

    let Payload = {
      sub: ManualUser.uniq_id,
      email: ManualUser.company_email,
      first_name: ManualUser.first_name,
      last_name: ManualUser.last_name || '',
      role: 'sme',
    }

    let access_token = await this.jwtService.signAsync(Payload);
    let refresh_token = await this.generateRefreshToken(Payload);

    await this.redis.setJson(`user:${ManualUser.uniq_id}`, {ManualUser}, 3600);

    this.logger.log(`SME user logged in with ID: ${ManualUser.uniq_id}`);

    return {
      access_token,
      refresh_token,
      SME: {
        first_name: ManualUser.first_name,
        last_name: ManualUser.last_name || '',
        email: ManualUser.company_email,
        phone_number: ManualUser.phone_number,
        company_name: ManualUser.company_name,
        company_address: ManualUser.company_address,
        company_monthly_sales: ManualUser.company_monthly_sales,
        company_annual_sales: ManualUser.company_annual_sales,
        role: ManualUser.role,
        balance_amount: ManualUser.balance_amount,
        isverified: ManualUser.isverified,
        company_logo: ManualUser.company_logo,
        company_description: ManualUser.company_description,
        company_GST_Number: ManualUser.company_GST_Number,
        collaterals: ManualUser.collaterals as string[],
      },
      expires_in: 30 * 24 * 60 * 60,
    };

  }

   async InvestorLogin(InvestorLoginDTO:InvestorLoginDTO): Promise<InvestorResponse> {
   
    let { email, password, google_id } = InvestorLoginDTO;
    
    let hashedPassword = await bcrypt.hash(password, 12);

    let ManualUser = await this.prisma.investor.findUnique({
      where: { email, password: hashedPassword }
    }); 

    let GoogleUser = await this.prisma.investor.findUnique({
      where: { google_id }
    });

    if(!ManualUser || !GoogleUser){
      throw new ConflictException('User with this email does not exist');
    } 

    let Payload = {
      sub: ManualUser.uniq_id,
      email: ManualUser.email,
      first_name: ManualUser.first_name,
      last_name: ManualUser.last_name || '',
      role: 'sme',
    }

    let access_token = await this.jwtService.signAsync(Payload);
    let refresh_token = await this.generateRefreshToken(Payload);

    await this.redis.setJson(`user:${ManualUser.uniq_id}`, {ManualUser}, 3600);

    this.logger.log(`SME user logged in with ID: ${ManualUser.uniq_id}`);

    return {
      access_token,
      refresh_token,
      Investor:{
        first_name: ManualUser.first_name,
        last_name: ManualUser.last_name || '',
        email: ManualUser.email,
        phone_number: ManualUser.phone_number,
        monthly_income: ManualUser.monthly_income,
        annual_family_income: ManualUser.annual_family_income,
        image_url: ManualUser.image_url,
        amount_invested: ManualUser.amount_invested,
        isverified: ManualUser.isverified
      },
      expires_in: 30 * 24 * 60 * 60,
    };
  }

  async SMErefreshToken(refresh_token: string): Promise<SMEResponse> {
  try {
    const payload = await this.jwtService.verifyAsync(refresh_token, {
      secret: this.configsService.get<string>('JWT_REFRESH_SECRET'),
    });

    const validToken = await this.prisma.token.findFirst({
      where: {
        sme_id: payload.sub,
        refresh_token,
      },
    });

    if (!validToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokenCreatedAt = validToken.created_at;
    const expiryMs = validToken.expires_in * 1000;
    if (Date.now() - tokenCreatedAt.getTime() > expiryMs) {
      throw new UnauthorizedException('Refresh token has expired');
    }

    const newPayload = {
      sub: validToken.sme_id,
      email: payload.email,
      first_name: payload.first_name,
      last_name: payload.last_name,
      role: payload.role,
    };

    const access_token = await this.jwtService.signAsync(newPayload);

    let cachedSME: SMEResponse['SME'] | null = await this.redis.getJson(
      `user:${validToken.sme_id}`,
    );

    if (!cachedSME) {
      const SMEFromDB = await this.prisma.sME.findUnique({
        where: { uniq_id: payload.sub },
      });
      if (!SMEFromDB) throw new UnauthorizedException('User not found');

      await this.redis.setJson(`user:${validToken.sme_id}`, SMEFromDB, 3600);
      cachedSME = {
        first_name: SMEFromDB.first_name,
        last_name: SMEFromDB.last_name || '',
        email: SMEFromDB.company_email,
        phone_number: SMEFromDB.phone_number,
        company_name: SMEFromDB.company_name,
        company_address: SMEFromDB.company_address,
        company_monthly_sales: SMEFromDB.company_monthly_sales,
        company_annual_sales: SMEFromDB.company_annual_sales,
        role: SMEFromDB.role,
        balance_amount: SMEFromDB.balance_amount,
        isverified: SMEFromDB.isverified,
        company_logo: SMEFromDB.company_logo,
        company_description: SMEFromDB.company_description,
        company_GST_Number: SMEFromDB.company_GST_Number,
        collaterals: SMEFromDB.collaterals as string[],
      };
    }

    return {
      access_token,
      refresh_token,
      SME: cachedSME,
      expires_in: validToken.expires_in,
    };
  } catch (error) {
    this.logger.error('Error in refreshing SME token', error);
    throw new UnauthorizedException('Invalid refresh token');
  }
}

async InvestorRefreshToken(refresh_token: string): Promise<InvestorResponse> {
  try {
    const payload = await this.jwtService.verifyAsync(refresh_token, {
      secret: this.configsService.get<string>('JWT_REFRESH_SECRET'),
    });

    const validToken = await this.prisma.token.findFirst({
      where: {
        Investor_id: payload.sub,
        refresh_token,
      },
    });

    if (!validToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokenCreatedAt = validToken.created_at;
    const expiryMs = validToken.expires_in * 1000;
    if (Date.now() - tokenCreatedAt.getTime() > expiryMs) {
      throw new UnauthorizedException('Refresh token has expired');
    }

    const newPayload = {
      sub: payload.sub,
      email: payload.email,
      first_name: payload.first_name,
      last_name: payload.last_name,
      role: payload.role,
    };

    const access_token = await this.jwtService.signAsync(newPayload);

    let cachedInvestor: InvestorResponse['Investor'] | null = await this.redis.getJson(
      `user:${payload.sub}`,
    );

    if (!cachedInvestor) {
      const investorFromDB = await this.prisma.investor.findUnique({
        where: { uniq_id: payload.sub },
      });
      if (!investorFromDB) throw new UnauthorizedException('User not found');

      await this.redis.setJson(`user:${payload.sub}`, investorFromDB, 3600);

      cachedInvestor = {
        first_name: investorFromDB.first_name,
        last_name: investorFromDB.last_name || '',
        email: investorFromDB.email,
        phone_number: investorFromDB.phone_number,
        monthly_income: investorFromDB.monthly_income,
        annual_family_income: investorFromDB.annual_family_income,
        image_url: investorFromDB.image_url,
        amount_invested: investorFromDB.amount_invested,
        isverified: investorFromDB.isverified,
      };
    }
    return {
      access_token,
      refresh_token,
      Investor: cachedInvestor,
      expires_in: validToken.expires_in,
    };
  } catch (error) {
    this.logger.error('Error in refreshing Investor token', error);
    throw new UnauthorizedException('Invalid refresh token');
  }
}

}




// npm install tesseract.js sharp multer
// # or yarn add tesseract.js sharp multer

// // src/ocr/ocr-tesseract.service.ts
// import { Injectable, Logger } from '@nestjs/common';
// import * as sharp from 'sharp';
// import { createWorker } from 'tesseract.js';

// @Injectable()
// export class OcrTesseractService {
//   private readonly logger = new Logger(OcrTesseractService.name);
//   private worker = createWorker({
//     // logger: m => console.log(m), // optional progress
//   });

//   private readonly panRegex = /[A-Z]{5}[0-9]{4}[A-Z]/g;
//   private readonly aadharRegex = /\b\d{4}\s?\d{4}\s?\d{4}\b/g;

//   async initWorker() {
//     await this.worker.load();
//     await this.worker.loadLanguage('eng');
//     await this.worker.initialize('eng');
//     // optionally set parameters for better accuracy
//   }

//   async preprocessImage(buffer: Buffer) {
//     return sharp(buffer)
//       .resize({ width: 1200, withoutEnlargement: true })
//       .grayscale()
//       .normalize()
//       .toFormat('png')
//       .toBuffer();
//   }

//   async extractPanAadhar(buffer: Buffer) {
//     try {
//       const pre = await this.preprocessImage(buffer);
//       await this.initWorker();

//       const { data } = await this.worker.recognize(pre);
//       const text = data?.text ?? '';

//       const pans = (text.match(this.panRegex) || []).map(s => s.trim());
//       const aadhars = (text.match(this.aadharRegex) || []).map(s => s.replace(/\s+/g, ''));

//       // terminate worker if you don't need it further
//       await this.worker.terminate();

//       return {
//         text,
//         pan_matches: pans,
//         aadhar_matches: aadhars,
//       };
//     } catch (err) {
//       this.logger.error('Tesseract OCR failed', err);
//       throw err;
//     }
//   }
// }

