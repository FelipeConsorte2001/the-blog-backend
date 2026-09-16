import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import { JwtPayload } from './types/jwt-payload.types';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    const secret = process.env.JWT_SECRET as string;
    if (!secret) {
      throw new InternalServerErrorException('JWT not found');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }
  async validate(payload: JwtPayload) {
    const user = await this.userService.findById(payload.sub);

    if (!user || user.forceLogout)
      throw new UnauthorizedException('You need do the login');

    return user;
  }
}
