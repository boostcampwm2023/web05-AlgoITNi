export const requestPath = {
  RUN_PYTHON: '/codes/python',
};

export const calcExpireSeconds = (expireString: string) => {
  const regex = /^(\d+)([smhd])$/;
  const result = expireString.match(regex);
  if (result) {
    const num = result[1];
    const unit = result[2];
    switch (unit) {
      case 's':
        return 1000 * +num;
      case 'm':
        return 1000 * +num * 60;
      case 'h':
        return 1000 * +num * 60 * 60;
      case 'd':
        return 1000 * +num * 24 * 60 * 60;
    }
  }
};

export function calcCookieExpire(expireString: string): Date {
  const date = new Date();
  const time = calcExpireSeconds(expireString);
  return new Date(date.getTime() + time);
}
