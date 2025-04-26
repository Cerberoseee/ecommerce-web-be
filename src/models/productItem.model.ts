import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    CreatedAt,
    UpdatedAt,
} from 'sequelize-typescript';
import moment from 'moment';
import { Product } from './product.model';

export enum ProductStatus {
    IN_STOCK = 'IN_STOCK',     // Còn trong kho
    SOLD = 'SOLD',             // Đã bán
    WARRANTY = 'WARRANTY',     // Đang bảo hành
    RETURNED = 'RETURNED',     // Đã trả lại
    PROCESSING = 'PROCESSING', // Đang xử lý
}

@Table({
    tableName: 'product_items',
})
export class ProductItem extends Model {
    @ForeignKey(() => Product)
    @Column({
        type: DataType.UUID,
        allowNull: false,
        comment: 'ID sản phẩm',
    })
    productId: string;

    @Column({
        type: DataType.STRING,
        unique: true,
        comment: 'Số serial duy nhất của sản phẩm',
    })
    serialNumber: string;

    @Column({
        type: DataType.ENUM(...Object.values(ProductStatus)),
        allowNull: false,
        defaultValue: ProductStatus.IN_STOCK,
        comment: 'Trạng thái của sản phẩm',
    })
    status: ProductStatus;

    @CreatedAt
    @Column({
        type: DataType.DATE,
        comment: 'Ngày tạo',
    })
    createdAt: Date;

    @UpdatedAt
    @Column({
        type: DataType.DATE,
        comment: 'Ngày cập nhật',
    })
    updatedAt: Date;

    toJSON() {
        const values = Object.assign({}, this.get());
        return {
            productItemId: values.id,
            productId: values.productId,
            serialNumber: values.serialNumber,
            status: values.status,
            createdAt: moment(values.createdAt).format('DD/MM/YYYY HH:mm:ss'),
            updatedAt: moment(values.updatedAt).format('DD/MM/YYYY HH:mm:ss'),
        };
    }
}