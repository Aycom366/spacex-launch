import "@testing-library/jest-dom";

class IntersectionObserver {
  constructor(callback: IntersectionObserverCallback) {
    // No operation needed for testing
  }

  observe() {}
  unobserve() {}
  disconnect() {}
}

(globalThis as any).IntersectionObserver = IntersectionObserver;
