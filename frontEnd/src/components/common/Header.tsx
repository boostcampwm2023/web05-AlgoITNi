import { Link } from 'react-router-dom';

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <img src="/main.png" alt="logo" className="w-14" />
      <h1 className="text-4xl font-light">AlgoITNi</h1>
    </Link>
  );
}

export default function Header() {
  return (
    <header className="flex items-center justify-start w-full pb-24 tablet:pb-8 pt-4 px-[7vw]">
      <Logo />
    </header>
  );
}
