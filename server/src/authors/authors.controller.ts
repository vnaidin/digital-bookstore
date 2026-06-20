import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile,UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth,ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';

import { Roles } from '@/common/decorators/roles.decorator';
import { JwtGuard } from '@/common/guards/jwt.guard';
import { RolesGuard } from '@/common/guards/roles.guard';

import { AuthorsService } from './authors.service';

const storage = diskStorage({
  destination: 'uploads/',
  filename: (_req, file, cb) =>
    cb(null, `${file.fieldname}-${Date.now()}.${file.mimetype.split('/')[1]}`),
});

@ApiTags('authors')
@Controller('api')
export class AuthorsController {
  constructor(private authors: AuthorsService) {}

  @Get('all/authors')
  getAuthors(@Query('page') page?: string) {
    return this.authors.getAuthors(page);
  }

  @Get('author/:id')
  getAuthorById(@Param('id') id: string) {
    return this.authors.getAuthorById(+id);
  }

  @Post('author')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('moderator', 'admin')
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('image', { storage }))
  createAuthor(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
    return this.authors.createAuthor(body, file);
  }

  @Put('author/:id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('moderator', 'admin')
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('image', { storage }))
  updateAuthor(@Param('id') id: string, @Body() body: any, @UploadedFile() file: Express.Multer.File) {
    return this.authors.updateAuthor(+id, body, file);
  }

  @Delete('author/:id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('moderator', 'admin')
  @ApiBearerAuth()
  deleteAuthor(@Param('id') id: string) {
    return this.authors.deleteAuthor(+id);
  }
}
