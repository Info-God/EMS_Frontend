import {
  ClipboardList,
  FileText,
  Copyright,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const steps = [
  { link: "/dashboard/downloads/", label: "Article", icon: FileText },
  { link: "/dashboard/downloads/manuscript-files", label: "Manuscript Files", icon: ClipboardList },
  { link: "/dashboard/downloads/copyright-form", label: "Copy Right Form", icon: Copyright },
];

export default function SubmitssionViewNavigation() {
  const [active, setActive] = useState("Article");
  const navigation = useNavigate()
  const handleNavigation = (link: string) => {
    // Implement navigation logic here, e.g., using react-router's useNavigate
    navigation(link)
  }
  useEffect(() => {
    for (const i of steps) {
      if (location.pathname.endsWith(i.link)) {
        setActive(i.label)
      }
    }
  }, [])
  return (
    <div className="w-full max-w-screen flex flex-wrap justify-start gap-3 bg-transparent">
      {steps.map(({ link, label, icon: Icon }) => {
        const isActive = active === label;
        return (
          <button
            key={label}
            onClick={() => { setActive(label); handleNavigation(link) }}
            className={`flex items-center justify-center gap-2 px-6 py-4 w-fit rounded-xl border transition-all duration-200 font-medium text-sm 
              ${isActive
                ? "bg-(--journal-600) text-white border-(--journal-600)"
                : "text-(--journal-600) bg-white border-blue-200 hover:bg-blue-50"
              }`}
          >
            <Icon
              size={18}
              className={`${isActive ? "text-white" : "text-(--journal-600)"}`}
            />
            {label}
          </button>
        );
      })}
    </div>
  );
}
