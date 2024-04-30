import type { UserType } from '@app/user/types/user.type';

export interface UserResponseInterface {
  user: UserType & { token: string };
}
