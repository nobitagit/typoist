import React, { Component } from 'react';
import classNames from 'classnames';
import { matchTokens, tokenize, add, isCorrect } from '../TextChecker';
import './style.css';

const paragraphs = [
 'Mongodb and other tools',
];

function onType(evt) {
  console.log(evt);
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
    window.addEventListener('keypress', this.onType.bind(this));
  }

  onType(evt) {
    console.log(evt);
    const { typed } = this.state;
    this.setState({
      typed: add(typed, evt.key),
    });
  }

  render() {

    const {
      paragraphs,
      typed,
    } = this.state;

    const text = matchTokens(paragraphs, typed);

    return (
      <div className="">
        <h2>Practice</h2>
        <div>
          {
            text.map(t => {
              return (
                <span key={t.index}
                  className={classNames("Practice__token", {
                    'Practice__token--correct': isCorrect(t),
                  })}
                >
                    {t.token}
                </span>
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

