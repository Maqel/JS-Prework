// // Konfiguracja efektu tilt
// const TILT_CONFIG = {
//   // Maksymalny kąt przechylenia w stopniach
//   maxTilt: 15,
//   // Intensywność efektu poświaty (glare)
//   glareIntensity: 0.5,
//   // Szybkość animacji w milisekundach
//   transitionDuration: 300,
//   // Mnożnik głębokości cienia
//   shadowFactor: 1.5,
//   // Hierarchia warstw
//   zIndexLevels: {
//     background: 1,
//     middle: 2,
//     foreground: 3
//   }
// };

// // Klasa implementująca efekt tilt
// class TiltEffect {
//   constructor() {
//     // Inicjalizacja elementów z różnymi poziomami z-index
//     this.backgroundElements = document.querySelectorAll('.header, .mainGameWindow');
//     this.middleElements = document.querySelectorAll(
//       '.header__text, .header__subtitle, .mainGameWindow__scoreContainer--playerScore, ' +
//       '.mainGameWindow__scoreContainer--computerScore, .mainGameWindow__messages, ' +
//       '.mainGameWindow__gameButtons'
//     );
//     this.foregroundElements = document.querySelectorAll(
//       '.mainGameWindow__imgContainer-imgPlayerMove, .mainGameWindow__imgContainer-imgComputerMove, ' +
//       '.mainGameWindow__gameButtons-button--rock, .mainGameWindow__gameButtons-button--paper, ' +
//       '.mainGameWindow__gameButtons-button--scissors'
//     );

//     // Ustawienie z-index dla wszystkich elementów
//     this.setupZIndexLevels();
//     // Inicjalizacja efektów
//     this.initializeTiltEffects();
//   }

//   // Ustawienie poziomów z-index
//   setupZIndexLevels() {
//     this.backgroundElements.forEach(el => {
//       el.style.zIndex = TILT_CONFIG.zIndexLevels.background;
//       this.prepareElement(el);
//     });

//     this.middleElements.forEach(el => {
//       el.style.zIndex = TILT_CONFIG.zIndexLevels.middle;
//       this.prepareElement(el);
//     });

//     this.foregroundElements.forEach(el => {
//       el.style.zIndex = TILT_CONFIG.zIndexLevels.foreground;
//       this.prepareElement(el);
//     });
//   }

//   // Przygotowanie elementu do efektu tilt
//   prepareElement(element) {
//     // Dodanie efektu glare
//     const glareElement = document.createElement('div');
//     glareElement.className = 'glare-effect';
//     glareElement.style.cssText = `
//       position: absolute;
//       top: 0;
//       left: 0;
//       width: 100%;
//       height: 100%;
//       background: linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,${TILT_CONFIG.glareIntensity}) 100%);
//       pointer-events: none;
//       opacity: 0;
//       transition: opacity ${TILT_CONFIG.transitionDuration}ms ease-out;
//     `;
//     element.style.position = 'relative';
//     element.style.transform = 'perspective(1000px)';
//     element.style.transition = `transform ${TILT_CONFIG.transitionDuration}ms ease-out`;
//     element.appendChild(glareElement);
//   }

//   // Obliczanie efektu tilt na podstawie pozycji myszy
//   calculateTilt(event, element) {
//     const rect = element.getBoundingClientRect();
//     const x = event.clientX - rect.left;
//     const y = event.clientY - rect.top;
    
//     // Obliczanie procentowej pozycji myszy względem elementu
//     const xPercent = (x / rect.width - 0.5) * 2;
//     const yPercent = (y / rect.height - 0.5) * 2;
    
//     return {
//       tiltX: -yPercent * TILT_CONFIG.maxTilt,
//       tiltY: xPercent * TILT_CONFIG.maxTilt,
//       glareX: x / rect.width * 100,
//       glareY: y / rect.height * 100
//     };
//   }

