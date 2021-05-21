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

const renderFormError = (rssForm, elements) => {
  if (rssForm.valid) {
    elements.input.classList.remove('danger-text');
    elements.input.classList.remove('is-invalid');
  } else {
    elements.input.classList.add('is-invalid');
    elements.feedback.classList.add('text-danger');
    elements.feedback.textContent = rssForm.error;
  }
};

const initview = (state, elements) => {
  const mapping = {
    xmlData: () => renderXmlData(state.xmlData, elements),
    error: () => renderAppError(state.error, elements),
    'form.rssForm': () => renderFormError(state.form.rssForm, elements),
  };

  const watchedState = onChange(state, (path) => {
    if (mapping[path]) {
      mapping[path]();
    }
  });
  return watchedState;
};

export default initview;
