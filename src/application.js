import i18next from 'i18next';
import initview from './view';
import { sendRequest, addRss, validate } from './utils';
import parse from './parser';
import resources from './locales';

const init = (i18n) => {
  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('input'),
    posts: document.querySelector('.posts'),
    feeds: document.querySelector('.feeds'),
    feedback: document.querySelector('.feedback'),
    submitButton: document.querySelector('button.add'),
    modalElements: {
      modalContainer: document.querySelector('#modal'),
      modalTitle: document.querySelector('.modal-title'),
      modalBody: document.querySelector('.modal-body'),
      modalRef: document.querySelector('.full-article'),
    },
  };

  const state = {
    form: {
      rssField: {
        valid: true,
        error: null,
      },
    },
    modalContent: {
      title: '',
      description: '',
      link: '',
    },
    posts: [],
    feeds: [],
    savedUrls: [],
    error: null,
    dataProcess: 'initial',
    uiState: {
      readPosts: new Set(),
    },
  };

  const watchedState = initview(state, elements, i18n);

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const url = formData.get('url');

    const urls = watchedState.savedUrls;

    const error = validate(url, urls, i18n);

    if (error) {
      watchedState.form.rssField = {
        valid: false,
        error,
      };
      return;
    }

    watchedState.form.rssField = {
      valid: true,
      error: null,
    };

    watchedState.dataProcess = 'sending';

    sendRequest(url)
      .then((xml) => {
        const data = parse(xml);
        watchedState.savedUrls.push(url);
        addRss(data, watchedState, url);
        watchedState.error = null;
        watchedState.dataProcess = 'processed';
      })
      .catch((err) => {
        watchedState.dataProcess = 'failed';
        if (err.isParsingError) {
          watchedState.error = i18n.t('errorMessage.invalidRSS');
        }
        if (err.isAxiosError) {
          watchedState.error = i18n.t('errorMessage.network');
        }
      });
  });

  elements.posts.addEventListener('click', (e) => {
    const choosedElem = e.target;
    if (choosedElem.classList.contains('link')) {
      const dataId = choosedElem.dataset.id;
      watchedState.uiState.readPosts.add(dataId);
    }

    if (choosedElem.hasAttribute('data-bs-toggle')) {
      const dataId = choosedElem.dataset.id;
      watchedState.uiState.readPosts.add(dataId);
      const relatedPost = watchedState.posts.find((post) => post.postId === dataId);
      const { title, description, postLink } = relatedPost;
      elements.modalElements.modalTitle.textContent = title;
      elements.modalElements.modalBody.textContent = description;
      elements.modalElements.modalRef.href = postLink;
    }
  });
};

const runApp = () => {
  const defaultLanguage = 'ru';
  const newInstance = i18next.createInstance();
  newInstance.init({
    lng: defaultLanguage,
    debug: true,
    resources,
  }).then(() => init(newInstance));
};

export default runApp;
