export const requestPath = {
  RUN_PYTHON: '/codes/python',
};

const timeUnit = {
  SECOND: 's',
  MINUTE: 'm',
  HOUR: 'h',
  DAY: 'd',
};

export const time = {
  SECOND: 1,
  MINUTE: 60,
  FIVE_MINUTE: 5 * 60,
  HOUR: 60 * 60,
  DAY: 60 * 60 * 24,
};

export const calcExpireSeconds = (expireString: string) => {
  const regex = /^(\d+)([smhd])$/;
  const result = expireString.match(regex);
  if (result) {
    const num = result[1];
    const unit = result[2];
    switch (unit) {
      case timeUnit.SECOND:
        return 1000 * +num;
      case timeUnit.MINUTE:
        return 1000 * +num * 60;
      case timeUnit.HOUR:
        return 1000 * +num * 60 * 60;
      case timeUnit.DAY:
        return 1000 * +num * 24 * 60 * 60;
    }
  }
};

export function calcCookieExpire(expireString: string): Date {
  const date = new Date();
  const time = calcExpireSeconds(expireString);
  return new Date(date.getTime() + time);
}
