import { useParams } from 'react-router-dom';

export default function LoginModal({ code }: { code: string }) {
  const { roomId } = useParams();

  const handleClick = () => {
    localStorage.setItem('code', code);
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
            <a
              href={`https://api.algoitni.site/auth/github?next=${roomId}`}
              onClick={handleClick}
              className="flex items-center p-4 text-white bg-black rounded-full"
            >
              <img src="/github.png" className="w-8 h-8" alt="github" />
              <span className="text-xl font-bold px-11 basis-[90%]">Github Login</span>
            </a>
            <a href="https://algoitni.site" className="flex items-center p-4 border-2 rounded-full">
              <img src="/google.png" className="w-8 h-8" alt="google" />
              <span className="text-xl font-bold px-11 basis-[90%]">Google Login</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
