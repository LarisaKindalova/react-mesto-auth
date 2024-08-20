import React from "react";
import Popup from "./Popup";

export default function PopupWithForm({
  title,
  name,
  children,
  isOpen,
  onClose,
  buttonText,
  onSubmit,
}) {
  
  
  return (
    <Popup 
    name={name}
    isOpen={isOpen}
    onClose={onClose}>
        <h2 className="popup__title">{title}</h2>
        <form
          className={`popup__form popup__form_${name}`}
          name={`popup__${name}`}
        >
          {children}
          <button
            type="submit"
            className="popup__submit-button"
            aria-label="кнопка сохранить"
            onClick = {onSubmit}
          >
            {buttonText}
          </button>
        </form>
    </Popup>
  );
}
