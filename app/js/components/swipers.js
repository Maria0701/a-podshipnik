import Swiper from "swiper";
import { Navigation, Pagination, Autoplay, EffectFade, Thumbs } from "swiper/modules";
Swiper.use([Navigation, Pagination, Autoplay, EffectFade, Thumbs]);

export const initializeMainSlider = ({ sliderElt, className }) => {
  const slider = sliderElt.querySelector(`${className}__slider`);
  if (!slider) return;
  const nextElt = sliderElt.querySelector(".btn--right");
  const prevElt = sliderElt.querySelector(".btn--left");

  const mySwiper = new Swiper(slider, {
    slidesPerView: 1,
    navigation: {
      nextEl: nextElt,
      prevEl: prevElt,
    },
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
  });
};

export const initializeBannersSlider = ({ sliderElt, className }) => {
  const slider = sliderElt.querySelector(`${className}__slider`);
  console.log(slider);
  if (!slider) return;
  const nextElt = sliderElt.querySelector(".btn--right");
  const prevElt = sliderElt.querySelector(".btn--left");

  const mySwiper = new Swiper(slider, {
    slidesPerView: 1,
    navigation: {
      nextEl: nextElt,
      prevEl: prevElt,
    },
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
  });
};

export const initializeBrandsSlider = ({ sliderElt, className, numberOfSlides, slideClass }) => {
  const slider = sliderElt.querySelector(`${className}__slider`);
  if (!slider) return;
  const nextElt = sliderElt.querySelector(".btn--right");
  const prevElt = sliderElt.querySelector(".btn--left");

  const mySwiper = new Swiper(slider, {
    slidesPerView: "auto",
    spaceBetween: 20,
    breakpoints: {
      1420: {
        slidesPerView: numberOfSlides,
      },
    },
    navigation: {
      nextEl: nextElt,
      prevEl: prevElt,
    },
    slideClass: slideClass ? slideClass : 'swiper-slide'
  });
};



export const initializeItemSlider = ({ sliderElt, className }) => {
  const slider = sliderElt.querySelector(`${className}__slider`);
  if (!slider) return;
  const jsThumbs = sliderElt.querySelector(`${className}__thumbs`);
  const thumbsSwiper = new Swiper(jsThumbs, {
    slidesPerView: 'auto',
    direction: 'vertical',
    spaceBetween: 15,
    mousewheel: true,
    // watchSlidesProgress: true,
  });

  const mySwiper = new Swiper(slider, {
    slidesPerView: 1,
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    thumbs: {
      swiper: thumbsSwiper,
    }
  });

};