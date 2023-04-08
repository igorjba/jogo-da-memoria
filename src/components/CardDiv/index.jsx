import './style.css'
// import cards from '../../../cards'

export default function CardDiv({ id, slug, image, turned }) {
    return (
        <div className='Card' style={{ backgroundImage: `url(${image})` }}>

        </div>
    )
}