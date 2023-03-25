import {
  Controller,
  Request,
  Response,
  NextFunction,
  Router,
  BadRequestError,
  UnauthorizedError
} from '@try-catch-f1nally/express-microservice';
import {Config} from '../config/types/config.interface';
import AuthService from './types/auth.service.interface';
import AuthValidator from './types/auth.validator.interface';

export default class AuthController implements Controller {
  private _router = Router();
  private _config: Config;
  private _authService: AuthService;
  private _authValidator: AuthValidator;

  constructor(config: Config, authService: AuthService, authValidator: AuthValidator) {
    this._config = config;
    this._authService = authService;
    this._authValidator = authValidator;
    this._registerRoutes();
  }

  get router() {
    return this._router;
  }

  private _registerRoutes() {
    this.router.post('/register', this._register.bind(this));
    this.router.post('/login', this._login.bind(this));
    this.router.post('/logout', this._logout.bind(this));
    this.router.post('/refresh', this._refresh.bind(this));
  }

  private async _register(req: Request, res: Response, next: NextFunction) {
    try {
      if (!this._authValidator.validateRegisterData(req.body)) {
        throw new BadRequestError('Invalid registration data', this._authValidator.validateRegisterData.errors);
      }
      const {refreshToken, ...userData} = await this._authService.register(req.body);
      this._setTokenInCookie(res, refreshToken);
      return res.status(201).json(userData);
    } catch (error) {
      next(error);
    }
  }

  private async _login(req: Request, res: Response, next: NextFunction) {
    try {
      if (!this._authValidator.validateLoginData(req.body)) {
        throw new BadRequestError('Invalid login data', this._authValidator.validateLoginData.errors);
      }
      const {refreshToken, ...userData} = await this._authService.login(req.body);
      this._setTokenInCookie(res, refreshToken);
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  private async _logout(req: Request, res: Response, next: NextFunction) {
    try {
      const {refreshToken} = req.cookies;
      if (!refreshToken) {
        throw new UnauthorizedError('Refresh token is missing');
      }
      this._removeTokenFromCookie(res);
      await this._authService.logout(refreshToken);
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }

  private async _refresh(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.cookies.refreshToken) {
        throw new UnauthorizedError('Refresh token is missing');
      }
      this._removeTokenFromCookie(res);
      const {refreshToken, ...userData} = await this._authService.refresh(req.cookies.refreshToken);
      this._setTokenInCookie(res, refreshToken);
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  private _setTokenInCookie(res: Response, token: string) {
    res.cookie('refreshToken', token, {
      maxAge: this._config.auth.refreshTokenTtlInSeconds * 1000,
      httpOnly: true
    });
  }

  private _removeTokenFromCookie(res: Response) {
    res.clearCookie('refreshToken');
  }
}
