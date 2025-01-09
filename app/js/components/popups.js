import { CreateNewElement } from "./createNewElt.js";
import { getScrollWidth } from "./getScrollWidth.js";

export class Popup {
  constructor({
    openElt, // элемент, по которому открываем попап
    popupClass, //класс попапа
    closeBtnClass = ".js-close", // класс кнопки закрытия
    animationOpenClass,
    animationCloseClass,
    onCloseCallback,
    onOpenCallback,
  }) {
    this.popupClass = popupClass;
    this.openElt = openElt;
    this.closeBtnClass = closeBtnClass;
    this.popupElt = document.querySelector(popupClass);
    this.closeBtns = this.popupElt.querySelectorAll(this.closeBtnClass); // находим кнопку закрытия
    this.overlay = null;
    this.animationOpenClass = animationOpenClass;
    this.animationCloseClass = animationCloseClass;
    this.scrollElt = document.querySelector(".header--scroll");
    this.closeHandler = this.closeHandler.bind(this);
    this.closeOverlayHandler = this.closeOverlayHandler.bind(this);
    this.btnEnterCloseHandler = this.keyDownHandler.bind(this);
    this.keyDownHandler = this.keyDownHandler.bind(this);
    this.onCloseCallback = onCloseCallback;
    this.onOpenCallback = onOpenCallback;
  }

  open() {
    if (this.animationOpenClass) {
      this.popupElt.classList.add(this.animationOpenClass);
      this.popupElt.addEventListener("animationend", this.animationEndHandler);
    }

    document.body.style.paddingRight = `${getScrollWidth()}px`;
    if (this.scrollElt)
      this.scrollElt.style.paddingRight = `${getScrollWidth()}px`;
    document.body.style.overflow = "hidden";
    this.createScrollElt();
    this.popupElt.classList.add("opened");
    this.setCloseListeners();

    if (this.onOpenCallback) this.onOpenCallback(this);
  }

  setCloseListeners() {
    this.overlay.newElement.addEventListener("click", this.closeOverlayHandler);
    this.closeBtns.forEach((item) =>
      item.addEventListener("click", this.closeHandler)
    );
    this.overlay.newElement.addEventListener("keydown", this.keyDownHandler);
    this.closeBtns.forEach((item) =>
      item.addEventListener("keydown", this.btnEnterCloseHandler)
    );
  }

  removeCloseListeners() {
    this.closeBtns.forEach((item) =>
      item.removeEventListener("click", this.closeHandler)
    );
    this.overlay.newElement.removeEventListener("keydown", this.keyDownHandler);
    this.closeBtns.forEach((item) =>
      item.removeEventListener("keydown", this.btnEnterCloseHandler)
    );
  }

  closeHandler() {
    this.close();
  }

  close() {
    if (this.animationCloseClass) {
      this.popupElt.classList.add(this.animationCloseClass);
      this.popupElt.addEventListener("animationend", this.animationEndHandler);
    }
    document.querySelector("body").style.paddingRight = `0`;
    if (this.scrollElt) this.scrollElt.style.paddingRight = `0`;
    document.body.style.overflow = "initial";
    this.popupElt.classList.remove("opened");
    this.removeCloseListeners();
    this.overlay.newElement.removeEventListener(
      "click",
      this.closeOverlayHandler
    );
    this.overlay.destroyElmt();
    this.observer.disconnect();
    this.overlay = null;
    if (this.onCloseCallback) this.onCloseCallback(this);
  }

  closeOverlayHandler(evt) {
    if (
      !this.popupElt.contains(evt.target) &&
      !evt.target.closest(".popup") &&
      !this.openElt.contains(evt.target)
    ) {
      this.closeHandler();
    }
  }

  createScrollElt() {
    this.overlay = new CreateNewElement(
      document.querySelector("body"),
      "div",
      "overlay"
    );
    this.overlay.createElmt();
  }

  keyDownHandler(evt) {
    if (evt.key === "Escape") {
      this.closeHandler();
    }
  }

  btnEnterCloseHandler(evt) {
    if (evt.key === "Enter") {
      this.closeHandler();
    }
  }

  animationEndHandler(evt) {
    const animationName = evt.animationName;
    evt.target.classList.remove(animationName);
    if (evt.target === this.popupElt) {
      this.popupElt.removeEventListener(
        "animationend",
        this.animationEndHandler
      );
    }
    if (animationName === this.animationCloseClass) {
      this.popupElt = null;
    }
  }
}
