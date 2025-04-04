import './Offer.css'
import oraimo from '../../Assets/orimo_5.jpg'
import { useNavigate } from 'react-router-dom'

const Offers = () => {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate('/earpods', { replace: true });
        
        setTimeout(() => {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });
        }, 100);
    }

    return (
        <div className="offers">
            <div className="offers-left">
                <h1>Best earpods from Gich-Tech electronics</h1>
                <p>Experience crystal-clear sound and ultimate comfort with our premium selection of wireless earpods. Perfect for music lovers and professionals alike.</p>
            </div>
            <div className="offers-right">
                <img src={oraimo} alt="Premium Earpods" />
            </div>
            <div className="far-right">
                <h1>Buy now, save for other product</h1>
                <p>Exclusive deals and special discounts available today. Don't miss out on our limited-time offers!</p>
                <button onClick={handleButtonClick} className="check-now-btn">check now</button>
            </div>
        </div>
    )
}

export default Offers