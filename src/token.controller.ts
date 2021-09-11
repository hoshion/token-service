import { Controller, Get } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TokenService } from './token.service';
import { TokensModel } from './tokens.model';

@Controller()
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @MessagePattern("generate-and-save-tokens")
  generateAndSaveTokens(@Payload() email: string): TokensModel {
    return this.tokenService.generateAndSaveToken(email);
  }

  @MessagePattern("check-access-token")
  checkAccessToken(@Payload() accessToken: string): boolean {
    return this.tokenService.validateAccessToken(accessToken)
  }

}
