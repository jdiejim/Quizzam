import React, { Component } from 'react';
import { object, array, string, func } from 'prop-types';
import './styles/TakeQuiz.scss';
import { questionTypes, getKey } from '../helpers';
import socket from '../socket';

function initializeState(quiz) {
  const initialState = [];
  for (let i = 0; i < quiz.questions.length; i += 1) {
    initialState.push({ selectedAnswers: [] });
  }
  return initialState;
}

class TakeQuiz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: `${props.username}_${getKey()}`,
      currentQuestion: 0,
      answers: initializeState(props.quiz),
    };
    this.handleClick = this.handleClick.bind(this);
    this.determineInputType = this.determineInputType.bind(this);
    this.handleSelectAnswer = this.handleSelectAnswer.bind(this);
    this.sendSocket = this.sendSocket.bind(this);
  }
  sendSocket() {
    socket.emit('selectAnswer', {
      name: this.state.name,
      answer: this.state.answers[this.state.currentQuestion].selectedAnswers[0],
      questionId: this.props.quiz.questions[this.state.currentQuestion].id,
      room: this.props.code,
    });
  }

  handleClick(event) {
    const { textContent } = event.target;
    const { questions } = this.props.quiz;
    const { currentQuestion } = this.state;
    this.sendSocket();

    if (textContent === 'Next' && currentQuestion < questions.length - 1) {
      const newState = this.state.currentQuestion + 1;
      this.setState({ currentQuestion: newState });
    } else if (textContent === 'Prev' && currentQuestion > 0) {
      const newState = this.state.currentQuestion - 1;
      this.setState({ currentQuestion: newState });
    }
  }

  handleSelectAnswer(event) {
    const { answers, currentQuestion } = this.state;

    const selectedAnswersArray = answers[currentQuestion].selectedAnswers;
    const selectedElement = event.target.dataset.id;
    const newState = [...answers];

    if (selectedAnswersArray.find(thisAnswer => selectedElement === thisAnswer)) {
      const newAnswers = selectedAnswersArray.filter(answer => selectedElement !== answer);
      newState[currentQuestion].selectedAnswers = newAnswers;

      this.setState({ answers: newState });
    } else if (event.target.type === 'checkbox') {
      newState[currentQuestion] = { selectedAnswers: [...selectedAnswersArray, selectedElement] };
      this.setState({ answers: newState });
    } else if (event.target.type === 'radio') {
      newState[currentQuestion] = { selectedAnswers: [selectedElement] };
      this.setState({ answers: newState });
    }
  }

  determineInputType(answer, index) {
    const { quiz } = this.props;
    const { currentQuestion, answers } = this.state;

    switch (quiz.questions[currentQuestion].question_type) {
      case 'multiple choice-multiple answer':
        return (
          <div key={`answer_${answer.id}`}>
            <input
              type="checkbox"
              data-id={answer.id}
              name={index}
              value={answer.answer_text}
              onClick={this.handleSelectAnswer}
              checked={answers[currentQuestion].selectedAnswers.includes(answer.id.toString())}
            />
            <label htmlFor={`answer_id_${answer.id}`}>{answer.answer_text}</label>
          </div>
        );
      default:
        return (
          <div key={answer.answer_text}>
            <input
              type="radio"
              data-id={answer.id}
              name={index}
              value={answer.answer_text}
              onChange={this.handleSelectAnswer}
              checked={answers[currentQuestion].selectedAnswers.includes(answer.id.toString())}
            />
            <label htmlFor={`answer_id_${answer.id}`}>{answer.answer_text}</label>
          </div>
        );
    }
  }

  render() {
    const { quiz } = this.props;
    const { currentQuestion, answers } = this.state;

    if (!this.props.quiz.id) {
      return <h3>LOADING</h3>;
    }

    return (
      <main>
        <header className="take-quiz-header">
          <h1>{this.props.quiz.name}</h1>
          <h1>Subject: {this.props.quiz.subject}</h1>
          <h1>Room: {this.props.quiz.id}</h1>
        </header>
        <section className="take-quiz-question">
          <h3 className="take-quiz-question-title">
            {this.props.quiz.questions[this.state.currentQuestion].question_text}
          </h3>
          <div className="question-wrapper">
            <p className="take-quiz-question-type">
              ({questionTypes[this.props.quiz.questions[this.state.currentQuestion].question_type]})
            </p>
            <form className="take-quiz-form">
              {this.props.quiz.questions[this.state.currentQuestion].answers
                .map((answer, index) => {
                  return this.determineInputType(answer, index);
                })}
            </form>
            <nav className="take-quiz-nav">
              <button
                className="take-quiz-btn"
                onClick={this.handleClick}
              >Prev
              </button>
              <button
                className="take-quiz-btn"
                onClick={this.handleClick}
              >Next
              </button>
            </nav>
          </div>
        </section>
      </main>
    );
  }
}

TakeQuiz.propTypes = {
  code: object,
  quiz: object,
  username: object,
};

export default TakeQuiz;
