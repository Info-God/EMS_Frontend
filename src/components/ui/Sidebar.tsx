import {
  LayoutDashboard,
  FileText,
  CheckCircle,
  Download,
  ListChecks,
  HelpCircle,
  User,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { LogoutBtn } from "./Logout";


const menuItems = [
  { link: "", name: "Dashboard", icon: <LayoutDashboard size={20} /> },
  { link: "submissions", name: "Submissions", icon: <FileText size={20} /> },
  { link: "acceptances", name: "Acceptances", icon: <CheckCircle size={20} /> },
  { link: "downloads", name: "Downloads", icon: <Download size={20} /> },
  { link: "guidence-for-submission", name: "Guidelines", icon: <ListChecks size={20} /> },
  { link: "faq", name: "FAQ’S", icon: <HelpCircle size={20} /> },
  { link: "profile", name: "Profile", icon: <User size={20} /> },
];

function Sidebar({ toggleSidebar, toggle }: { toggleSidebar: (trigger: boolean) => void, toggle: boolean }) {
  return (
    <aside className={`w-full md:max-w-72 lg:w-64 bg-white min-h-screen flex flex-col items-start py-8 px-4 shadow-sm absolute z-9999 lg:sticky top-0 ${toggle ? "translate-x-0" : "-translate-x-full"} lg:translate-0 transition-all`}>

      <div className="flex items-center justify-between md:justify-center w-full">
        <i><img src="/logo1.png" alt="fdrp logo" className="mx-auto w-full max-w-64" /></i>
        <button className="_close lg:hidden" onClick={() => toggleSidebar(false)}><X /></button>
      </div>
      <nav className="flex flex-col gap-2 w-full mt-8">
        {menuItems.map((item, i) => (
          <NavLink
            key={i}
            onClick={() => toggleSidebar(false)}
            to={`/dashboard/${item.link}`}
            end={item.link === ""} // important for correct active state
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full ${isActive
                ? `bg-(--journal-500) text-white shadow-sm`
                : `text-gray-800 hover:bg-(--journal-500) hover:text-white`
              }`
            }
          >
            {item.icon}
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
        <LogoutBtn />
      </nav>
    </aside>
  );
};

export default Sidebar;
