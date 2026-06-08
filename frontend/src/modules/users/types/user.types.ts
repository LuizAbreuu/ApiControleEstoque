export type UserRole = 'Admin' | 'Employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export interface UserListResponse {
  data: User[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}
