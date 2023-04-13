import {
  Controller,
  Middleware,
  NextFunction,
  Request,
  Response,
  Router
} from "@try-catch-f1nally/express-microservice";
import {Config} from "../config/types/config.interface";
import {StorageService} from "./types/storage.service.interface";
import path from "path";

export default class StorageController implements Controller {
  private _router = Router();
  private _config: Config;
  private _authMiddleware: Middleware;
  private _storageService: StorageService;

  constructor(
    config: Config,
    authMiddleware: Middleware,
    storageService: StorageService
  ) {
    this._config = config;
    this._authMiddleware = authMiddleware;
    this._storageService = storageService;
    this._initialiseRouter();
  }

  get router() {
    return this._router;
  }

  private _initialiseRouter(): void {
    this.router.get(
      '/archive',
      this._authMiddleware.middleware,
      this._getUserArchives.bind(this)
    );
    this.router.delete(
      '/archive/:id',
      this._authMiddleware.middleware,
      this._deleteArchive.bind(this)
    );
    this.router.post(
      '/archive',
      this._authMiddleware.middleware,
      this._postArchive.bind(this)
    );
    this.router.get(
      '/archive/:userId/download/:archiveName',
      this._authMiddleware.middleware,
      this._downloadArchive.bind(this)
    )
  }

  private async _getUserArchives(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const userArchives = await this._storageService.getUserArchives(userId);
      return res.status(200).json(userArchives);
    } catch (error) {
      next(error);
    }
  }

  private async _deleteArchive(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const archiveId = req.params['id'];
      await this._storageService.deleteArchive(archiveId, userId);
      return res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }

  private async _postArchive(req: Request, res: Response, next: NextFunction) {
    try {
      const {userId, name} = req.body;
      await this._storageService.postArchive(userId, name);
      return res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }

  private _downloadArchive(req: Request, res: Response, next: NextFunction) {
    try {
      const {userId, archiveName} = req.params;
      if (userId !== req.user!.id) {
        return res.sendStatus(403);
      }
      return res.download(path.resolve(this._config.storage.path, userId, archiveName));
    } catch (error) {
      next(error);
    }
  }
}
