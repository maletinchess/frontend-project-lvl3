import initview from './view';
import { sendRequest, addRss, validate } from './utils';
import parse from './parser';

const app = async () => {
  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('input'),
    posts: document.querySelector('.posts'),
    feedback: document.querySelector('.feedback'),
    submitButton: document.querySelector('button.add'),
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
    rssCount: 0,
    error: null,
    dataProcess: 'initial',
  };

  const watchedState = initview(state, elements);

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const url = formData.get('url');

    const urls = watchedState.feeds.map((feed) => feed.url);

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
        addRss(data, watchedState, watchedState.rssCount, url);
        watchedState.error = null;
        watchedState.dataProcess = 'processed';
      })
      .catch((err) => {
        watchedState.error = err.message;
        watchedState.dataProcess = 'failed';
        console.log(err);
      });
  });
};

export default app;
