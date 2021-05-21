import initview from './view';
import sendRequest from './utils';

const app = async () => {
  const elements = {
    form: document.querySelector('form'),
    posts: document.querySelector('.posts'),
    feedback: document.querySelector('.feedback'),
  };

  const state = {
    xmlData: '',
    error: null,
  };

  const watchedState = initview(state, elements);

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const url = formData.get('url');

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
