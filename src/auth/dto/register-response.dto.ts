import { User } from 'src/generated/prisma/client';

export type RegisterResponse = Omit<User, 'password' | 'role'>;
