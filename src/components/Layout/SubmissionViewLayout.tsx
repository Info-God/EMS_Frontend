import { Outlet, useNavigate, useParams } from "react-router-dom";
import SubmitssionViewNavigation from "../submissions/SubmitssionViewNavigation";
import { useArticleDetails } from "../../hook/useArticleDetails";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../lib/store/store";
import { setActivePaperId } from "../../lib/store/features/globle";
import toast from "react-hot-toast";
import LoadingScreen from "../ui/LoadingScreen";

export default function SubmissionViewLayout() {
  const { fetchArticleDetails, data, loading } = useArticleDetails();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { activePaperId } = useAppSelector((state) => state.global);

  useEffect(() => {
    if (!id) {
      toast.error("Invalid submission ID");
      navigate("/dashboard/submissions");
      return;
    }

    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      toast.error("Invalid submission ID");
      navigate("/dashboard/submissions");
      return;
    }

    // Sync Redux with URL
    if (activePaperId !== numericId) {
      dispatch(setActivePaperId(numericId));
      fetchArticleDetails(id);
      return;
    }

    // Fetch only when data is missing
    if (!data) {
      fetchArticleDetails(id);
    }
  }, [id, activePaperId, data, dispatch, fetchArticleDetails, navigate]);

  
  return (
    <div className="mt-8 lg:mt-0 space-y-3 sm:space-y-8 pb-8 lg:pr-4 relative overflow-x-hidden">
      {loading && <LoadingScreen title="Paper" />}

      <div className="max-w-screen overflow-x-auto">
        <SubmitssionViewNavigation />
      </div>

      <div className="max-w-screen pr-4 sm:pr-0">
        <Outlet />
      </div>
    </div>
  );
}
