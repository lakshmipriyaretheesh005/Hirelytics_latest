export type Difficulty = "Easy" | "Medium" | "Hard";
export type QuestionCategory = "aptitude" | "coding" | "interview";

export interface Question {
  id: string;
  company: string;
  category: QuestionCategory;
  difficulty: Difficulty;
  question: string;
  options?: string[];
  answer?: string;
  explanation?: string;
  tags: string[];
}

export const prepQuestions: Question[] = [
  // ── EY ──
  { id: "ey-a1", company: "EY", category: "aptitude", difficulty: "Easy", question: "A train 150m long passes a pole in 15 seconds. What is the speed of the train in km/hr?", options: ["36 km/hr", "40 km/hr", "32 km/hr", "28 km/hr"], answer: "36 km/hr", explanation: "Speed = 150/15 = 10 m/s = 10 × 3.6 = 36 km/hr.", tags: ["Speed & Distance"] },
  { id: "ey-a2", company: "EY", category: "aptitude", difficulty: "Medium", question: "If 6 men can complete a work in 12 days, how many men are needed to complete it in 4 days?", options: ["12", "18", "24", "9"], answer: "18", explanation: "Men × Days = constant. 6×12 = 72. For 4 days: 72/4 = 18 men.", tags: ["Work & Time"] },
  { id: "ey-a3", company: "EY", category: "aptitude", difficulty: "Hard", question: "A sum of ₹5000 amounts to ₹6050 in 2 years at compound interest. Find the rate of interest.", options: ["8%", "10%", "12%", "9%"], answer: "10%", explanation: "6050 = 5000(1 + r/100)². Solving: (1+r/100)² = 1.21, so r = 10%.", tags: ["Compound Interest"] },
  { id: "ey-c1", company: "EY", category: "coding", difficulty: "Easy", question: "Write a function to check if a string is a palindrome.", answer: "function isPalindrome(s) {\n  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');\n  return clean === clean.split('').reverse().join('');\n}", tags: ["Strings"] },
  { id: "ey-c2", company: "EY", category: "coding", difficulty: "Medium", question: "Find the first non-repeating character in a string.", answer: "function firstNonRepeating(s) {\n  const freq = {};\n  for (const c of s) freq[c] = (freq[c] || 0) + 1;\n  for (const c of s) if (freq[c] === 1) return c;\n  return null;\n}", tags: ["Hash Map", "Strings"] },
  { id: "ey-c3", company: "EY", category: "coding", difficulty: "Hard", question: "Given an array of integers, find the length of the longest increasing subsequence.", answer: "function LIS(nums) {\n  const tails = [];\n  for (const n of nums) {\n    let lo = 0, hi = tails.length;\n    while (lo < hi) { const m = (lo+hi)>>1; tails[m]<n ? lo=m+1 : hi=m; }\n    tails[lo] = n;\n  }\n  return tails.length;\n}", tags: ["Dynamic Programming", "Binary Search"] },
  { id: "ey-i1", company: "EY", category: "interview", difficulty: "Easy", question: "Tell me about yourself and why you want to join EY.", tags: ["Behavioral"] },
  { id: "ey-i2", company: "EY", category: "interview", difficulty: "Medium", question: "Describe a situation where you had to work in a team with conflicting opinions. How did you handle it?", tags: ["Behavioral", "Teamwork"] },
  { id: "ey-i3", company: "EY", category: "interview", difficulty: "Hard", question: "How would you approach a digital transformation project for a traditional manufacturing company?", tags: ["Case Study", "Consulting"] },

  // ── IBM ──
  { id: "ibm-a1", company: "IBM", category: "aptitude", difficulty: "Easy", question: "What comes next in the series: 2, 6, 12, 20, 30, ?", options: ["40", "42", "36", "38"], answer: "42", explanation: "Differences: 4, 6, 8, 10, 12. Next: 30 + 12 = 42.", tags: ["Number Series"] },
  { id: "ibm-a2", company: "IBM", category: "aptitude", difficulty: "Medium", question: "In a class of 40, 25 play cricket, 20 play football, and 10 play both. How many play neither?", options: ["5", "10", "15", "0"], answer: "5", explanation: "Cricket or Football = 25 + 20 - 10 = 35. Neither = 40 - 35 = 5.", tags: ["Sets & Venn Diagrams"] },
  { id: "ibm-a3", company: "IBM", category: "aptitude", difficulty: "Hard", question: "A clock shows 3:15. What is the angle between the hour and minute hands?", options: ["0°", "7.5°", "15°", "22.5°"], answer: "7.5°", explanation: "Minute hand at 90°. Hour hand at 90 + 15×0.5 = 97.5°. Angle = 7.5°.", tags: ["Clocks"] },
  { id: "ibm-c1", company: "IBM", category: "coding", difficulty: "Easy", question: "Write a function to reverse a linked list.", answer: "function reverseList(head) {\n  let prev = null, curr = head;\n  while (curr) {\n    const next = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = next;\n  }\n  return prev;\n}", tags: ["Linked List"] },
  { id: "ibm-c2", company: "IBM", category: "coding", difficulty: "Medium", question: "Implement a function to check if a binary tree is balanced.", answer: "function isBalanced(root) {\n  function height(node) {\n    if (!node) return 0;\n    const l = height(node.left), r = height(node.right);\n    if (l === -1 || r === -1 || Math.abs(l-r) > 1) return -1;\n    return Math.max(l, r) + 1;\n  }\n  return height(root) !== -1;\n}", tags: ["Trees", "Recursion"] },
  { id: "ibm-c3", company: "IBM", category: "coding", difficulty: "Hard", question: "Design an LRU Cache with O(1) get and put operations.", answer: "Use a doubly-linked list + hash map. Map stores key → node. List maintains access order. On get/put, move node to head. On capacity overflow, evict tail.", tags: ["Design", "Hash Map"] },
  { id: "ibm-i1", company: "IBM", category: "interview", difficulty: "Easy", question: "What do you know about IBM's cloud and AI products?", tags: ["Company Knowledge"] },
  { id: "ibm-i2", company: "IBM", category: "interview", difficulty: "Medium", question: "Explain the difference between REST and GraphQL APIs with pros and cons.", tags: ["Technical", "APIs"] },
  { id: "ibm-i3", company: "IBM", category: "interview", difficulty: "Hard", question: "Design a scalable notification system that supports email, SMS, and push notifications.", tags: ["System Design"] },

  // ── Infosys ──
  { id: "inf-a1", company: "Infosys", category: "aptitude", difficulty: "Easy", question: "If the cost price of 20 articles is equal to the selling price of 16 articles, find the gain%.", options: ["20%", "25%", "30%", "15%"], answer: "25%", explanation: "Let CP of 1 article = 1. CP of 20 = 20 = SP of 16. SP of 1 = 20/16 = 1.25. Gain = 25%.", tags: ["Profit & Loss"] },
  { id: "inf-a2", company: "Infosys", category: "aptitude", difficulty: "Medium", question: "A boat goes 24 km upstream in 6 hours and 24 km downstream in 4 hours. Find the speed of the stream.", options: ["1 km/hr", "2 km/hr", "1.5 km/hr", "3 km/hr"], answer: "1 km/hr", explanation: "Upstream speed = 4, Downstream = 6. Stream = (6-4)/2 = 1 km/hr.", tags: ["Boats & Streams"] },
  { id: "inf-a3", company: "Infosys", category: "aptitude", difficulty: "Hard", question: "In how many ways can 5 boys and 3 girls be seated in a row so that no two girls sit together?", options: ["14400", "7200", "3600", "2400"], answer: "14400", explanation: "Boys in 5! ways. Girls in 6C3 × 3! = 20 × 6 = 120. Total = 120 × 120 = 14400.", tags: ["Permutations & Combinations"] },
  { id: "inf-c1", company: "Infosys", category: "coding", difficulty: "Easy", question: "Write a program to find the factorial of a number using recursion.", answer: "function factorial(n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}", tags: ["Recursion", "Math"] },
  { id: "inf-c2", company: "Infosys", category: "coding", difficulty: "Medium", question: "Given a sorted array, remove duplicates in-place and return the new length.", answer: "function removeDuplicates(nums) {\n  if (!nums.length) return 0;\n  let i = 0;\n  for (let j = 1; j < nums.length; j++) {\n    if (nums[j] !== nums[i]) nums[++i] = nums[j];\n  }\n  return i + 1;\n}", tags: ["Arrays", "Two Pointers"] },
  { id: "inf-c3", company: "Infosys", category: "coding", difficulty: "Hard", question: "Implement a function to find all permutations of a string.", answer: "function permutations(s) {\n  if (s.length <= 1) return [s];\n  const result = [];\n  for (let i = 0; i < s.length; i++) {\n    const rest = s.slice(0,i) + s.slice(i+1);\n    for (const p of permutations(rest)) result.push(s[i] + p);\n  }\n  return result;\n}", tags: ["Recursion", "Backtracking"] },
  { id: "inf-i1", company: "Infosys", category: "interview", difficulty: "Easy", question: "What are the four pillars of Object-Oriented Programming?", tags: ["Technical", "OOP"] },
  { id: "inf-i2", company: "Infosys", category: "interview", difficulty: "Medium", question: "Explain normalization in databases. What is 3NF?", tags: ["Technical", "DBMS"] },
  { id: "inf-i3", company: "Infosys", category: "interview", difficulty: "Hard", question: "You have a project deadline in 2 days but discover a critical bug. How do you handle the situation?", tags: ["Situational", "Problem Solving"] },

  // ── TCS ──
  { id: "tcs-a1", company: "TCS", category: "aptitude", difficulty: "Easy", question: "A man walks at 5 km/hr for 6 hrs and at 4 km/hr for 12 hrs. His average speed is:", options: ["4.33 km/hr", "4.5 km/hr", "5 km/hr", "4 km/hr"], answer: "4.33 km/hr", explanation: "Total distance = 30 + 48 = 78 km. Total time = 18 hrs. Avg = 78/18 ≈ 4.33.", tags: ["Average"] },
  { id: "tcs-a2", company: "TCS", category: "aptitude", difficulty: "Medium", question: "A pipe can fill a tank in 12 minutes and another can empty it in 18 minutes. If both are opened, how long to fill?", options: ["36 min", "30 min", "24 min", "48 min"], answer: "36 min", explanation: "Net fill rate = 1/12 - 1/18 = 1/36 per minute. Time = 36 min.", tags: ["Pipes & Cisterns"] },
  { id: "tcs-a3", company: "TCS", category: "aptitude", difficulty: "Hard", question: "A bag contains 5 red, 4 blue, and 3 green balls. If 3 balls are drawn at random, what is the probability that all are red?", options: ["1/22", "1/44", "2/33", "1/11"], answer: "1/22", explanation: "5C3 / 12C3 = 10/220 = 1/22.", tags: ["Probability"] },
  { id: "tcs-c1", company: "TCS", category: "coding", difficulty: "Easy", question: "Write a function to check if a number is prime.", answer: "function isPrime(n) {\n  if (n < 2) return false;\n  for (let i = 2; i <= Math.sqrt(n); i++) {\n    if (n % i === 0) return false;\n  }\n  return true;\n}", tags: ["Math", "Loops"] },
  { id: "tcs-c2", company: "TCS", category: "coding", difficulty: "Medium", question: "Implement binary search on a sorted array.", answer: "function binarySearch(arr, target) {\n  let lo = 0, hi = arr.length - 1;\n  while (lo <= hi) {\n    const mid = (lo + hi) >> 1;\n    if (arr[mid] === target) return mid;\n    arr[mid] < target ? lo = mid + 1 : hi = mid - 1;\n  }\n  return -1;\n}", tags: ["Binary Search", "Arrays"] },
  { id: "tcs-c3", company: "TCS", category: "coding", difficulty: "Hard", question: "Given a matrix of 0s and 1s, find the number of islands (connected components of 1s).", answer: "Use BFS/DFS. Iterate through matrix; when a 1 is found, increment count and flood-fill all connected 1s to 0.", tags: ["Graph", "BFS/DFS", "Matrix"] },
  { id: "tcs-i1", company: "TCS", category: "interview", difficulty: "Easy", question: "Why do you want to join TCS? What do you know about the company?", tags: ["Behavioral", "Company Knowledge"] },
  { id: "tcs-i2", company: "TCS", category: "interview", difficulty: "Medium", question: "Explain the difference between process and thread. Give real-world examples.", tags: ["Technical", "OS"] },
  { id: "tcs-i3", company: "TCS", category: "interview", difficulty: "Hard", question: "If you were to build a web application from scratch for a large enterprise, what architecture would you choose and why?", tags: ["System Design", "Architecture"] },
];
