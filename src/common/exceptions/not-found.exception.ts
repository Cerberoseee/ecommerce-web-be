import { AppException } from '../base/base.dto';

export class NotFoundException extends AppException {
  constructor(id?: string | string[], message?: string) {
    super(message ?? 'Not found', 'not-found', 404);
    if (!!id) this.data = { id };
  }
}
