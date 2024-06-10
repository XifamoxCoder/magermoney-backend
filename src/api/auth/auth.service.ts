import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'nestjs-prisma';

import { LoginAuthDto } from '@/api/auth/dto/login-auth.dto';
import { VerifyAuthDto } from '@/api/auth/dto/verify-auth.dto';
import { DetectUserEntity } from '@/api/auth/entities/detect-user.entity';
import { VerifyUserEntity } from '@/api/auth/entities/verify-user.entity';
import { JwtPayload } from '@/api/auth/strategies/jwt.strategy';
import { generateAuthCode } from '@/api/auth/utils';
import { UserEntity } from '@/api/users/entities/user.entity';
import { UsersService } from '@/api/users/users.service';
import { NotifierService } from '@/modules/notifier/notifier.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly isDev: boolean = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly notifierService: NotifierService,
  ) {
    this.isDev = this.configService.get<boolean>('isDev');
  }

  public async detectUser(data: LoginAuthDto): Promise<DetectUserEntity> {
    const { email, phone } = data;

    let user = await this.usersService.findOneByEmailOrPhone(email, phone);

    if (!user) {
      user = await this.usersService.create({ email, phone });
    }

    if (!user.authCode) {
      const authCode = generateAuthCode();

      user = await this.prisma.users.update({ where: { id: user.id }, data: { authCode } });

      if (this.isDev) {
        this.logger.debug(`Auth code ${authCode}`);
      } else {
        await this.notifierService.sendMail<UserEntity>({
          to: user.email,
          subject: 'Magermoney Auth Code',
          template: 'auth-code',
          context: user,
        });
      }
    }

    return { id: user.id };
  }

  public async verifyUser(data: VerifyAuthDto): Promise<VerifyUserEntity> {
    const { userId, authCode, language, darkMode } = data;

    let user = await this.prisma.users.findUniqueOrThrow({ where: { id: userId } });

    if (authCode !== user.authCode) {
      throw new UnauthorizedException('Wrong auth code');
    }

    user = await this.prisma.users.update({ where: { id: user.id }, data: { authCode: null, language, darkMode } });

    return await this.login(user);
  }

  public async login(user: UserEntity) {
    const payload: JwtPayload = { email: user.email, phone: user.phone, sub: user.id };

    return {
      accessToken: !user.authCode ? this.jwtService.sign(payload) : null,
      email: user.email,
      phone: user.phone,
      isFirstTime: user.isFirstTime,
    };
  }
}
