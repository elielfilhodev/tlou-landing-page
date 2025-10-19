// Inicialização de AOS
document.addEventListener('DOMContentLoaded', function () {
  if (window.AOS) {
    window.AOS.init({
      duration: 800,
      once: true,
      offset: 100
    });
  }

  // Smooth Scroll para âncoras
  var anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetSelector = this.getAttribute('href');
      if (!targetSelector || targetSelector === '#') return;
      var target = document.querySelector(targetSelector);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });
});

