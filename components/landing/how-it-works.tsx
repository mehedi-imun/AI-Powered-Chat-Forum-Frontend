const steps = [
  {
    number: "01",
    title: "Create a Thread",
    description:
      "Pick a topic, write your post, and start a conversation with the community.",
  },
  {
    number: "02",
    title: "Get Real-Time Replies",
    description:
      "Other members respond instantly. See new posts appear live without refreshing.",
  },
  {
    number: "03",
    title: "AI Keeps It Clean",
    description:
      "Every post is reviewed by AI for spam and toxicity. Quality discussions, always.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">
          How It Works
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-12 text-center">
          Get started in three simple steps and join the conversation today.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm"
            >
              <p className="text-5xl font-black text-primary/20 mb-4">
                {step.number}
              </p>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
