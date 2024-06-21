import iziToast from 'izitoast';
import SimpleLightbox from 'simplelightbox';
import axios from 'axios';

import 'izitoast/dist/css/iziToast.min.css';
import 'simplelightbox/dist/simple-lightbox.min.css';

axios.defaults.baseURL = 'https://pixabay.com/api/';
axios.defaults.headers = ['Access-Control-Allow-Origin'];
const API_KEY = '44478278-1149efa35d94f549e3de6ad11';

const form = document.querySelector('.search-form');
const resultContainer = document.getElementById('results');
const scrollAnchor = document.getElementById('scroll-anchor');
let totalHits = 0;
let page = 1;
let consumedHits = 0;
let searchQuery;

const simpleLightbox = new SimpleLightbox('.gallery-link', {
  captionsData: 'alt',
  captionDelay: 100,
  close: false,
  showCounter: false,
  animationSlide: false,
  fadeSpeed: 250,
});

const displaMessage = (type, title) => {
  const bgColor = type === 'warning' ? 'orange' : 'green';
  iziToast.show({
    title: title,
    backgroundColor: bgColor,
    titleColor: 'white',
    position: 'topRight',
  });
};

const createImageCards = hits =>
  hits
    .map(
      hit => `
  <div class="image-card">
    <a class="gallery-link" href="${hit.largeImageURL}">
      <img src="${hit.previewURL}" alt="${hit.tags}" />
    </a>
    <div class="image-metadata">
      ${['likes', 'views', 'comments', 'downloads']
        .map(
          label => `
        <div class="metadata">
          <p class="label">${label.charAt(0).toUpperCase() + label.slice(1)}</p>
          <p>${hit[label]}</p>
        </div>`
        )
        .join('')}
    </div>
  </div>
`
    )
    .join('');

const loadImages = async (query, pageNum, perPage) => {
  try {
    const response = await axios.get('', {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        per_page: 40,
        page: pageNum,
        orientation: 'horizontal',
        safesearch: true,
      },
    });
    const results = response.data.hits;
    totalHits = response.data.totalHits;
    consumedHits += results.length;
    console.log(results);

    if (totalHits === 0) {
      displaMessage(
        'warning',
        'Sorry, there are no images matching your search query. Please try again'
      );
      return;
    }

    const imageCards = createImageCards(results);
    resultContainer.insertAdjacentHTML('beforeend', imageCards);

    simpleLightbox.refresh();
    if (totalHits - consumedHits <= 0) {
      displaMessage(
        'warning',
        'You have reached the end of the search results'
      );
      observer.unobserve(scrollAnchor);
      return;
    }
  } catch (error) {
    console.error('Error getting the data from Pixabay: ', error);
    iziToast.error({
      title: 'Error',
      message: 'Failed to fetch data, please try again',
      position: 'topRight',
    });
  }
};

const observer = new IntersectionObserver(
  entries => {
    if (entries[0].isIntersecting) {
      if (totalHits <= 40) {
        observer.unobserve(scrollAnchor);
      } else {
        page++;
        loadImages(searchQuery, page);
      }
    }
  },
  {
    root: null,
    rootMargin: '0px',
    threshold: 1.0,
  }
);

form.addEventListener('submit', async event => {
  event.preventDefault();
  observer.unobserve(scrollAnchor);

  const formData = new FormData(form);
  searchQuery = formData.get('searchQuery').trim();

  if (!searchQuery) {
    displaMessage('warning', 'Please enter the search query');
    return;
  }

  page = 1;
  consumedHits = 0;

  resultContainer.innerHTML = '';
  await loadImages(searchQuery, page);
  if (totalHits > 0) {
    displaMessage(
      'success',
      `Hooray! We found ${totalHits} images for your search`
    );
    observer.observe(scrollAnchor);
  }
});
