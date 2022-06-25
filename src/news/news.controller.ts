import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateNewsDto, UpdateNewsDto } from './dto';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(private newsService: NewsService) {}

  @Post()
  createNews(@Body() dto: CreateNewsDto) {
    return this.newsService.create(dto);
  }

  @Patch(':id')
  updateNews(@Param('id', ParseIntPipe) newsId: number, @Body() dto: UpdateNewsDto) {
    return this.newsService.update(newsId, dto);
  }

  @Delete(':id')
  deleteNews(@Param('id', ParseIntPipe) newsId: number) {
    return this.newsService.delete(newsId);
  }

  @Get(':id')
  getNews(@Param('id', ParseIntPipe) newsId: number) {
    return this.newsService.get(newsId);
  }

  @Get('project/:id')
  getProjectNews(@Param('id', ParseIntPipe) projectId: number) {
    return this.newsService.getProjectNews(projectId);
  }
}
