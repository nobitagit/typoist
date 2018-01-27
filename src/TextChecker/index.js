import * as R from 'ramda';
import { CORRECT, WRONG, IDLE, AMENDED } from '../matchTypes.js';

const mapIndexed = R.addIndex(R.map);
const reduceIndexed = R.addIndex(R.reduce);

export const isCorrect = t => R.propEq('match', CORRECT, t);
export const isAmended = t => R.propEq('match', AMENDED, t);
export const isWrong = t => R.propEq('match', WRONG, t);

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

  if (expToken === typed) {

    if (exp.everWrong) {
      return AMENDED;
    }

    return CORRECT;
  }

  return WRONG;
}

export function matchTokens(exp, typed = []) {
  return mapIndexed((v, idx) => {
    const match = getMatch(v, typed[idx]);
    // mark if it was ever typed wrong.
    const everWrong = (v.everWrong == null && match === WRONG);
    return {
      ...v,
      match,
      ...everWrong && { everWrong: true },
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

  return R.pipe(
    reduceIndexed(
      (acc, split, i) => i === 0 ? [...split] : [...acc, sep, ...split],
      [],
      //splits,
    ),
    mapIndexed((o, index) => ({ ...o, index })),
  )(splits);
}

