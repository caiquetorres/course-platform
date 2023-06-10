import { Log } from '../../domain/models/log';

export abstract class LogRepository {
  abstract save(log: Log): Promise<void>;
}
