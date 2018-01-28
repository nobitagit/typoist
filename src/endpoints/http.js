const get = url => {
  console.log(url);
  return fetch(url).then(r => r.json());
}

export default { get };