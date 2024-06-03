import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { CreateUserDto } from '@/api/users/dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  public async create(createUserDto: CreateUserDto) {
    const { email, phone } = createUserDto;

    if (!email && !phone) throw new BadRequestException('Email or phone is required');

    return this.prisma.users.create({ data: createUserDto });
  }

  public async findAll() {
    return this.prisma.users.findMany();
  }
}
