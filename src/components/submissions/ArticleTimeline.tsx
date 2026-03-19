import React from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import { useAppSelector } from '../../lib/store/store';

interface TimelineEvent {
  label: string;
  date: string | null;
  time: string | null;
  status: "completed" | "pending";
  icon: 'clock' | 'check';
}


const ArticleTimeline: React.FC = () => {
  const { article, acceptances } = useAppSelector((state) => state.article);

  const events: TimelineEvent[] = [
    {
      label: 'Received on',
      date: article?.created_at ? article?.created_at.split(" ")[0] : "N/A",
      time: article?.created_at ? article?.created_at.split(" ")[1] : "N/A",
      status: article?.created_at ? 'completed' : "pending",
      icon: 'clock'
    },
    {
      label: 'Updated on',
      date: article?.updated_at ? article?.updated_at.split(" ")[0] : "N/A",
      time: article?.updated_at ? article?.updated_at.split(" ")[1] : "N/A",
      status: article?.updated_at ? 'completed' : "pending",
      icon: 'check'
    },
    {
      label: 'Accepted on',
      date: acceptances[0] ? acceptances[0].accepted_on.split(" ")[0] : "N/A",
      time: acceptances[0] ? acceptances[0].accepted_on.split(" ")[1] : "N/A",
      status: acceptances[0] !== undefined ? acceptances[0].status === "Accepted" ? 'completed' : "pending" : "pending",
      icon: 'clock'
    },
    {
      label: 'Published on',
      date: acceptances[0] ? acceptances[0].published_on.split(" ")[0] : "N/A",
      time: acceptances[0] ? acceptances[0].published_on.split(" ")[1] : "N/A",
      status: acceptances[0] !== undefined ? acceptances[0].status === "Accepted" ? 'completed' : "pending" : "pending",
      icon: 'clock'
    }
  ];
  //->console.log(events)
  const getCardStyles = (status: string) => {
    if (status == 'completed') {
      return 'bg-blue-50 border-blue-100';
    }
    return 'bg-gray-50 border-gray-200';
  };

  const getIconColor = (icon: string, status: string) => {
    if (icon === 'check' && status === 'completed') {
      return 'text-green-500';
    }
    if (status === 'completed') {
      return 'text-blue-500';
    }
    return 'text-gray-400';
  };

  //   const getIconBgColor = (icon: string, status: string) => {
  //     if (icon === 'check' && status === 'completed') {
  //       return 'bg-green-50';
  //     }
  //     return '';
  //   };

  return (
    <div className=" p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-6 h-6 text-purple-600" />
        <h2 className="text-xl font-semibold text-gray-900">Article Timeline</h2>
      </div>

      {/* Timeline Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {events.map((event, index) => (
          <div
            key={index}
            className={`rounded-lg border p-5 ${getCardStyles(event.status)}`}
          >
            {/* Label with Icon */}
            <div className="flex items-center gap-2 mb-3">
              {event.icon === 'check' ? (
                <CheckCircle className={`w-5 h-5 ${getIconColor(event.icon, event.status)}`} />
              ) : (
                <Clock className={`w-5 h-5 ${getIconColor(event.icon, event.status)}`} />
              )}
              <span className="text-sm font-medium text-gray-700">{event.label}</span>
            </div>

            {/* Date and Time */}
            {event.status === "completed" && event.date ? (
              <>
                <div className="text-gray-900 font-semibold mb-1">{event.date}</div>
                {event.time && <div className="text-sm text-gray-500">{event.time}</div>}
              </>
            ) : (
              <div className="text-gray-400 font-medium">Pending</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticleTimeline;