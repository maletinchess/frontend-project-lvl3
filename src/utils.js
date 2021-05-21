import axios from 'axios';
import * as yup from 'yup';

export const validate = (url) => {
  const schema = yup
    .string()
    .trim()
    .url()
    .matches(/rss/);
  try {
    schema.validateSync(url);
    return null;
  } catch (err) {
    return err.errors;
  }
};

const normalizeUrl = (url) => {
  const urlWithProxy = new URL('/get', 'https://hexlet-allorigins.herokuapp.com');
  urlWithProxy.searchParams.set('url', url);
  urlWithProxy.searchParams.set('disableCache', true);
  return urlWithProxy.toString();
};

export default (url) => {
  const normalizedUrl = normalizeUrl(url);
  return axios.get(normalizedUrl).then((response) => {
    const { data } = response;
    return data.contents;
  });
};
