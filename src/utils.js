/* eslint-disable no-param-reassign */

import axios from 'axios';
import * as yup from 'yup';
import { setLocale } from 'yup';
import _ from 'lodash';
import parse from './parser';

export const validate = (url, urls, i18n) => {
  setLocale({
    string: {
      url: i18n.t('errorMessage.invalidUrl'),
    },
    mixed: {
      required: i18n.t('errorMessage.emptyField'),
      notOneOf: i18n.t('errorMessage.existedRss'),
    },
  });
  const schema = yup
    .string()
    .trim()
    .url()
    .required()
    .notOneOf(urls);

  try {
    schema.validateSync(url);
    return null;
  } catch (err) {
    return err.message;
  }
};

const addProxy = (url) => {
  const urlWithProxy = new URL('/get', 'https://hexlet-allorigins.herokuapp.com');
  urlWithProxy.searchParams.set('url', url);
  urlWithProxy.searchParams.set('disableCache', true);
  return urlWithProxy.toString();
};

export const sendRequest = (url) => {
  const urlWithProxy = addProxy(url);
  return axios.get(urlWithProxy).then((response) => {
    const { data } = response;
    return data.contents;
  });
};

const updatePosts = (state, receivedPosts, statePosts, id) => {
  const mappedStatePosts = statePosts.map((post) => ({
    title: post.title,
    description: post.description,
    postLink: post.postLink,
  }));

  const newPosts = _.differenceWith(receivedPosts, mappedStatePosts, _.isEqual);
  if (newPosts.length > 0) {
    const mappedNewPosts = newPosts.map(
      (newPost) => ({ ...newPost, id, postId: _.uniqueId() }),
    );
    _.forEachRight(mappedNewPosts, (post) => state.posts.unshift(post));
  }
};

const autoUpdateRss = (state, url, id) => {
  sendRequest(url)
    .then((xml) => {
      const data = parse(xml);
      const { posts: receivedPosts } = data;
      const { posts: statePosts } = state;
      updatePosts(state, receivedPosts, statePosts, id);
    });

  setTimeout(() => autoUpdateRss(state, url, id), 5000);
};

export const addRss = (data, state, url) => {
  const { feed, posts } = data;
  const id = state.savedUrls.length;
  const newFeed = { ...feed, id, url };
  state.feeds = [newFeed, ...state.feeds];

  const mappedPosts = posts.map(
    (post) => ({ ...post, id, postId: _.uniqueId() }),
  );
  _.forEachRight(mappedPosts, (post) => state.posts.unshift(post));

  autoUpdateRss(state, url, id);
};
