import { Body, Controller, Delete, FileTypeValidator, Get, Param, ParseFilePipe, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Roles } from '@/common/decorators/roles.decorator';
import { JwtGuard } from '@/common/guards/jwt.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { FileUpload } from '@/common/utils/save-upload';

import { NewsService } from './news.service';

const imagePipe = new ParseFilePipe({ fileIsRequired: false, validators: [new FileTypeValidator({ fileType: /image\/(jpeg|png)/ })] });

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
  @UseInterceptors(FileInterceptor('image'))
  createNews(@Body() body: any, @UploadedFile(imagePipe) file?: FileUpload) {
    return this.news.createNews(body, file);
  }

  @Put('news/:id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('moderator', 'admin')
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('image'))
  updateNews(@Param('id') id: string, @Body() body: any, @UploadedFile(imagePipe) file?: FileUpload) {
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
