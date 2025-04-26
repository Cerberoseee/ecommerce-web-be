import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CategoryModel } from 'src/models/category.model';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';

@Module({
    imports: [SequelizeModule.forFeature([CategoryModel])],
    providers: [CategoryService],
    controllers: [CategoryController],
    exports: [CategoryService],
})
export class CategoryModule { }