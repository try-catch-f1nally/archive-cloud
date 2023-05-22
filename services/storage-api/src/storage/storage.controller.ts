import {Controller, Middleware, NextFunction, Request, Response, Router} from '@try-catch-f1nally/express-microservice';
import Config from '../config/types/config.interface';
import {StorageService} from './types/storage.service.interface';

export default class StorageController implements Controller {
  private _router = Router();
  private _config: Config;
  private _storageService: StorageService;
  private _authMiddleware: Middleware;

  constructor(config: Config, storageService: StorageService, authMiddleware: Middleware) {
    this._config = config;
    this._storageService = storageService;
    this._authMiddleware = authMiddleware;
    this._initialiseRouter();
  }

  get router() {
    return this._router;
  }

  private _initialiseRouter(): void {
    this.router.get('/archives', this._authMiddleware.middleware, this._getUserArchives.bind(this));
    this.router.delete('/archives/:id', this._authMiddleware.middleware, this._deleteArchive.bind(this));
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
}
