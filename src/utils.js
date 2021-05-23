/* eslint-disable no-param-reassign */

import axios from 'axios';
import * as yup from 'yup';

export const validate = (url, urls) => {
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

const normalizeUrl = (url) => {
  const urlWithProxy = new URL('/get', 'https://hexlet-allorigins.herokuapp.com');
  urlWithProxy.searchParams.set('url', url);
  urlWithProxy.searchParams.set('disableCache', true);
  return urlWithProxy.toString();
};

export const sendRequest = (url) => {
  const normalizedUrl = normalizeUrl(url);
  return axios.get(normalizedUrl).then((response) => {
    const { data } = response;
    return data.contents;
  });
};

export const addRss = (data, state, url) => {
  const { feed, posts } = data;
  const id = state.rssCount;
  const newFeed = { ...feed, id, url };
  state.feeds = [newFeed, ...state.feeds];

  const mappedPosts = posts.map(
    (post, index) => ({ ...post, id, postId: state.posts.length + index }),
  );
  state.posts = [...mappedPosts, state.posts];
  console.log(state.posts);
};
