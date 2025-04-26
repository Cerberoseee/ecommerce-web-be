import { Table, Column, DataType } from 'sequelize-typescript';
import { BaseModel } from './base.model';

@Table({
    tableName: 'products',
})
export class Product extends BaseModel {
    @Column({
        type: DataType.STRING,
        allowNull: false,
        comment: 'Tên sản phẩm',
    })
    productName: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
        comment: 'Barcode duy nhất của sản phẩm',
    })
    barcode: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        comment: 'ID danh mục sản phẩm',
    })
    categoryId: string;

    @Column({
        type: DataType.FLOAT,
        allowNull: false,
        comment: 'Giá nhập sản phẩm',
    })
    importPrice: number;

    @Column({
        type: DataType.FLOAT,
        allowNull: false,
        comment: 'Giá bán lẻ sản phẩm',
    })
    retailPrice: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        comment: 'Nhà sản xuất sản phẩm',
    })
    manufacturer: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
        defaultValue: '',
        comment: 'Mô tả sản phẩm',
    })
    description: string;

    @Column({
        type: DataType.ARRAY(DataType.STRING),
        allowNull: false,
        defaultValue: [],
        comment: 'Danh sách ảnh của sản phẩm',
    })
    image: string[];

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        comment: 'Số lượng hàng tồn kho',
    })
    stockQuantity: number;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Trạng thái kích hoạt của sản phẩm',
    })
    isActive: boolean;
}