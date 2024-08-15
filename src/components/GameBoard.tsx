import { useState, useEffect } from 'react';
import { CardItem } from '../types/CardItem';
import { LastCard } from '../types/LastCard';
import Card from './Card';
import Timer from './Timer';
import StartButton from './StartButton';
import RestartButton from './RestartButton';
import TopScores from './TopScores';
import cards from '../data/cards'
import { shuffle, duplicate } from '../utils/gameUtils';

export default function GameBoard() {
  const [gameStarted, setGameStarted] = useState(false);
	const [isDisabled, setIsDisabled] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [canFlipCards, setCanFlipCards] = useState(1);
  const [lastCard, setLastCard] = useState<LastCard>({cardId: -1, index: -1});
  const [tracked, setTracked] = useState<number[]>([]);
  const [cardList, setCardList] = useState<CardItem[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [topScores, setTopScores] = useState<number[]>([]);
  const [showTopScores, setShowTopScores] = useState(false);

  useEffect(() => {
    const savedScores = localStorage.getItem('topScores');
    if (savedScores) {
      setTopScores(JSON.parse(savedScores));
    }
  }, []);

  const startGame = () => {
    setGameStarted(true);
    setStartTime(Date.now());
    setCardList(shuffle(duplicate(cards)));
  };

  const restartGame = () => {
    setGameStarted(false);
    setGameEnded(false);
    setCanFlipCards(1);
    setLastCard({cardId: -1, index: -1});
    setTracked([]);
    setStartTime(null);
    setEndTime(null);
  };

	function flipCard(cardIndex: number, card: CardItem) {
		if (!gameStarted || isDisabled || canFlipCards > 2 || tracked.includes(card.cardId) || cardList[cardIndex].flipped) {
			return;
		}

		setCanFlipCards(prevState => {
			if (prevState > 2) return prevState;

			const newCardList = cardList.map((c, index) =>
				index === cardIndex ? { ...c, flipped: true } : c
			);

			if (prevState === 1) {
				setLastCard({ cardId: card.cardId, index: cardIndex });
				setCardList(newCardList);
				return 2;
			} else {
				setCardList(newCardList);

				if (card.cardId === lastCard.cardId && cardIndex !== lastCard.index) {
					const newTracked = [...tracked, card.cardId];
					setTracked(newTracked);

					if (newTracked.length === cards.length) {
						//setTimeout(() => alert("You won!"), 300);
						const endTime = Date.now();
						setEndTime(endTime);
						setGameEnded(true);
						const gameDuration = endTime - startTime!;
						updateTopScores(gameDuration);
					}
				} else {
					setIsDisabled(true);
					setTimeout(() => {
						setCardList(prevList =>
							prevList.map((c, index) =>
								(index === cardIndex || index === lastCard.index)
									? { ...c, flipped: false }
									: c
							)
						);
						setIsDisabled(false);
					}, 1000);
				}

				setLastCard({ cardId: -1, index: -1 });
				return 1;
			}
		});
	}

  const updateTopScores = (newScore: number) => {
    setTopScores(prevScores => {
      const newScores = [...prevScores, newScore].sort((a, b) => a - b).slice(0, 10);
      localStorage.setItem('topScores', JSON.stringify(newScores));
      return newScores;
    });
  };

  return (
    <div>
      {!gameStarted ? (
        <StartButton onStart={startGame} />
      ) : (
        <>
          <Timer startTime={startTime} endTime={endTime} />
          <ul className='card-container'>
            {cardList.map((card, index) => (
              <li key={index} onClick={() => flipCard(index, card)} className='cards'>
                <Card {...card} />
              </li>
            ))}
          </ul>
          {gameEnded && (
            <>
              <RestartButton onRestart={restartGame} />
              <button onClick={() => setShowTopScores(!showTopScores)}>
                {showTopScores ? 'Ocultar los mejores tiempos' : 'Mostrar los mejores tiempos'}
              </button>
            </>
          )}
          {showTopScores && <TopScores scores={topScores} />}
        </>
      )}
    </div>
  );
}