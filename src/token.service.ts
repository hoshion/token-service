import { Injectable } from '@nestjs/common';
import { sign, verify, JwtPayload } from 'jsonwebtoken';
import { TokenRepository } from './repository/token.repository';
import { TokensModel } from './tokens.model';

@Injectable()
export class TokenService {
  generateAndSaveToken(email: string): TokensModel {
    const tokens: TokensModel = this.generateToken(email);
    this.saveToken(email, tokens.refreshToken);

    return tokens;
  }

  constructor(readonly tokenRepository: TokenRepository) {}

  saveRepository() {
    this.tokenRepository.save();
  }
  
  saveToken(email: string, refreshToken: string) {
    if (this.tokenRepository.exists(email)) {
      this.tokenRepository.updateToken(email, refreshToken);
    } else this.tokenRepository.add(email, refreshToken);

    return { email, refreshToken };
  }

  generateToken(email: string): TokensModel {
    const accessToken: string = this.generateAccessToken(email)
    const refreshToken: string = sign(
      { email },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '30d' },
    );

    return { accessToken, refreshToken };
  }

  private generateAccessToken(email: string) {
    return sign({email}, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' });
  }

  validateAccessToken(token: string): boolean {
    const userData = verify(token, process.env.JWT_ACCESS_SECRET);
    return userData != null
  }
}
