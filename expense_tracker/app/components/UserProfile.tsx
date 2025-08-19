import { useAuth } from "../contexts/AuthContext";

export function UserProfile({ isCollapsed }: { isCollapsed: boolean }) {
  const { user } = useAuth();
  if (!user) return null;
  const userName = user.name.split(" ")[0];

  return (
    <div className="flex flex-col items-start p-4">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full bg-white border border-gray-200 dark:border-gray-700 dark:bg-gray-700 flex items-center justify-center">
          <span className="text-sm  dark:text-white">
            {userName.charAt(0).toUpperCase()}
          </span>
        </div>
        <div
          className={`flex-1 transition-all duration-200 text-left ${
            isCollapsed ? "opacity-0" : "opacity-100"
          }`}
        >
          <p className="text-sm  text-gray-800 dark:text-white">
            {userName}
            {user.isLoading && userName && (
              <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            )}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-400">
            {user.isLoading && !userName ? "Loading profile..." : user.email}
          </p>
        </div>
      </div>
    </div>
  );
}
