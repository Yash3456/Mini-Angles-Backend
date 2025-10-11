import {
  ConflictException,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { DatabaseService } from 'Libs/Database/src/database.service';
import { RedisService } from 'Libs/Redis/src';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RedisPubSubService } from 'Libs/Redis/src/redis-pubsub.service';
import { CreateSMEDto, SMEResponse } from 'Libs/Common/DTO/SME.dto';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService implements OnModuleInit {
  private readonly logger = new Logger(UserService.name);

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
          collaterals: collaterals || [] as Prisma.JsonValue,
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
        role: newSMEUser.role,
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

  getHello(): string {
    return 'Hello World!';
  }

  getUser(): string {
    return 'helo';
  }
}
