import type { UserPort, UpdateUserData } from '../ports/outbound/UserPort';
import type { User } from '../entities/User';

export class UserUseCases {
  constructor(private userPort: UserPort) {}

  async updateUser(data: UpdateUserData): Promise<User> {
    // Validations
    if (data.firstname.trim().length < 2) {
      throw new Error('Le prénom doit contenir au moins 2 caractères');
    }

    if (data.lastname.trim().length < 2) {
      throw new Error('Le nom doit contenir au moins 2 caractères');
    }

    if (!data.email.includes('@')) {
      throw new Error('Email invalide');
    }

    return await this.userPort.updateUser(data);
  }

  async deleteAccount(): Promise<void> {
    await this.userPort.deleteAccount();
  }
}
