import { User } from "@prisma/client";
import { Role } from "src/auth/enums/role.enum";

export class UserResponseDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  verifiedEmail: boolean;
  role: string;
  isBanned: boolean;
  profileImage: string;
  createdAt: Date;
  updatedAt: Date;
  totalSpent: number;
  totalOrders: number;
}

class Metadata {
  _count: number;

}

export class UsersListResponseDto {
  users: UserResponseDto[];
  metadata: Metadata;
}
