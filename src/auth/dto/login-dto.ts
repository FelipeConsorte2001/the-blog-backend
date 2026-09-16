import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Invalid Email' })
  email!: string;

  @IsString({ message: 'Password should be a string' })
  @IsNotEmpty({ message: 'Password is not empty' })
  password!: string;
}
