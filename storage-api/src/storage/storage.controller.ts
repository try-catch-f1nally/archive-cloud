import {
  BadRequestError,
  Controller,
  Middleware,
  NextFunction,
  Request,
  Response,
  Router
} from '@try-catch-f1nally/express-microservice';
import Config from '../config/types/config.interface';
import {StorageService} from './types/storage.service.interface';
import StorageValidator from './types/storage.validator.interface';

export default class StorageController implements Controller {
  private _router = Router();
  private _config: Config;
  private _storageService: StorageService;
  private _storageValidator: StorageValidator;
  private _authMiddleware: Middleware;

  constructor(
    config: Config,
    storageService: StorageService,
    storageValidator: StorageValidator,
    authMiddleware: Middleware
  ) {
    this._config = config;
    this._storageService = storageService;
    this._storageValidator = storageValidator;
    this._authMiddleware = authMiddleware;
    this._initialiseRouter();
  }

  get router() {
    return this._router;
  }

  private _initialiseRouter(): void {
    this.router.get('/archive', this._authMiddleware.middleware, this._getUserArchives.bind(this));
    this.router.post('/archive', this._discoverArchive.bind(this));
    this.router.delete('/archive/:id', this._authMiddleware.middleware, this._deleteArchive.bind(this));
  }

  private async _getUserArchives(req: Request, res: Response, next: NextFunction) {
    try {
      const userArchives = await this._storageService.getUserArchives(req.user!.id);
      return res.status(200).json(userArchives);
    } catch (error) {
      next(error);
    }
  }

  private async _deleteArchive(req: Request, res: Response, next: NextFunction) {
    try {
      await this._storageService.deleteArchive(req.params.id);
      return res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }

  private async _discoverArchive(req: Request, res: Response, next: NextFunction) {
    try {
      if (!this._storageValidator.validateDiscoverArchive(req.body)) {
        throw new BadRequestError(
          'Invalid archive discovering params',
          this._storageValidator.validateDiscoverArchive.errors
        );
      }
      await this._storageService.discoverArchive(req.body.userId, req.body.name);
      return res.sendStatus(201);
    } catch (error) {
      next(error);
    }
  }
}
