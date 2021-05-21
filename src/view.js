/* eslint-disable no-param-reassign */

import onChange from 'on-change';

const renderXmlData = (xml, elements) => {
  elements.posts.innerHTML = '';
  const messageContainer = document.createElement('div');
  const p = document.createElement('p');
  elements.posts.append(messageContainer);
  messageContainer.append(p);
  p.textContent = xml;
};

const renderError = (error, elements) => {
  if (!error) {
    elements.feedback.textContent = '';
  }
  elements.feedback.textContent = error;
};

const initview = (state, elements) => {
  const mapping = {
    xmlData: () => renderXmlData(state.xmlData, elements),
    error: () => renderError(state.error, elements),
  };

  const watchedState = onChange(state, (path) => {
    if (mapping[path]) {
      mapping[path]();
    }
  });
  return watchedState;
};

export default initview;
