import { AlertCircle, FileText, Clock, Check } from "lucide-react";
import { useAppSelector } from "../../lib/store/store";
import { useNavigate } from "react-router-dom";
import { useMarkNotificationAsRead } from "../../hook/useMarkNotificationAsRead";

function mapping(arg: string) {
  if (arg.includes("successfully")) {
    return [<Check />, "bg-green-100", "Completed", "bg-green-300"]
  }
  else if (arg.includes("available")) {
    return [<FileText />, "bg-yellow-100", "Active", "bg-yellow-300"]
  } else if ((arg.includes("pending"))) {
    return [<Clock />, "bg-red-100", "Pending", "bg-red-300"]
  } else {
    return [<AlertCircle />, "bg-gray-100", "Pending", "bg-gray-300"]
  }
}




export default function ActionRequired() {
  const { data } = useAppSelector(s => s.dashboard)
  const { user } = useAppSelector(s => s.user)
  const { markAsRead } = useMarkNotificationAsRead()
  const navigate = useNavigate()

  function redirectiNotification(msg: string, id: number, type:string) {
    if (msg.match("Acceptance letter is available")) {
      navigate(`/dashboard/submissions/${id}/acceptance`)
    }
    else if (msg.match("Article accepted successfully")) {
      navigate(`/dashboard/submissions/${id}/view`)
    }
    else if (msg.match("Please complete your profile address")) {
      navigate(`/dashboard/profile`)
    }
    if (user) {
      markAsRead({
        article_id: id,
        user_id: user.id,
        type: type
      })
    }
  }
  return (
    <div className="hidden lg:block bg-white rounded-2xl shadow-sm p-6 w-full max-w-sm mx-auto h-fit">
      <div className="flex items-center gap-2 mb-2">
        <AlertCircle className="text-orange-500" size={20} />
        <h2 className="text-gray-800 font-semibold text-lg">Action Required</h2>
      </div>
      <p className="text-gray-500 text-sm mb-5">
        Papers needing your attention
      </p>

      <div className="h-[600px] overflow-y-auto">
        <div className="space-y-4 ">
          {data && data.notifications.map((n, idx) => (
            <div
              key={idx}
              className={`${mapping(n.message)[1]}  rounded-xl p-4 flex justify-between items-start`}
            >
              <div>

                <div className="flex items-center gap-4 mb-2">
                  {/* icon */}
                  {mapping(n.message)[0]}
                  <p className={`px-2 py-1 ${mapping(n.message)[3]} font-medium text-sm rounded-full`}>
                    {/* status */}
                    {mapping(n.message)[2]}
                  </p>
                </div>
                <p className="text-gray-800 text-sm font-medium leading-snug">
                  {n.papername}

                </p>
                <p className="text-gray-500 text-sm mt-2">{n.message}</p>
                {/* <p className="text-gray-400 text-xs mt-1">{n.timeAgo}</p> */}
              </div>
              <button
                onClick={() => redirectiNotification(n.message, n.article_id, n.type)}
                className={`bg-(--journal-500) text-white text-sm font-medium px-3 py-1.5 rounded-md`}
              >
                View
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
