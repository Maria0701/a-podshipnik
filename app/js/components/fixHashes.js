export function fixHashes({containerClass, blockClass}) {
  const container = document.querySelector(containerClass);
  if (!container) return;
  const block = container.querySelector(blockClass);
  if (!block) return;
  let isFixed = false;

  const getHeaderHeight = () => {
    const header = document.querySelector('header');
    return header.getBoundingClientRect().height;
  };

  const checkPosition = (container, block) => {
    const containerPosition = container.getBoundingClientRect().top;
    const headerHeight = getHeaderHeight();
    if (containerPosition < headerHeight && !isFixed) {
      isFixed = true;
      block.classList.add('fixed');
      block.style.top = `${headerHeight}px`;
    } else if (containerPosition > headerHeight && isFixed) {
      isFixed = false;
      block.classList.remove('fixed');
      block.removeAttribute('style');
    }

    console.log(containerPosition, headerHeight);
  }

  document.addEventListener("scroll", (evt) => {
    checkPosition(container, block);
  }, {passive: true});

  checkPosition(container, block);
}