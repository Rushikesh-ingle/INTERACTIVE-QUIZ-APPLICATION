import { Question } from '../types/quiz';

export const questions: Question[] = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
    category: "Geography",
    explanation: "Paris is the capital and most populous city of France."
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
    category: "Science",
    explanation: "Mars is called the Red Planet due to iron oxide (rust) on its surface."
  },
  {
    id: 3,
    question: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
    correctAnswer: 2,
    category: "Art",
    explanation: "Leonardo da Vinci painted the Mona Lisa between 1503 and 1519."
  },
  {
    id: 4,
    question: "What is the largest mammal in the world?",
    options: ["African Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
    correctAnswer: 1,
    category: "Biology",
    explanation: "The Blue Whale is the largest animal ever known to have lived on Earth."
  },
  {
    id: 5,
    question: "In which year did World War II end?",
    options: ["1944", "1945", "1946", "1947"],
    correctAnswer: 1,
    category: "History",
    explanation: "World War II ended in 1945 with the surrender of Japan in September."
  },
  {
    id: 6,
    question: "What is the chemical symbol for gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correctAnswer: 2,
    category: "Chemistry",
    explanation: "Au comes from the Latin word 'aurum' meaning gold."
  },
  {
    id: 7,
    question: "Which programming language was created by Brendan Eich?",
    options: ["Python", "JavaScript", "Java", "C++"],
    correctAnswer: 1,
    category: "Technology",
    explanation: "Brendan Eich created JavaScript in 1995 while working at Netscape."
  },
  {
    id: 8,
    question: "What is the smallest country in the world?",
    options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"],
    correctAnswer: 1,
    category: "Geography",
    explanation: "Vatican City is the smallest sovereign state in the world by area."
  },
  {
    id: 9,
    question: "Which element has the atomic number 1?",
    options: ["Helium", "Hydrogen", "Lithium", "Carbon"],
    correctAnswer: 1,
    category: "Chemistry",
    explanation: "Hydrogen has one proton, giving it the atomic number 1."
  },
  {
    id: 10,
    question: "Who wrote '1984'?",
    options: ["Aldous Huxley", "Ray Bradbury", "George Orwell", "Kurt Vonnegut"],
    correctAnswer: 2,
    category: "Literature",
    explanation: "George Orwell wrote the dystopian novel '1984', published in 1949."
  }
];