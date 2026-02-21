import { SearchIcon } from "./Icons";

export const SearchBar = ({
  searchQuery,
  setSearchQuery,
  placeholder,
}: {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  placeholder: string;
}) => {
  return (
    <div className="px-2 py-4">
      <div className="flex flex-row items-center w-full gap-2 border border-slate-200 dark:border-slate-700 rounded-full bg-white dark:bg-slate-900 py-2 px-4 justify-between focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500">
        <input
          type="text"
          placeholder={placeholder}
          className="w-full outline-none bg-transparent text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button>
          <SearchIcon className="w-4 h-4 stroke-slate-500 dark:stroke-slate-400" />
        </button>
      </div>
    </div>
  );
};
