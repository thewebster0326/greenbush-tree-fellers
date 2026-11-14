const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('#mobile-menu');
const quoteForm = document.querySelector('#quote-form');
const serviceSelect = document.querySelector('#service-select');

const closeMenu = () => {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  mobileMenu.hidden = true;
  document.body.classList.remove('menu-open');
};

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  mobileMenu.hidden = isOpen;
  document.body.classList.toggle('menu-open', !isOpen);
});

mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

window.addEventListener('resize', () => {
  if (window.innerWidth > 820) closeMenu();
});

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 12);
}, { passive: true });

document.querySelectorAll('[data-service]').forEach((button) => {
  button.addEventListener('click', () => {
    serviceSelect.value = button.dataset.service;
    document.querySelector('#quote').scrollIntoView({ behavior: 'smooth' });
    window.setTimeout(() => serviceSelect.focus({ preventScroll: true }), 650);
  });
});

quoteForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!quoteForm.reportValidity()) return;

  const data = new FormData(quoteForm);
  const lines = [
    'Hi Greenbush Tree Fellers, I would like a quote.',
    '',
    `Name: ${data.get('name')}`,
    `Service: ${data.get('service')}`,
    data.get('phone') ? `Phone: ${data.get('phone')}` : '',
    data.get('location') ? `Location: ${data.get('location')}` : '',
    data.get('details') ? `Job details: ${data.get('details')}` : ''
  ].filter(Boolean);

  const whatsappUrl = `https://wa.me/27747545666?text=${encodeURIComponent(lines.join('\n'))}`;
  const note = document.querySelector('#form-note');
  note.textContent = 'Your message is ready. Opening WhatsApp…';
  note.classList.add('success');
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
});

const galleryItems = [...document.querySelectorAll('[data-gallery]')];
const galleryData = galleryItems.map((item) => ({
  src: item.querySelector('img').src,
  alt: item.querySelector('img').alt,
  caption: item.querySelector('strong').textContent
}));
const lightbox = document.querySelector('#lightbox');
const lightboxImage = lightbox.querySelector('img');
const lightboxCaption = lightbox.querySelector('figcaption');
let currentPhoto = 0;

const showPhoto = (index) => {
  currentPhoto = (index + galleryData.length) % galleryData.length;
  const photo = galleryData[currentPhoto];
  lightboxImage.src = photo.src;
  lightboxImage.alt = photo.alt;
  lightboxCaption.textContent = `${photo.caption} · ${currentPhoto + 1} / ${galleryData.length}`;
};

galleryItems.forEach((item, index) => {
  item.addEventListener('click', () => {
    showPhoto(index);
    lightbox.showModal();
  });
});

lightbox.querySelector('.lightbox__close').addEventListener('click', () => lightbox.close());
lightbox.querySelector('.lightbox__nav--prev').addEventListener('click', () => showPhoto(currentPhoto - 1));
lightbox.querySelector('.lightbox__nav--next').addEventListener('click', () => showPhoto(currentPhoto + 1));
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) lightbox.close();
});
lightbox.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') showPhoto(currentPhoto - 1);
  if (event.key === 'ArrowRight') showPhoto(currentPhoto + 1);
});

const galleryToggle = document.querySelector('.gallery__toggle');
galleryToggle.addEventListener('click', () => {
  const expanded = galleryToggle.getAttribute('aria-expanded') === 'true';
  document.querySelectorAll('.gallery__item--extra').forEach((item) => {
    item.hidden = expanded;
    if (!expanded) item.classList.add('is-visible');
  });
  galleryToggle.setAttribute('aria-expanded', String(!expanded));
  galleryToggle.innerHTML = expanded ? 'View more photos <span aria-hidden="true">+</span>' : 'Show fewer photos <span aria-hidden="true">−</span>';
});

document.querySelector('#year').textContent = new Date().getFullYear();
