import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtGuard } from '@/common/guards/jwt.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';

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
