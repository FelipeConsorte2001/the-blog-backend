import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Name should be a string' })
  @IsNotEmpty({ message: 'name is not empty' })
  name: string;

  @IsEmail({}, { message: 'Invalid Email' })
  email: string;

  @IsString({ message: 'Password should be a string' })
  @IsNotEmpty({ message: 'Password is not empty' })
  @MinLength(6, { message: 'Password should be min 6 caracteres' })
  password: string;
}
