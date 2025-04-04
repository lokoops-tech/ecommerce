import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import grooming from '../Assets/groom12.jpg';
import kitchen from '../Assets/kitchen6.jpg';
import earpods from '../Assets/orimo_2.jpg';
import laptops from '../Assets/pc10.jpg';
import phone from '../Assets/product_15.png';
import woofer from '../Assets/speaker_4.jpeg';
import tv from '../Assets/tv3.jpg';
import watch from '../Assets/watch_6.webp';
import './Hero.css';

const holidays = {
    '12-12': "Happy Jamhuri Day! Enjoy Special Discounts!",
    '01-01': "Happy New Year! Start Your Year with Great Deals!",
    '06-01': "Madaraka Day Sale! Celebrate with Exciting Offers!",
    '10-20': "Happy Mashujaa Day! Special Offers Await!",
    '12-25': "Merry Christmas! Enjoy Festive Discounts!",
    '02-24': "Happy Gich-Day! Celebrate with Us!" // Example custom holiday
};

const categories = [
    { title: "Laptops & Computers", description: "High-performance computing solutions for work and play", image: laptops, path: "/pc-computer-products" },
    { title: "Smart TVs", description: "Immersive entertainment for your home", image: tv, path: "/tv-appliances" },
    { title: "Wireless Earpods", description: "Crystal clear audio on the go", image: earpods, path: "/earpods" },
    { title: "Premium Woofers", description: "Experience powerful, dynamic sound", image: woofer, path: "/woofers" },
    { title: "Phone Accessories", description: "Enhance your mobile experience", image: phone, path: "/phone-accessories" },
    { title: "Smart Watches", description: "Stay connected in style", image: watch, path: "/watch" },
    { title: "Grooming Essentials", description: "Professional grooming tools for your daily routine", image: grooming, path: "/groomings" },
    { title: "Kitchen Appliances", description: "Modern solutions for your kitchen needs", image: kitchen, path: "/kitchen-appliances" }
];

const Hero = () => {
    const [holidayMessage, setHolidayMessage] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const checkHoliday = () => {
            const today = new Date();
            const dateKey = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
            
            // Directly set the holiday message if it exists for today
            if (holidays[dateKey]) {
                setHolidayMessage(holidays[dateKey]);
            } else {
                setHolidayMessage('');
            }
        };

        checkHoliday();
        // Check more frequently, every 10 seconds for testing
        const interval = setInterval(checkHoliday, 10000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % categories.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const navigateToAllInOne = () => {
        navigate('/all-in-one');
    };

    return (
        <div className="hero">
            {holidayMessage && (
                <div className="holiday-banner">{holidayMessage}</div>
            )}
            <div className="hero-content">
                <h1 className="hero-title">Your One-Stop Shop for <span className="highlight">Quality Electronics</span></h1>
                <div className="promo"><h1>Upto <span>50%</span> discount on our products</h1></div>
                <button className="shop-button" onClick={navigateToAllInOne}><span>Explore Now</span></button>
                
                <div className='middle-content'>
                    <div className="slider-container">
                        <div className="slider-wrapper" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                            {categories.map((category, index) => (
                                <div key={index} className="slide">
                                    <Link to={category.path} className="category-card">
                                        <img src={category.image} alt={category.title} className="category-image" />
                                        <div className="category-overlay">
                                            <h2>{category.title}</h2>
                                            <p>{category.description}</p>
                                            <span className="explore-link">Explore Now</span>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="dots">
                        {categories.map((_, index) => (
                            <span
                                key={index}
                                className={`dot ${index === currentIndex ? "active" : ""}`}
                                onClick={() => setCurrentIndex(index)}
                            ></span>
                        ))}
                    </div>
                    
                  
                    
                    <div className="bottom-content">
                        <p className="hero-description">From premium smartphones to home appliances - discover amazing deals with up to 50% off.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
