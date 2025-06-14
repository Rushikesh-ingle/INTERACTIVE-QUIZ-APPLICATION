import React from 'react';
import { QuizResults as QuizResultsType } from '../types/quiz';
import { Trophy, RotateCcw, Award, Target } from 'lucide-react';

interface QuizResultsProps {
  results: QuizResultsType;
  onRestart: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({ results, onRestart }) => {
  const getPerformanceMessage = (percentage: number) => {
    if (percentage >= 90) return { message: "Outstanding! You're a quiz master!", color: "text-yellow-600", icon: Trophy };
    if (percentage >= 80) return { message: "Excellent work! You know your stuff!", color: "text-green-600", icon: Award };
    if (percentage >= 70) return { message: "Good job! You did well!", color: "text-blue-600", icon: Target };
    if (percentage >= 60) return { message: "Not bad! Room for improvement.", color: "text-orange-600", icon: Target };
    return { message: "Keep studying and try again!", color: "text-red-600", icon: Target };
  };

  const performance = getPerformanceMessage(results.percentage);
  const PerformanceIcon = performance.icon;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-4">
              <PerformanceIcon className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Quiz Complete!</h1>
          <p className={`text-xl font-semibold ${performance.color}`}>
            {performance.message}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
            <div className="text-3xl font-bold text-blue-800 mb-2">
              {results.percentage}%
            </div>
            <div className="text-blue-600 font-medium">Overall Score</div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
            <div className="text-3xl font-bold text-green-800 mb-2">
              {results.correctAnswers}/{results.totalQuestions}
            </div>
            <div className="text-green-600 font-medium">Correct Answers</div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Breakdown</h3>
          <div className="flex justify-center items-center space-x-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {results.correctAnswers}
              </div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600 mb-1">
                {results.incorrectAnswers}
              </div>
              <div className="text-sm text-gray-600">Incorrect</div>
            </div>
          </div>
        </div>

        <button
          onClick={onRestart}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center mx-auto"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Take Quiz Again
        </button>
      </div>
    </div>
  );
};

export default QuizResults;