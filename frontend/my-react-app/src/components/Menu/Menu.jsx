import React from "react";
import { Link } from 'react-router-dom';
import './Menu.css';
import grooming from "../../Assets/groom12.jpg";
import kitchen from '../../Assets/kitchen6.jpg';
import earpods from '../../Assets/orimo_2.jpg';
import laptops from '../../Assets/pc10.jpg';
import phone from '../../Assets/product_15.png';
import woofer from '../../Assets/speaker_4.jpeg';
import tv from '../../Assets/tv3.jpg';
import watch from '../../Assets/watch_6.webp';

const MenuCategory = () => {
    const categories = [
        {
            title: "Laptops & Computers",
            description: "High-performance computing solutions for work and play",
            image: laptops,
            path: "/pc-computer-products"
        },
        {
            title: "Smart TVs",
            description: "Immersive entertainment for your home",
            image: tv,
            path: "/tv-appliances"
        },
        {
            title: "Wireless Earpods",
            description: "Crystal clear audio on the go",
            image: earpods,
            path: "/earpods"
        },
        {
            title: "Premium Woofers",
            description: "Experience powerful, dynamic sound",
            image: woofer,
            path: "/woofers"
        },
        {
            title: "Phone Accessories",
            description: "Enhance your mobile experience",
            image: phone,
            path: "/phone-accessories"
        },
        {
            title: "Smart Watches",
            description: "Stay connected in style",
            image: watch,
            path: "/watch"
        },
        {
            title: "Grooming Essentials",
            description: "Professional grooming tools for your daily routine",
            image: grooming,
            path: "/groomings"
        },
        {
            title: "Kitchen Appliances",
            description: "Modern solutions for your kitchen needs",
            image: kitchen,
            path: "/kitchen-appliances"
        }
    ];

    return (
        <div className="menu-container">
            <header className="menu-header">
                <h1>Explore Categories in GichTech</h1>
                <p>Discover our wide range of premium tech products and accessories</p>
            </header>

            <main className="category-grid">
                {categories.map((category, index) => (
                    <Link 
                        to={category.path} 
                        className="category-card" 
                        key={index}
                    >
                        <div className="category-image-container">
                            <img 
                                src={category.image} 
                                alt={category.title} 
                                className="category-image"
                            />
                            <div className="category-overlay">
                                <h2>{category.title}</h2>
                                <p>{category.description}</p>
                                <span className="explore-link">Explore Now</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </main>
        </div>
    );
};

export default MenuCategory;
