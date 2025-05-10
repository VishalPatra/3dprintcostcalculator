import { MountainVisualization } from './visualization.js';

/* sweetScroll load */
document.addEventListener("DOMContentLoaded", function () {
  // Initialize sweet scroll
  const sweetScroll = new SweetScroll({
    trigger: '[data-scroll]', // Selector for trigger (must be a valid css selector)
    duration: 1000, // Specifies animation duration in pixels
    easing: 'easeInOutQuint', // Easing function
    offset: 0, // Specifies the value to offset from screen top
    vertical: true, // Enable the vertical scroll
    horizontal: false, // Enable the horizontal scroll
    cancellable: true, // When fired wheel or touchstart events to stop scrolling
  });

  /* particlesJS configuration */
  if (window.particlesJS) {
    window.particlesJS('particles-js', {
      "particles": {
        "number": {
          "value": 50,
          "density": {
            "enable": true,
            "value_area": 800
          }
        },
        "color": {
          "value": "#ffffff"
        },
        "shape": {
          "type": "circle",
          "stroke": {
            "width": 0,
            "color": "#000000"
          }
        },
        "opacity": {
          "value": 0.5,
          "random": false,
          "anim": {
            "enable": false,
            "speed": 1,
            "opacity_min": 0.1,
            "sync": false
          }
        },
        "size": {
          "value": 3,
          "random": true,
          "anim": {
            "enable": true,
            "speed": 3,
            "size_min": 0.1,
            "sync": false
          }
        },
        "line_linked": {
          "enable": true,
          "distance": 150,
          "color": "#ffffff",
          "opacity": 0.4,
          "width": 1
        },
        "move": {
          "enable": true,
          "speed": 6,
          "direction": "none",
          "random": true,
          "straight": false,
          "out_mode": "out",
          "bounce": false,
          "attract": {
            "enable": true,
            "rotateX": 600,
            "rotateY": 1200
          }
        }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": {
          "onhover": {
            "enable": true,
            "mode": "grab"
          },
          "onclick": {
            "enable": true,
            "mode": "push"
          },
          "resize": true
        },
        "modes": {
          "grab": {
            "distance": 140,
            "line_linked": {
              "opacity": 1
            }
          },
          "push": {
            "particles_nb": 4
          }
        }
      },
      "retina_detect": true
    });
  }

  // Initialize visualization
  const mountainViz = new MountainVisualization();
  mountainViz.init();
}, false);
