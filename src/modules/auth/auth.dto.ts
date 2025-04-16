import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class SignInDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    description: 'user mail',
    example: 'hello@example.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(255)
  @ApiProperty({
    type: 'string',
    description: 'user password',
    example: 'string',
  })
  password: string;
}

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    description: 'user name',
    example: 'hello@example.com',
  })
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    description: 'user mail',
    example: 'hello@example.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(255)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message: 'Minimum eight characters, at least one uppercase letter, one lowercase letter and one number' 
  })
  @ApiProperty({
    type: 'string',
    description: 'user password',
    example: 'string',
  })
  password: string;
}

export class ForgetPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    description: 'user mail',
    example: 'hello@example.com',
  })
  email: string;
}