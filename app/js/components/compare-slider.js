const fixColumn = (allFirstRows, slideContainer, container, itemWidth, isDesktop) => {
  let containerTable = container.querySelector('.compare-table__wrapper');

  const ready = () => {
    setTimeout(() => {
      allFirstRows.forEach((item) => {
        const rowHeight = item.closest('tr').getBoundingClientRect();
        item.style.height = `${rowHeight.height}px`;
        item.style.width = `${itemWidth}px`;
        item.style.top = `${rowHeight.top - slideContainer.getBoundingClientRect().top}px`;
        item.style.position = 'absolute';
        item.style.left = `${0}px`;
      });

      containerTable.style.paddingLeft = `${itemWidth}px`;
      document.querySelector('.compare-form').style.width = `${itemWidth - 10}px`;
    }, 0);
  };
  if (!isDesktop) {
    containerTable.style.paddingLeft = `0`;
    document.querySelector('.compare-form').style.width = `auto`;
  } else {
    ready();
  }
};

const detectDesktop = () => window.matchMedia('(min-width: 1024px)').matches;
const getActualWidth = (containerWidth, itemWidth) => containerWidth % itemWidth === 0
  ? itemWidth
  : containerWidth / Math.round(containerWidth / itemWidth) - 10;

export class SliderTable {
  constructor({ containerClass }) {
    this.containerClass = containerClass;
    if (!this.containerClass) return;
    this.isDesktop = false;
    this.containerWidth = 0;
    this.actualWidth = 0;
    this.itemWidth = 288;
    this.currentValue = 0;
    this.resizeObserver = null;
    this.container = null;
    this.range = null;
    this.slideContainer = null;
    this.table = null;
    this.slide = null;
    this.allTabletds = [];
    this.nameTds = [];
    this.items = [];
    this.allFirstRows = null;
    this.fixRowInput = null;
    this.isDesktop = false;
    this.nameFixed = false;
    this.topPosition = 0;
    this.isMoving = false; // проверка на начало движения закрепленных имен
    this.topNameOffset = 0; // отступ строки имен от края страницы
    this.headerElt = null; // получать только для вертикальной прокрутки
    this.containerHandler = this.containerHandler.bind(this);
    this.fixNameRowHandler = this.fixNameRowHandler.bind(this);
    this.setNamesPositionHandler = this.setNamesPositionHandler.bind(this);
    this.setResizeObserver = this.setResizeObserver.bind(this);
    this.getElements();
  }

  getElements() {
    this.container = document.querySelector(`[data-name=${this.containerClass}]`);
    if (!this.container) return;
    this.range = this.container.querySelector(`[data-input=${this.containerClass}]`);
    if (!this.range) throw new Error('You need to define container and range');
    this.slideContainer = this.container.querySelector(`[data-container=${this.containerClass}]`);
    this.table = this.container.querySelector('.compare-table__table');
    this.slide = this.container.querySelector(`.compare-slider`);
    this.fixRowInput = this.container.querySelector('[name="fixrow"]')
    this.items = this.slideContainer.querySelectorAll(`[data-td=${this.containerClass}]`);
    this.allTabletds = this.slideContainer.querySelectorAll('.js-compare-td');
    this.nameTds = this.slideContainer.querySelectorAll('.js-compare-name');
    this.allFirstRows = this.slideContainer.querySelectorAll(`.compare-table__td--first`);
    this.init();
    this.setResizeObserver()
  }

