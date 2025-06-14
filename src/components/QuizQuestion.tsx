import React from 'react';
import { Question } from '../types/quiz';
import { Check, X } from 'lucide-react';

interface QuizQuestionProps {
  question: Question;
  selectedAnswer: number | null;
  showFeedback: boolean;
  onAnswerSelect: (answerIndex: number) => void;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  selectedAnswer,
  showFeedback,
  onAnswerSelect,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
        <div className="mb-6">
          <span className="inline-block px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm font-semibold rounded-full mb-4">
            {question.category}
          </span>
          <h2 className="text-2xl font-bold text-gray-800 leading-relaxed">
            {question.question}
          </h2>
        </div>

        <div className="grid gap-4">
          {question.options.map((option, index) => {
            let buttonClass = "w-full p-4 text-left rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ";
            
            if (showFeedback) {
              if (index === question.correctAnswer) {
                buttonClass += "bg-green-50 border-green-500 text-green-800 shadow-lg ";
              } else if (index === selectedAnswer && index !== question.correctAnswer) {
                buttonClass += "bg-red-50 border-red-500 text-red-800 shadow-lg ";
              } else {
                buttonClass += "bg-gray-50 border-gray-200 text-gray-600 ";
              }
            } else {
              if (selectedAnswer === index) {
                buttonClass += "bg-blue-50 border-blue-500 text-blue-800 shadow-lg ";
              } else {
                buttonClass += "bg-gray-50 border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300 ";
              }
            }

            return (
              <button
                key={index}
                onClick={() => !showFeedback && onAnswerSelect(index)}
                disabled={showFeedback}
                className={buttonClass}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-lg">{option}</span>
                  {showFeedback && (
                    <div className="flex-shrink-0 ml-4">
                      {index === question.correctAnswer ? (
                        <Check className="w-6 h-6 text-green-600" />
                      ) : index === selectedAnswer ? (
                        <X className="w-6 h-6 text-red-600" />
                      ) : null}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {showFeedback && (
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500">
            <p className="text-blue-800 font-medium">
              <strong>Explanation:</strong> {question.explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizQuestion;