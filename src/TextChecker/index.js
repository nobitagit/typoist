import * as R from 'ramda';
import { CORRECT, WRONG, IDLE, AMENDED } from '../matchTypes.js';

const mapIndexed = R.addIndex(R.map);
const reduceIndexed = R.addIndex(R.reduce);

export const isCorrect = t => R.propEq('match', CORRECT, t);
export const isAmended = t => R.propEq('match', AMENDED, t);
export const isWrong = t => R.propEq('match', WRONG, t);

/**
 * We use a super simple stack implementation to store the user input
 */
export function add(stack, newToken) {
  return R.concat(stack, [newToken]);
}

export function remove(stack) {
  return R.dropLast(1, stack);
}

/**
 * Give a token object and a single character we defined the outcome of the transaction.
 * IDLE - a token has yet to be tried by the user
 * AMENDED - preiously seen, typed wrong, then corrrected
 * CORRECT - typed correctly the first time
 * WRONG = currently wrong in the stack
 *
 * @param {Object} exp
 * @param {String} typed
 */
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

/**
 * From a stack of letters generate a map of tokens
 * {
 *   token: 'a',
 *   match: Symbol(IDLE)
 * }
 *
 * If the array is formed of more than one string a newLine is useed to join them and a newLine
 * token is inserted. Finally a sequential index is added so React can use it as a key.
 *
 * @param {Array} textList
 */
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
    token: 'Enter',
    match: IDLE,
  };

  return R.pipe(
    reduceIndexed(
      (acc, split, i) => i === 0 ? [...split] : [...acc, sep, ...split],
      [],
    ),
    mapIndexed((o, index) => ({ ...o, index })),
  )(splits);
}

export function hasErrors(amount, paragraph) {
  return R.pipe(
    R.filter(isWrong),
    R.length,
    R.gte(R.__, amount),
  )(paragraph);
}
