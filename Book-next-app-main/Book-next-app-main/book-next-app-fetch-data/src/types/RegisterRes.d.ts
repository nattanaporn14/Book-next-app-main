export interface User {
  username: string;
  email: string;
  role: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface RegistrationRes {
  message: string;
  user: User;
  token: string;
}
