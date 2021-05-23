/* eslint-disable no-param-reassign */

import onChange from 'on-change';

const renderPosts = (state, elements) => {
  elements.posts.innerHTML = '';
  const { posts } = state;
  const ul = document.createElement('ul');
  posts.forEach((post) => {
    const { feed } = post;
    const li = document.createElement('li');
    const descriptionEl = document.createElement('span');
    const titleEl = document.createElement('span');
    descriptionEl.textContent = feed.description;
    titleEl.textContent = feed.title;
    li.append(titleEl);
    li.append(descriptionEl);
    ul.append(li);
  });
  elements.posts.append(ul);
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
    elements.feedback.textContent = rssField.error;
    console.log(rssField);
  }
};

const renderForm = (dataProcess, elements) => {
  switch (dataProcess) {
    case 'initial':
      elements.submitButton.focus();
      elements.input.select();
      break;
    case 'sending':
      elements.submitButton.setAttribute('disabled', true);
      elements.input.setAttribute('disabled', true);
      elements.submitButton.focus();
      break;
    case 'failed':
      elements.submitButton.removeAttribute('disabled');
      elements.input.removeAttribute('disabled');
      elements.input.select();
      elements.submitButton.focus();
      elements.input.value = '';
      break;
    case 'processed':
      elements.submitButton.removeAttribute('disabled');
      elements.input.removeAttribute('disabled');
      elements.input.value = '';
      elements.input.select();
      elements.feedback.classList.add('text-success');
      elements.feedback.classList.remove('text-danger');
      elements.feedback.textContent = 'RSS successfully loaded';
      break;
    default:
      throw new Error(`Unknown process ${dataProcess}`);
  }
};

const initview = (state, elements) => {
  const mapping = {
    posts: () => renderPosts(state, elements),
    error: () => renderAppError(state.error, elements),
    'form.rssField': () => renderFormError(state, elements),
    dataProcess: () => renderForm(state.dataProcess, elements),
  };

  const watchedState = onChange(state, (path) => {
    if (mapping[path]) {
      mapping[path]();
    }
  });
  return watchedState;
};

export default initview;
