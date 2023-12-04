interface SpinnerProps {
  size: number;
  width: number;
}

export default function Spinner({ size, width }: SpinnerProps) {
  return <div className={`bg-transparent border-${width} border-white rounded-full w-${size} h-${size} border-r-blue-400 animate-spin`} />;
}
