import { fixHashes } from "./components/fixHashes.js";
import { MenuHandler } from "./components/menu-opener.js";
import { phoneMask } from "./components/phone-mask.js";
import { Popup } from "./components/popups.js";
import {
  initializeBannersSlider,
  initializeBrandsSlider,
  initializeMainSlider,
} from "./components/swipers.js";

const catalogInstanse = new MenuHandler({
  togglerClass: ".js-menu-catalog-toggler",
  menuClass: ".js-menu-catalog",
  submenuTogglersClass: ".js-menu-catalog-sub",
  headerOpenClass: "catalog-opened",
});

const menuInstanse = new MenuHandler({
  togglerClass: ".js-menu-toggler",
  menuClass: ".js-menu",
  headerOpenClass: "menu-opened",
});

const searchInstanse = new MenuHandler({
  togglerClass: ".js-search-toggler",
  menuClass: ".js-search",
  headerOpenClass: "search-opened",
  overlayNeeded: false,
});

const mainSlider = document.querySelector(`.js-main-slider`);
if (mainSlider) {
  initializeMainSlider({ sliderElt: mainSlider, className: ".top-slider" });
}

const bannersSlider = document.querySelector(`.js-banner-slider`);
if (bannersSlider) {
  initializeBannersSlider({
    sliderElt: bannersSlider,
    className: ".top-slider",
  });
}

const brandsSlider = document.querySelector(`.js-brands-slider`);
if (brandsSlider) {
  initializeBrandsSlider({
    sliderElt: brandsSlider,
    className: ".brands-swiper",
    numberOfSlides: 6,
  });
}

const goodsSlider = document.querySelectorAll(`.js-goods-slider`);
if (goodsSlider.length) {
  goodsSlider.forEach((item) =>
    initializeBrandsSlider({
      sliderElt: item,
      className: ".items-swiper",
      numberOfSlides: 5,
    })
  );
}

const catsSlider = document.querySelector(`.js-cats-slider`);
if (catsSlider) {
  initializeBrandsSlider({
    sliderElt: catsSlider,
    className: ".categories-sw",
    numberOfSlides: 4,
  });
}

let phoneInputs = [];

const getPhoneInputsListeners = async () => {
  phoneInputs = document.querySelectorAll('[type="tel"]');
  if (phoneInputs.length) {
    phoneInputs.forEach((item) => phoneMask(item));
  }
};

getPhoneInputsListeners();

// fixHashes({ containerClass: '.js-fix-hashes', blockClass: '.js-hashes' });

try {
  const popupsClass = "[data-action]";
  let popupInstance = null;
  let popupOpeners = document.querySelectorAll(popupsClass);

  const setFormListener = async (wrapper, popup) => {
    const form = wrapper.querySelector("form");
    // sendForm(form, popup);
  };

  const onOpenCallback = async (popup) => {};

  const onCloseCallback = (popup) => {};

  if (popupOpeners.length > 0) {
    const popupHandler = (evt) => {
      evt.preventDefault();
      const opener = evt.target.closest(popupsClass);
      const actionType = opener.dataset.action;
      const popupElement = document.querySelector(
        `[data-target=${actionType}]`
      );
      if (!popupElement) return;
      popupInstance = new Popup({
        openElt: opener,
        popupClass: `[data-target=${actionType}]`, //класс попапа
        onOpenCallback: onOpenCallback,
        onCloseCallback: onCloseCallback,
      });
      popupInstance.open();
    };

    popupOpeners.forEach((opener) =>
      opener.addEventListener("click", popupHandler)
    );
  }
} catch (e) {
  console.log(e);
}

const changeView = () => {
  const viewBlock = document.querySelector(".js-views");
  if (!viewBlock) return;
  const viewChangeHandler = (evt) => {
    evt.preventDefault();
    const categoryClass = ".category__list";
    const target = evt.target.closest("[data-view]");
    if (!target) return;
    const view = target.dataset.view;
    const list = document.querySelector(categoryClass);
    if (!list || list.classList.contains(view)) return;
    if (list.classList.contains(view)) return;
    if (view === "grid") {
      list.classList.remove("list");
      list.classList.add("grid");
    } else {
      list.classList.remove("grid");
      list.classList.add("list");
    }
  };
  viewBlock.addEventListener("click", viewChangeHandler);
  //category__list--list
};

changeView();
