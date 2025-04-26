import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CategoryModel } from 'src/models/category.model';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { BaseModelService, FindOptions } from 'src/common/base/base.service';

@Injectable()
export class CategoryService extends BaseModelService<CategoryModel> {
    constructor(
        @InjectModel(CategoryModel)
        private readonly categoryModel: typeof CategoryModel,
    ) {
        super(categoryModel);
    }

    async create(createCategoryDto: CreateCategoryDto): Promise<CategoryModel> {
        return this.create(createCategoryDto);
    }

    async findAll(): Promise<CategoryModel[]> {
        return this.findAll();
    }

    async findOne(id: string): Promise<CategoryModel> {
        const category = await this.findById(id);
        if (!category) {
            throw new NotFoundException(`Category with id ${id} not found`);
        }
        return category;
    }

    async update(id: string, updateCategoryDto: UpdateCategoryDto, options?: FindOptions): Promise<CategoryModel> {
        return this.update(id, updateCategoryDto, options);
    }

    async remove(id: string): Promise<void> {
        await this.delete(id);
    }
}