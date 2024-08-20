import React from "react";
import Popup from "./Popup"

export default function ImagePopup({ isOpen, onClose, card }) {
  return (
  <Popup 
    isOpen={isOpen}
    onClose={onClose}
    name="large-img">
        <img className="popup__image" src={card.link} alt={card.name} />
        <p className="popup__caption">{card.name}</p>

 </Popup>
  );
}
