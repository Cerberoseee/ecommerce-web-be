import { SetMetadata, CustomDecorator } from '@nestjs/common';

export const System = (): CustomDecorator => SetMetadata('isSystem', true);
