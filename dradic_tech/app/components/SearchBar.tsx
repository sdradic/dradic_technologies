import { SearchIcon } from "./Icons";

export const SearchBar = ({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}) => {
  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex flex-row items-center w-full gap-2 border border-gray-300 dark:border-gray-700 rounded-full bg-white dark:bg-dark-500 py-2 px-4 justify-between focus-within:border-primary-500">
        <input
          type="text"
          placeholder="Search for a post..."
          className="w-full outline-none bg-transparent"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button>
          <SearchIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
