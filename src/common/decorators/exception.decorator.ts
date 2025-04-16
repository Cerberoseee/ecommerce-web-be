import { Logger } from '@nestjs/common';

export function SafeException() {
  return (target: any, nameMethod: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      try {
        const executionMethod = await originalMethod.apply(this, args);
        return executionMethod;
      } catch (error) {
        // eslint-disable-next-line no-console
        const logger = new Logger(target.constructor.name);
        logger.error('Uncaught error', error);
      }
    };
  };
}
