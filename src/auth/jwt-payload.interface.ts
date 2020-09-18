import { UserRole } from './user-role.enum';

export interface JwtPayload {
  name: string;
  role: UserRole;
}
