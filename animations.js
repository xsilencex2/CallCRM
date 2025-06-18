import anime from "animejs";

export function animateCard(el) {
  anime({
    targets: el,
    scale: [0.97, 1],
    opacity: [0, 1],
    easing: 'easeOutBack',
    duration: 480
  });
}

export function blinkOption(el) {
  anime({
    targets: el,
    scale: [1, 1.12, 1],
    duration: 370,
    easing: 'easeOutCubic'
  });
}