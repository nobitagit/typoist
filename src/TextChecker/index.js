import R from 'ramda';
import { CORRECT, WRONG, IDLE, AMENDED } from '../matchTypes.js';

const mapIndexed = R.addIndex(R.map);
const reduceIndexed = R.addIndex(R.reduce);

export function add(stack, newToken) {
  return R.concat(stack, [newToken]);
}

export function remove(stack) {
  return R.dropLast(1, stack);
}

function getMatch(exp, typed) {
  if (typed == null) {
    return IDLE;
  }

  const expToken = exp.token;
  const seen = exp.match !== IDLE;

  if (expToken === typed) {

    if (seen) {
      return AMENDED;
    }

    return CORRECT;
  }

  return WRONG;
}

export function matchTokens(exp, typed = []) {
  return mapIndexed((v, idx) => {
    const match = getMatch(v, typed[idx]);
    return {
      ...v,
      match,
    };
  }, exp);
}

export function tokenize(textList) {
  const toToken = R.map(o => ({
    token: o,
    match: IDLE,
  }));
  const splits = R.map(
    R.pipe(
      R.splitEvery(1),
      toToken,
    ),
  )(textList);
  const sep = {
    token: 'newLine',
    match: IDLE,
  };

  return reduceIndexed(
    (acc, split, i) => i === 0 ? [...split] : [...acc, sep, ...split],
    [],
    splits,
  );
}
