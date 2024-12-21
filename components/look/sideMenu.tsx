import Menu from "../icons/menu";
import Close from "../icons/close";
import SideList from "./sideMenuList";

interface SideMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  date: string | null;
  diaries: Diaries[];
  index: number | null;
}

type Diaries = {
  title: string;
};

export default function SideMenu({
  isOpen,
  setIsOpen,
  date,
  diaries,
  index,
}: SideMenuProps) {
  return (
    <div>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="z-30 p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
        aria-label="Toggle menu"
      >
        <Menu />
      </button>

      {/* Sliding Menu */}
      <div
        className={`fixed px-4 top-0 left-0 h-full w-[300px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-3 left-60 z-50 p-2 rounded-lg hover:bg-gray-100"
          aria-label="Toggle menu"
        >
          <Close />
        </button>
        <div className="mt-20">
          <SideList date={date} diaries={diaries} index={index} />
        </div>
      </div>
    </div>
  );
}
