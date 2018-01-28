import * as R from 'ramda';
const base = '/api';

const mapping = {
  texts: 'texts'
};

const API = R.pipe(
  R.toPairs,
  R.map(([k, v]) => [k, `${base}/${v}`]),
  R.fromPairs,
)(mapping);

export default API;