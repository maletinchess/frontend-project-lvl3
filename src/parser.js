const parse = (xml) => {
  const parser = new DOMParser();
  const docXml = parser.parseFromString(xml, 'text/xml');

  const errorEl = docXml.querySelector('parsererror');

  if (errorEl) {
    const error = new Error('Parse error');
    error.isParsingError = true;
    throw error;
  }

  const title = docXml.querySelector('title').textContent;
  const description = docXml.querySelector('description').textContent;

  const feed = { title, description };
  const items = docXml.querySelectorAll('item');
  const posts = [...items].map((item) => console.log(item, '!!!!!'));
  return { feed, posts };
};

export default parse;
