import {LoginData, RegisterData, UserData} from './auth.types';

export default interface AuthService {
  register(registerData: RegisterData): Promise<UserData>;
  login(loginData: LoginData): Promise<UserData>;
  logout(refreshToken: string): Promise<void>;
  refresh(refreshToken: string): Promise<UserData>;
}
