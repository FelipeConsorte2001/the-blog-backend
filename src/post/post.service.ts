import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createSlugFromText } from 'src/common/utils/create-slug-from-text';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}
  async create(dto: CreatePostDto, author: User) {
    const post = this.postRepository.create({
      title: dto.title,
      content: dto.content,
      excerpt: dto.excerpt,
      slug: createSlugFromText(dto.title),
      author,
    });
    return await this.postRepository.save(post).catch((err: unknown) => {
      if (err instanceof Error) {
        this.logger.error('Erro to create post', err.stack);
      }
      throw new BadRequestException('Invalid Post');
    });
  }

  async findAll(postData: Partial<Post>) {
    const post = await this.postRepository.find({
      where: postData,
      order: {
        createdAt: 'desc',
      },
      relations: {
        author: true,
      },
    });

    return post;
  }

  async findOneOrFail(postData: Partial<Post>) {
    const post = await this.findOne(postData);
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async findOne(postData: Partial<Post>) {
    const post = await this.postRepository.findOne({
      where: postData,
      relations: { author: true },
    });
    return post;
  }

  async findOneOwnedOrFail(postData: Partial<Post>, author: User) {
    const post = await this.findOneOwned(postData, author);

    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async findOneOwned(postData: Partial<Post>, author: User) {
    const post = await this.postRepository.findOne({
      where: {
        ...postData,
        author: { id: author.id },
      },
      relations: {
        author: true,
      },
    });
    return post;
  }
  async findAllOwned(author: User) {
    const posts = await this.postRepository.find({
      where: {
        author: { id: author.id },
      },
      order: {
        createdAt: 'DESC',
      },
      relations: {
        author: true,
      },
    });
    return posts;
  }

  async update(postData: Partial<Post>, dto: Partial<Post>, author: User) {
    if (Object.keys(dto).length === 0)
      throw new BadRequestException('Invalid data');

    const post = await this.findOneOwnedOrFail(postData, author);

    post.title = dto.title ?? post.title;
    post.content = dto.content ?? post.content;
    post.excerpt = dto.excerpt ?? post.excerpt;
    post.coverImageUrl = dto.coverImageUrl ?? post.coverImageUrl;
    post.published = dto.published ?? post.published;

    return this.postRepository.save(post);
  }

  async remove(postData: Partial<Post>, author: User) {
    const post = await this.findOneOrFail(postData);
    await this.postRepository.delete({
      ...postData,
      author: { id: author.id },
    });
    return post;
  }
}
