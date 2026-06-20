import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile,UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth,ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';

import { Roles } from '@/common/decorators/roles.decorator';
import { JwtGuard } from '@/common/guards/jwt.guard';
import { RolesGuard } from '@/common/guards/roles.guard';

import { NewsService } from './news.service';

const storage = diskStorage({
  destination: 'uploads/',
  filename: (_req, file, cb) =>
    cb(null, `${file.fieldname}-${Date.now()}.${file.mimetype.split('/')[1]}`),
});

@ApiTags('news')
@Controller('api')
export class NewsController {
  constructor(private news: NewsService) {}

  @Get('all/news')
  getNews(@Query('page') page?: string) {
    return this.news.getNews(page);
  }

  @Get('news/:id')
  getNewsById(@Param('id') id: string) {
    return this.news.getNewsById(+id);
  }

  @Post('news')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('moderator', 'admin')
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('image', { storage }))
  createNews(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
    return this.news.createNews(body, file);
  }

  @Put('news/:id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('moderator', 'admin')
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('image', { storage }))
  updateNews(@Param('id') id: string, @Body() body: any, @UploadedFile() file: Express.Multer.File) {
    return this.news.updateNews(+id, body, file);
  }

  @Delete('news/:id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('moderator', 'admin')
  @ApiBearerAuth()
  deleteNews(@Param('id') id: string) {
    return this.news.deleteNews(+id);
  }
}
