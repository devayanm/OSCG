export type Speaker = {
  image: string;
  name: string;
  title: string;
  expertise: string;
  linkedin?: string;
  twitter?: string;
  imagePosition?: string;
};

export const kameshSpeaker: Speaker = {
  image: "/speakers/kamesh.jpg",
  name: "Kamesh Sampath",
  title: "Developer Advocate at Snowflake",
  expertise: "Data + AI Advocate",
  linkedin: "https://www.linkedin.com/in/kameshsampath/"
};

export const speakers: Speaker[] = [
  {
    image: "/speakers/Olena.png",
    name: "Olena Yara",
    title: "Founder, Yara Agency",
    expertise: "Marketing Strategist",
    linkedin: "https://www.linkedin.com/in/olena-yara-a26567223/"
  },
  {
    image: "/speakers/Dishantgandhi.png",
    name: "Dishant Gandhi",
    title: "AI/ML Consultant",
    expertise: "Generative AI and LLMs",
    linkedin: "https://www.linkedin.com/in/dishant-gandhi/?originalSubdomain=in"
  },
  {
    image: "/speakers/Sebastiano1.png",
    name: "Sebastiano Fuccio",
    title: "Founder & CEO | Managing Partner",
    expertise: "AI Strategy & Sovereign Innovation",
    linkedin: "https://www.linkedin.com/in/sebastiano-fuccio/?originalSubdomain=ch"
  },
  {
    image: "/speakers/Nithin.jpg",
    name: "Nithin S.S",
    title: "Founder of Synapse QA",
    expertise: "Career & Leadership Strategist",
    linkedin: "https://www.linkedin.com/in/nithin-ss/"
  },
  {
    image: "/speakers/Luiz.jpeg",
    name: "Luiz Carneiro",
    title: "Solution Engineer, smapiot GmbH",
    expertise: "Google Cloud Community Organizer",
    linkedin: "https://www.linkedin.com/in/carneirodotdev/"
  },
  {
    image: "/speakers/TarunGupta.png",
    name: "Tarun Gupta",
    title: "Founder & CTO, Vivaansh Consulting.",
    expertise: "Growth Catalyst Leader & Community Builder",
    linkedin: "https://www.linkedin.com/in/thetarungupta"
  },
  {
    image: "/speakers/MesutDurukal.png",
    name: "Mesut Durukal",
    title: "Founder and Head of Tokyo Test Fest",
    expertise: "Technical Quality Engineering & Test Automation Manager",
    linkedin: "https://www.linkedin.com/in/mesutdurukal?originalSubdomain=jp"
  },
  {
    image: "/speakers/Ekaterina.png",
    name: "Ekaterina Maevskaia",
    title: "Growth Leader at Snap Inc. & TikTok",
    expertise: "Revenue and Growth Leader",
    linkedin: "https://www.linkedin.com/in/katia-maevskaia/"
  },
  {
    image: "/speakers/shedrack.jpg",
    name: "Shedrack Akintayo",
    title: "Software & DevOps Engineer",
    expertise: "Founder at DevRel Community Africa",
    linkedin: "https://www.linkedin.com/in/shedrackakintayo/"
  },
  {
    image: "/speakers/kamesh.jpg",
    name: "Kamesh Sampath",
    title: "Developer Advocate at Snowflake",
    expertise: "Data + AI Advocate",
    linkedin: "https://www.linkedin.com/in/kameshsampath/"
  },
  {
    image: "/speakers/TanishaBansal.png",
    name: "Tanisha Bansal",
    title: "Software Development Engineer at SITA",
    expertise: "ML & AWS Community Builder",
    linkedin: "https://www.linkedin.com/in/tanishabansal110902/?originalSubdomain=in",
    imagePosition: "object-[50%_75%] scale-150"
  },
  {
    image: "/speakers/chikahiro-tokoro.png",
    name: "Chikahiro Tokoro",
    title: "Software Engineer, Podcaster",
    expertise: "Database and Deployment expert",
    linkedin: "https://www.linkedin.com/in/chikahiro/",
  },
  {
    image: "/speakers/Aarya.png",
    name: "Aarya Pandey",
    title: "Intel OpenVINO",
    expertise: "AI, Research and Startups",
    linkedin: "https://www.linkedin.com/in/aaryavjti/?originalSubdomain=in"
  },
  {
    image: "/speakers/Kateryna.png",
    name: "Kateryna Tertiienko",
    title: "Technical Lead at Infonetica",
    expertise: "Technology Leader and Self Learner with over 20 Years of Experience",
    linkedin: "https://www.linkedin.com/in/kate-tertiienko-1536663/"
  },
  {
    image: "/speakers/yash.jpg",
    name: "Yash Thakare",
    title: "AI-specialized Software Engineer",
    expertise: "Hackathon Expert",
    linkedin: "https://www.linkedin.com/in/yashthakare/"
  },
  {
    image: "/speakers/dev.jpeg",
    name: "Deveesh C. Shetty",
    title: "Software Engineer at Levels.fyi",
    expertise: "FOSS United Mangalore",
    linkedin: "https://www.linkedin.com/in/deveesh-shetty/"
  },
];

export const landingSpeakers = [kameshSpeaker, ...speakers.filter(s => s.name !== "Kamesh Sampath")];

export const topSpeakers: Speaker[] = [
  kameshSpeaker,
  {
    image: "/speakers/Olena.png",
    name: "Olena Yara",
    title: "Founder, Yara Agency",
    expertise: "Marketing Strategist",
    linkedin: "https://www.linkedin.com/in/olena-yara-a26567223/"
  },
  {
    image: "/speakers/Sebastiano1.png",
    name: "Sebastiano Fuccio",
    title: "Founder & CEO | Managing Partner",
    expertise: "AI Strategy & Sovereign Innovation",
    linkedin: "https://www.linkedin.com/in/sebastiano-fuccio/"
  },
  {
    image: "/speakers/MesutDurukal.png",
    name: "Mesut Durukal",
    title: "Founder and Head of Tokyo Test Fest",
    expertise: "Technical Quality Engineering & Test Automation Manager",
    linkedin: "https://www.linkedin.com/in/mesutdurukal?originalSubdomain=jp"
  },
];