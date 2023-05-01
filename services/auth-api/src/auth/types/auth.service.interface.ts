import {LoginData, RegisterData, UpdateData, UserData} from './auth.types';
import {User} from "../../user/types/user.model.interface";

export default interface AuthService {
  register(registerData: RegisterData): Promise<UserData>;
  login(loginData: LoginData): Promise<UserData>;
  logout(refreshToken: string): Promise<void>;
  refresh(refreshToken: string): Promise<UserData>;
  delete(userId: string): Promise<void>;
  get(refreshToken: string): Promise<User>;
  update(refreshToken: string, updateData: UpdateData): Promise<User>;
}
