import * as R from 'ramda';
import { add, remove, tokenize, matchTokens } from './index.js';
import { CORRECT, WRONG, IDLE, AMENDED } from '../matchTypes.js';

describe('TextChecker', () => {

  describe('add()', () => {
    it('should add a letter to the stack', () => {
      const typed = [];
      const ret = add(typed, 'a');
      expect(ret).toEqual(['a']);
    });
  });

  it('should remove the last token', () => {
    const typed = ['a', 'b'];
    const ret = remove(typed);
    expect(ret).toEqual(['a']);
  });

  describe('tokenize()', () => {
    it('should properly tokenize a single string', () => {
      const ret = tokenize(['Some random text here.']);
      //console.log(ret)
      expect(ret.length).toBe(22);
    });

    it('should properly tokenize a single string', () => {
      const ret = tokenize(['Some random text here.']);
      expect(ret[0]).toEqual({
        index: 0,
        token: 'S',
        match: IDLE,
      });
    });

    it('should properly tokenize multiple strings', () => {
      const ret = tokenize(['Some random text here.', 'hey']);
      expect(ret.length).toBe(26);
    });

    it('should return the tokens in the expected format', () => {
      const ret = tokenize(['abc', 'd']);
      expect(ret[4]).toEqual({
        index: 4,
        token: 'd',
        match: IDLE,
      });
    });

    it('should join sentences with a new line token', () => {
      const ret = tokenize(['abc', 'd']);
      expect(ret[3]).toEqual({
        index: 3,
        token: 'Enter',
        match: IDLE,
      });
    });

    it('should not append a new line at the end.', () => {
      const ret = tokenize(['abc', 'd']);
      expect(ret[5]).toEqual(undefined);
    });
  });

  describe('matchToken()', () => {
    it('should dy default return all tokens as idle', () => {
      const text = tokenize(['some words']);
      const ret = matchTokens(text, undefined);
      const allIdle = R.all(o => o.match === IDLE, ret);
      expect(allIdle).toBe(true);
    });

    it('should dy default return all token as idle', () => {
      const text = tokenize(['some words']);
      const ret = matchTokens(text, []);
      const allIdle = R.all(o => o.match === IDLE, ret);
      expect(allIdle).toBe(true);
    });

    it('should mark passed characters as being typed', () => {
      const text = tokenize(['some words']);
      const ret = matchTokens(text, ['s', 'o']);
      const [typed, idle] = R.partition(o => o.match !== IDLE, ret);
      expect(R.length(typed)).toBe(2);
    });

    it('should mark correct characters as such', () => {
      const text = tokenize(['some words']);
      const ret = matchTokens(text, ['s', 'o']);
      const correct = R.filter(o => o.match === CORRECT, ret);
      expect(R.length(correct)).toBe(2);
    });

    it('should mark incorrect characters as such', () => {
      const text = tokenize(['some words']);
      const ret = matchTokens(text, ['s', 'e']);
      const correct = R.filter(o => o.match === CORRECT, ret);
      expect(R.length(correct)).toBe(1);
    });

    it('should mark incorrect characters as such', () => {
      const text = tokenize(['some words']);
      const ret = matchTokens(text, ['s', 'e']);
      const wrong = R.filter(o => o.match === WRONG, ret);
      expect(wrong[0].token).toBe('o');
    });

    it('should mark amended chars as AMENDED', () => {
      const text = tokenize(['some words']);
      const attempt1 = matchTokens(text, ['s', 'e']);
      const attempt2 = matchTokens(attempt1, ['s', 'o']);
      const match = attempt2[1].match;
      expect(match).toBe(AMENDED);
    });

    it('should preserve the CORRECT match status', () => {
      const text = tokenize(['some words']);
      const attempt1 = matchTokens(text, ['s', 'e']);
      const attempt2 = matchTokens(attempt1, ['s', 'o']);
      const match = attempt2[0].match;
      expect(match).toBe(CORRECT);
    });


    it('should mark previously amended chars as WRONG if wrong', () => {
      const text = tokenize(['some words']);
      const attempt1 = matchTokens(text, ['s', 'e']);
      const attempt2 = matchTokens(attempt1, ['s', 'o']);
      const attempt3 = matchTokens(text, ['s', 't']);
      const match = attempt3[1].match;
      expect(match).toBe(WRONG);
    });


  });
})

