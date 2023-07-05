import dbConnect from '../dbConnect';

export function wrapWithDbConnect<T extends object>(obj: T): T {
  return new Proxy<T>(obj, {
    // @ts-expect-error-next-line
    get(target: T, property: keyof T): T[keyof T] {
      const original = target[property];

      if (typeof original === 'function' && typeof (original as any).then === 'function') {
        const asyncOriginal = async (...args: any[]) => {
          await dbConnect();
          return (original as any).apply(target, args);
        };
        return asyncOriginal as T[keyof T];
      }

      return original;
    },
  });
}
