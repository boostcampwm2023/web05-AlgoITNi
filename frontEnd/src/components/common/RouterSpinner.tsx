import Spinner from './Spinner';

export default function RouterSpinner() {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen">
      <div className="w-[400px] h-[400px] mobile:hidden animate-pulse">
        <picture>
          <source srcSet="/main.webp" type="image/webp" />
          <img src="/main.png" alt="main" />
        </picture>
      </div>
      <div className="flex items-center gap-4 ">
        <Spinner />
        <div className="text-3xl font-bold">Loading...</div>
      </div>
    </div>
  );
}
