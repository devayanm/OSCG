import { EventCard } from "./_components/event-card";

const EventTimeline = () => {
  const events = [
    {
      status: "past" as const,
      title: "Registrations Open",
      description: "Participants from across the globe can officially register for OSCG’26.",
      date: "1st December, 2025",
      location: "Virtual",
      attendees: "500+",
    },
    {
      status: "past" as const,
      title: "Mentor Registration Opens",
      description: "Experienced open-source contributors, industry professionals, and community leaders are invited to register as mentors.",
      date: "10th January, 2026",
      location: "Virtual",
      attendees: "50+",
      link: "https://docs.google.com/forms/d/e/1FAIpQLSebuqxmKNDuIgXYZzbOZ1nhJp38fHxthFGDyDN0j4V6cX3sFQ/viewform?usp=header",
      buttonText: "Become a Mentor",
    },
    {
      status: "past" as const,
      title: "Project Admin Registration Opens",
      description: "Open-source organizations, startups, and independent maintainers are invited to onboard their projects.",
      date: "10th January, 2026",
      location: "Virtual",
      attendees: "20+",
      link: "https://docs.google.com/forms/d/e/1FAIpQLSfnWgjErOia0Kj6IFOeK8zEb8K7NFXUHFr8F4oYsaGC-Qh8OQ/viewform?usp=header",
      buttonText: "Become Project Admin",
    },
    {
      status: "Open" as const,
      title: "Project Listings Go Live",
      description: "Registered projects are published on the platform with detailed descriptions, tech stacks, contribution guidelines, and difficulty levels.",
      date: "5th February, 2026",
      location: "Virtual",
      attendees: "Pending",
    },
    {
      status: "Open" as const,
      title: "Orientation Session",
      description: "Introductory sessions, mentor meet-ups, and contributor orientations are conducted to ensure everyone understands workflows, open-source best practices, and collaboration tools.",
      date: "6th February, 2026",
      location: "Virtual",
      attendees: "300+",
      link: "https://www.youtube.com/live/wPnhpzGozyA",
      buttonText: "Watch Now",
    },
    {
      status: "Open" as const,
      title: "Contribution Phase Begins",
      description: "Active development starts as contributors work on issues, features, documentation, design, and research under mentor guidance.",
      date: "9th February, 2026",
      location: "Virtual",
      attendees: "800+",
      link: "https://docs.google.com/document/d/1O61yDFdRpNInNGem6A4gOx3Z0rX2Lcr7ONNEuXEmpyY/edit?tab=t.0",
      buttonText: "Explore Projects",

    },
    {
      title: "Mid-Program Evaluation & Feedback",
      description: "Progress is reviewed across projects. Contributors receive feedback, mentors refine guidance strategies, and project admins optimize task distribution to maximize impact.",
      date: "20th February, 2026",
      location: "Virtual",
      attendees: "800+",
    },
    {
      title: "Program Wrap-Up & Community Continuation",
      description: "OSCG’26 concludes with a global wrap-up session highlighting achievements, success stories, and opportunities to continue contributing beyond the program.",
      date: "25th March, 2026",
      location: "Virtual",
      attendees: "1000+",
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
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventTimeline;