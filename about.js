/* ============================================================
   ABOUT PAGE — credentials lightbox
   ------------------------------------------------------------
   Any [data-cert-src] button opens the shared lightbox at full
   size; Esc, the close button, or a click on the backdrop close
   it again.
   ============================================================ */
(function () {
  var lightbox = document.getElementById('certLightbox');
  if (!lightbox) return;

  var img     = document.getElementById('certLightboxImg');
  var caption = document.getElementById('certLightboxCaption');
  var closeBtn = document.getElementById('certLightboxClose');
  var lastFocus = null;

  function open(src, alt) {
    lastFocus = document.activeElement;
    img.src = src;
    img.alt = alt || '';
    caption.textContent = alt || '';
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function close() {
    lightbox.hidden = true;
    img.src = '';
    document.body.style.overflow = '';
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  Array.prototype.forEach.call(document.querySelectorAll('[data-cert-src]'), function (btn) {
    btn.addEventListener('click', function () {
      open(btn.getAttribute('data-cert-src'), btn.getAttribute('data-cert-alt'));
    });
  });

  closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) close();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !lightbox.hidden) close();
  });
})();
