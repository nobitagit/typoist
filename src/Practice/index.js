import React, { Component } from 'react';
import classNames from 'classnames';
import API from '../endpoints';
import http from '../endpoints/http';
import {
  matchTokens, tokenize, add, remove, isCorrect, isWrong, isAmended, hasErrors,
} from '../TextChecker';
import './style.css';

const DELETE_KEY_CODE = 8;

const paragraphs = [
 'Mongodb and other tools',
];

async function getText() {
  const { text } = await http.get(API.texts);
  return tokenize(text);
}

export default class Practice extends Component {
  constructor() {
    super();
    this.state = {
      paragraphs: tokenize(paragraphs),
      typed: [],
    };
  }

  componentDidMount() {
    // keyup fires only for printable characters so it will
    // auto-filter SHIFT,CTRL ecc. for us
    // see: http://jsfiddle.net/user2314737/543zksjc/3/show/
    window.addEventListener('keypress', this.onType.bind(this));
    // since DEL is not a printable char we need to listen for
    // it in order to remove tokens from the stack when the user
    // is deleting text
    window.addEventListener('keydown', this.onDelete.bind(this));

    this.getText();
  }

  async getText() {
    const paragraphs = await getText();
    this.setState({ paragraphs, original: paragraphs });
  }

  onType(evt) {
    const { typed, paragraphs } = this.state;
    const updateTyped = add(typed, evt.key);
    const matched = matchTokens(paragraphs, updateTyped);
    this.setState({
      typed: updateTyped,
      paragraphs: matched,
    });

    if (hasErrors(2, matched)) {
      this.setState({
        paragraphs: this.state.original,
        typed: [],
      });
    }
  }

  onDelete(evt) {
    if (evt.which !== DELETE_KEY_CODE) { return; }

    const { typed, paragraphs } = this.state;
    const updateTyped = remove(typed)
    this.setState({
      typed: updateTyped,
      paragraphs: matchTokens(paragraphs, updateTyped),
    });
  }

  render() {

    const {
      paragraphs: text,
      typed,
    } = this.state;

    return (
      <div className="">
        <h2>Practice</h2>
        <div className="Practice__paragraph">
          {
            text.map(t => {
              const newLine = t.token === 'Enter';
              return (
                <React.Fragment key={t.index}>
                  <span
                    className={classNames("Practice__token", {
                      'Practice__token--correct': isCorrect(t),
                      'Practice__token--wrong': isWrong(t),
                      'Practice__token--amended': isAmended(t),
                    })}
                  >
                      {newLine ? '↵' : t.token}
                  </span>
                  {newLine && <br />}
                </ React.Fragment>
              );
            })
          }
        </div>
        <div>
          {
            typed.map((c, i) => (<span key={i}>{c} </span>))
          }
        </div>
      </div>
    );
  }
}

