export interface AuthenticatedUser {
  sub: string;
  email: string;
  preferred_username: string;
  roles: string[];
}
