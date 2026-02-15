export interface Project {
  title: string;
  description: string;
  githubRepo: string;
  liveLink?: string;
  techStack: string[];
  level: "Beginner" | "Intermediate" | "Advanced";
  category: "AI" | "Blockchain" | "Python" | "Web" | "Other";
  admin: {
    name: string;
    linkedin: string;
    github?: string;
    avatar?: string;
  };
}

export const PROJECTS: Project[] = [
  {
    title: "EVID-DGC",
    description: "A Blockchain-based Evidence Management System designed for transparency, security, and decentralized data integrity (DGC).",
    githubRepo: "https://github.com/Gooichand/blockchain-evidence",
    techStack: ["HTML5", "CSS3", "Vanilla JavaScript", "Socket.IO Client"],
    level: "Advanced",
    category: "Blockchain",
    liveLink: "https://blockchain-evidence.onrender.com/",
    admin: {
      name: "Gopichand Dandimeni",
      linkedin: "https://www.linkedin.com/in/gopichand-d-269709287/",
      github: "Gooichand",
      avatar: "https://github.com/Gooichand.png"
    },
  },
  {
    title: "LOOK-DGC",
    description: "LOOK-DGC is a comprehensive digital image forensics toolkit developed by Gopichand. It provides a fully integrated environment for analyzing digital images to detect tampering, forgery, and manipulation.",
    githubRepo: "https://github.com/Gooichand/LOOK_DGC",
    techStack: ["Perl", "HTML", "Python", "C++", "PostScript", "Makefile"],
    level: "Intermediate",
    category: "Blockchain",
    admin: {
      name: "Gopichand",
      linkedin: "",
      github: "Gooichand",
      avatar: "https://github.com/Gooichand.png"
    },
  },
  {
    title: "Achievement Management System",
    description: "A web-based system that helps institutions manage and track student achievements, awards, and recognitions in an organized digital format.",
    githubRepo: "https://github.com/Eswaramuthu/Achievement-Management-System",
    techStack: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
    level: "Beginner",
    category: "Python",
    admin: {
      name: "Eswaramuthu",
      linkedin: "",
      github: "Eswaramuthu",
      avatar: "https://github.com/Eswaramuthu.png"
    },
  },
  {
    title: "Innovision",
    description: "InnoVision is a cutting-edge AI-powered learning platform that dynamically generates structured and engaging courses from any topic. Unlike traditional static courses, InnoVision leverages AI and machine learning to create a flexible, adaptive learning environment tailored to individual learner needs.",
    githubRepo: "https://github.com/ItsVikasA/Innovision-Open-Source.git",
    techStack: ["Next.js", "Firebase", "RazorPay","Google AI Studio"],
    level: "Intermediate",
    category: "Python",
    liveLink: "https://innovision-open-source.vercel.app/",
    admin: {
      name: "Vikas",
      linkedin: "https://www.linkedin.com/in/vikas028",
      github: "https://github.com/ItsVikasA.git",
      avatar: "https://github.com/akshay-innovision.png"
    },
  },
  {
    title: "AI Council",
    description: "A revolutionary Python-based system that intelligently coordinates multiple specialized AI models to solve complex problems by treating them as specialized agents.",
    githubRepo: "https://github.com/shrixtacy/Ai-Council",
    liveLink: "https://pypi.org/project/ai-council-orchestrator/1.0.0//",
    techStack: ["Python", "Pydantic", "Httpx", "Tenacity", "Structlog", "PyYAML", "GitHub Actions"],
    level: "Intermediate",
    category: "AI",
    admin: {
      name: "Shriyansh Dash",
      linkedin: "https://www.linkedin.com/in/shriyanshdash/",
      github: "https://github.com/shrixtacy/",
      avatar: "https://github.com/shrixtacy.png"
    },
  },
  {
    title: "Healconnect",
    description: "A health monitoring platform connecting doctors and patients digitally.",
    githubRepo: "https://github.com/Dipanita45/HEALCONNECT",
    techStack: ["Next.js", "JavaScript", "Firebase", "CSS"],
    level: "Intermediate",
    category: "Python",
    admin: {
      name: "Dipanita Mondal",
      linkedin: "https://wwww.linkedin.com/in/dipanita-mondal-6a9257306",
      github: "https://github.com/Dipanita45",
      avatar: "https://github.com/Dipanita45.png"
    },
  },
  {
    title: "Transportation & Logistics Management System",
    description: "A management system built to streamline transportation and logistics operations including vehicle tracking, shipment handling, and delivery management.",
    githubRepo: "https://github.com/Kush-012/Transportation-and-Logistics",
    techStack: ["Java", "Spring Boot", "MySQL"],
    level: "Intermediate",
    category: "Python",
    admin: {
      name: "Kush Mehta",
      linkedin: "",
      github: "https://github.com/Kush-012",
      avatar: "https://github.com/Kush-012.png"
    },
  },
  {
    title: "arduino-cli-interactive",
    description: "An interactive terminal-based tool to help beginners use arduino-cli easily with guided workflows.",
    githubRepo: "https://github.com/Vaishnav-Sabari-Girish/arduino-cli-interactive",
    liveLink: "https://vaishnav.world/arduino-cli-interactive",
    techStack: ["Bash scripting"],
    level: "Intermediate",
    category: "Python",
    admin: {
      name: "Vaishnav Sabari Girish",
      linkedin: "https://www.linkedin.com/in/vaishnav-sabari-girish",
      github: "https://github.com/Vaishnav-Sabari-Girish",
      avatar: "https://github.com/Vaishnav-Sabari-Girish.png"
    },
  },
  {
    title: "ComChan",
    description: "A high-performance serial monitor for embedded engineers to view serial logs efficiently.",
    githubRepo: "https://github.com/Vaishnav-Sabari-Girish/ComChan",
    liveLink: "https://vaishnav.world/ComChan/",
    techStack: ["Rust", "C++", "Tex"],
    level: "Advanced",
    category: "Python",
    admin: {
      name: "Vaishnav Sabari Girish",
      linkedin: "https://www.linkedin.com/in/vaishnav-sabari-girish",
      github: "https://github.com/Vaishnav-Sabari-Girish",
      avatar: "https://github.com/Vaishnav-Sabari-Girish.png"
    },
  },
  {
    title: "MCP-Arena",
    description: "MCP-Arena is a production-ready Python library focused on AI and Machine Learning workflows, designed to work with MCP (Model Context Protocol) and LangChain for building intelligent AI systems.",
    githubRepo: "https://github.com/SatyamSingh8306/mcp_arena",
    liveLink: "https://mcparena.vercel.app/",
    techStack: ["Python", "Machine Learning", "AI", "MCP", "LangChain"],
    level: "Advanced",
    category: "AI",
    admin: {
      name: "Satyam Singh",
      linkedin: "https://www.linkedin.com/in/satyam8306",
      github: "https://github.com/SatyamSingh8306",
      avatar: "https://github.com/SatyamSingh8306.png"
    },
  },
  {
    title: "RWA Tokenization using Aptos Framework",
    description: "A decentralized protocol for Real-World Asset (RWA) management built using Move on Aptos. The project introduces a structured Invoice Lifecycle (Pending, Funded, Paid) where each invoice is treated as a decoupled, secure Resource.",
    githubRepo: "https://github.com/Akshith985/Aptos-RWA",
    liveLink: "https://aptos-rwa.vercel.app/",
    techStack: ["Move", "Aptos Framework", "React.js", "TypeScript", "Aptos SDK", "Tailwind CSS"],
    level: "Intermediate",
    category: "Blockchain",
    admin: {
      name: "Akshith",
      linkedin: "https://www.linkedin.com/in/akshith-anand-5a5988379/",
      github: "https://github.com/Akshith985",
      avatar: "https://github.com/Akshith985.png"
    },
  },
  {
    title: "PPMM - Python Project Manager",
    description: "PPMM is a Python-based project management tool designed to help developers organize, track, and manage Python projects efficiently. It focuses on simplifying workflows, dependency handling, and project structure management.",
    githubRepo: "https://github.com/Sumangal44/ppmm",
    techStack: ["Python", "CLI Development", "Project Management Tools"],
    level: "Intermediate",
    category: "Python",
    admin: {
      name: "Sumangal Karan",
      linkedin: "https://www.linkedin.com/in/sumangal-karan",
      github: "https://github.com/Sumangal44",
      avatar: "https://github.com/Sumangal44.png"
    },
  },
  {
    title: "Intervyo",
    description: "An intelligent, interactive platform designed to simulate real-world interviews using AI. It helps users practice technical and behavioral questions in a realistic interview environment with feedback and performance tracking.",
    githubRepo: "https://github.com/santanu-atta03/Intervyo",
    liveLink: "https://intervyo-sage.vercel.app",
    techStack: ["React.js", "Node.js", "MongoDB", "Express.js"],
    level: "Advanced",
    category: "AI",
    admin: {
      name: "Santanu Atta",
      linkedin: "https://www.linkedin.com/in/santanu-atta-139820363",
      github: "santanu-atta03",
      avatar: "https://github.com/santanu-atta03.png"
    },
  },
  {
    title: "tweakio-sdk",
    description: "tweakio-sdk is a developer-friendly SDK designed to integrate AI-powered workflows and automation into applications easily. It focuses on simplifying interaction with AI services through structured APIs and tools.",
    githubRepo: "https://github.com/BITS-Rohit/tweakio-sdk",
    liveLink: "https://pypi.org/project/tweakio-SDK/",
    techStack: ["Python", "SDK Development", "AI Integration", "REST APIs"],
    level: "Advanced",
    category: "AI",
    admin: {
      name: "Rohit Gupta",
      linkedin: "https://www.linkedin.com/in/rohit-gupta-169931272/",
      github: "TweakIO",
      avatar: "https://github.com/TweakIO.png"
    },
  },
  {
    title: "WalletWise – Behaviour-Aware Personal Finance Assistant",
    description: "WalletWise is an intelligent personal finance management platform that leverages AI and behavioral analysis to help users track spending, manage budgets, and make smarter financial decisions based on their habits.",
    githubRepo: "https://github.com/SoumyaMishra-7/WalletWise",
    techStack: ["React.js", "Node.js", "Express.js", "MongoDB"],
    level: "Advanced",
    category: "AI",
    admin: {
      name: "Soumya Mishra",
      linkedin: "",
      github: "https://github.com/SoumyaMishra-7",
      avatar: "https://github.com/SoumyaMishra-7.png"
    },
  },
  {
    title: "OpenMath",
    description: "OpenMath is an educational platform aimed at solving and visualizing mathematical problems using interactive tools and algorithms to enhance learning experiences.",
    githubRepo: "https://github.com/AshChadha-iitg/OpenMath",
    techStack: ["Python", "Web Development", "Math Algorithms"],
    level: "Intermediate",
    category: "Python",
    admin: {
      name: "Ashish Chadha",
      linkedin: "",
      github: "https://github.com/AshChadha-iitg",
      avatar: "https://github.com/AshChadha-iitg.png"
    },
  },
  {
    title: "Photoflux (Fediverse)",
    description: "This project is a Fediverse-compatible photo sharing social platform built to work with decentralized social networks using the ActivityPub protocol. It allows users to share images and interact across different federated platforms.",
    githubRepo: "https://github.com/avdhut400/Fediverse.git",
    techStack: ["Node.js", "Express.js", "MongoDB", "ActivityPub Protocol"],
    level: "Advanced",
    category: "AI",
    admin: {
      name: "Avdhut Magar",
      linkedin: "https://www.linkedin.com/in/avdhut-magar-94088333b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      github: "https://github.com/avdhut400",
      avatar: "https://github.com/avdhut400.png"
    },
  },
  {
    title: "VoucherX",
    description: "A modern web app for buying, selling, and trading vouchers before expiry, with AI-powered assistance.",
    githubRepo: "https://github.com/jaiashwinisatish/VoucherX",
    liveLink: "https://voucher-x-tau.vercel.app/",
    techStack: ["React", "TypeScript", "Supabase", "PostgreSQL", "Tailwind CSS"],
    level: "Intermediate",
    category: "Python",
    admin: {
      name: "Ashwini Jaiswal",
      linkedin: "https://www.linkedin.com/in/ashwini-jaiswal-095165282/",
      github: "https://github.com/jaiashwinisatish",
      avatar: "https://github.com/jaiashwinisatish.png"
    },
  },
  {
    title: "NexumDB",
    description: "NexumDB is a high-performance distributed database system designed for scalable data storage and fast query processing, focusing on modern data-intensive applications.",
    githubRepo: "https://github.com/aviralgarg05/NexumDB",
    techStack: ["C++", "Distributed Systems", "Database Engineering"],
    level: "Advanced",
    category: "Python",
    admin: {
      name: "Aviral Garg",
      linkedin: "https://www.linkedin.com/in/aviral-garg-b7b053280/",
      github: "https://github.com/aviralgarg05",
      avatar: "https://github.com/aviralgarg05.png"
    },
  },
  {
    title: "Veren",
    description: "Veren is a cloud-native deployment platform designed to simplify application deployment and management. It focuses on modern DevOps practices with scalable infrastructure and automation.",
    githubRepo: "https://github.com/atithi4dev/veren",
    techStack: ["Node.js", "TypeScript", "Docker", "AWS"],
    level: "Advanced",
    category: "AI",
    admin: {
      name: "Atithi Singh",
      linkedin: "https://linkedin.com/in/singhatithi",
      github: "https://github.com/atithi4dev",
      avatar: "https://github.com/atithi4dev.png"
    },
  },
  {
    title: "DocVerse",
    description: "DocVerse is a document management and collaboration platform that allows users to upload, organize, and share documents efficiently with smart search and access controls.",
    githubRepo: "https://github.com/Xenonesis/Docverse",
    techStack: ["React.js", "Node.js", "MongoDB", "Express.js"],
    level: "Intermediate",
    category: "Python",
    admin: {
      name: "Aditya Kumar Tiwari",
      linkedin: "",
      github: "https://github.com/Xenonesis",
      avatar: "https://github.com/Xenonesis.png"
    },
  },
  {
    title: "Code Guardian",
    description: "Code Guardian is an intelligent code analysis and security tool designed to scan applications for vulnerabilities, bad practices, and potential threats. It helps developers write safer and more reliable code.",
    githubRepo: "https://github.com/Xenonesis/code-guardian-report",
    liveLink: "https://code-guardian-report.vercel.app/",
    techStack: ["Python", "Static Code Analysis", "Security Automation"],
    level: "Intermediate",
    category: "Python",
    admin: {
      name: "Aditya Kumar Tiwari",
      linkedin: "",
      github: "https://github.com/Xenonesis",
      avatar: "https://github.com/Xenonesis.png"
    },
  },
  {
    title: "Fleetiva-Roadlines",
    description: "A MERN-based transportation and logistics management platform featuring digital bilty generation, fleet operations, freight workflows, and load management.",
    githubRepo: "https://github.com/sarojit049/Fleetiva-Roadlines",
    techStack: ["React.js", "Node.js", "Express.js", "MongoDB", "Redis", "Twilio", "PDFKit"],
    level: "Beginner",
    category: "Python",
    admin: {
      name: "Saroj Kumar",
      linkedin: "https://www.linkedin.com/in/saroj-kumar-017948314?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      github: "https://github.com/sarojit049",
      avatar: "https://github.com/sarojit049.png"
    },
  },
  {
    title: "Civic-Resolve",
    description: "An AI-powered civic issue detection and resolution platform using computer vision and automated routing for complaint management, priority assessment, and fraud prevention.",
    githubRepo: "https://github.com/Aditya20032004/CivicResolve.git",
    liveLink: "https://civic-resolve-orcin.vercel.app/",
    techStack: ["OpenCV", "YOLO", "AI priority analysis"],
    level: "Intermediate",
    category: "Python",
    admin: {
      name: "Aditya Gupta",
      linkedin: "http://www.linkedin.com/in/aditya-gupta-b06418365",
      github: "Aditya20032004",
      avatar: "https://github.com/Aditya20032004.png"
    },
  },
  {
    title: "CryptoHub",
    description: "A modern crypto tracking platform to explore real-time cryptocurrency prices, view detailed coin analytics, and stay updated with market trends.",
    githubRepo: "https://github.com/KaranUnique/CryptoHub",
    liveLink: "https://crypto-hub-rosy.vercel.app/",
    techStack: ["JavaScript", "React", "Tailwind", "Node", "Express", "REST API"],
    level: "Intermediate",
    category: "Blockchain",
    admin: {
      name: "Karan Manickam",
      linkedin: "https://www.linkedin.com/in/karanunix",
      github: "https://github.com/KaranUnique",
      avatar: "https://github.com/KaranUnique.png"
    },
  },
  {
    title: "MooVit",
    description: "MooVit is a fitness and activity tracking application designed to help users monitor workouts, daily movements, and health progress in a simple and engaging way. It focuses on improving lifestyle habits through data-driven insights.",
    githubRepo: "https://github.com/ShubhangiRoy12/MooVit",
    liveLink: "https://moo-vit.vercel.app/",
    techStack: ["Flutter", "Firebase", "Mobile App Development"],
    level: "Intermediate",
    category: "Python",
    admin: {
      name: "Shubhangi Roy",
      linkedin: "http://www.linkedin.com/in/shubhangi-roy-762a3427a",
      github: "https://github.com/ShubhangiRoy12",
      avatar: "https://github.com/ShubhangiRoy12.png"
    },
  },
  {
    title: "AnimateHub",
    description: "An open-source animation UI library that provides sleek, reusable, and customizable animation components for modern web applications to enhance user experience and simplify frontend development.",
    githubRepo: "https://github.com/Premkolte/AnimateHub",
    liveLink: "https://animate-hub.vercel.app/",
    techStack: ["MongoDB", "Express.js", "React.js", "Node.js (MERN)"],
    level: "Advanced",
    category: "Python",
    admin: {
      name: "Prem kolte",
      linkedin: "https://www.linkedin.com/in/prem-kolte/",
      github: "https://github.com/Premkolte",
      avatar: "https://github.com/Premkolte.png"
    },
  },
  {
    title: "SensBot",
    description: "A remotely operated robotic vehicle integrated with sensors for real-time navigation, terrain stability, and environmental data collection, combining mechanical design with intelligent automation.",
    githubRepo: "https://github.com/Karthik-v202/SensBot",
    techStack: ["ESP8266", "DHT/MQ Sensors", "Arduino C/C++", "Motor Controllers"],
    level: "Intermediate",
    category: "Python",
    admin: {
      name: "Karthik VS",
      linkedin: "http://www.linkedin.com/in/karthik-v-s-4335k",
      github: "https://github.com/Karthik-v202",
      avatar: "https://github.com/Karthik-v202.png"
    },
  },
  {
    title: "Hologram-with-AI",
    description: "Hologram-with-AI is an innovative project that combines holographic display concepts with artificial intelligence to create interactive visual experiences. It focuses on using AI to enhance hologram responses and user interaction.",
    githubRepo: "https://github.com/Beastyy69/Hologram-With-AI",
    techStack: ["Python", "AI/ML", "Computer Vision", "Hardware Integration"],
    level: "Intermediate",
    category: "Python",
    admin: {
      name: "Harshit Shaw",
      linkedin: "https://www.linkedin.com/in/harshitshaw/",
      github: "https://github.com/Beastyy69",
      avatar: "https://github.com/Beastyy69.png"
    },
  },
  {
    title: "PyLabFlow",
    description: "PyLabFlow is a Python-based automation and workflow management tool designed to streamline laboratory processes and data handling. It focuses on building efficient pipelines for experiments, analysis, and task orchestration.",
    githubRepo: "https://github.com/BBEK-Anand/PyLabFlow",
    liveLink: "http://experquick.org/learn",
    techStack: ["Python", "Workflow Automation", "Data Processing"],
    level: "Intermediate",
    category: "Python",
    admin: {
      name: "Bibekananada Hati",
      linkedin: "https://www.linkedin.com/in/bbek-anand/",
      github: "https://github.com/BBEK-Anand",
      avatar: "https://github.com/BBEK-Anand.png"
    },
  },
  {
    title: "Event Planner",
    description: "A comprehensive event planning and management platform designed to help users organize, schedule, and coordinate various types of events with ease and efficiency.",
    githubRepo: "https://github.com/raghav-yadav-dev/event-planner",
    techStack: ["Python", "Django", "JavaScript", "PostgreSQL"],
    level: "Intermediate",
    category: "Python",
    admin: {
      name: "Raghav Yadav",
      linkedin: "https://www.linkedin.com/in/raghav-yadav-dev",
      github: "https://github.com/raghav-yadav-dev",
      avatar: "https://github.com/raghav-yadav-dev.png"
    },
  },
  {
    title: "Lextransition-AI",
    description: "Lextransition-AI is an AI-powered language translation system that focuses on accurate contextual translations using modern NLP models.",
    githubRepo: "https://github.com/SharanyaAchanta/LexTransition-AI",
    techStack: ["Python", "Natural Language Processing", "Machine Learning"],
    level: "Advanced",
    category: "Python",
    admin: {
      name: "Achanta Sharanya",
      linkedin: "https://www.linkedin.com/in/sharanya-achanta-946297276/",
      github: "https://github.com/SharanyaAchanta",
      avatar: "https://github.com/SharanyaAchanta.png"
    },
  },
  {
    title: "GroqTales",
    description: "GroqTales is an open-source platform that uses AI to generate stories and comics, which you can mint and own as NFTs on the Monad blockchain. Join a creative community blending storytelling, generative AI, and Web3 technology.",
    githubRepo: "https://github.com/IndieHub25/GroqTales",
    liveLink: "https://www.groqtales.xyz/",
    techStack: ["Next.js", "React", "TS", "TailwindCSS", "shadcn/ui", "Node.js", "REST APIs", "Groq API", "LPU", "prompt-eng", "gen-AI", "MongoDB", "Monad", "EVM", "Solidity", "Web3", "NFT", "dApp", "Hardhat", "Foundry", "Jest", "ESLint", "Prettier", "Vercel", "Netlify", "Render"],
    level: "Advanced",
    category: "AI",
    admin: {
      name: "Mantej Singh Arora",
      linkedin: "https://www.linkedin.com/in/mantej-singh-arora/",
      github: "https://github.com/IndieHub25",
      avatar: "https://github.com/IndieHub25.png"
    },
  },
];
