import { MessageSquare } from "lucide-react";
import { useAppSelector } from "../../lib/store/store";
import { Link } from "react-router-dom";

export default function NotesComments() {
  const { article } = useAppSelector((state) => state.article);
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 w-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="text-gray-600" size={22} />
        <h2 className="text-gray-800 font-semibold text-lg">Notes & Comments</h2>
      </div>

      {/* Content Area */}
      <div className="flex flex-col space-y-4 pt-6">
        {/* {article?.notes?<>
          <MessageSquare className="text-gray-300" size={40} />
          <p className="text-gray-500 mt-4 text-sm">
            No notes or comments available
          </p>
        </>:
          <p className="text-gray-500 mt-4 text-sm">
            { article?.notes }
          </p>
          } */}
        <h2 className="text-xl font-semibold">Published Article Details  :</h2>
        <h3 className="text-lg font-semibold">{article?.journal_short_form} Journal Link : <Link target="_blank" to={article?.notes ?? ""} className="text-blue-500 hover:text-blue-600">click here</Link></h3>
        <h3 className="text-lg font-semibold">
          DOI Link(Please check after 4-5 days) : <Link target="_blank" to={article?.doi_link ?? ""} className="text-blue-500 hover:text-blue-600">click here</Link>
        </h3>
        <div className="text-lg font-semibold">
        {/* <article className="text-gray-500 mt-4 text-sm" dangerouslySetInnerHTML={{ __html: article?.notes || 'No notes or comments available' }}></article> */}
        </div >
      </div>
    </div >
  );
}
