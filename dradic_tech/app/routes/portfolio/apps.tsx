export default function Apps() {
  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4 mt-4 text-center pt-4 pb-8">
      <h1 className="text-4xl md:text-6xl font-semibold">Apps</h1>
      <p className="text-xl text-gray-500 dark:text-gray-400 mt-4">
        Here are some of the apps I have worked on.
      </p>
      <div className="max-w-6xl mx-auto mt-12">
        <AppCard
          title="Expense Tracker"
          description="A simple expense tracker app built with React and TypeScript."
          image={"/TallyUp.webp"}
          link="https://expense-tracker-kappa-livid.vercel.app/"
        />
      </div>
    </div>
  );
}

const AppCard = ({
  title,
  description,
  image = "/blog_post_placeholder.webp",
  link,
}: {
  title: string;
  description: string;
  image?: string;
  link?: string;
}) => {
  return (
    <div
      className={`flex flex-col gap-2 border bg-gray-50 dark:bg-dark-400 border-gray-200 dark:border-gray-800 rounded-lg p-4 w-full hover:bg-gray-100 dark:hover:bg-dark-300 transition-colors ${
        link ? "cursor-pointer" : "cursor-not-allowed"
      }`}
      onClick={() => {
        if (link) {
          window.open(link, "_blank");
        } else {
          alert("Coming Soon");
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (link) {
            window.open(link, "_blank");
          } else {
            alert("Coming Soon");
          }
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={link ? `Open ${title} app` : `${title} - Coming Soon`}
    >
      {image && (
        <img src={image} alt={title} className="size-16 rounded-lg mx-auto" />
      )}
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  );
};
