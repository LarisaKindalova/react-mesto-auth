/* eslint-disable no-lone-blocks */
/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ConfirmPopup from "./ConfirmPopup";
import ProtectedRoute from "./ProtectedRoute";
import Register from "./Register ";
import Login from "./Login";
import InfoTooltip from "./InfoTooltip";
import api from "../utils/api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { Route, Routes, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import * as auth from "../utils/auth.js";

export default function App() {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = React.useState(false);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({});
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isToolTipOpen, setIsToolTipOpen] = React.useState(false);
  const [isSuccessMessage, setIsSuccessMessage] = React.useState(false);
  const [messageTooltip, setMessageToolTip] = React.useState("");
  const [userEmail, setUserEmail] = React.useState("");

 
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    {
      Promise.all([api.getUserInfoApi(), api.getInitialCards()])
        .then(([user, card]) => {
          setCurrentUser(user);
          setCards(card);
        })
        .catch(err => console.log(`Ошибка: ${err}`));
    }
  }, [isLoggedIn]);

  useEffect(() => {
    checToken();
  }, []);

  function checToken() {
    const jwt = localStorage.getItem("jwt");
    auth
      .checkToken(jwt)
      .then((data) => {
        if (!data) {
          return;
        }
        setUserEmail(data.data.email);
        setIsLoggedIn(true);
        navigate(location.path);
      })
      .catch(() => {
        setIsLoggedIn(false);
      });
  }

  function handleCardClick(card) {
    setSelectedCard(card);
    setIsImagePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handelDeleteClick() {
    setIsConfirmPopupOpen(true);
  }
  function handleRegister() {
    setIsLoggedIn(true);
  }

  function handleLogin() {
    setIsLoggedIn(true);
  }

  

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsImagePopupOpen(false);
    setSelectedCard({});
    setIsConfirmPopupOpen(false);
    setIsToolTipOpen(false);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(user => user._id === currentUser._id);

    if (!isLiked) {
      api
        .setLikeCardApi(card._id)
        .then(newCard =>
          setCards(state =>
            state.map(item => (item._id === card._id ? newCard : item))
          )
        )
        .catch(err => console.log(`Ошибка ${err}`));
    } else {
      api
        .removeLikeCardApi(card._id)
        .then(newCard =>
          setCards(state =>
            state.map(item => (item._id === card._id ? newCard : item))
          )
        )
        .catch(err => console.log(`Ошибка ${err}`));
    }
  }

  function handleCardDelete(card) {
    setIsLoading(true);
    api
      .deledeCard(selectedCard._id)
      .then(() => {
        setCards(cards.filter(item => item._id !== selectedCard._id));
        closeAllPopups();
      })
      .catch(err => console.log(`Ошибка: ${err}`))
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleUpdateUser(data) {
    setIsLoading(true);
    api
      .setUserInfoApi(data)
      .then(res => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch(err => console.log(`Ошибка: ${err}`))
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleUpdateAvatar(data) {
    setIsLoading(true);
    api
      .editNewAvatar(data)
      .then(res => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch(err => console.log(`Ошибка: ${err}`))
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleAddPlaceSubmit(data) {
    setIsLoading(true);
    api
      .addNewCard(data)
      .then(newCard => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch(err => console.log(`Ошибка: ${err}`))
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handelDeletion(card) {
    handelDeleteClick(card);
    setSelectedCard(card);
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header 
        isLoggedIn={isLoggedIn} 
        userEmail={userEmail}
        setIsLoggedIn={setIsLoggedIn} />
        <Routes>
          <Route
            path="/sign-up"
            element={
              isLoggedIn ? (
                <Navigate to="/" />
              ) : (
                <Register
                  handleRegister={handleRegister}
                  setIsToolTipOpen={setIsToolTipOpen}
                  setMessageToolTip={setMessageToolTip}
                  setIsSuccessMessage={setIsSuccessMessage}
                  isLoggedIn={isLoggedIn}
                  isLoading={isLoading}
                />
              )
            }
          />
          <Route
            path="/sign-in"
            element={<Login 
              handleLogin={handleLogin}
              setUserEmail={setUserEmail} />}
          />
          <Route
            path="/"
            element={
              <ProtectedRoute
                element={Main}
                isLoggedIn={isLoggedIn}
                onEditAvatar={handleEditAvatarClick}
                onEditProfile={handleEditProfileClick}
                onCardClick={handleCardClick}
                onCardLike={handleCardLike}
                onAddPlace={handleAddPlaceClick}
                onCardDelete={handelDeletion}
                cards={cards}
              />
            }
          />
          <Route
            path="*"
            element={
              isLoggedIn
               ? (<Navigate to="/" />)
               : (<Navigate to="/sign-in" />)
            }
          />
        </Routes>
        {isLoggedIn && <Footer />}

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          isLoading={isLoading}
        />

        <ConfirmPopup
          isOpen={isConfirmPopupOpen}
          onClose={closeAllPopups}
          onConfirmDelete={handleCardDelete}
          isLoading={isLoading}
        />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          isLoading={isLoading}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
          isLoading={isLoading}
        />

        <ImagePopup
          card={selectedCard}
          isOpen={isImagePopupOpen}
          onClose={closeAllPopups}
          isLoading={isLoading}
        />
        <InfoTooltip
          isOpen={isToolTipOpen}
          onClose={closeAllPopups}
          isLoading={isLoading}
          messageTooltip={messageTooltip}
          isSuccessMessage={isSuccessMessage}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}
