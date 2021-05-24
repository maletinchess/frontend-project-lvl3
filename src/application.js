import i18next from 'i18next';
import initview from './view';
import { sendRequest, addRss, validate } from './utils';
import parse from './parser';
import resources from './locales';

const app = async () => {
  const defaultLanguage = 'ru';
  await i18next.init({
    lng: defaultLanguage,
    debug: true,
    resources,
  });

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
    rssCount: 0,
    error: null,
    dataProcess: 'initial',
    uiState: {
      readPosts: [],
    },
  };

  const watchedState = initview(state, elements);

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const url = formData.get('url');

    const urls = watchedState.savedUrls.map((item) => item.url);

    const error = validate(url, urls);

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
        watchedState.rssCount += 1;
        watchedState.savedUrls = [{ url, id: watchedState.rssCount }, ...watchedState.savedUrls];
        addRss(data, watchedState, url);
        watchedState.error = null;
        watchedState.dataProcess = 'processed';
      })
      .catch((err) => {
        watchedState.dataProcess = 'failed';
        if (err.isParsingError) {
          watchedState.error = i18next.t('errorMessage.invalidRSS');
        } else {
          watchedState.error = i18next.t('errorMessage.network');
        }
      });
  });

  elements.modalElements.modalContainer.addEventListener('show.bs.modal', (e) => {
    const relatedElement = e.relatedTarget;
    const dataId = Number(relatedElement.dataset.id);
    watchedState.uiState.readPosts.push(dataId);
    const relatedPost = watchedState.posts.find((post) => post.postId === dataId);
    const { title, description, postLink } = relatedPost;
    watchedState.modalContent = {
      title, description, link: postLink,
    };
    console.log(elements.modalElements.modalContainer, watchedState.modalContent);
  });

  elements.posts.addEventListener('click', (e) => {
    const choosedElem = e.target;
    if (choosedElem.classList.contains('link')) {
      const dataId = Number(choosedElem.dataset.id);
      watchedState.uiState.readPostsId.push(dataId);
    }
  });
};

export default app;
