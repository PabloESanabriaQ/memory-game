type StartButtonProps = {
  onStart: () => void;
}

export default function StartButton({ onStart }: StartButtonProps) {
  return <button onClick={onStart}>Iniciar juego</button>;
}