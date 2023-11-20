export function timeout(ms: number) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;
    let timer: NodeJS.Timeout;

    descriptor.value = async function (...args: any[]) {
      const timeoutPromise = new Promise((_resolve, reject) => {
        timer = setTimeout(() => {
          reject(new Error(`Timeout: ${ms / 1000} seconds exceeded`));
        }, ms);
      });

      try {
        const result = await Promise.race([
          originalMethod.apply(this, args),
          timeoutPromise,
        ]);
        return result;
      } catch (error) {
        throw error;
      } finally {
        clearTimeout(timer);
      }
    };

    return descriptor;
  };
}
