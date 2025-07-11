export default function Footer() {
  return (
    <div className="w-full bg-transparent">
      <div className="max-w-[1000px] mx-auto">
        <footer className="text-center py-2 text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Dradic Technologies. All rights
          reserved.
        </footer>
      </div>
    </div>
  );
}
