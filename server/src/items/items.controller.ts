import {
  Controller, Get, Post, Put, Delete,
  Param, Query, Body, Req, UseGuards, UseInterceptors, UploadedFile, UploadedFiles,
} from '@nestjs/common';
import { FileInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ItemsService } from './items.service';
import { JwtGuard } from '@/common/guards/jwt.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';

const storage = diskStorage({
  destination: 'uploads/',
  filename: (_req, file, cb) =>
    cb(null, `${file.fieldname}-${Date.now()}.${file.mimetype.split('/')[1]}`),
});

const imageFilter = (_req: any, file: Express.Multer.File, cb: any) => {
  cb(null, file.mimetype === 'image/jpeg' || file.mimetype === 'image/png');
};

@ApiTags('items')
@Controller('api')
export class ItemsController {
  constructor(private items: ItemsService) {}

  @Get('all/books')
  getBooks(@Query() query: Record<string, string>) {
    return this.items.getBooks(query);
  }

  @Get('books/search')
  searchBooks(@Query('search') search: string) {
    return this.items.searchBooks(search);
  }

  @Get('book/:id')
  getBookById(@Param('id') id: string) {
    return this.items.getBookById(+id);
  }

  @Post('book')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('moderator', 'admin')
  @ApiBearerAuth()
  @UseInterceptors(FileFieldsInterceptor(
    [{ name: 'image', maxCount: 1 }, { name: 'cover_front', maxCount: 1 }, { name: 'cover_back', maxCount: 1 }],
    { storage, fileFilter: imageFilter },
  ))
  createBook(@Body() body: any, @UploadedFiles() files: Record<string, Express.Multer.File[]>) {
    return this.items.createBook(body, files);
  }

  @Put('book/:id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('moderator', 'admin')
  @ApiBearerAuth()
  @UseInterceptors(FileFieldsInterceptor(
    [{ name: 'image', maxCount: 1 }, { name: 'cover_front', maxCount: 1 }, { name: 'cover_back', maxCount: 1 }],
    { storage, fileFilter: imageFilter },
  ))
  updateBook(@Param('id') id: string, @Body() body: any, @UploadedFiles() files: Record<string, Express.Multer.File[]>) {
    return this.items.updateBook(+id, body, files);
  }

  @Delete('book/:id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('moderator', 'admin')
  @ApiBearerAuth()
  deleteBook(@Param('id') id: string) {
    return this.items.deleteBook(+id);
  }

  @Get('all/merch')
  getMerch(@Query() query: Record<string, string>) {
    return this.items.getMerch(query);
  }

  @Get('merches/search')
  searchMerch(@Query('search') search: string) {
    return this.items.searchMerch(search);
  }

  @Get('merch/:id')
  getMerchById(@Param('id') id: string) {
    return this.items.getMerchById(+id);
  }

  @Post('merch')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('moderator', 'admin')
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('image', { storage, fileFilter: imageFilter }))
  createMerch(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
    return this.items.createMerch(body, file);
  }

  @Put('merch/:id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('moderator', 'admin')
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('image', { storage, fileFilter: imageFilter }))
  updateMerch(@Param('id') id: string, @Body() body: any, @UploadedFile() file: Express.Multer.File) {
    return this.items.updateMerch(+id, body, file);
  }

  @Delete('merch/:id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('moderator', 'admin')
  @ApiBearerAuth()
  deleteMerch(@Param('id') id: string) {
    return this.items.deleteMerch(+id);
  }

  @Get('item/:id')
  getItemById(@Param('id') id: string) {
    return this.items.getItemById(+id);
  }
}
