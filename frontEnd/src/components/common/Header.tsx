import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="flex items-center justify-start w-full py-10 px-[7vw]">
      <Link to="/" className="flex items-center gap-2">
        <img src="/main.png" alt="logo" className="w-24" />
        <h1 className="text-5xl font-semibold">AlgoITNi</h1>
      </Link>
    </header>
  );
}
