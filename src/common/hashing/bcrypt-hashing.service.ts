import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'node_modules/bcryptjs';
import { HashingService } from './hashing.service';

@Injectable()
export class BcryptHashingService extends HashingService {
  constructor(private readonly configService: ConfigService) {
    super();
  }
  async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(
      Number(this.configService.getOrThrow('SALT')),
    );
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
