import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Request } from '@nestjs/common';
import { TrackingRequest } from '../auth/middleware/auth.middleware';
import { CreateNewsDto, UpdateNewsDto } from './dto';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(private newsService: NewsService) {}

  @Post()
  createNews(@Request() req: TrackingRequest, @Body() dto: CreateNewsDto) {
    return this.newsService.create(req, dto);
  }

  @Patch(':id')
  updateNews(@Request() req: TrackingRequest, @Param('id', ParseIntPipe) newsId: number, @Body() dto: UpdateNewsDto) {
    return this.newsService.update(req, newsId, dto);
  }

  @Delete(':id')
  deleteNews(@Request() req: TrackingRequest, @Param('id', ParseIntPipe) newsId: number) {
    return this.newsService.delete(req, newsId);
  }

  @Get(':id')
  getNews(@Request() req: TrackingRequest, @Param('id', ParseIntPipe) newsId: number) {
    return this.newsService.get(req, newsId);
  }

  @Get('project/:id')
  getProjectNews(@Request() req: TrackingRequest, @Param('id', ParseIntPipe) projectId: number) {
    return this.newsService.getProjectNews(req, projectId);
  }
}
