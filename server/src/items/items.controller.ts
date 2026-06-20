import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from "@nestjs/platform-express";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { Roles } from "@/common/decorators/roles.decorator";
import { JwtGuard } from "@/common/guards/jwt.guard";
import { RolesGuard } from "@/common/guards/roles.guard";
import { FileUpload } from "@/common/utils/save-upload";

import { ItemsService } from "./items.service";

const imageFilePipe = new ParseFilePipe({
  fileIsRequired: false,
  validators: [new FileTypeValidator({ fileType: /image\/(jpeg|png)/ })],
});

@ApiTags("items")
@Controller("api")
export class ItemsController {
  constructor(private items: ItemsService) {}

  @Get("all/books")
  getBooks(@Query() query: Record<string, string>) {
    return this.items.getBooks(query);
  }

  @Get("books/search")
  searchBooks(@Query("search") search: string) {
    return this.items.searchBooks(search);
  }

  @Get("book/:id")
  getBookById(@Param("id") id: string) {
    return this.items.getBookById(+id);
  }

  @Post("book")
  @UseGuards(JwtGuard, RolesGuard)
  @Roles("moderator", "admin")
  @ApiBearerAuth()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: "image", maxCount: 1 },
        { name: "cover_front", maxCount: 1 },
        { name: "cover_back", maxCount: 1 },
      ],
      {},
    ),
  )
  createBook(
    @Body() body: any,
    @UploadedFiles() files: Record<string, FileUpload[]>,
  ) {
    return this.items.createBook(body, files);
  }

  @Put("book/:id")
  @UseGuards(JwtGuard, RolesGuard)
  @Roles("moderator", "admin")
  @ApiBearerAuth()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: "image", maxCount: 1 },
        { name: "cover_front", maxCount: 1 },
        { name: "cover_back", maxCount: 1 },
      ],
      {},
    ),
  )
  updateBook(
    @Param("id") id: string,
    @Body() body: any,
    @UploadedFiles() files: Record<string, FileUpload[]>,
  ) {
    return this.items.updateBook(+id, body, files);
  }

  @Delete("book/:id")
  @UseGuards(JwtGuard, RolesGuard)
  @Roles("moderator", "admin")
  @ApiBearerAuth()
  deleteBook(@Param("id") id: string) {
    return this.items.deleteBook(+id);
  }

  @Get("all/merch")
  getMerch(@Query() query: Record<string, string>) {
    return this.items.getMerch(query);
  }

  @Get("merches/search")
  searchMerch(@Query("search") search: string) {
    return this.items.searchMerch(search);
  }

  @Get("merch/:id")
  getMerchById(@Param("id") id: string) {
    return this.items.getMerchById(+id);
  }

  @Post("merch")
  @UseGuards(JwtGuard, RolesGuard)
  @Roles("moderator", "admin")
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor("image", {}),
  )
  createMerch(@Body() body: any, @UploadedFile(imageFilePipe) file?: FileUpload) {
    return this.items.createMerch(body, file);
  }

  @Put("merch/:id")
  @UseGuards(JwtGuard, RolesGuard)
  @Roles("moderator", "admin")
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor("image", {}),
  )
  updateMerch(
    @Param("id") id: string,
    @Body() body: any,
    @UploadedFile(imageFilePipe) file?: FileUpload,
  ) {
    return this.items.updateMerch(+id, body, file);
  }

  @Delete("merch/:id")
  @UseGuards(JwtGuard, RolesGuard)
  @Roles("moderator", "admin")
  @ApiBearerAuth()
  deleteMerch(@Param("id") id: string) {
    return this.items.deleteMerch(+id);
  }

  @Get("item/:id")
  getItemById(@Param("id") id: string) {
    return this.items.getItemById(+id);
  }
}
