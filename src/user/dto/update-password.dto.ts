import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsString({ message: 'New password should be a string' })
  @IsNotEmpty({ message: 'New password is not empty' })
  currentPassword: string;

  @IsString({ message: 'New password should be a string' })
  @IsNotEmpty({ message: 'New password is not empty' })
  @MinLength(6, { message: 'New password should be min 6 caracteres' })
  newPassword: string;
}