  init() {
    this.removeListeners();
    this.isDesktop = detectDesktop(); // Проверяем размер экрана (десктоп от 1024)
    this.containerWidth = this.slideContainer.getBoundingClientRect().width; // определяем ширину контейнера
    this.actualWidth = getActualWidth(this.containerWidth, this.itemWidth); // получаем скорректированную ширину элемента, чтобы элементы вставали в контейнер целиком
    // устанавливаем нужную ширину всем элементам
    this.allTabletds.forEach((item) => { item.style.width = `${this.actualWidth}px` });
    this.nameTds.forEach((item) => { item.style.width = `${this.actualWidth}px` });
    // пересчитываем реальную ширину таблицы, исходя из реальных размеров ячеек
    this.table.style.width = `${this.actualWidth * (this.items.length)}px`;
    // если все ячейки влезают в страницу, то прячем слайдер
    if (this.containerWidth > this.items.length * this.actualWidth) {
      this.slide.style.display = 'none';
    }
    // получаем текущее значение range
    this.currentValue = Number(this.range.value);
    // устанавливаем максимум для range, чтобы последний элемент фиксировался в конце страницы
    this.range.max = this.items.length - Math.floor(this.containerWidth / this.actualWidth) + 1;
    // фиксируем столбец с названиями строк

    fixColumn(this.allFirstRows, this.slideContainer, this.container, this.actualWidth, this.isDesktop);

    // проверяем, отмечен ли чекбокс "закрепить область с названием", если да, то фиксируем строку
    this.fixNameRowHandler();
    // передвигаем все в соответствии с условиями 
    setTimeout(() => {
      this.moveSlide();
    }, 0);
    // устанавливаем наблюдение за перемещением range и отметки "зафиксировать блок" 
    this.setListeners();

  }
  // передвижение таблицы по горизонтали
  moveSlide() {
    this.allTabletds.forEach((item) => item.style.transform = `translate3d(-${this.currentValue * this.actualWidth}px, 0, 0)`);
    this.nameTds.forEach((item) => item.style.transform = `translate3d(-${this.currentValue * this.actualWidth}px, ${this.topPosition}px, 0)`);
  }
  // реакция при изменении позиции range
  containerHandler(evt) {
    evt.preventDefault();
    this.currentValue = evt.target.value;
    this.moveSlide();
  }
  // фиксация блоков с названием 
  fixNameRowHandler() {
    this.nameFixed = this.fixRowInput.checked;
    this.setNameTopPosition();
  }
  // отслеживаем изменение размера окна
  setResizeObserver() {
    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // если окно меняет размер, пересчитываем размеры элементов
        this.init();
      }
    });
    this.resizeObserver.observe(this.container);
  }
  // устанавливаем стартовые позиции для фиксации строки с названиями
  setStartValuesForTop() {
    // фиксируем высоту всех элементов, чтобы таблица не прыгала 
    const trElement = this.nameTds[0].closest('tr');
    let rowHeight = trElement.getBoundingClientRect().height;
    trElement.style.height = `${rowHeight}px`;
    this.headerElt = document.querySelector('header');
    this.nameCell = trElement.querySelector('.compare-table__td--first');
    this.nameTds.forEach((item) => {
      item.style.height = `${rowHeight}px`;
    });
    this.topNameOffset = trElement.getBoundingClientRect().top + window.scrollY - this.headerElt.getBoundingClientRect().height;
    // так как я изменила логику крепления заголовка, мы теперь не учитываем его высоту
  }

  setNamesPositionHandler() {
    if (window.scrollY + this.headerElt.getBoundingClientRect().height > this.topNameOffset) {
      this.topPosition = - this.topNameOffset + window.scrollY + this.headerElt.getBoundingClientRect().height;
      if (!this.isMoving) {
        this.isMoving = true;
        this.setItemsClass()
      }
    } else {
      this.topPosition = 0;
      if (this.isMoving) {
        this.isMoving = false;
        this.setItemsClass()
      }
    }
    this.nameCell.style.transform = `translate3d(0px, ${this.topPosition}px, 0)`;
    this.nameTds.forEach((item) => item.style.transform = `translate3d(-${this.currentValue * this.actualWidth}px, ${this.topPosition}px, 0)`);
  }

  setItemsClass() {
    this.nameTds.forEach((item) => {
      this.isMoving ? item.classList.add('fixed') : item.classList.remove('fixed');
    });
    this.isMoving ? this.nameCell.classList.add('fixed') : this.nameCell.classList.remove('fixed');
  }

  // Передвижение элементов по вертикали
  setNameTopPosition() {
    if (!this.nameFixed) {
      window.removeEventListener('scroll', this.setNamesPositionHandler);
      return this.topPosition = 0;
    }
    this.setStartValuesForTop();
    window.addEventListener('scroll', this.setNamesPositionHandler);
  }

  setListeners() {
    this.range.addEventListener('change', this.containerHandler);
    this.fixRowInput.addEventListener('change', this.fixNameRowHandler);

  }

  removeListeners() {
    this.range.removeEventListener('change', this.containerHandler);
    this.fixRowInput.removeEventListener('change', this.fixNameRowHandler);
  }

  destroy() {
    this.removeListeners();
    this.resizeObserver.unobserve(this.container);
    this.resizeObserver = null;
    this.container = null;
    this.range = null;
    this.slideContainer = null;
    this.table = null;
    this.slide = null;
    this.allTabletds = [];
    this.nameTds = [];
    this.items = [];
    this.allFirstRows = null;
    this.fixRowInput = null;
  }
}