import img from '../assets/4.png';

type CardProps = {
    cardId: number,
    image: string,
    flipped: boolean
}
export default function Card(props: CardProps) {
    return (
        <button >
            {props.flipped
            ? <img src={props.image} className='img'/>
            : <img src={img} className='img' />}
        </button>
    )
}