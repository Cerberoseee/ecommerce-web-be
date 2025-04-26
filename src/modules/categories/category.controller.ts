import { Controller, Get, Post, Put, Delete, Body, Param, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import * as express from 'express';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { CategoryModel } from 'src/models/category.model';
import { BaseController } from 'src/common/base/base.controller';

@ApiTags('Category')
@Controller('v1/categories')
export class CategoryController extends BaseController {
    constructor(private readonly categoryService: CategoryService) {
        super();
    }

    @Post()
    async create(
        @Res() res: express.Response,
        @Body() createCategoryDto: CreateCategoryDto,
    ): Promise<express.Response> {
        const category: CategoryModel = await this.categoryService.create(createCategoryDto);
        return this.successResponse(res, category);
    }

    @Get()
    async findAll(@Res() res: express.Response): Promise<express.Response> {
        const categories: CategoryModel[] = await this.categoryService.findAll();
        return this.successResponse(res, categories);
    }

    @Get(':id')
    async findOne(
        @Res() res: express.Response,
        @Param('id') id: string,
    ): Promise<express.Response> {
        const category: CategoryModel = await this.categoryService.findOne(id);
        return this.successResponse(res, category);
    }

    @Put(':id')
    async update(
        @Res() res: express.Response,
        @Param('id') id: string,
        @Body() updateCategoryDto: UpdateCategoryDto,
    ): Promise<express.Response> {
        const category: CategoryModel = await this.categoryService.update(id, updateCategoryDto);
        return this.successResponse(res, category);
    }

    @Delete(':id')
    async remove(
        @Res() res: express.Response,
        @Param('id') id: string,
    ): Promise<express.Response> {
        await this.categoryService.remove(id);
        return this.successResponse(res);
    }
}