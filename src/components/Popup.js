import React from "react";
import { useEffect } from "react";


export default function Popup ({name, isOpen, onClose, children}) {

  useEffect(() => {
    if (!isOpen) return;

    function handleEscClose(evt) {
      if(evt.key === "Escape") {
        onClose();
      }
    }
    
    isOpen && document.addEventListener("keydown", handleEscClose);
    return () => document.removeEventListener("keydown", handleEscClose);
  }, [isOpen, onClose]);

  

  function handleOverlayClose(evt) {
    if(evt.target === evt.currentTarget) {
      onClose();
    }
  }

  return (
    <div className={`popup popup_type_${name} ${isOpen ? "popup_opened" : ""}`}
    onMouseDown={handleOverlayClose}>
      <div className={`popup__container popup__container-${name}`}>
        <button
          onClick={onClose}
          className="popup__close-button"
          type="button"
          />
        {children}
      </div>
    </div>
  )
}