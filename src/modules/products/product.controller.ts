import { Controller, Get, Post, Put, Delete, Body, Param, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import * as express from 'express';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { Product } from 'src/models/product.model';
import { BaseController } from 'src/common/base/base.controller';

@ApiTags('Product')
@Controller('v1/products')
export class ProductController extends BaseController {
    constructor(private readonly productService: ProductService) {
        super();
    }

    @Post()
    async create(
        @Res() res: express.Response,
        @Body() createProductDto: CreateProductDto,
    ): Promise<express.Response> {
        const product: Product = await this.productService.create(createProductDto);
        return this.successResponse(res, product);
    }

    @Get()
    async findAll(@Res() res: express.Response): Promise<express.Response> {
        const products: Product[] = await this.productService.findAll();
        return this.successResponse(res, products);
    }

    @Get(':id')
    async findOne(
        @Res() res: express.Response,
        @Param('id') id: string,
    ): Promise<express.Response> {
        const product: Product = await this.productService.findOne(id);
        return this.successResponse(res, product);
    }

    @Put(':id')
    async update(
        @Res() res: express.Response,
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto,
    ): Promise<express.Response> {
        const product: Product = await this.productService.update(id, updateProductDto);
        return this.successResponse(res, product);
    }

    @Delete(':id')
    async remove(
        @Res() res: express.Response,
        @Param('id') id: string,
    ): Promise<express.Response> {
        await this.productService.remove(id);
        return this.successResponse(res);
    }
}