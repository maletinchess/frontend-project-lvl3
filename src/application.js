import initview from './view';
import sendRequest, { validate } from './utils';

const app = async () => {
  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('input'),
    posts: document.querySelector('.posts'),
    feedback: document.querySelector('.feedback'),
  };

  const state = {
    form: {
      rssField: {
        valid: true,
        error: null,
      },
    },
    posts: [],
    feeds: [],
    error: null,
  };

  const watchedState = initview(state, elements);

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const url = formData.get('url');

    const errorUrl = validate(url);

    if (errorUrl) {
      watchedState.form.rssField = {
        valid: false,
        errorUrl,
      };
      return;
    }

    watchedState.form.rssField = {
      valid: true,
      error: null,
    };

    sendRequest(url)
      .then((xml) => {
        watchedState.xmlData = xml;
        watchedState.error = null;
      })
      .catch((error) => {
        watchedState.error = error;
      });
  });
};

export default app;
