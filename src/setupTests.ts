import '@testing-library/jest-dom';

// Polyfill for HTMLDialogElement to support <dialog> in jsdom
if (typeof HTMLDialogElement === 'undefined') {
  class HTMLDialogElementMock extends HTMLElement {
    open: boolean = false;
    show() {
      this.open = true;
    }
    showModal() {
      this.open = true;
    }
    close() {
      this.open = false;
      this.dispatchEvent(new Event('close'));
    }
  }
  (global as any).HTMLDialogElement = HTMLDialogElementMock;
} else {
  if (!HTMLDialogElement.prototype.show) {
    HTMLDialogElement.prototype.show = function() {
      this.open = true;
    };
  }
  if (!HTMLDialogElement.prototype.showModal) {
    HTMLDialogElement.prototype.showModal = function() {
      this.open = true;
    };
  }
  if (!HTMLDialogElement.prototype.close) {
    HTMLDialogElement.prototype.close = function() {
      this.open = false;
      this.dispatchEvent(new Event('close'));
    };
  }
}
