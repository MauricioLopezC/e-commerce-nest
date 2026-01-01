import { Role } from '../../auth/enums/role.enum';

export interface JwtPayload {
  id: number;
  email: string;
  role: Role;
  iat: number;
  exp: number;
}
