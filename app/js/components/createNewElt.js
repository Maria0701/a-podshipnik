export class CreateNewElement {
  constructor(elmnt, tag = 'div', className) {
   
    this.elmnt = elmnt;
    this.tag = tag;
    this.className = className || null;
    this.newElement = null;
    this.createElmt = this.createElmt.bind(this);
  }

  createElmt() {
    this.newElement = document.createElement(this.tag);
    if (this.className) this.newElement.classList.add(this.className);
    this.elmnt.append(this.newElement);
    return this.newElement;
  }

  destroyElmt() {
    this.newElement.remove();
    this.newElement = null;
  }

  insertText(text) {
    this.newElement.innerHTML = '';
    this.newElement.insertAdjacentHTML('beforeend', text);
  }

  setAttribute(atrName,atrValue) {
    this.newElement.setAttribute(atrName, atrValue);
  } 
};