//   // Aktualizacja cienia elementu
//   updateShadow(element, tiltX, tiltY) {
//     const shadowX = tiltY * TILT_CONFIG.shadowFactor;
//     const shadowY = tiltX * TILT_CONFIG.shadowFactor;
//     element.style.boxShadow = `
//       ${shadowX}px ${shadowY}px 20px rgba(0,0,0,0.2)
//     `;
//   }

//   // Inicjalizacja efektów tilt dla wszystkich elementów
//   initializeTiltEffects() {
//     const allElements = [
//       ...this.backgroundElements,
//       ...this.middleElements,
//       ...this.foregroundElements
//     ];

//     allElements.forEach(element => {
//       // Obsługa wejścia myszy na element
//       element.addEventListener('mouseenter', () => {
//         element.querySelector('.glare-effect').style.opacity = '1';
//       });

//       // Obsługa ruchu myszy nad elementem
//       element.addEventListener('mousemove', (e) => {
//         const { tiltX, tiltY, glareX, glareY } = this.calculateTilt(e, element);
        
//         // Zastosowanie efektu tilt
//         element.style.transform = `
//           perspective(1000px)
//           rotateX(${tiltX}deg)
//           rotateY(${tiltY}deg)
//         `;

//         // Aktualizacja pozycji poświaty
//         const glare = element.querySelector('.glare-effect');
//         glare.style.transform = `
//           translate(${glareX}%, ${glareY}%)
//         `;

//         // Aktualizacja cienia
//         this.updateShadow(element, tiltX, tiltY);
//       });

//       // Obsługa wyjścia myszy z elementu
//       element.addEventListener('mouseleave', () => {
//         // Reset wszystkich efektów
//         element.style.transform = 'perspective(1000px)';
//         element.style.boxShadow = '';
//         element.querySelector('.glare-effect').style.opacity = '0';
//       });
//     });
//   }
// }

// // Inicjalizacja efektu po załadowaniu strony
// document.addEventListener('DOMContentLoaded', () => {
//   new TiltEffect();
// });

document.addEventListener('DOMContentLoaded', () => {

  // Kod dla efektu 3D karty
  const $gameWindow = document.querySelector('.mainGameWindow');

  if ($gameWindow) { // Sprawdź, czy element istnieje
    let bounds;

    function rotateToMouse(e) {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const leftX = mouseX - bounds.x;
      const topY = mouseY - bounds.y;
      const center = {
        x: leftX - bounds.width / 2,
        y: topY - bounds.height / 2
      }
      // Zmniejszamy dzielnik (np. ze 100 na 50 lub mniej), aby zwiększyć czułość/zakres obrotu
      // Możesz też dostosować mnożnik logarytmu (np. * 1 lub * 1.5 zamiast * 2)
      const rotateX = center.y / 50; // Zwiększona czułość
      const rotateY = -center.x / 50; // Zwiększona czułość
      const distance = Math.sqrt(center.x**2 + center.y**2);
      const angle = Math.log(distance + 1) * 1.5; // Użyj (distance + 1), aby uniknąć log(0), dostosuj mnożnik

      $gameWindow.style.transform = `
        scale3d(1.05, 1.05, 1.05) /* Możesz dostosować skalę lub ją usunąć */
        rotate3d(
          ${rotateX},
          ${rotateY},
          0,
          ${angle}deg
        )
      `;

      // Usunięto aktualizację '.glow'
    }

    $gameWindow.addEventListener('mouseenter', () => {
      bounds = $gameWindow.getBoundingClientRect();
      document.addEventListener('mousemove', rotateToMouse);
    });

    $gameWindow.addEventListener('mouseleave', () => {
      document.removeEventListener('mousemove', rotateToMouse);
      // Resetuj tylko transform, zachowując inne potencjalne style inline
      $gameWindow.style.transform = '';
      // Usunięto resetowanie tła
    });

  } else {
    console.warn('.mainGameWindow element not found for 3D effect.');
  }

  // ... Twój pozostały kod JavaScript ...

}); // Koniec DOMContentLoaded