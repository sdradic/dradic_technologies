import { useAuth } from "../contexts/AuthContext";

export function UserProfile({ isCollapsed }: { isCollapsed: boolean }) {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="flex flex-col items-start p-4">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full bg-white border border-gray-200 dark:border-gray-700 dark:bg-gray-700 flex items-center justify-center">
          <span className="text-sm  dark:text-white">
            {user.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div
          className={`flex-1 transition-all duration-200 text-left ${
            isCollapsed ? "opacity-0" : "opacity-100"
          }`}
        >
          <p className="text-sm  text-gray-800 dark:text-white">{user.name}</p>
          <p className="text-xs text-gray-400 dark:text-gray-400">
            {user.email}
          </p>
        </div>
      </div>
    </div>
  );
}
