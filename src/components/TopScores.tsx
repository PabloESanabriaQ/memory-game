type TopScoresProps = {
  scores: number[];
}

export default function TopScores({ scores }: TopScoresProps) {
  return (
    <div>
      <h3>Mejores 10 tiempos:</h3>
      <ol>
        {scores.map((score, index) => (
          <li key={index}>{(score / 1000).toFixed(2)} segundos</li>
        ))}
      </ol>
    </div>
  );
}