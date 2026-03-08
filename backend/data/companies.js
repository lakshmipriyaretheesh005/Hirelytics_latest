export const companiesData = [
    {
        name: "TCS",
        logo: "T",
        industry: "IT Services",
        description: "Tata Consultancy Services - India's largest IT services company",
        website: "https://www.tcs.com",

        eligibility: {
            minCGPA: 6.0,
            branches: ["CSE", "IT", "ECE", "EEE", "Mechanical"],
            backlogAllowed: false,
            yearOfPassing: 2026
        },

        roles: [
            {
                title: "Assistant System Engineer",
                type: "Full-time",
                package: "3.36 LPA",
                description: "Entry-level software development role"
            }
        ],

        selectionProcess: {
            rounds: [
                {
                    name: "Online Aptitude Test",
                    duration: "90 minutes",
                    sections: ["Verbal", "Quantitative", "Logical Reasoning"],
                    cutoff: "40%",
                    topics: ["Verbal", "Quantitative", "Logical Reasoning"],
                    difficulty: "Easy",
                    description: "Proctored online assessment"
                },
                {
                    name: "Technical Interview",
                    duration: "45-60 minutes",
                    sections: [],
                    cutoff: "50%",
                    topics: ["DSA", "DBMS", "OS", "Networks"],
                    difficulty: "Medium",
                    description: "Coding problems and technical concepts"
                },
                {
                    name: "HR Interview",
                    duration: "20-30 minutes",
                    sections: [],
                    cutoff: "Pass",
                    topics: ["Motivation", "Strengths", "Career Goals"],
                    difficulty: "Easy",
                    description: "Behavioral and cultural fit assessment"
                }
            ]
        },

        aptitudeTopics: [
            "Number System",
            "Percentages",
            "Time & Work",
            "Profit & Loss",
            "Permutations & Combinations",
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
        studentPlaced: 45,
        isActive: true
    },

    {
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
                    topics: ["English", "Quantitative", "Reasoning", "Basic Coding"],
                    difficulty: "Easy",
                    description: "Adaptive online assessment with coding round"
                },
                {
                    name: "Technical + HR Round",
                    duration: "45-60 minutes",
                    sections: [],
                    cutoff: "Pass",
                    topics: ["DSA", "Programming", "HR"],
                    difficulty: "Medium",
                    description: "Combined technical interview and HR discussion"
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
            "Problem Solving Techniques",
            "Basic System Design"
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
                topic: "Numbers",
                question: "Check if a number is palindrome",
                difficulty: "Easy"
            },
            {
                topic: "Arrays",
                question: "Find duplicate elements in an array",
                difficulty: "Easy"
            },
            {
                topic: "Strings",
                question: "Implement a simple calculator",
                difficulty: "Medium"
            }
        ],

        interviewTimeline: "September - October",
        averagePackage: "3.6 LPA",
        previouslyVisited: true,
        studentPlaced: 38,
        isActive: true
    },

    {
        name: "IBM",
        logo: "IBM",
        industry: "Technology & Consulting",
        description: "International Business Machines - Global technology company",
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
                description: "Full-stack software development role"
            }
        ],

        selectionProcess: {
            rounds: [
                {
                    name: "Online Assessment",
                    duration: "90 minutes",
                    sections: ["Coding", "Logical Reasoning"],
                    cutoff: "50%",
                    topics: ["DSA", "Problem Solving"],
                    difficulty: "Medium",
                    description: "Coding and problem-solving assessment"
                },
                {
                    name: "Technical Interview 1",
                    duration: "45-60 minutes",
                    sections: [],
                    cutoff: "Pass",
                    topics: ["DSA", "System Design"],
                    difficulty: "Medium",
                    description: "Deep dive into data structures and algorithms"
                },
                {
                    name: "Technical Interview 2",
                    duration: "45-60 minutes",
                    sections: [],
                    cutoff: "Pass",
                    topics: ["System Design", "Architecture"],
                    difficulty: "Hard",
                    description: "System design and architectural patterns"
                },
                {
                    name: "HR Interview",
                    duration: "30-45 minutes",
                    sections: [],
                    cutoff: "Pass",
                    topics: ["Motivation", "Culture Fit", "Career Goals"],
                    difficulty: "Easy",
                    description: "HR discussion and culture fit assessment"
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
            "Scalability Concepts",
            "Object-Oriented Design"
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
                topic: "Advanced DSA",
                question: "Implement LRU Cache",
                difficulty: "Hard"
            },
            {
                topic: "System Design",
                question: "Design a URL shortener service",
                difficulty: "Hard"
            },
            {
                topic: "Graphs",
                question: "Find strongly connected components",
                difficulty: "Hard"
            }
        ],

        interviewTimeline: "October - November",
        averagePackage: "4.5 LPA",
        previouslyVisited: true,
        studentPlaced: 25,
        isActive: true
    },

    {
        name: "EY",
        logo: "EY",
        industry: "Consulting & Audit",
        description: "Ernst & Young - Global professional services company",
        website: "https://www.ey.com",

        eligibility: {
            minCGPA: 6.5,
            branches: ["CSE", "IT", "ECE", "Mechanical"],
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
                    name: "Written Assessment",
                    duration: "60 minutes",
                    sections: ["English", "Quantitative", "Logical Reasoning"],
                    cutoff: "Pass",
                    topics: ["Quantitative", "Logical Reasoning", "English"],
                    difficulty: "Easy",
                    description: "Aptitude and reasoning assessment"
                },
                {
                    name: "Group Discussion",
                    duration: "30 minutes",
                    sections: [],
                    cutoff: "Pass",
                    topics: ["Communication", "Leadership"],
                    difficulty: "Medium",
                    description: "Group discussion on business topics"
                },
                {
                    name: "HR + Technical Interview",
                    duration: "45-60 minutes",
                    sections: [],
                    cutoff: "Pass",
                    topics: ["HR", "Basic Technical", "Consulting Awareness"],
                    difficulty: "Medium",
                    description: "Combined HR and basic technical discussion"
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
            "Analytics Tools",
            "Digital Transformation Concepts"
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
                topic: "Case Studies",
                question: "Solve a complex case study involving business metrics",
                difficulty: "Medium"
            },
            {
                topic: "System Design",
                question: "Design a simple scalable system",
                difficulty: "Medium"
            },
            {
                topic: "SQL",
                question: "Write SQL queries for business analysis",
                difficulty: "Easy"
            }
        ],

        interviewTimeline: "July - August",
        averagePackage: "4.0 LPA",
        previouslyVisited: true,
        studentPlaced: 42,
        isActive: true
    }
];

