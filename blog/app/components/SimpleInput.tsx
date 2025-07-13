export const SimpleInput = () => {
  return (
    <div className="flex flex-row items-center w-full gap-2 border border-gray-300 dark:border-gray-700 rounded-full bg-white dark:bg-dark-500 p-1 mx-4 justify-between mt-4 focus-within:border-primary-500">
      <input
        type="text"
        placeholder="Search"
        className="w-full outline-none bg-transparent px-4"
      />
      <button className="bg-primary-500 dark:bg-primary-600 text-white rounded-full px-6 py-2">
        Subscribe
      </button>
    </div>
  );
};
