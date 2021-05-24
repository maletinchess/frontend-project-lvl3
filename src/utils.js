/* eslint-disable no-param-reassign */

import axios from 'axios';
import * as yup from 'yup';
import { setLocale } from 'yup';
import i18next from 'i18next';
import _ from 'lodash';
import parse from './parser';

export const validate = (url, urls) => {
  setLocale({
    string: {
      url: i18next.t('errorMessage.invalidUrl'),
    },
    mixed: {
      required: i18next.t('errorMessage.emptyField'),
      notOneOf: i18next.t('errorMessage.existedRss'),
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

const autoUpdateRss = (state, url, id) => {
  sendRequest(url)
    .then((xml) => {
      const data = parse(xml);
      const { posts: receivedPosts } = data;
      const { posts: statePosts } = state;
      const mappedStatePosts = statePosts.map((post) => ({
        title: post.title,
        description: post.description,
        postLink: post.postLink,
      }));

      const newPosts = _.differenceWith(receivedPosts, mappedStatePosts, _.isEqual);
      if (newPosts.length > 0) {
        const mappedNewPosts = newPosts.map(
          (newPost, index) => ({ ...newPost, id, postId: statePosts.length + index }),
        );
        state.posts = [...mappedNewPosts, statePosts];
      }
    });

  setTimeout(() => autoUpdateRss(state, url, id), 5000);
};

export const addRss = (data, state, url) => {
  const { feed, posts } = data;
  const id = state.rssCount;
  const newFeed = { ...feed, id, url };
  state.feeds = [newFeed, ...state.feeds];

  const mappedPosts = posts.map(
    (post, index) => ({ ...post, id, postId: state.posts.length + index }),
  );
  state.posts = [...mappedPosts, ...state.posts];

  autoUpdateRss(state, url, id);
};
