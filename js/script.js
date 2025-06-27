import './parts/mixins-variables.scss';

/**
 * Main Algorithm:
 * 1. Wait for the entire HTML structure (DOM) to be fully loaded.
 * 2. Find the HTML element that should react to the mouse ('.mainGameWindow').
 * 3. If the element exists:
 * a. Prepare a variable to store its dimensions ('bounds').
 * b. Define a function ('rotateToMouse') to be called on mouse movement over the element:
 * i. Get the element's current dimensions and position.
 * ii. Calculate the mouse cursor's position relative to the element's center.
 * iii. Calculate the cursor's distance from the element's center.
 * iv. Calculate 3D rotation parameters based on the cursor's position and distance.
 * v. Apply the calculated 3D transformation (rotation + scaling) to the element.
 * vi. Calculate the position for the center of the "glow" effect's gradient.
 * vii. Set CSS custom properties (--glow-x, --glow-y) on the element to pass the gradient position to the pseudo-element in CSS.
 * c. Add a listener for the 'mouseenter' event (mouse enters the element):
 * i. Get the element's dimensions.
 * ii. Start listening for mouse movements ('mousemove') on the entire document, calling the 'rotateToMouse' function.
 * d. Add a listener for the 'mouseleave' event (mouse leaves the element):
 * i. Stop listening for mouse movements ('mousemove').
 * ii. Reset the element's 3D transformation to its initial state.
 * iii. Remove the CSS custom properties (--glow-x, --glow-y) so the pseudo-element reverts to its default appearance.
 * 4. If the element doesn't exist, display a warning in the console.
 */

