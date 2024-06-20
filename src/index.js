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
let searchQuery;
let simpleLightbox;

const displaMessage = (type, title) => {
  const bgColor = type === 'warning' ? 'orange' : 'green';
  iziToast.show({
    title: title,
    backgroundColor: bgColor,
    titleColor: 'white',
    position: 'topRight',
  });
};

const loadImages = async (query, pageNum) => {
  try {
    const response = await axios.get('', {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        per_page: 40,
        page: pageNum,
      },
    });
    const results = response.data.hits;
    totalHits = response.data.totalHits;
    console.log(results);

    if (results.length === 0) {
      displaMessage(
        'warning',
        'Sorry, there are not images matching your search query. Please try again'
      );
      return;
    }

    const imageCards = results
      .map(hit => {
        return `<div class="image-card">
            <a class="gallery-link" href="${hit.largeImageURL}">
            <img
            src="${hit.previewURL}"
            alt="${hit.tags}"
            />
            </a>
            <div class="image-metadata">
            <div class="metadata">
            <p class="label">Likes</p>
            <p>${hit.likes}</p>
            </div>
            <div class="metadata">
            <p class="label">Views</p>
            <p>${hit.views}</p>
            </div>
            <div class="metadata">
            <p class="label">Comments</p>
            <p>${hit.comments}</p>
            </div>
            <div class="metadata">
            <p class="label">Downloads</p>
            <p>${hit.downloads}</p>
            </div>
            </div>
            </div>`;
      })
      .join('');
    resultContainer.innerHTML += imageCards;

    if (!simpleLightbox) {
      simpleLightbox = new SimpleLightbox('.gallery-link', {
        captionsData: 'alt',
        captionDelay: 100,
        close: false,
        showCounter: false,
        animationSlide: false,
        fadeSpeed: 250,
      });
    } else {
      simpleLightbox.refresh();
    }
  } catch (error) {
    console.error('Error getting the data from Pixabay: ', error);
    iziToast.error({
      title: Error,
      message: 'Failed to fetch data, please try again',
      position: 'topRight',
    });
  }
};

const observer = new IntersectionObserver(
  entries => {
    if (entries[0].isIntersecting) {
      if (resultContainer.childElementCount + 40 >= totalHits) {
        displaMessage(
          'warning',
          'You have reached the end of the search results'
        );
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
  searchQuery = formData.get('searchQuery');
  page = 1;

  if (searchQuery) {
    resultContainer.innerHTML = '';
    await loadImages(searchQuery, page);
    if (totalHits > 0) {
      displaMessage(
        'success',
        `Hooray! We found ${totalHits} images for your search`
      );
      observer.observe(scrollAnchor);
    }
  } else {
    displaMessage('warning', 'Please enter the search query');
  }
});
