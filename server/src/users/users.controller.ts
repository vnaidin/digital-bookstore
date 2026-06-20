import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth,ApiTags } from '@nestjs/swagger';

import { Roles } from '@/common/decorators/roles.decorator';
import { JwtGuard } from '@/common/guards/jwt.guard';
import { RolesGuard } from '@/common/guards/roles.guard';

import { UsersService } from './users.service';

@ApiTags('users')
@Controller('api')
export class UsersController {
  constructor(private users: UsersService) {}

  @Get('all/user')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  getAllUsers() {
    return this.users.getAllUsers();
  }

  @Get('all/mod')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  getModerators() {
    return this.users.getModerators();
  }

  @Post('user/create')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  createUser(@Body() body: any) {
    return this.users.createUser(body);
  }

  @Put('user/:id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  updateInfo(@Param('id') id: string, @Body() body: any) {
    return this.users.updateInfo(+id, body);
  }

  @Delete('user/:id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  deleteUser(@Param('id') id: string) {
    return this.users.deleteUser(+id);
  }
}
