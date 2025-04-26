import { IsString, IsNumber, IsBoolean, IsArray, IsOptional } from 'class-validator';

export class CreateProductDto {
    @IsString()
    productName: string;

    @IsString()
    barcode: string;

    @IsString()
    categoryId: string;

    @IsNumber()
    importPrice: number;

    @IsNumber()
    retailPrice: number;

    @IsString()
    manufacturer: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsArray()
    @IsOptional()
    image?: string[];

    @IsNumber()
    stockQuantity: number;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}

export class UpdateProductDto {
    @IsString()
    @IsOptional()
    productName?: string;

    @IsString()
    @IsOptional()
    barcode?: string;

    @IsString()
    @IsOptional()
    categoryId?: string;

    @IsNumber()
    @IsOptional()
    importPrice?: number;

    @IsNumber()
    @IsOptional()
    retailPrice?: number;

    @IsString()
    @IsOptional()
    manufacturer?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsArray()
    @IsOptional()
    image?: string[];

    @IsNumber()
    @IsOptional()
    stockQuantity?: number;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}