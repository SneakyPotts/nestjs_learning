import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { ExpressRequestInterface } from '@app/types/expressRequest.interface';

export const User = createParamDecorator((data: any, req: ExecutionContext) => {
  const request = req.switchToHttp().getRequest<ExpressRequestInterface>();

  if (!request.user) {
    return null;
  }

  if (data) {
    return request.user[data];
  }

  return request.user;
});
