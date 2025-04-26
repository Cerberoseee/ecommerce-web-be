import { Table, Column, DataType } from 'sequelize-typescript';
import { BaseModel } from './base.model';

@Table({
    modelName: 'category',
})

export class CategoryModel extends BaseModel {
    @Column({
        type: DataType.STRING,
    })
    name: string;

    @Column({
        type: DataType.TEXT,
        comment: 'Mô tả sản phẩm',
    })
    description: string;
}