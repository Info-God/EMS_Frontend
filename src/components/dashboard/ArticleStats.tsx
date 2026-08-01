import { FileText, Clock, CheckCircle2, FileSignature } from "lucide-react";
import { useAppSelector } from "../../lib/store/store";
import type { DashboardResponse } from "../../types";
import { useEffect, useState } from "react";
import LoadingScreen from "../ui/LoadingScreen";

export default function ArticleStats() {
  const [DashboardData, setDashboardData] = useState<DashboardResponse>();
  const stats = [
    {
      label: "Submitted Articles",
      value: DashboardData?.counts?.approve || 0,
      icon: <FileText className="text-purple-600" size={28} />,
      border: "",
    },
    {
      label: "Pending Articles",
      value: DashboardData?.counts?.pending || 0,
      icon: <Clock className="text-yellow-500" size={28} />,
      border: "border-transparent",
    },
    {
      label: "Accepted Articles",
      value: DashboardData?.counts?.accepted || 0,
      icon: <CheckCircle2 className="text-green-500" size={28} />,
      border: "border-transparent",
    },
    {
      label: "Published Articles",
      value: DashboardData?.counts?.published || 0,
      icon: <FileSignature className="text-purple-500" size={28} />,
      border: "border-transparent",
    },
  ];
  const { data } = useAppSelector((state) => state.dashboard);
  
  useEffect(() => {
      if (data) {
        setDashboardData(data);
      }
    }, [data])

  if (!DashboardData) {
    return <LoadingScreen  title="Dashboard" />;
  }

  return (
    <div className="hidden md:grid grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`flex justify-between items-center bg-white p-5 py-7 rounded-lg shadow-sm min-w-[230px] ${stat.border}`}
        >
          <div>
            <h3 className="text-gray-600 text-base font-medium">
              {stat.label}
            </h3>
            <p className="text-2xl font-semibold mt-2">{stat.value}</p>
          </div>
          <div className="bg-gray-100 p-3 rounded-lg">{stat.icon}</div>
        </div>
      ))}
    </div>
  );
}
