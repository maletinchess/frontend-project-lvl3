import axios from 'axios';

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
