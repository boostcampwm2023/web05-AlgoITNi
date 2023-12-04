interface EditorFileNameProps {
  children: React.ReactNode;
}

export default function EditorFileName({ children }: EditorFileNameProps) {
  return <h1 className="text-[max(2vh,15px)]">{children}</h1>;
}
