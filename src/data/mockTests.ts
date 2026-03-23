export type MockTestQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correctAnswer: string;
  section: "Aptitude" | "MCQ";
};

export type MockTest = {
  id: string;
  company: string;
  title: string;
  durationMinutes: number;
  released: boolean;
  questions: MockTestQuestion[];
};

export const mockTests: MockTest[] = [
  {
    id: "infosys-mock-1",
    company: "Infosys",
    title: "Infosys Placement Mock Test",
    durationMinutes: 30,
    released: true,
    questions: [
      {
        id: "inf-m1-q1",
        prompt: "A shopkeeper marks an item 25% above cost price and gives a 10% discount. What is the profit percentage?",
        options: ["10%", "12.5%", "15%", "8%"],
        correctAnswer: "12.5%",
        section: "Aptitude",
      },
      {
        id: "inf-m1-q2",
        prompt: "If the ratio of boys to girls in a class is 3:2 and there are 20 girls, how many students are there in total?",
        options: ["45", "50", "40", "55"],
        correctAnswer: "50",
        section: "Aptitude",
      },
      {
        id: "inf-m1-q3",
        prompt: "Which data structure follows the FIFO principle?",
        options: ["Stack", "Queue", "Tree", "Graph"],
        correctAnswer: "Queue",
        section: "MCQ",
      },
      {
        id: "inf-m1-q4",
        prompt: "Which SQL clause is used to filter grouped records?",
        options: ["WHERE", "ORDER BY", "HAVING", "LIMIT"],
        correctAnswer: "HAVING",
        section: "MCQ",
      },
    ],
  },
  {
    id: "tcs-mock-1",
    company: "TCS",
    title: "TCS NQT Mock Test",
    durationMinutes: 35,
    released: true,
    questions: [
      {
        id: "tcs-m1-q1",
        prompt: "A train crosses a platform in 24 seconds and a pole in 18 seconds. If the train length is 180m, what is the platform length?",
        options: ["40 m", "50 m", "60 m", "70 m"],
        correctAnswer: "60 m",
        section: "Aptitude",
      },
      {
        id: "tcs-m1-q2",
        prompt: "Find the next number in the series: 5, 11, 23, 47, ?",
        options: ["91", "95", "99", "87"],
        correctAnswer: "95",
        section: "Aptitude",
      },
      {
        id: "tcs-m1-q3",
        prompt: "Which of the following has the highest precedence in Java?",
        options: ["+", "&&", "()", "="],
        correctAnswer: "()",
        section: "MCQ",
      },
      {
        id: "tcs-m1-q4",
        prompt: "What is the time complexity of binary search?",
        options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
        correctAnswer: "O(log n)",
        section: "MCQ",
      },
    ],
  },
  {
    id: "ey-mock-1",
    company: "EY",
    title: "EY Aptitude and Technical Mock",
    durationMinutes: 30,
    released: true,
    questions: [
      {
        id: "ey-m1-q1",
        prompt: "If 8 analysts complete a task in 15 days, how many analysts are needed to complete it in 10 days?",
        options: ["10", "12", "14", "16"],
        correctAnswer: "12",
        section: "Aptitude",
      },
      {
        id: "ey-m1-q2",
        prompt: "A sum becomes Rs. 8,820 in 2 years at 5% compound interest. What was the principal?",
        options: ["Rs. 8,000", "Rs. 8,200", "Rs. 8,400", "Rs. 8,600"],
        correctAnswer: "Rs. 8,000",
        section: "Aptitude",
      },
      {
        id: "ey-m1-q3",
        prompt: "Which HTTP method is idempotent?",
        options: ["POST", "PATCH", "DELETE", "CONNECT"],
        correctAnswer: "DELETE",
        section: "MCQ",
      },
      {
        id: "ey-m1-q4",
        prompt: "Which normalization form removes partial dependency?",
        options: ["1NF", "2NF", "3NF", "BCNF"],
        correctAnswer: "2NF",
        section: "MCQ",
      },
    ],
  },
  {
    id: "ibm-mock-1",
    company: "IBM",
    title: "IBM Cognitive and Technical Mock",
    durationMinutes: 40,
    released: true,
    questions: [
      {
        id: "ibm-m1-q1",
        prompt: "A clock gains 2 minutes every hour. How many minutes will it gain in a day?",
        options: ["24", "36", "48", "60"],
        correctAnswer: "48",
        section: "Aptitude",
      },
      {
        id: "ibm-m1-q2",
        prompt: "The probability of drawing an ace from a standard deck is:",
        options: ["1/13", "1/26", "4/13", "1/4"],
        correctAnswer: "1/13",
        section: "Aptitude",
      },
      {
        id: "ibm-m1-q3",
        prompt: "Which traversal of a BST gives sorted output?",
        options: ["Preorder", "Inorder", "Postorder", "Level order"],
        correctAnswer: "Inorder",
        section: "MCQ",
      },
      {
        id: "ibm-m1-q4",
        prompt: "Which cloud service model provides virtual machines?",
        options: ["SaaS", "PaaS", "IaaS", "FaaS"],
        correctAnswer: "IaaS",
        section: "MCQ",
      },
    ],
  },
];
