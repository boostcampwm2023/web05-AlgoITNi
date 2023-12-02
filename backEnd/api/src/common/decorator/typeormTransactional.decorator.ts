import { getNamespace } from 'cls-hooked';
export const typeormTransactional = () => {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    const nameSpace = getNamespace('namespace');
    nameSpace.set();
    // console.log("target instance:", target);

    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      // 비동기 작업을 수행하거나 비동기 함수를 호출할 수 있습니다.
      const [res, req] = args;
      if (!req.authorized) return res.redirect('/user/login');
      // console.log(originalMethod)
      await originalMethod.apply(this, args);
    };
  };
};
