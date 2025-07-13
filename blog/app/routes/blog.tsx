export default function Blog() {
  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4">
      <h1 className="text-4xl font-semibold text-center mt-4">Blog</h1>
      <div className="flex flex-col mt-4">
        <h2 className="text-xl font-semibold">Latest Posts</h2>
        <ul className="flex flex-col mt-4">
          <li>Post 1</li>
          <li>Post 2</li>
          <li>Post 3</li>
        </ul>
      </div>
    </div>
  );
}
