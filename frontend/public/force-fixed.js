// Script para FORZAR que header y footer estén COMPLETAMENTE fijos
// Se ejecuta en el index.html antes de React

(function() {
  'use strict';
  
  function forceFixed() {
    // Header
    const headers = document.querySelectorAll('header');
    headers.forEach(header => {
      header.style.setProperty('position', 'fixed', 'important');
      header.style.setProperty('top', '0', 'important');
      header.style.setProperty('left', '0', 'important');
      header.style.setProperty('right', '0', 'important');
      header.style.setProperty('z-index', '9998', 'important');
    });
    
    // Footer/Nav
    const navs = document.querySelectorAll('nav');
    navs.forEach(nav => {
      nav.style.setProperty('position', 'fixed', 'important');
      nav.style.setProperty('bottom', '0', 'important');
      nav.style.setProperty('left', '0', 'important');
      nav.style.setProperty('right', '0', 'important');
      nav.style.setProperty('z-index', '9999', 'important');
    });
  }
  
  // Ejecutar inmediatamente
  forceFixed();
  
  // Ejecutar en intervalos
  setInterval(forceFixed, 100);
  
  // Ejecutar en scroll
  window.addEventListener('scroll', forceFixed, { passive: true });
  window.addEventListener('touchmove', forceFixed, { passive: true });
  
  // Ejecutar cuando DOM cambia
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(forceFixed);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
  
  // Ejecutar cuando la página carga
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', forceFixed);
  } else {
    forceFixed();
  }
  
  window.addEventListener('load', forceFixed);
})();

