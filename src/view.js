/* eslint-disable no-param-reassign */

import onChange from 'on-change';
import i18next from 'i18next';

const renderFeeds = (state, elements) => {
  elements.feeds.innerHTML = '';
  const { feeds } = state;
  const feedsHead = document.createElement('h2');
  feedsHead.textContent = i18next.t('feedsHead');
  elements.feeds.append(feedsHead);
  const ul = document.createElement('ul');
  ul.classList.add('list-group');
  ul.classList.add('mb-5');
  feedsHead.after(ul);
  feeds.forEach((feed) => {
    const { title, description } = feed;
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    ul.append(li);
    const h = document.createElement('h3');
    li.append(h);
    h.textContent = title;
    const p = document.createElement('p');
    h.after(p);
    p.textContent = description;
  });
};

const renderPosts = (state, elements) => {
  elements.posts.innerHTML = '';
  const { posts } = state;
  const postsHead = document.createElement('h2');
  postsHead.textContent = i18next.t('postsHead');
  elements.posts.append(postsHead);
  const ul = document.createElement('ul');
  ul.classList.add('list-group');
  posts.forEach((post) => {
    const { title, postLink, postId } = post;

    const postContainer = document.createElement('li');
    postContainer.classList.add('list-group-item');
    postContainer.classList.add('d-flex');
    postContainer.classList.add('justify-content-between');
    postContainer.classList.add('align-items-start');

    const linkElement = document.createElement('a');
    linkElement.textContent = title;
    linkElement.href = postLink;
    linkElement.setAttribute('data-id', postId);
    linkElement.setAttribute('target', '_blank');
    linkElement.setAttribute('rel', 'noopener noreferrer');
    linkElement.classList.add('fw-bold', 'list-group-item', 'list-group-item-action');

    postContainer.append(linkElement);
    ul.append(postContainer);
  });
  postsHead.after(ul);
};

const renderAppError = (error, elements) => {
  elements.feedback.innerHTML = '';
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
    elements.feedback.textContent = i18next.t(rssField.error);
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
      elements.input.classList.add('is-invalid');
      elements.feedback.classList.add('text-danger');
      elements.input.select();
      elements.submitButton.focus();
      elements.input.value = '';
      elements.feedback.classList.remove('text-success');
      elements.feedback.classList.add('text-danger');
      break;
    case 'processed':
      elements.submitButton.removeAttribute('disabled');
      elements.input.classList.remove('danger-text');
      elements.input.classList.remove('is-invalid');
      elements.input.removeAttribute('disabled');
      elements.input.value = '';
      elements.input.select();
      elements.feedback.classList.add('text-success');
      elements.feedback.classList.remove('text-danger');
      elements.feedback.textContent = i18next.t('successMessage');
      break;
    default:
      throw new Error(`Unknown process ${dataProcess}`);
  }
};

const initview = (state, elements) => {
  const mapping = {
    feeds: () => renderFeeds(state, elements),
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
