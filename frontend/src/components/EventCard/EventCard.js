// src/components/EventCard.js

import React from "react";
import './EventCard.css';

const EventCard = ({ event }) => {
  const { title, date, venue, price, category, imageUrl, id } = event;

  return (
    <div className="event-card">
      <div className="event-card__image-wrapper">
        <img src={imageUrl} alt={title} className="event-card__image" />
        <span className="event-card__badge">{category}</span>
      </div>
      <div className="event-card__body">
        <h3 className="event-card__title">{title}</h3>
        <div className="event-card__meta">
          <span className="event-card__meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            {date}
          </span>
          <span className="event-card__meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            {venue}
          </span>
        </div>
        <div className="event-card__footer">
          <span className="event-card__price">Starting from <strong>${price}</strong></span>
          <a href={`/events/${id}`} className="event-card__btn">Get Tickets</a>
        </div>
      </div>
    </div>
  );
};

export default EventCard;