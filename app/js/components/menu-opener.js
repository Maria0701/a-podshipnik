import { CreateNewElement } from "./createNewElt.js";

const desktopWidth = 1024;
const header = document.querySelector(".header");

const checkWidth = (correctHandler, incorrectHandler) => {
  let currentWidth = header.getBoundingClientRect().width;
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (
        entry.contentBoxSize[0].inlineSize >= desktopWidth &&
        currentWidth <= desktopWidth
      ) {
        currentWidth = entry.contentBoxSize[0].inlineSize;
        console.log(entry.contentBoxSize[0].inlineSize);
        correctHandler();
      } else if (
        entry.contentBoxSize[0].inlineSize < desktopWidth &&
        currentWidth > desktopWidth
      ) {
        currentWidth = entry.contentBoxSize[0].inlineSize;
        console.log(
          entry.contentBoxSize[0].inlineSize,
          desktopWidth,
          currentWidth
        );
        incorrectHandler();
      }
    }
  });

  resizeObserver.observe(header);
};

export class MenuHandler {
  constructor({
    togglerClass,
    menuClass,
    submenuTogglersClass,
    closerClass,
    headerOpenClass = "opened",
    openedClass = "opened",
    overlayNeeded = true,
  }) {
    this.togglerClass = togglerClass;
    this.headerOpenClass = headerOpenClass;
    this.menuClass = menuClass;
    this.closerClass = closerClass;
    this.menuTogglers = document.querySelectorAll(this.togglerClass);
    this.menu = document.querySelector(this.menuClass);
    this.submenuTogglersClass = submenuTogglersClass;
    this.closerElts = null;
    this.subMenuTogglers = null;
    this.activeSubMenu = null;
    this.overlay = null;
    this.header = null;
    this.overlayNeeded = overlayNeeded;
    this.openedClass = openedClass;
    this.openMenuHandler = this.openMenuHandler.bind(this);
    this.closeMenuHandler = this.closeMenuHandler.bind(this);
    this.subMenuHandler = this.subMenuHandler.bind(this);
    this.closeHandler = this.closeHandler.bind(this);
    this.outOfAreHandler = this.outOfAreHandler.bind(this);
    this.subMenuClickHandler = this.subMenuClickHandler.bind(this);
    this.init();
  }

  init() {
    if (!this.menuTogglers.length || !this.menu) return;
    this.menuTogglers.forEach((menuToggler) =>
      menuToggler.addEventListener("click", this.openMenuHandler)
    );
    if (this.closerClass) {
      this.closerElts.querySelectorAll(this.closerClass);
    }
  }

  closeMenuHandler(evt) {
    evt.preventDefault();
    this.closeMenu();
  }

  openMenuHandler(evt) {
    evt.preventDefault();
    this.menu.classList.add(this.openedClass);
    this.menuTogglers.forEach((menuToggler) => {
      menuToggler.classList.add(this.openedClass);
      this.setSubmenu();
      menuToggler.removeEventListener("click", this.openMenuHandler);
      menuToggler.addEventListener("click", this.closeMenuHandler);
    });

    if (this.headerOpenClass) {
      this.header = document.querySelector(".header");
      this.header.classList.add(this.headerOpenClass);
    }

    if (this.closerClass && this.closerElts.length) {
      this.closerElts.forEach((item) =>
        item.addEventListener("click", this.closeHandler)
      );
    }

    if (!this.overlay && this.overlayNeeded) {
      this.overlay = new CreateNewElement(
        document.querySelector("body"),
        "div",
        "overlay"
      );
      this.overlay.createElmt();
    }

    document.addEventListener("click", this.outOfAreHandler);
  }

  setSubmenu() {
    if (this.submenuTogglersClass) {
      this.subMenuTogglers = this.menu.querySelectorAll(
        this.submenuTogglersClass
      );
      if (this.subMenuTogglers.length) {
        this.setSubMenuHandlers();
        checkWidth(
          () => {
            this.subMenuTogglers.forEach((item) =>
              item
                .closest("li")
                .addEventListener("mouseenter", this.subMenuHandler)
            );
            this.subMenuTogglers.forEach((item) =>
              item.removeEventListener("click", this.subMenuClickHandler)
            );
          },
          () => {
            this.subMenuTogglers.forEach((item) =>
              item
                .closest("li")
                .removeEventListener("mouseenter", this.subMenuHandler)
            );
            this.subMenuTogglers.forEach((item) =>
              item.addEventListener("click", this.subMenuClickHandler)
            );
          }
        );
      }
    }
  }

  setSubMenuHandlers() {
    if (window.matchMedia(`(min-width: ${desktopWidth}px)`).matches) {
      this.subMenuTogglers.forEach((item) =>
        item.closest("li").addEventListener("mouseenter", this.subMenuHandler)
      );
    } else {
      this.subMenuTogglers.forEach((item) =>
        item.addEventListener("click", this.subMenuClickHandler)
      );
    }
  }

  subMenuHandler(evt) {
    evt.preventDefault();
    const li = evt.target.closest("li");
    if (this.activeSubMenu && this.activeSubMenu !== li) {
      this.activeSubMenu
        .querySelector(this.submenuTogglersClass)
        .classList.remove("opened");
      this.activeSubMenu.classList.remove("opened");
    }
    this.activeSubMenu = li;
    this.openSubMenu();
  }

  subMenuClickHandler(evt) {
    evt.preventDefault();
    const li = evt.target.closest("li");
    this.activeSubMenu = li;
    if (this.activeSubMenu) {
      this.activeSubMenu
        .querySelector(this.submenuTogglersClass)
        .classList.toggle("opened");
      this.activeSubMenu.classList.toggle("opened");
    }
  }

  openSubMenu() {
    this.activeSubMenu
      .querySelector(this.submenuTogglersClass)
      .classList.add("opened");
    this.activeSubMenu.classList.add("opened");
  }

  closeHandler(evt) {
    evt.preventDefault();
    this.closeMenu();
  }

  closeMenu() {
    if (this.activeSubMenu) this.closeSubMenu();
    this.menu.classList.remove(this.openedClass);
    this.menuTogglers.forEach((menuToggler) => {
      menuToggler.classList.remove(this.openedClass);
      menuToggler.removeEventListener("click", this.closeMenuHandler);
      menuToggler.addEventListener("click", this.openMenuHandler);
    });

    if (this.header) {
      this.header.classList.remove(this.headerOpenClass);
      this.header = null;
    }

    if (this.overlay) {
      this.overlay.destroyElmt();
      this.overlay = null;
    }

    if (this.closerClass && this.closerElts.length) {
      this.closerElts.forEach((item) =>
        item.removeEventListener("click", this.closeHandler)
      );
    }

    document.removeEventListener("click", this.outOfAreHandler);
  }

  closeSubMenu() {
    if (this.subMenuTogglers.length) {
      this.subMenuTogglers.forEach((item) =>
        item.removeEventListener("click", this.subMenuClickHandler)
      );
      this.subMenuTogglers.forEach((item) =>
        item
          .closest("li")
          .removeEventListener("mouseenter", this.subMenuHandler)
      );
      this.subMenuTogglers = null;
    }
  }

  outOfAreHandler(evt) {
    const containsToggler = [...this.menuTogglers].find((toggler) =>
      toggler.contains(evt.target)
    );
    if (this.menu.contains(evt.target) || containsToggler) return;
    this.closeMenu();
  }
}
