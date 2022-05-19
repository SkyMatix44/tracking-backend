import { Gender, Role } from '@prisma/client';

export interface SignInResult {
  accessToken: string;
  user: UserResult;
}

export interface UserResult {
  id: number;
  email: string;
  role: Role;
  firstName: string;
  lastName: string;
  validated?: boolean;
  blocked?: boolean;
  gender?: Gender;
  address?: string;
  birthday?: number;
  height?: number; // im cm
  weight?: number; // in kg
  universityId?: number;
}
