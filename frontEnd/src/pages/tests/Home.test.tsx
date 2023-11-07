import * as Home from '@pages/Home';

describe('Home 호출 테스트', () => {
  it('Home이 제대로 실행된다.', () => {
    jest.spyOn(Home, 'default');
    Home.default();
    expect(Home.default).toHaveBeenCalled();
  });
});
