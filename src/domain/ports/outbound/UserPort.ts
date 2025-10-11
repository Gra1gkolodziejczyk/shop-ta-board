import type { User } from '../../entities/User';

export interface UpdateUserData {
  firstname: string;
  lastname: string;
  email: string;
}

export interface UserPort {
  updateUser(data: UpdateUserData): Promise<User>;
  deleteAccount(): Promise<void>;
}
