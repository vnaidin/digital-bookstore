import { Controller, Get, Post, Put, Delete, Param, Query, Body, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { NewsService } from './news.service';
import { JwtGuard } from '@/common/guards/jwt.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';

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
