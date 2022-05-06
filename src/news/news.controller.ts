import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateNewsDto, UpdateNewsDto } from './dto';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(private newsService: NewsService) {}

  @Post()
  createActivity(@Body() dto: CreateNewsDto) {
    return this.newsService.create(dto);
  }

  @Patch(':id')
  updateActivity(@Param('id', ParseIntPipe) newsId: number, @Body() dto: UpdateNewsDto) {
    return this.newsService.update(newsId, dto);
  }

  @Delete(':id')
  deleteActivity(@Param('id', ParseIntPipe) newsId: number) {
    return this.newsService.delete(newsId);
  }

  @Get(':id')
  getActivity(@Param('id', ParseIntPipe) newsId: number) {
    return this.newsService.get(newsId);
  }

  @Get()
  getAllActivity() {
    return this.newsService.getAll();
  }
}
