class MouseParallax {
  constructor(config) {
    this.wrapper = config.wrapper; // Główny wrapper
    this.elements = config.elements;
    this.strengths = config.strengths || [15, 10, 5];
    this.easing = config.easing || 0.1;
    this.targetPositions = {};
    this.isMouseInside = false; // Flaga śledząca, czy mysz jest wewnątrz wrappera

    this.wrapper.addEventListener(
      'mouseenter',
      () => (this.isMouseInside = true)
    );
    this.wrapper.addEventListener(
      'mouseleave',
      this.resetParallax.bind(this)
    );
    document.addEventListener(
      'mousemove',
      this.updateTargetPositions.bind(this)
    );
    this.animateParallax();
  }

  /**
   * Update the target positions of the elements based on the mouse position
   */
  updateTargetPositions(event) {
    if (!this.isMouseInside) return; // Ignoruj zdarzenia, gdy mysz jest poza wrapperem

    const wrapperRect = this.wrapper.getBoundingClientRect(); // Pobierz wymiary wrappera
    const mouseX = event.clientX - wrapperRect.left; // Pozycja myszy względem wrappera
    const mouseY = event.clientY - wrapperRect.top;

    const wrapperCenterX = wrapperRect.width / 2;
    const wrapperCenterY = wrapperRect.height / 2;

    this.elements.forEach((layer, index) => {
      const strength = this.strengths[index];

      layer.forEach((element) => {
        // Obliczenia paralaksy
        this.targetPositions[element] = {
          x: ((wrapperCenterX - mouseX) * strength) / 100,
          y: ((wrapperCenterY - mouseY) * strength) / 100,
        };

        // Obliczenia tilt
        const relativeX = (mouseX - wrapperCenterX) / wrapperRect.width; // Proporcjonalna pozycja X
        const relativeY = (mouseY - wrapperCenterY) / wrapperRect.height; // Proporcjonalna pozycja Y

        const tiltX = relativeY * 20; // Obrót w osi X
        const tiltY = relativeX * -20; // Obrót w osi Y

        // Dynamiczne cienie
        const shadowX = relativeX * 50; // Pozycja cienia w osi X
        const shadowY = relativeY * 50; // Pozycja cienia w osi Y
        const shadowBlur = 30; // Rozmycie cienia
        const shadowColor = 'rgba(0, 0, 0, 0.3)'; // Kolor cienia

        // Efekt blasku
        const glowColor = 'rgba(255, 255, 255, 0.6)'; // Kolor blasku
        const glowBlur = 20; // Rozmycie blasku

        // Przypisz wartości tilt i style cieni do dataset
        element.dataset.tiltX = tiltX;
        element.dataset.tiltY = tiltY;
        element.style.boxShadow = `
          ${-shadowX}px ${-shadowY}px ${shadowBlur}px ${shadowColor},
          0 0 ${glowBlur}px ${glowColor}
        `;
      });
    });
  }

  /**
   * Reset the parallax, tilt, and shadow effect to center
   */
  resetParallax() {
    this.isMouseInside = false; // Flaga resetowana na false, gdy mysz opuszcza wrapper

    this.elements.forEach((layer) => {
      layer.forEach((element) => {
        this.targetPositions[element] = { x: 0, y: 0 };

        // Reset efektu tilt, paralaksy i cieni
        element.dataset.tiltX = 0;
        element.dataset.tiltY = 0;
        element.style.transform = 'rotateX(0deg) rotateY(0deg) translate(0px, 0px)';
        element.style.boxShadow = 'none';
      });
    });
  }

  /**
   * Animate the parallax, tilt, and shadow effect
   */
  animateParallax() {
    this.elements.forEach((layer) => {
      layer.forEach((element) => {
        const target = this.targetPositions[element];
        if (!target) return;

        const matrix = new DOMMatrix(getComputedStyle(element).transform);
        const currentX = matrix.m41;
        const currentY = matrix.m42;

        const newX = currentX + (target.x - currentX) * this.easing;
        const newY = currentY + (target.y - currentY) * this.easing;

        // Pobranie wartości tilt
        const tiltX = parseFloat(element.dataset.tiltX) || 0;
        const tiltY = parseFloat(element.dataset.tiltY) || 0;

        // Zastosowanie spójnej transformacji
        element.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) translate(${newX}px, ${newY}px)`;
      });
    });

    requestAnimationFrame(this.animateParallax.bind(this));
  }
}

// Initialize MouseParallax
const wrapper = document.querySelector('.wrapper');
const layer1 = document.querySelectorAll('.mainGameWindow__gameButtons-button');
const layer2 = document.querySelectorAll('.mainGameWindow__gameButtons, .mainGameWindow__imgContainer');
const layer3 = document.querySelectorAll('.mainGameWindow');

new MouseParallax({
  wrapper,
  elements: [layer1, layer2, layer3],
  strengths: [20, 10, 5], // Siła efektu dla każdej warstwy
  easing: 0.1,
});
