import { useNavigate } from "react-router";

export const Logo = () => {
  const navigate = useNavigate();

  return (
    <div
      className="text-2xl font-black tracking-tighter cursor-pointer flex items-center gap-2 group"
      onClick={() => navigate("/")}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate("/");
        }
      }}
      tabIndex={0}
      role="button"
      aria-label="Navigate to home page"
    >
      <div className="bg-brand-600 text-white p-1 rounded group-hover:scale-110 transition-transform">
        DR
      </div>
      <span className="dark:text-white text-slate-900 uppercase">Dradic</span>
      <span className="text-brand-600 uppercase">Tech</span>
    </div>
  );
};
