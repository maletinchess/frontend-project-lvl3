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

const renderAppError = (error, elements) => {
  if (!error) {
    elements.feedback.textContent = '';
  }
  elements.feedback.textContent = error;
};

const renderFormError = (state, elements) => {
  const { rssField } = state.form;
  if (rssField.valid) {
    elements.input.classList.remove('danger-text');
    elements.input.classList.remove('is-invalid');
  } else {
    elements.input.classList.add('is-invalid');
    elements.feedback.classList.add('text-danger');
    console.log(elements.feedback);
    elements.feedback.textContent = rssField.errorUrl;
    console.log(rssField);
  }
};

const initview = (state, elements) => {
  const mapping = {
    xmlData: () => renderXmlData(state.xmlData, elements),
    error: () => renderAppError(state.error, elements),
    'form.rssField': () => renderFormError(state, elements),
  };

  const watchedState = onChange(state, (path) => {
    if (mapping[path]) {
      mapping[path]();
    }
  });
  return watchedState;
};

export default initview;
