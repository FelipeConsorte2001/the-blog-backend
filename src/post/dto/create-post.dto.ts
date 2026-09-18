import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class CreatePostDto {
  @IsString({ message: 'Title should be a string' })
  @Length(10, 150, {
    message: 'The title must be between 10 and 200 characters long',
  })
  title: string;

  @IsString({ message: 'Excerpt should be a string' })
  @Length(10, 200, {
    message: 'The excerpt must be between 10 and 200 characters long.',
  })
  excerpt: string;

  @IsString({ message: 'Content should be a string' })
  @IsNotEmpty({ message: 'Content have not be empty' })
  content: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  coverImageUrl?: string;
}
