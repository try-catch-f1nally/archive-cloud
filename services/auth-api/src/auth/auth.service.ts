import jwt from 'jsonwebtoken';
import {BadRequestError, UnauthorizedError, TokenPayload} from '@try-catch-f1nally/express-microservice';
import AuthService from './types/auth.service.interface';
import Config from '../config/types/config.interface';
import UserModel, {User} from '../user/types/user.model.interface';
import {LoginData, RegisterData, UpdateData, UserData} from './types/auth.types';

export default class AuthServiceImpl implements AuthService {
  private _config: Config;
  private _userModel: UserModel;

  constructor(config: Config, userModel: UserModel) {
    this._config = config;
    this._userModel = userModel;
  }

  async register({email, password}: RegisterData) {
    const candidate = await this._userModel.findOne({email});
    if (candidate) {
      throw new BadRequestError('User with such email already exists');
    }
    const user = await this._userModel.create({email, password});
    const payload: TokenPayload = {user: {id: user.id}};
    const tokens = this._generateTokens(payload);
    user.token = tokens.refreshToken;
    await user.save();
    return {...tokens, userId: user.id};
  }

  async login({email, password}: LoginData) {
    const user = await this._userModel.findOne({email});
    if (!user?.comparePassword(password)) {
      throw new BadRequestError('Wrong email or password');
    }
    const payload = {user: {id: user.id}};
    const tokens = this._generateTokens(payload);
    user.token = tokens.refreshToken;
    await user.save();
    return {...tokens, userId: user.id};
  }

  async logout(refreshToken: string) {
    const payload = this._decodeExpiredToken(refreshToken, this._config.auth.refreshSecret);
    if (payload === null) {
      throw new UnauthorizedError('Invalid refresh token provided');
    }
    const user = await this._userModel.findById(payload.user.id);
    if (!user) {
      throw new Error(`Wrong user id in token: ${refreshToken}`);
    }
    user.token = undefined;
    await user.save();
  }

  async refresh(refreshToken: string) {
    const invalidTokenError = new UnauthorizedError('Invalid refresh token provided');

    const payload = this._decodeExpiredToken(refreshToken, this._config.auth.refreshSecret);
    if (payload === null) {
      throw invalidTokenError;
    }

    const user = await this._userModel.findOne({_id: payload.user.id});
    if (!user) {
      throw new Error(`Wrong user id in token: ${refreshToken}`);
    }

    const currentToken = user.token;
    user.token = undefined;
    await user.save();

    if (currentToken !== refreshToken) {
      throw invalidTokenError;
    }

    const tokens = this._generateTokens({user: {id: user.id}});
    user.token = tokens.refreshToken;
    await user.save();

    return {...tokens, userId: user.id};
  }

  async delete(userId: string) {
    const user = await this._userModel.findById(userId);
    if (!user) {
      throw new BadRequestError(`User with id ${userId} not found`);
    }
    await user.deleteOne();
  }

  _isTokenPayload(decoded: string | jwt.JwtPayload | null): decoded is TokenPayload {
    return (
      // prettier-ignore
      decoded instanceof Object &&
      'user' in decoded &&
      'id' in decoded.user &&
      typeof decoded.user.id === 'string'
    );
  }

  _decodeExpiredToken(token: string, secretKey: string) {
    let payload = null;
    try {
      payload = jwt.verify(token, secretKey);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        payload = jwt.decode(token);
      }
    }
    return this._isTokenPayload(payload) ? payload : null;
  }

  _generateTokens(payload: TokenPayload) {
    const {privateKey, refreshSecret, accessTokenTtlInSeconds, refreshTokenTtlInSeconds} = this._config.auth;
    return {
      accessToken: jwt.sign(payload, privateKey, {algorithm: 'ES256', expiresIn: accessTokenTtlInSeconds}),
      refreshToken: jwt.sign(payload, refreshSecret, {expiresIn: refreshTokenTtlInSeconds})
    };
  }

  async get(refreshToken: string){
    const payload = await this._decodeExpiredToken(refreshToken, this._config.auth.refreshSecret);
    if (payload === null) {
      throw new UnauthorizedError('Invalid refresh token provided');
    }

    const user = await this._userModel.findById(payload.user.id);
    if (!user) {
      throw new BadRequestError(`User with id ${payload.user.id} not found`);
    }

    return user;
  }

  async update(refreshToken: string, updateData: UpdateData) {
    const payload = await this._decodeExpiredToken(refreshToken, this._config.auth.refreshSecret);
    if (payload === null) {
      throw new UnauthorizedError('Invalid refresh token provided');
    }

    const user = await this._userModel.findById(payload.user.id);
    if (!user) {
      throw new BadRequestError(`User with id ${payload.user.id} not found`);
    }

    user.password = updateData.password;
    user.email = updateData.email;

    return user;
  }
}
