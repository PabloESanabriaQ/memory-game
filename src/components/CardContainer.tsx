import { CardItem } from '../types/CardItem';
import { LastCard } from '../types/LastCard';
import Card from './Card';
import cards from '../data/cards'
import { useEffect, useState } from 'react';
import { shuffle, duplicate } from '../utils/gameUtils';

export default function CardContainer() {

	const [gameStarted, setGameStarted] = useState(false);

	const [currentTime, setCurrentTime] = useState<number>(0);

	const [showTopScores, setShowTopScores] = useState<boolean>(false);

	const [startTime, setStartTime] = useState<number | null>(null);

	const [endTime, setEndTime] = useState<number | null>(null);

	const [topScores, setTopScores] = useState<number[]>([]);

	const [gameEnded, setGameEnded] = useState(false);

	const [isDisabled, setIsDisabled] = useState(false);

	const [canFlipCards, setCanFlipCards] = useState(1);

	const [lastCard, setLastCard] = useState<LastCard>({ cardId: -1, index: -1 });

	const [tracked, setTracked] = useState<number[]>([]);

	const [cardList, setCardList] = useState<CardItem[]>(shuffle(duplicate(cards)));

	useEffect(() => {
		const savedScores = localStorage.getItem('topScores');
		if (savedScores) {
			setTopScores(JSON.parse(savedScores));
		}
	}, []);

	function updateTopScores(newScore: number) {
		setTopScores(prevScores => {
			const newScores = [...prevScores, newScore].sort((a, b) => a - b).slice(0, 10);
			localStorage.setItem('topScores', JSON.stringify(newScores));
			return newScores;
		});
	}

	useEffect(() => {
		let interval: number | null = null;
		if (startTime && !endTime) {
		  interval = window.setInterval(() => {
			setCurrentTime(Date.now() - startTime);
		  }, 100);
		} else if (endTime) {
		  setCurrentTime(endTime - startTime!);
		}
	  
		return () => {
		  if (interval) window.clearInterval(interval);
		};
	  }, [gameStarted, startTime, endTime]);

	useEffect(() => {
		setStartTime(Date.now());
	}, []);

	function startGame() {
		setGameStarted(true);
		setStartTime(Date.now());
		setCardList(shuffle(duplicate(cards)));
	  }

	  function restartGame() {
		setGameStarted(false);
		setCanFlipCards(1);
		setLastCard({cardId: -1, index: -1});
		setTracked([]);
		setCardList(shuffle(duplicate(cards)));
		setGameEnded(false);
		setStartTime(null);
		setEndTime(null);
		setCurrentTime(0);
	  }

	function toggleTopScores() {
		setShowTopScores(!showTopScores);
	}

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
						setTimeout(() => alert("You won!"), 300);
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


	return (
		<>
		  {!gameStarted ? (
			<button onClick={startGame}>Start Game</button>
		  ) : (
			<>
			  <div>
				<p>Time: {(currentTime / 1000).toFixed(2)} seconds</p>
			  </div>
			  <ul className='card-container'>
				{cardList.map((card, index) => (
				  <li
					key={index}
					onClick={() => !isDisabled && !card.flipped && !tracked.includes(card.cardId) && flipCard(index, card)}
					className='cards'
				  >
					<Card {...card} />
				  </li>
				))}
			  </ul>
			  {gameEnded && (
				<>
				  <button onClick={restartGame}>Restart Game</button>
				  <button onClick={toggleTopScores}>
					{showTopScores ? 'Hide Top Scores' : 'Show Top Scores'}
				  </button>
				</>
			  )}
			  {showTopScores && (
				<div>
				  <h3>Top 10 Scores:</h3>
				  <ol>
					{topScores.map((score, index) => (
					  <li key={index}>{(score / 1000).toFixed(2)} seconds</li>
					))}
				  </ol>
				</div>
			  )}
			</>
		  )}
		</>
	  )
	}