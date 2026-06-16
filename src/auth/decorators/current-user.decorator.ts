import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

/**
 * Shortcut buat ambil user yang sudah diverifikasi JwtStrategy.
 * Dipakai di controller: @CurrentUser() user: AuthUser
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
