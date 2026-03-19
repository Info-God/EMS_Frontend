import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../lib/store/store";
import { OnboardingCard } from "../onboardcards/OnboardingCards";
import { Rocket } from "lucide-react";

function InfoBar() {
  const navigate = useNavigate();
  const { journalShortWithId, article } = useAppSelector((s) => s.article);
  const { pathname } = useLocation();
  const { tutorialStep } = useAppSelector(s => s.global)
  



  // Routes where article context should be shown
  const articleContextRoutes = [
    "view",
    "tasks",
    "files",
    "review",
    "acceptance",
    "copyrights",
    "payment",
    "final-submission",
  ];

  const isArticleContext = articleContextRoutes.some((segment) =>
    pathname.includes(segment)
  );

  const title = isArticleContext
    ? null
    : pathname.includes("submissions")
      ? "Submission List"
      : "Dashboard";

  const handleNewSubmission = () => {
    navigate("/dashboard/new-submission");
  };

  return (
    <div className="pt-6 sm:py-6 px-4 flex flex-wrap items-center justify-between">
      {/* LEFT SECTION */}
      {isArticleContext ? (
        <div>
          <h2 className="text-lg text-gray-600 font-semibold space-x-5">
            Paper ID:
            <span className="text-(--journal-500) pl-3">{journalShortWithId}</span>
            Title:
            <span className="text-(--journal-500) pl-3">{article?.title}</span>
          </h2>
        </div>

      ) : (
        <>
          <h1 className="text-3xl font-semibold">{title}</h1>
          {/* RIGHT ACTIONS */}
          <div className="grid grid-cols-2 w-full sm:w-auto sm:flex gap-4 justify-end pr-6 pt-6 lg:pt-0 lg:pr-0 relative">
            <button
              onClick={() => navigate("/dashboard/guidence-for-submission")}
              className="cursor-pointer py-3 rounded-md px-4 border border-(--journal-500) shadow-md text-(--journal-500) hover:bg-(--journal-500) hover:text-white"
            >
              Submission Guideline
            </button>

            <button
              onClick={handleNewSubmission}
              className="cursor-pointer py-3 rounded-md px-4 border border-(--journal-500) shadow-md bg-(--journal-500) text-white animate-pulse hover:border-(--journal-600)"
            >
              New Submission
            </button>

            {/* onboard card */}
            {
              tutorialStep===1 &&
              <OnboardingCard icon={Rocket}
                title='Start Your Submission'
                description='Submit your article for review and publication.'
                iconBg='bg-teal-100'
                BgColor="bg-teal-50"
                iconColor='text-teal-500'
                dotColors={['bg-teal-400', 'bg-teal-300', 'bg-teal-500']}
                showTags={true}
                position="top-10 sm:top-16 lg:top-10 -left-30 sm:-left-53"
              />
            }
          </div>
        </>
      )}
    </div>
  );
}

export default InfoBar;
