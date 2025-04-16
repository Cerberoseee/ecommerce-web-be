import {
  Model,
  Column,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  DataType,
  PrimaryKey,
} from 'sequelize-typescript';

export class BaseModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  id: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at?: Date;

  transformToResponse() {
    return JSON.parse(JSON.stringify(this));
  }
}
