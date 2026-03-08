// Comprehensive company data for TCS, EY, IBM, and Infosys
export const companiesData = [
    {
        _id: "tcs_001",
        name: "TCS",
        logo: "T",
        industry: "IT Services",
        description: "Tata Consultancy Services - India's largest IT services company",
        website: "https://www.tcs.com",

        // Eligibility
        eligibility: {
            minCGPA: 6.0,
            branches: ["CSE", "IT", "ECE", "EEE", "Mechanical"],
            backlogAllowed: false,
            yearOfPassing: 2026
        },

        // Roles
        roles: [
            {
                title: "Assistant System Engineer",
                type: "Full-time",
                package: "3.36 LPA",
                description: "Entry-level software development role"
            }
        ],

        // Selection Process
        selectionProcess: {
            rounds: [
                {
                    name: "Online Aptitude Test",
                    duration: "90 minutes",
                    sections: ["Verbal", "Quantitative", "Logical Reasoning"],
                    cutoff: "40%",
                    description: "Proctored online assessment"
                },
                {
                    name: "Technical Interview",
                    duration: "45-60 minutes",
                    topics: ["DSA", "DBMS", "OS", "Networks"],
                    difficulty: "Medium",
                    description: "Coding problems and technical concepts"
                },
                {
                    name: "HR Interview",
                    duration: "20-30 minutes",
                    topics: ["Motivation", "Strengths", "Career Goals"],
                    difficulty: "Easy",
                    description: "Behavioral and cultural fit assessment"
                }
            ]
        },

        // Preparation Resources
        aptitudeTopics: [
            "Number System",
            "Percentages",
            "Time & Work",
            "Profit & Loss",
            "permutations & Combinations",
            "Probability",
            "Clocks & Calendars"
        ],

        technicalTopics: [
            "Array & String manipulation",
            "Stack & Queue",
            "Linked Lists",
            "Trees & Graphs",
            "Sorting & Searching",
            "DP Basics",
            "SQL Queries",
            "DBMS Concepts",
            "OS - Process Scheduling",
            "Networking - Layers & Protocols"
        ],

        codingLanguages: ["Java", "C++", "Python"],

        hrQuestions: [
            "Tell me about yourself",
            "Why TCS?",
            "What are your strengths and weaknesses?",
            "Where do you see yourself in 5 years?",
            "Why should we hire you?",
            "How do you handle pressure?",
            "Tell about a challenging project you've done"
        ],

        sampleQuestions: [
            {
                topic: "Arrays",
                question: "Find the maximum sum subarray",
                difficulty: "Easy"
            },
            {
                topic: "Trees",
                question: "Level order traversal of binary tree",
                difficulty: "Easy"
            },
            {
                topic: "Strings",
                question: "Reverse a string without using library functions",
                difficulty: "Easy"
            }
        ],

        interviewTimeline: "August - September",
        averagePackage: "3.36 LPA",
        previouslyVisited: true,
        studentPlaced: 45
    },

    {
        _id: "infosys_001",
        name: "Infosys",
        logo: "I",
        industry: "IT Services",
        description: "Infosys Limited - Global IT services and consulting company",
        website: "https://www.infosys.com",

        eligibility: {
            minCGPA: 6.5,
            branches: ["CSE", "IT", "ECE"],
            backlogAllowed: false,
            yearOfPassing: 2026
        },

        roles: [
            {
                title: "Systems Engineer",
                type: "Full-time",
                package: "3.6 LPA",
                description: "Software development and support engineer position"
            }
        ],

        selectionProcess: {
            rounds: [
                {
                    name: "Infosys Online Test (IOT)",
                    duration: "2 hours",
                    sections: ["English", "Quantitative", "Reasoning", "Coding"],
                    cutoff: "50%",
                    description: "Adaptive online assessment with coding round"
                },
                {
                    name: "Technical + HR Round",
                    duration: "45-60 minutes",
                    topics: ["Programming", "Data Structures", "DBMS", "Communication"],
                    difficulty: "Medium",
                    description: "Combined technical and HR interview"
                }
            ]
        },

        aptitudeTopics: [
            "Basic Arithmetic",
            "Logical Reasoning",
            "Data Interpretation",
            "Sequence & Series",
            "English Grammar",
            "Critical Reasoning"
        ],

        technicalTopics: [
            "Core Programming Concepts",
            "Object-Oriented Programming",
            "Data Structures Basics",
            "Relational Databases",
            "SQL Fundamentals",
            "Problem Solving Techniques"
        ],

        codingLanguages: ["Java", "Python", "C"],

        hrQuestions: [
            "Introduce yourself briefly",
            "Why are you interested in Infosys?",
            "What are your key strengths?",
            "How do you manage your time?",
            "Describe a situation where you overcame a challenge",
            "What do you know about Infosys?",
            "How would you handle a conflict with a team member?"
        ],

        sampleQuestions: [
            {
                topic: "Basics",
                question: "Write a program to check if a number is palindrome",
                difficulty: "Easy"
            },
            {
                topic: "Logic",
                question: "Find duplicate elements in an array",
                difficulty: "Easy"
            },
            {
                topic: "Implementation",
                question: "Implement a simple calculator",
                difficulty: "Medium"
            }
        ],

        interviewTimeline: "September - October",
        averagePackage: "3.6 LPA",
        previouslyVisited: true,
        studentPlaced: 38
    },

    {
        _id: "ibm_001",
        name: "IBM",
        logo: "I",
        industry: "Technology & Consulting",
        description: "International Business Machines - Global technology and consulting company",
        website: "https://www.ibm.com",

        eligibility: {
            minCGPA: 7.0,
            branches: ["CSE", "IT"],
            backlogAllowed: false,
            yearOfPassing: 2026
        },

        roles: [
            {
                title: "Software Engineer",
                type: "Full-time",
                package: "4.5 LPA",
                description: "Development and engineering role in software platforms"
            }
        ],

        selectionProcess: {
            rounds: [
                {
                    name: "HackerEarth Online Assessment",
                    duration: "2 hours",
                    sections: ["Coding Problems", "Technical MCQs"],
                    cutoff: "60%",
                    description: "Coding-focused assessment with 2-3 problems"
                },
                {
                    name: "Technical Interview Round 1",
                    duration: "45-60 minutes",
                    topics: ["Core Programming", "DSA", "System Design Basics"],
                    difficulty: "Hard",
                    description: "Deep dive into coding and problem-solving"
                },
                {
                    name: "Technical Interview Round 2",
                    duration: "45-60 minutes",
                    topics: ["Advanced DSA", "Design Patterns", "Database Design"],
                    difficulty: "Hard",
                    description: "Advanced technical concepts"
                },
                {
                    name: "HR Round",
                    duration: "30 minutes",
                    topics: ["Motivation", "Values", "Team Fit"],
                    difficulty: "Medium",
                    description: "Cultural and values alignment"
                }
            ]
        },

        aptitudeTopics: [
            "Advanced Quantitative Skills",
            "Logical Puzzles",
            "Pattern Recognition",
            "Complex Problem Solving",
            "Data Analysis"
        ],

        technicalTopics: [
            "Advanced DSA",
            "System Design Fundamentals",
            "Database Design",
            "Design Patterns",
            "Microservices Concepts",
            "Cloud Computing Basics",
            "API Design",
            "Scalability Concepts"
        ],

        codingLanguages: ["Java", "C++", "Python", "Node.js"],

        hrQuestions: [
            "Tell me about your biggest technical achievement",
            "Why IBM?",
            "How do you stay updated with technology?",
            "Describe your approach to solving complex problems",
            "Tell about your strongest technical skill",
            "How do you work in a team environment?",
            "What is your career vision?",
            "How would you handle tight deadlines?"
        ],

        sampleQuestions: [
            {
                topic: "DSA",
                question: "Implement LRU Cache",
                difficulty: "Hard"
            },
            {
                topic: "Design",
                question: "Design a URL shortener service",
                difficulty: "Hard"
            },
            {
                topic: "Graphs",
                question: "Find strongly connected components in a graph",
                difficulty: "Hard"
            }
        ],

        interviewTimeline: "October - November",
        averagePackage: "4.5 LPA",
        previouslyVisited: true,
        studentPlaced: 12
    },

    {
        _id: "ey_001",
        name: "EY",
        logo: "E",
        industry: "Consulting & Audit",
        description: "Ernst & Young - Global professional services company",
        website: "https://www.ey.com",

        eligibility: {
            minCGPA: 6.5,
            branches: ["CSE", "IT", "ECE", "Mechanical", "Civil"],
            backlogAllowed: false,
            yearOfPassing: 2026
        },

        roles: [
            {
                title: "Associate Consultant (Technology)",
                type: "Full-time",
                package: "4.0 LPA",
                description: "Technology consulting and digital transformation role"
            }
        ],

        selectionProcess: {
            rounds: [
                {
                    name: "Online Assessment",
                    duration: "60 minutes",
                    sections: ["Aptitude", "English", "Logical Reasoning", "Technical MCQs"],
                    cutoff: "50%",
                    description: "Comprehensive assessment covering multiple domains"
                },
                {
                    name: "Group Discussion",
                    duration: "15-20 minutes",
                    topics: ["Tech Topics", "Case Studies", "Business Problems"],
                    difficulty: "Medium",
                    description: "Group discussion on current industry topics"
                },
                {
                    name: "Technical + HR Interview",
                    duration: "45-60 minutes",
                    topics: ["Tech Stack", "Problem Solving", "Communication", "Analytical Skills"],
                    difficulty: "Medium",
                    description: "Combined technical knowledge and HR fit assessment"
                }
            ]
        },

        aptitudeTopics: [
            "Quantitative Analysis",
            "Logical Deduction",
            "Critical Thinking",
            "Data Interpretation",
            "Business Mathematics"
        ],

        technicalTopics: [
            "Programming Fundamentals",
            "Database Concepts",
            "Web Technologies",
            "Cloud Services Overview",
            "Software Development Lifecycle",
            "Business Process Automation",
            "Analytics Tools"
        ],

        codingLanguages: ["Java", "Python", "C#", "JavaScript"],

        hrQuestions: [
            "Tell me about yourself",
            "Why EY and why consulting?",
            "What attracts you to technology consulting?",
            "How do you handle ambiguity?",
            "Tell about your leadership experience",
            "Describe your problem-solving approach",
            "How would you impact a client project?",
            "What is your understanding of digital transformation?"
        ],

        sampleQuestions: [
            {
                topic: "Logic",
                question: "Solve a complex case study involving business metrics",
                difficulty: "Medium"
            },
            {
                topic: "Tech",
                question: "Design a simple scalable system",
                difficulty: "Medium"
            },
            {
                topic: "Query",
                question: "Write SQL queries for business analysis",
                difficulty: "Medium"
            }
        ],

        interviewTimeline: "July - August",
        averagePackage: "4.0 LPA",
        previouslyVisited: true,
        studentPlaced: 28
    }
];
