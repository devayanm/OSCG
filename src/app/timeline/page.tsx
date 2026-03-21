import { EventCard } from "./_components/event-card";

const EventTimeline = () => {
  const events = [
    {
      status: "past" as const,
      title: "Registrations Open",
      description:
        "Participants from across the globe can officially register for OSCG’26.",
      date: "1st December, 2025",
      location: "Virtual",
      attendees: "500+",
    },
    {
      status: "past" as const,
      title: "Mentor Registration Opens",
      description:
        "Experienced open-source contributors, industry professionals, and community leaders are invited to register as mentors.",
      date: "10th January, 2026",
      location: "Virtual",
      attendees: "50+",
      link:
        "https://docs.google.com/forms/d/e/1FAIpQLSebuqxmKNDuIgXYZzbOZ1nhJp38fHxthFGDyDN0j4V6cX3sFQ/viewform?usp=header",
      buttonText: "Become a Mentor",
    },
    {
      status: "past" as const,
      title: "Project Admin Registration Opens",
      description:
        "Open-source organizations, startups, and independent maintainers are invited to onboard their projects.",
      date: "10th January, 2026",
      location: "Virtual",
      attendees: "20+",
      link:
        "https://docs.google.com/forms/d/e/1FAIpQLSfnWgjErOia0Kj6IFOeK8zEb8K7NFXUHFr8F4oYsaGC-Qh8OQ/viewform?usp=header",
      buttonText: "Become Project Admin",
    },
    {
      status: "past" as const,
      title: "Project Listings Go Live",
      description:
        "Registered projects are published on the platform with detailed descriptions, tech stacks, contribution guidelines, and difficulty levels.",
      date: "5th February, 2026",
      location: "Virtual",
      attendees: "Pending",
    },
    {
      status: "past" as const,
      title: "OSCG'26 Orientation Session",
      description: "This session introduces Open Source Connect Global (OSCG), explaining what open source is and how participants can contribute to projects. ",
      sessionnum: "",
      date: "6th February, 2026",
      location: "Virtual",
      attendees: "300+",
      link: "https://www.youtube.com/live/wPnhpzGozyA",
      buttonText: "Watch Now",
    },
    {
      status: "past" as const,
      title:
        "Speaker Session 1 : Unlocking on-device intelligence with Small Language Models | Open Source Connect Global 2026",
      date: "9th February, 2026",
      location: "Virtual",
      sessionnum: "1",
      description: "Dishant G. explains how Small Language Models power efficient, privacy-first AI with minimal cloud reliance.Learn to build lightweight GenAI systems and scalable RAG-based solutions with real-world insights.",
      attendees: "300+",
      link: "https://www.youtube.com/live/cuInxtp2tGE?si=EZ-15F1B0-SmjMl4",
      buttonText: "Watch Now",
    },
    {
      status: "past" as const,
      title:
        "Speaker Session 2 : From Classroom to Code : Building Your First MVP With Open Source",
      date: "16th February, 2026",
      location: "Virtual",
      description: "Speaker Tarun Gupta walks you through turning ideas into reality by building your first MVP using open-source tools and communities.",
      sessionnum: "2",
      attendees: "300+",
      link: "https://www.youtube.com/live/b7sLMzooDdo?si=yEGfoDx1hX5YPSjq",
      buttonText: "Watch Now",
    },
    {
      status: "past" as const,
      title:
        "Speaker Session 3 : From Milliseconds to Insights: Real-Time PostgreSQL + CDC Architecture for Spatial Analytics and AI",
      date: "18th February, 2026",
      description: "Speaker Kamesh Sampath delivers a deep dive into building real-time spatial intelligence using PostgreSQL, PostGIS, and Apache-based CDC.",
      location: "Virtual",
      sessionnum: "3",
      attendees: "300+",
      link: "https://www.youtube.com/live/9rR4cyCs_rw?si=JCEgQ_bQR085R97k",
      buttonText: "Watch Now",
    },
    {
      status: "past" as const,
      title: "Mid-Program Evaluation & Feedback",
      description:
        "Progress is reviewed across projects. Contributors receive feedback, mentors refine guidance strategies, and project admins optimize task distribution to maximize impact.",
      date: "20th February, 2026",
      location: "Virtual",
      attendees: "800+",
    },
    {
      status: "past" as const,
      title: "Speaker Session 4 : My Learning From Community : No one is an island",
      date: "21th February, 2026",
      description: "Speaker Nitin SS shares powerful insights on the importance of community in personal and professional growth.",
      location: "Virtual",
      sessionnum: "4",
      attendees: "300+",
      link: "https://www.youtube.com/live/9rR4cyCs_rw?si=JCEgQ_bQR085R97k",
      buttonText: "Watch Now",
    },
    {
      status: "past" as const,
      title: "Speaker Session 5 : Building a Strong Brand In the Open-Source Ecosystem",
      date: "26th February, 2026",
      description: "Speaker Olena Yara explores how to build a strong and authentic personal brand within the open-source ecosystem.",
      location: "Virtual",
      sessionnum: "5",
      attendees: "300+",
      link: "https://www.youtube.com/live/rKMMKQjKysE?si=SvDGFPieHbZ8kJsF",
      buttonText: "Watch Now",
    },
    {
      status: "Open" as const,
      title: "Program Wrap-Up & Community Continuation",
      description:
        "OSCG’26 concludes with a global wrap-up session highlighting achievements, success stories, and opportunities to continue contributing beyond the program.",
      date: "3rd March, 2026",
      location: "Virtual",
      attendees: "1000+",
      link: "https://www.youtube.com/@open-source-connect/streams",
      buttonText: "Watch Now",
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 py-8 pt-24">
        <div className="text-center my-12 mb-16">
          <h2 className="mb-4 text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Event <span className="text-[#4FD1D0]">Timeline</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mt-4 px-4">
            Join us at upcoming events and workshops designed to inspire and connect developers.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto mb-16">
          <div className="space-y-8">
            {events.map((event, index) => (
              <EventCard
                key={index}
                {...event}
                index={index}
                totalEvents={events.length}
                sessionnum={event.sessionnum}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventTimeline;