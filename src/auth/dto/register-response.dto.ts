import { User } from 'src/generated/prisma/client';

export type UserResponse = Omit<User, 'password' | 'role'>;