// 1. Wait for the entire HTML structure (DOM) to be fully loaded and parsed.
//    This ensures that the '.mainGameWindow' element is available when the script tries to find it.
document.addEventListener('DOMContentLoaded', () => {

  // 2. Find the HTML element with the class 'mainGameWindow' in the document.
  //    'const' means the variable $card cannot be reassigned to another element later.
  //    The '$' prefix is a common convention for variables holding DOM elements.
  const $card = document.querySelector('.mainGameWindow');

  // 3a. Prepare a variable 'bounds' to store information about the dimensions and position of the $card element.
  //     'let' means the value of this variable can be changed (updated) later.
  let bounds;

  // Check if the $card element was successfully found in the document.
  if (!$card) {
    // 4. If the element doesn't exist (e.g., due to a typo in the selector or HTML), display an error message in the developer console.
    console.error('.mainGameWindow element not found!');
    // Stop the execution of the anonymous function passed to addEventListener to prevent further errors.
    return;
  }

  // 3b. Define a function named 'rotateToMouse'. It will accept an event object 'e' as an argument.
  //     This function will be called every time the mouse moves while over the $card element (after 'mouseenter').
  function rotateToMouse(e) {

    // 3b.i. Get the current dimensions and position of the $card element relative to the viewport.
    //       This is important for accurate calculations, especially if the element's size or position changes.
    bounds = $card.getBoundingClientRect();

    // Get the global mouse cursor coordinates (X and Y) from the event object 'e'.
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // 3b.ii. Calculate the local mouse cursor coordinates relative to the top-left corner of the $card element.
    const leftX = mouseX - bounds.x;
    const topY = mouseY - bounds.y;

    // Calculate the mouse cursor coordinates relative to the *center* of the $card element.
    // Subtract half the element's width and height from the local coordinates (leftX, topY).
    const center = {
      x: leftX - bounds.width / 2,
      y: topY - bounds.height / 2
    };

    // 3b.iii. Calculate the Euclidean distance of the cursor from the center of the $card element.
    //         Math.hypot(x, y) is equivalent to Math.sqrt(x*x + y*y).
    const distance = Math.hypot(center.x, center.y);

    // 3b.iv. Calculate the 3D rotation parameters.
    //        The rotation around the X-axis depends on the vertical mouse position (center.y). The divisor (e.g., 50) controls sensitivity.
    const rotateX = center.y / 50;
    //        The rotation around the Y-axis depends on the horizontal mouse position (center.x). The negative sign inverts the rotation direction.
    const rotateY = -center.x / 50;
    //        The rotation angle (around the combined X and Y axis vector) depends on the logarithm of the distance.
    //        The logarithm makes the rotation more subtle near the center and increase faster further away.
    //        We add +1 to distance to avoid Math.log(0) (which would result in -Infinity). The multiplier (e.g., 1.5) scales the angle.
    const angle = Math.log(distance + 1) * 1.5;

    // 3b.v. Apply the calculated 3D transformation to the $card element using inline styles.
    //       `scale3d` slightly enlarges the element for a "lifting" effect.
    //       `rotate3d` rotates the element around the vector (rotateX, rotateY, 0) by the calculated 'angle'.
    $card.style.transform = `
      scale3d(1.05, 1.05, 1.05)
      rotate3d(
        ${rotateX},
        ${rotateY},
        0,
        ${angle}deg
      )
    `;

    // 3b.vi. Calculate the X and Y position for the center of the radial gradient "glow" effect.
    //        Multiplying center.x/y by 2 and adding half the dimensions creates an offset
    //        that makes the light source appear further away and react more strongly to movement.
    const glowX = center.x * 2 + bounds.width / 2;
    const glowY = center.y * 2 + bounds.height / 2;

    // 3b.vii. Set the CSS custom properties (--glow-x, --glow-y) on the $card element.
    //         These variables are then used in the `background-image` definition of the pseudo-element in CSS
    //         to dynamically change the gradient's center position.
    //         We use `setProperty`, which is the standard way to manipulate CSS custom properties.
    $card.style.setProperty('--glow-x', `${glowX}px`);
    $card.style.setProperty('--glow-y', `${glowY}px`);
  }

  // 3c. Add an event listener for the 'mouseenter' event (the moment the mouse cursor enters the $card element's area).
  $card.addEventListener('mouseenter', () => {
    // 3c.i. Get the dimensions and position of the $card element when the mouse enters.
    //       This is crucial for the first call to rotateToMouse to have correct 'bounds' data.
    bounds = $card.getBoundingClientRect();

    // 3c.ii. Start listening for the 'mousemove' event on the *entire document*.
    //        When the mouse moves (even outside the $card element, after having entered it),
    //        the 'rotateToMouse' function will be called. Listening on the document
    //        provides a smoother experience, especially with fast mouse movements.
    document.addEventListener('mousemove', rotateToMouse);
  });

  // 3d. Add an event listener for the 'mouseleave' event (the moment the mouse cursor leaves the $card element's area).
  $card.addEventListener('mouseleave', () => {
    // 3d.i. Stop listening for the 'mousemove' event that was added during 'mouseenter'.
    //       This prevents 'rotateToMouse' from being called unnecessarily when the mouse is outside the element.
    document.removeEventListener('mousemove', rotateToMouse);

    // 3d.ii. Reset the 'transform' style of the $card element to its default value (or the value defined in the CSS stylesheet).
    //        This will cause the element to smoothly transition back to its original orientation (thanks to the CSS transition).
    $card.style.transform = '';

    // 3d.iii. Remove the CSS custom properties (--glow-x, --glow-y) from the $card element.
    //         This causes the pseudo-element's `background-image` in CSS to use its fallback values
    //         (e.g., 50% 50% defined in `var(--glow-x, 50%)`), returning the "glow" effect to its resting state.
    $card.style.removeProperty('--glow-x');
    $card.style.removeProperty('--glow-y');
  });

}); // End of the DOMContentLoaded listener



// const img = document.querySelector('.img');
// const score = document.querySelector('.shine');

// img.addEventListener('mouseenter', () => {
//   score.classList.add('active');
// });

// img.addEventListener('mouseleave', () => {
//   score.classList.remove('s');
// });