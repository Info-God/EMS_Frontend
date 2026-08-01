import { Outlet, useNavigate } from "react-router-dom";
import DownloadNavigation from "../download/DownloadNavigation";
import { useEffect } from "react";
import LoadingScreen from "../ui/LoadingScreen";
import { useDownloadsFiles } from "../../hook/useDownloads";
import toast from "react-hot-toast";

export default function DownloadLayout() {
    const { fetchDownloadsFiles, data, loading, error } = useDownloadsFiles()
    const navigate = useNavigate()
    useEffect(() => {
        fetchDownloadsFiles()
    }, [fetchDownloadsFiles])
    if (error) {
        toast.error(error)
        navigate("/dashboard/")
    }
    return (
        <div className="Download_layout mt-8 space-y-8 lg:px-4 pb-8 relative h-full">
            {loading && <LoadingScreen title="Downloads" />}
            <div className="space-y-4">
                {/* <h2 className="text-lg text-gray-600 font-semibold"><span className="text-(--journal-500)">IJIRE-000050</span> In the current work an endeavor has been made to concentrate</h2> */}
                <DownloadNavigation />
            </div>
            {data && <Outlet context={{ data }} />}
        </div>
    )
}
