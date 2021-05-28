import NewsApiService from './js/apiService';
import photoCardTml from './templates/photo-card.hbs';
import './css/style.css';
import { info, error } from '@pnotify/core';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/PNotify.css';
import * as basicLightbox from 'basiclightbox';

const newsApiService = new NewsApiService();

const refs = {
  searchForm: document.querySelector('#search-form'),
  photoCardsContainer: document.querySelector('.js-photo-cards-container'),
  loadMoreBtn: document.querySelector('[data-action="load-more"]'),
};

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(e) {
  e.preventDefault();

  clearPhotoCardsMarcup();
  refs.loadMoreBtn.classList.remove('is-hidden');
  newsApiService.query = e.currentTarget.elements.query.value;
  if (newsApiService.query === '') {
    noticeInfo();
  }
  newsApiService.resetPage();

  try {
    const photoCards = await newsApiService.fetchPhotoCards();
    appendPhotoCardsMarcup(photoCards);
  } catch (error) {
    noticeError();
    console.log(error);
  }
}

async function onLoadMore() {
  try {
    const photoCards = await newsApiService.fetchPhotoCards();
    appendPhotoCardsMarcup(photoCards);
    scroll();
  } catch (error) {
    noticeError();
    console.log(error);
  }
}

function appendPhotoCardsMarcup(hits) {
  refs.photoCardsContainer.insertAdjacentHTML('beforeend', photoCardTml(hits));
}

refs.photoCardsContainer.addEventListener('click', onClick);

function onClick(e) {
  if (e.target.nodeName !== 'IMG') return;
  const largeimage = e.target.dataset.source;
  basicLightbox
    .create(
      `
    <img src="${largeimage}">
`,
    )
    .show();
}

function clearPhotoCardsMarcup() {
  refs.photoCardsContainer.innerHTML = '';
}

function scroll() {
  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: 'smooth',
  });
}

function noticeInfo() {
  info({
    title: false,
    text: 'Is empty',
    hide: true,
    icon: false,
    delay: 500,
  });
}

function noticeError() {
  error({
    title: false,
    text: 'Ops, error',
    hide: true,
    icon: false,
    delay: 500,
  });
}
