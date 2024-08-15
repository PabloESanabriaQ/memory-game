import { CardItem } from "../types/CardItem";

function duplicate(cards: CardItem[]) {
	return [...cards, ...cards];
}

function shuffle(cards: CardItem[]) {
	return cards.map((a) => ({ sort: Math.random(), value: a }))
		.sort((a, b) => a.sort - b.sort)
		.map((a) => a.value);
};

export { duplicate, shuffle };