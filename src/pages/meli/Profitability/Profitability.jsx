import React from 'react';
import './CarListingCard.css'; // Estilos customizados

const CarListingCard = ({ car }) => {
    return (
        <div className="car-listing-card">
            <div className="image-container">
                <img src={car.imageUrl} alt={`${car.make} ${car.model}`} />
                <div className="boost-label">IMPULSIONADO</div>
            </div>
            <div className="details-container">
                <h2>{car.make} {car.model} {car.year}</h2>
                <ul className="car-specs">
                    <li>{car.kilometers} km</li>
                    <li>{car.color}</li>
                    <li>{car.engineSize}</li>
                </ul>
                <div className="location-time">
                    <p>{car.location} | Hoje, {car.time}</p>
                </div>
                <div className="price-container">
                    {car.oldPrice && <span className="old-price">R$ {car.oldPrice}</span>}
                    <span className="current-price">R$ {car.currentPrice}</span>
                </div>
                <button className="favorite-button">&#9829;</button>
            </div>
        </div>
    );
}

export default CarListingCard;
