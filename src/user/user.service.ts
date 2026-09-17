import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingService } from 'src/common/hashing/hashing.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}
  async findOneByOrFail(userData: Partial<User>) {
    const user = await this.userRepository.findOneBy(userData);

    if (!user) throw new BadRequestException('User not found');

    return user;
  }

  async create(dto: CreateUserDto) {
    await this.findOneByEmailExist(dto.email);

    const hashedPassword = await this.hashingService.hash(dto.password);

    const newUser: CreateUserDto = {
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    };

    const created = await this.userRepository.save(newUser);
    return created;
  }

  findByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  findById(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  save(user: User) {
    return this.userRepository.save(user);
  }

  async findOneByEmailExist(email: string) {
    const exist = await this.userRepository.existsBy({ email });

    if (exist) throw new ConflictException('E-mail already exist');
  }

  async update(id: string, dto: UpdateUserDto) {
    if (!dto.email && !dto.name) throw new BadRequestException('Invalid data');

    const user = await this.findOneByOrFail({ id });
    user.name = dto.name ?? user.name;

    if (dto.email && dto.email !== user.email) {
      await this.findOneByEmailExist(dto.email);
      user.email = dto.email;
      user.forceLogout = true;
    }

    return this.save(user);
  }

  async updatePassword(id: string, dto: UpdatePasswordDto) {
    const user = await this.findOneByOrFail({ id });

    const isCurrentPasswordValid = await this.hashingService.compare(
      dto.currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid)
      throw new UnauthorizedException('Invalid password');

    user.password = await this.hashingService.hash(dto.newPassword);
    user.forceLogout = true;

    return this.save(user);
  }

  async remove(id: string) {
    const user = this.findOneByOrFail({ id });
    await this.userRepository.delete({ id });
    return user;
  }
}
