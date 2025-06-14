import React, { useState, useEffect } from 'react';
import { questions } from './data/questions';
import { QuizState, QuizResults } from './types/quiz';
import QuizQuestion from './components/QuizQuestion';
import QuizResultsComponent from './components/QuizResults';
import ProgressBar from './components/ProgressBar';
import { Brain, Play } from 'lucide-react';

function App() {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    score: 0,
    answers: [],
    isQuizComplete: false,
    selectedAnswer: null,
    showFeedback: false,
  });

  const [showStartScreen, setShowStartScreen] = useState(true);

  const currentQuestion = questions[quizState.currentQuestionIndex];

  const handleAnswerSelect = (answerIndex: number) => {
    if (quizState.showFeedback) return;

    const newState = {
      ...quizState,
      selectedAnswer: answerIndex,
      showFeedback: true,
    };

    if (answerIndex === currentQuestion.correctAnswer) {
      newState.score += 1;
    }

    newState.answers = [...quizState.answers, answerIndex];
    setQuizState(newState);

    // Auto-advance to next question after showing feedback
    setTimeout(() => {
      if (quizState.currentQuestionIndex < questions.length - 1) {
        setQuizState(prev => ({
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
          selectedAnswer: null,
          showFeedback: false,
        }));
      } else {
        setQuizState(prev => ({
          ...prev,
          isQuizComplete: true,
        }));
      }
    }, 2500);
  };

  const handleRestart = () => {
    setQuizState({
      currentQuestionIndex: 0,
      score: 0,
      answers: [],
      isQuizComplete: false,
      selectedAnswer: null,
      showFeedback: false,
    });
    setShowStartScreen(true);
  };

  const handleStartQuiz = () => {
    setShowStartScreen(false);
  };

  const getQuizResults = (): QuizResults => {
    const percentage = Math.round((quizState.score / questions.length) * 100);
    return {
      score: quizState.score,
      totalQuestions: questions.length,
      percentage,
      correctAnswers: quizState.score,
      incorrectAnswers: questions.length - quizState.score,
    };
  };

  if (showStartScreen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-4">
              <Brain className="w-16 h-16 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Ultimate Knowledge Quiz
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Test your knowledge across multiple categories including Science, History, Geography, and more. 
            Get instant feedback and track your progress!
          </p>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quiz Details</h3>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600 mb-1">{questions.length}</div>
                <div className="text-sm text-gray-600">Questions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600 mb-1">Multiple</div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600 mb-1">Instant</div>
                <div className="text-sm text-gray-600">Feedback</div>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleStartQuiz}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center mx-auto"
          >
            <Play className="w-6 h-6 mr-2" />
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <Brain className="w-10 h-10 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">Knowledge Quiz</h1>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 inline-block">
            <span className="text-2xl font-bold text-blue-600">{quizState.score}</span>
            <span className="text-gray-600 ml-2">/ {questions.length} correct</span>
          </div>
        </div>

        {!quizState.isQuizComplete ? (
          <>
            <ProgressBar
              currentQuestion={quizState.currentQuestionIndex}
              totalQuestions={questions.length}
            />
            <QuizQuestion
              question={currentQuestion}
              selectedAnswer={quizState.selectedAnswer}
              showFeedback={quizState.showFeedback}
              onAnswerSelect={handleAnswerSelect}
            />
          </>
        ) : (
          <QuizResultsComponent
            results={getQuizResults()}
            onRestart={handleRestart}
          />
        )}
      </div>
    </div>
  );
}

export default App;