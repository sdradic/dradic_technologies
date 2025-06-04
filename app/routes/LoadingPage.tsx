export default function LoadingPage() {
  return (
    <div className="flex flex-col justify-center items-center h-screen inverse-gradient-background gap-4">
      <div className="text-4xl font-bold text-center">
        <span className="text-primary-800">Dradic</span> <br />{" "}
        <span className="text-primary-600">Technologies</span>
      </div>
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-900"></div>
    </div>
  );
}
