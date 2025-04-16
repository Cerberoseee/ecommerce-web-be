import { Table, Column, DataType } from 'sequelize-typescript';
import { BaseModel } from './base.model';

@Table({
  modelName: 'users',
})

export class UserModel extends BaseModel {
  @Column({
    type: DataType.STRING,
  })
  name: string;

  @Column({
    type: DataType.STRING,
  })
  email: string;

  @Column({
    type: DataType.STRING,
  })
  role: string;

  @Column({
    type: DataType.STRING,
  })
  password: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_verified: boolean;
}