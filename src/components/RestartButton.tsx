type RestartButtonProps = {
  onRestart: () => void;
}

export default function RestartButton({ onRestart }: RestartButtonProps) {
  return <button onClick={onRestart}>Volver a jugar</button>;
}