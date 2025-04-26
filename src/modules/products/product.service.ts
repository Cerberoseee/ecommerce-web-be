import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from 'src/models/product.model';
import { CreateProductDto, UpdateProductDto } from 'src/modules/products/product.dto';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product)
        private productModel: typeof Product,
    ) { }

    async create(createProductDto: CreateProductDto): Promise<Product> {
        return this.productModel.create({ ...createProductDto });
    }

    async findAll(): Promise<Product[]> {
        return this.productModel.findAll();
    }

    async findOne(id: string): Promise<Product> {
        const product = await this.productModel.findByPk(id);
        if (!product) {
            throw new NotFoundException(`Product with id ${id} not found`);
        }
        return product;
    }

    async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
        const product = await this.findOne(id);
        return product.update({ ...updateProductDto });
    }

    async remove(id: string): Promise<void> {
        const product = await this.findOne(id);
        await product.destroy();
    }
}