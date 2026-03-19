import { useAppSelector } from "../../lib/store/store";
import { MenuIcon } from "lucide-react";

function Header({ toggleSidebar }: { toggleSidebar: (arg: boolean) => void }) {
  const { active } = useAppSelector((state) => state.journal);
  const { user } = useAppSelector((state) => state.user);
  return (
    <header className="w-full max-w-screen bg-white px-4 py-4 flex items-center justify-between shadow-sm rounded-md ">
      {/* Left Section */}
      <div className="flex lg:flex-col items-center lg:items-start">
        <button onClick={() => toggleSidebar(true)} className="_menu lg:hidden mr-5"><MenuIcon className="w-8 h-6" /></button>
        <div>
          <h1 className="md:text-lg font-semibold text-gray-600 text-wrap w-3/4 sm:w-auto">
            {active?.fullName ?? "Journal Platform"}
          </h1>
          <p className="text-gray-500 lg:mt-2 hidden md:block">
            ISSN: {active?.eissn} — An International Scholarly Open Access Journal, Peer-reviewed,
            Refereed Journal. DOI: <span className="text-gray-500 font-medium">10.59256/{active?.code}</span>
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Profile Image */}
        <img
          // src={user?.avatar??"https://cdn-icons-png.flaticon.com/512/4140/4140037.png"}
          src={"https://cdn-icons-png.flaticon.com/512/4140/4140037.png"}
          alt="Profile"
          className="min-w-10 min-h-10 max-w-10 max-h-10 rounded-full object-cover block"
        />
        <div className="hidden md:flex flex-col text-right ">
          <span className="font-medium text-gray-800">{user?.name}</span>
          <span className="text-sm text-gray-500">Author</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
