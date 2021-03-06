import React from 'react';
import PropTypes from 'prop-types';
import './styles/EditQuiz.scss';

const EditQuiz = ({ quizObj,
  onHandleQuestionChange,
  onHandleAnswerChange,
  onHandleSubmitEdit }) => {
  const questions = quizObj.questions.map((question, index) => {
    const quesId = question.id;
    return (
      <div
        key={quesId}
        className="edit-question-container"
      >
        <h4>Question</h4>
        <input
          id={quesId}
          value={quizObj.questions[index].question_text}
          onChange={e => onHandleQuestionChange(e, quesId)}
        />
        {
          question.answers.map((answer, i) => {
            const ansId = answer.id;
            return (
              <div
                key={ansId}
                className="edit-answer-container"
              >
                <input
                  id={ansId}
                  name={answer.answer_text}
                  value={quizObj.questions[index].answers[i].answer_text}
                  onChange={e => onHandleAnswerChange(e, quesId, ansId)}
                />
              </div>
            );
          })
        }
      </div>
    );
  });

  return (
    <div className="edit-quiz">
      <h1>{quizObj.name}</h1>
      {questions}
      <button
        className="edit-quiz-btn"
        onClick={onHandleSubmitEdit}
      >submit changes
      </button>
    </div>
  );
};

EditQuiz.propTypes = {
  onHandleAnswerChange: PropTypes.func,
  onHandleQuestionChange: PropTypes.func,
  onHandleSubmitEdit: PropTypes.func,
  quizObj: PropTypes.object,
};

export default EditQuiz;
