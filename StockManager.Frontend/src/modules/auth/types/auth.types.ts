export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Employee';
}

export interface LoginResponse {
  token: string;
  user: User;
}
