import { Body, Controller, Delete, Get, Param, Patch, Post, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';

import { CreateUserDto } from '@/api/users/dto/create-user.dto';
import { UpdateUserDto } from '@/api/users/dto/update-user.dto';
import { UserEntity } from '@/api/users/entities/user.entity';
import { UsersService } from '@/api/users/users.service';
import { Roles } from '@/shared/decorators';
import { RequestContext } from '@/shared/types';

const controllerName = 'users';

@Controller(controllerName)
@ApiTags(controllerName)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({ type: UserEntity })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles($Enums.Role.ADMIN)
  @ApiOkResponse({ type: UserEntity, isArray: true })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: UserEntity })
  findOne(@Request() req: RequestContext, @Param('id') id: string) {
    return this.usersService.findOne(req, +id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: UserEntity })
  update(@Request() req: RequestContext, @Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req, +id, updateUserDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: UserEntity })
  remove(@Request() req: RequestContext, @Param('id') id: string) {
    return this.usersService.remove(req, +id);
  }
}
