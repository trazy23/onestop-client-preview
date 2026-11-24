'use strict';
(() => {
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#navigation');
  function closeMenu() { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); }
  menu.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menu.focus(); }
  });
  document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
  window.matchMedia('(min-width: 851px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

  const filters = [...document.querySelectorAll('[data-filter]')];
  const items = [...document.querySelectorAll('.work-gallery .gallery-item')];
  const counter = document.querySelector('.gallery-count');
  function updateCount() { if (counter) counter.textContent = `${items.filter(item => !item.hidden).length} photographs`; }
  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(filter => { const chosen = filter === button; filter.classList.toggle('active', chosen); filter.setAttribute('aria-pressed', String(chosen)); });
    items.forEach(item => { item.hidden = button.dataset.filter !== 'All' && item.dataset.category !== button.dataset.filter; });
    updateCount();
  }));
  updateCount();

  const dialog = document.querySelector('#lightbox');
  const modalImage = document.querySelector('#lightbox-image');
  const caption = document.querySelector('#lightbox-caption');
  const photos = [...document.querySelectorAll('[data-gallery]')];
  let activePhotos = [], activeIndex = 0, opener = null;
  function showPhoto(index) {
    activeIndex = (index + activePhotos.length) % activePhotos.length;
    const button = activePhotos[activeIndex], image = button.querySelector('img');
    modalImage.src = image.getAttribute('src'); modalImage.alt = image.alt;
    caption.textContent = `${button.dataset.caption} — ${activeIndex + 1} / ${activePhotos.length}`;
  }
  photos.forEach(button => button.addEventListener('click', () => {
    opener = button;
    activePhotos = photos.filter(photo => !photo.closest('.gallery-item').hidden);
    showPhoto(activePhotos.indexOf(button));
    dialog.showModal(); document.body.classList.add('modal-open');
    dialog.querySelector('.lightbox-close').focus();
  }));
  dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('.lightbox-prev').addEventListener('click', () => showPhoto(activeIndex - 1));
  dialog.querySelector('.lightbox-next').addEventListener('click', () => showPhoto(activeIndex + 1));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); showPhoto(activeIndex - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); showPhoto(activeIndex + 1); }
  });
  dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
  dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); if (opener) opener.focus(); });

  const form = document.querySelector('#project-form');
  if (form) {
    let fileURL = null;
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const fields = [...new FormData(form).entries()];
      const contents = 'ONE STOP PRODUCTIONS — PROJECT BRIEF\n\n' + fields.map(([name, value]) => `${name}\n${String(value).trim() || 'Not provided'}\n`).join('\n') + '\nCreated locally in your browser. Nothing has been sent.\nTo share this brief, email it to admin@onestopproduction.com or call 404-310-6643.\nBudget selections are planning prompts, not pricing or quotations.\n';
      if (fileURL) URL.revokeObjectURL(fileURL);
      fileURL = URL.createObjectURL(new Blob([contents], { type: 'text/plain;charset=utf-8' }));
      const download = document.querySelector('#download-again');
      download.href = fileURL;
      document.querySelector('#brief-result').hidden = false;
      const status = document.querySelector('#form-status');
      status.textContent = 'Your brief is ready. A download has been requested; nothing has been sent. If it did not appear, use Download again below.';
      download.click();
      status.focus();
    });
    window.addEventListener('pagehide', () => { if (fileURL) URL.revokeObjectURL(fileURL); });
  }
})();
