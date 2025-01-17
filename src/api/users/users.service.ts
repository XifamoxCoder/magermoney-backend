import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { CreateUserDto } from '@/api/users/dto/create-user.dto';
import { UpdateUserDto } from '@/api/users/dto/update-user.dto';
import { RequestContext } from '@/shared/types';

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

  public async findOne(req: RequestContext, id: number) {
    const { id: userId } = req.user;

    if (userId !== id) throw new ForbiddenException(`You don't have permission to access this resource`);

    const user = await this.prisma.users.findUnique({ where: { id } });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  public async findOneByEmailOrPhone(email: string, phone: string) {
    return this.prisma.users.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });
  }

  public async update(req: RequestContext, id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(req, id);
    return this.prisma.users.update({ where: { id: user.id }, data: updateUserDto });
  }

  public async remove(req: RequestContext, id: number) {
    const user = await this.findOne(req, id);
    return this.prisma.users.delete({ where: { id: user.id } });
  }
}
