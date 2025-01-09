import { MenuHandler } from "./components/menu-opener.js";
import { phoneMask } from "./components/phone-mask.js";
import { Popup } from "./components/popups.js";
import {
  initializeBannersSlider,
  initializeBrandsSlider,
  initializeGoodsSlider,
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
  });
}

const goodsSlider = document.querySelector(`.js-goods-slider`);
if (goodsSlider) {
  initializeGoodsSlider({
    sliderElt: goodsSlider,
    className: ".items-swiper",
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
