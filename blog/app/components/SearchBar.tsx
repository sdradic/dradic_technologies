import { SearchIcon } from "./Icons";

export const SearchBar = () => {
  return (
    <div className="flex flex-row items-center w-full gap-2 border border-gray-300 rounded-full bg-gray-100 dark:bg-dark-500 p-2 mx-4 justify-between px-4 mt-4 focus-within:border-primary-500">
      <input
        type="text"
        placeholder="Search"
        className="w-full outline-none bg-transparent"
      />
      <button>
        <SearchIcon className="w-4 h-4" />
      </button>
    </div>
  );
};
