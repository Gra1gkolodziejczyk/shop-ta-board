export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly firstname: string,
    public readonly lastname: string,
    public readonly token: string
  ) {}

  isAuthenticated(): boolean {
    return this.token.length > 0;
  }
}
