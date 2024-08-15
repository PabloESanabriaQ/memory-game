import { CardItem } from "../types/CardItem";
import images from "./images";

const cards : CardItem[] = images.map(
  (image, index) => (
    {
      cardId: index, 
      image: image, 
      flipped: false
    }
  )
);

export default cards;