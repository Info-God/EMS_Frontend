import toast from "react-hot-toast";
import { useLogout } from "../../hook/useLogout";
import { LogOut } from "lucide-react";

export const LogoutBtn = () => {
    const { logout, loading, error } = useLogout();
    
    //->console.log("logout", error)
    if (error) {
        toast.error(error)
    }
    const handleLogout = async () => {
        logout();
    };

    return (
        <button
            onClick={handleLogout}
            disabled={loading}
            className="text-red-600 font-medium flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full"
        >
            <LogOut size={20} />
            {loading ? "Processing…" : "Logout"}
        </button>
    );
};
