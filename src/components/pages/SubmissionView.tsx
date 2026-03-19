import { Link } from "react-router-dom";
import { useAppSelector } from "../../lib/store/store";
import ArticleInformationDashboard from "../submissions/ArticleInformationDashboard";
import ArticleTimeline from "../submissions/ArticleTimeline";
import NotesComments from "../submissions/NotesComments";
import usePusherTaskUpdates from "../../hook/useGetState";

export default function SubmissionView() {
  const { error, article } = useAppSelector(s => s.article)
  usePusherTaskUpdates()
  if (error) {
    return <section className="detials_view flex flex-col items-center justify-center text-center h-96">
      <h2 className="text-4xl font-bold text-gray-400">{error}</h2>
      <Link to="/dashboard/submissions" className="text-(--journal-500) underline mt-3">Go Back</Link>
    </section>
  }
  return (
    <section className="detials_view space-y-8 pr-4 lg:pr-0">
      <ArticleInformationDashboard/>
      <ArticleTimeline/>
      {article?.doi_link || article?.notes ?  <NotesComments/> : null}
    </section>
  )
}
