import type { Route } from "./+types/index";
import { SimpleInput } from "~/components/SimpleInput";
import { PostsList, PostsSkeleton } from "~/components/PostList";
import { useState, useCallback, Suspense, useEffect } from "react";
import { RefreshIcon } from "~/components/Icons";
import { Link } from "react-router";
import { useFeaturedPost } from "~/hooks/useBlogPostsData";
import { extractPlainText } from "~/components/markdown";
import { handleSubscribe } from "~/modules/utils";
import { SimpleNotification } from "~/components/SimpleNotification";

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "Dradic Technologies Blog" },
    { name: "description", content: "Welcome to Dradic Technologies Blog!" },
  ];
}

export default function Blog() {
  const [refreshKey, setRefreshKey] = useState(0);
  const handleRefresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);
  const [userEmail, setUserEmail] = useState<string>("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeError, setSubscribeError] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState<string>("");
  const [notificationType, setNotificationType] = useState<
    "info" | "success" | "error"
  >("info");

  useEffect(() => {
    setNotificationType(
      subscribeError ? "error" : isSubscribed ? "success" : "info",
    );
    setNotificationMessage(
      subscribeError
        ? "Failed to subscribe"
        : isSubscribed
          ? "Subscribed successfully"
          : "Subscribing...",
    );
  }, [subscribeError, isSubscribed]);

  return (
    <>
      <div>
        {subscribing && (
          <SimpleNotification
            message={notificationMessage}
            type={notificationType}
            timeout={3000}
          />
        )}
        {/* Hero Section */}
        <div className="flex flex-col justify-center items-center text-center pt-8 pb-8">
          <h1 className="text-3xl sm:text-5xl font-bold">
            Weekly <span className="text-primary-500">DevOps</span> tech
            insights and tutorials
          </h1>
          <p className="text-lg sm:text-2xl text-gray-500 dark:text-gray-400 mt-4">
            Join us as we explore the latest trends in technology and share our
            insights with you.
          </p>
          {/* Subscribe Bar */}
          <div className="hidden">
            <SimpleInput
              placeholder="Enter your email"
              inputType="email"
              value={userEmail}
              onChange={(value: string) => setUserEmail(value)}
              buttonText="Subscribe"
              buttonOnClick={() => {
                setSubscribing(true);
                const isSubscribed = handleSubscribe(userEmail);
                if (isSubscribed) {
                  setIsSubscribed(true);
                  setUserEmail("");
                } else {
                  setSubscribeError(true);
                }
                setSubscribing(false);
              }}
            />
          </div>
        </div>

        <div className="flex flex-col justify-center items-center text-center pt-4 pb-8 gap-4">
          <h1 className="text-2xl font-semibold">Latest Post</h1>
          <Suspense fallback={<LatestPostSkeleton />}>
            <LatestPost refreshKey={refreshKey} />
          </Suspense>
        </div>
        {/* Recent Posts */}
        <RecentPosts refreshKey={refreshKey} handleRefresh={handleRefresh} />
      </div>
    </>
  );
}

export function RecentPosts({
  refreshKey = 0,
  handleRefresh = () => {},
  refreshButton = true,
  showLatestPost = false,
}: {
  refreshKey?: number;
  handleRefresh?: () => void;
  refreshButton?: boolean;
  showLatestPost?: boolean;
}) {
  return (
    <div className="flex flex-col mt-6 justify-center text-left">
      <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2">
        <h2 className="font-semibold text-gray-600 dark:text-gray-400">
          Recent content
        </h2>
        {refreshButton && (
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 cursor-pointer text-gray-600 dark:text-gray-400 group hover:text-primary-500 dark:hover:text-primary-400"
            title="Refresh posts"
          >
            <RefreshIcon className="w-4 h-4 stroke-gray-600 dark:stroke-gray-400 group-hover:stroke-primary-500 dark:group-hover:stroke-primary-400" />
            Refresh
          </button>
        )}
      </div>
      <ul className="flex flex-col mt-4 dark:bg-dark-400 bg-gray-100 rounded-xl divide-y divide-gray-200 dark:divide-gray-700">
        <Suspense fallback={<PostsSkeleton />}>
          <PostsList
            reloadTrigger={refreshKey}
            showLatestPost={showLatestPost}
          />
        </Suspense>
      </ul>
    </div>
  );
}

function LatestPostSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 dark:bg-dark-400 bg-gray-100 rounded-xl p-4 w-full">
      {/* Image skeleton takes up 3/4 of width on sm+ screens, full width on mobile */}
      <div className="w-full sm:w-3/4 h-48 sm:h-64 rounded-2xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
      {/* Text skeleton takes up remaining 1/4 of width on sm+ screens, full width on mobile */}
      <div className="flex flex-col justify-between w-full sm:w-1/4 py-2">
        <div className="w-3/4 h-6 bg-gray-200 dark:bg-gray-700 rounded-full mb-4 animate-pulse"></div>
        <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full mb-2 animate-pulse"></div>
        <div className="w-5/6 h-4 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
}

function LatestPost({ refreshKey }: { refreshKey: number }) {
  const latestPost = useFeaturedPost({ reloadTrigger: refreshKey });

  return (
    <Link
      to={`/blog/${latestPost?.metadata.slug}`}
      state={{ post: latestPost }}
      className="flex flex-col sm:flex-row gap-4 dark:bg-dark-400 bg-gray-100 rounded-xl p-4 justify-center items-center sm:items-start"
    >
      <img
        src={latestPost?.metadata.image || "/assets/blog_post_placeholder.webp"}
        alt="Latest Post"
        className="w-full sm:w-3/4 h-full object-cover rounded-2xl"
      />
      <div className="flex flex-col justify-between w-full sm:w-1/4 py-2">
        <p className="text-lg sm:text-2xl text-gray-500 dark:text-gray-400 mt-4 w-full text-left">
          {latestPost?.metadata.title}
        </p>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-4 w-full text-left">
          {extractPlainText(latestPost?.content || "", 100)}
        </p>
      </div>
    </Link>
  );
}
