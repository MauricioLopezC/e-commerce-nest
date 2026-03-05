import { Prisma } from 'src/generated/prisma/client';
import {
  UserResponseDto,
  UsersListResponseDto,
} from './dtos/users-response.dto';
import { UserSelect } from './user-constants';

type UserWithSelect = Prisma.UserGetPayload<{
  select: typeof UserSelect;
}>;

export type UserWithStats = UserWithSelect & {
  totalSpent?: number;
  totalOrders?: number;
};

export type UsersListWithRelations = {
  users: UserWithStats[];
  metadata: { _count: number };
};

export function mapToUserResponse(user: UserWithStats): UserResponseDto {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    verifiedEmail: user.verifiedEmail,
    role: user.role,
    isBanned: user.isBanned,
    profileImage: user.profileImage,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    totalSpent: user.totalSpent ?? 0,
    totalOrders: user.totalOrders ?? 0,
  };
}

export function mapToUsersListResponse(
  data: UsersListWithRelations,
): UsersListResponseDto {
  return {
    users: data.users.map((user: any) => mapToUserResponse(user)),
    metadata: data.metadata,
  };
}
