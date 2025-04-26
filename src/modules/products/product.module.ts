import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from 'src/models/product.model';
import { ProductService } from 'src/modules/products/product.service';
import { ProductController } from 'src/modules/products/product.controller';

@Module({
    imports: [SequelizeModule.forFeature([Product])],
    providers: [ProductService],
    controllers: [ProductController],
})
export class ProductModule { }