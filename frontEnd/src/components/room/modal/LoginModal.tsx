import { ReactNode } from 'react';
import { MODE } from '@/constants/env';
import getDevCookie from '@/apis/getDevCookie';
import reactQueryClient from '@/configs/reactQueryClient';
import QUERY_KEYS from '@/constants/queryKeys';
import useModal from '@/hooks/useModal';

type LoginButtonWrapperProps = {
  handleClick: () => void;
  className: string;
  type: 'github' | 'google';
  children: ReactNode;
};

function LoginButtonWrapper({ handleClick, className, type, children }: LoginButtonWrapperProps) {
  const nextPath = window.location.pathname.split('/')[1];

  if (MODE === 'development')
    return (
      <button type="button" onClick={handleClick} className={className}>
        {children}
      </button>
    );

  return (
    <a href={`https://api.algoitni.site/auth/${type}?next=${nextPath}`} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}

export default function LoginModal({ code }: { code: string }) {
  const { hide } = useModal();
  const handleClick = async () => {
    localStorage.setItem('code', code);
    if (MODE === 'development') {
      const token = await getDevCookie();
      document.cookie = `access_token=${token};`;
      hide();
      window.location.reload();
    }
    reactQueryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOAD_CODES] });
  };

  return (
    <div className="flex items-center justify-center gap-8 min-w-[600px]">
      <div className="relative flex items-center justify-center">
        <img src="/main.png" alt="logo" className="w-64 h-64" />
      </div>
      <div className="flex flex-col items-center justify-center h-full gap-8">
        <h1 className="text-2xl font-bold">소셜로그인</h1>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col justify-between h-full gap-4">
            <LoginButtonWrapper type="github" handleClick={handleClick} className="flex items-center p-4 text-white bg-black rounded-full">
              <img src="/github.png" className="w-8 h-8" alt="github" />
              <span className="text-xl font-bold px-11 basis-[90%]">Github Login</span>
            </LoginButtonWrapper>
            <LoginButtonWrapper type="google" handleClick={handleClick} className="flex items-center p-4 border-2 rounded-full">
              <img src="/google.png" className="w-8 h-8" alt="google" />
              <span className="text-xl font-bold px-11 basis-[90%]">Google Login</span>
            </LoginButtonWrapper>
          </div>
        </div>
      </div>
    </div>
  );
}
