import {
  LayoutGrid,
  ClipboardList,
  FileText,
  Check,
  MessageSquare,
  Copyright,
  CreditCard,
  Flag,
  ChevronLeft,
  ChevronRight,
  Info,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../lib/store/store";
import { useRef, useState, useEffect } from "react";
import { OnboardingCard } from "../onboardcards/OnboardingCards";
// import { setBackground } from "../../lib/store/features/globle";

export default function SubmitssionViewNavigation() {
  const { article } = useAppSelector((state) => state.article);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftBtn, setShowLeftBtn] = useState(false);
  const [showRightBtn, setShowRightBtn] = useState(false);
  // const dispatch = useAppDispatch()
  const steps = [
    {
      id: 4,
      style: "-left-28 md:-left-10 top-4 sm:top-12 h-fit",
      description: <div className="space-y-4">
        <h2 className="font-semibold text-lg">Provides complete manuscript and journal information.</h2>
        <div>
          <h3 className="font-semibold text-xl text-gray-800">Includes:</h3>
          <ul className="pt-3 list-disc list-inside ml-2">
            <li>Journal Details</li>
            <li>Article Information</li>
            <li>Processing Information</li>
            <li>Type of Article</li>
            <li>Mode of Processing (Normal/ Fast/ Express Track, etc.)</li>
          </ul>
        </div>
      </div>,
      link: `/dashboard/submissions/${article?.id}/view`,
      label: "Details",
      icon: LayoutGrid
    },
    {
      id: 5,
      style: "-left-28 md:left-30 top-4 sm:top-12 h-fit",
      description: <div className="space-y-4">
        <h2 className="font-semibold text-lg">Displays the real-time editorial progress.</h2>
        <div>
          <h3 className="font-semibold text-xl text-gray-800">Workflow Stages:</h3>
          <ol className="list-disc list-inside pt-3 ">
            <li>Editorial Check</li>
            <li>Plagiarism Check</li>
            <li>Peer Review</li>
            <li>Acceptance</li>
            <li>Proofreading</li>
            <li>Layout Editing</li>
            <li>Galley Correction</li>
            <li>Publishing</li>
          </ol>
        </div>
      </div>,
      link: `/dashboard/submissions/${article?.id}/tasks`,
      label: "Tasks",
      icon: ClipboardList
    },
    {
      id: 6,
      style: "-left-28 md:left-50 top-4 sm:top-12 h-fit",
      description: <div className="space-y-4">
        <h2 className="font-semibold text-lg">Central repository for all article-related documents.</h2>
        <div>
          <h3 className="font-semibold text-xl text-gray-800">Includes:</h3>
          <ul className="pt-3 list-disc list-inside ml-2">
            <li>Initially Submitted Manuscript</li>
            <li>Plagiarism Report</li>
            <li>Certificates downloads (All authors)</li>
            <li>Published Article (Final PDF)</li>
          </ul>
        </div>
      </div>,
      link: `/dashboard/submissions/${article?.id}/files`,
      label: "Files",
      icon: FileText
    },
    {
      id: 7,
      style: "-left-28 md:left-70 top-4 sm:top-12 h-fit",
      description: <div className="space-y-4">
        <h2 className="font-semibold text-lg">Review monitoring and transparency.</h2>
        <div>
          <h3 className="font-semibold text-xl text-gray-800">Includes:</h3>
          <ul className="pt-3 list-disc list-inside ml-2">
            <li>Review Status</li>
            <li>Reviewer Comments / Review Reports</li>
          </ul>
        </div>
      </div>,
      link: `/dashboard/submissions/${article?.id}/review`,
      label: "Review",
      icon: Check
    },
    {
      id: 8,
      style: "-left-28 md:left-90 top-4 sm:top-12 h-fit",
      description: <div className="space-y-4">
        <h2 className="font-semibold text-lg">Official acceptance communication.</h2>
        <div>
          <h3 className="font-semibold text-xl text-gray-800">Includes:</h3>
          <ul className="pt-3 list-disc list-inside ml-2">
            <li>Acceptance Status</li>
            <li>Tentative Publication Date</li>
            <li>Acceptance Letter (Generated after author updates profile details)</li>
          </ul>
        </div>
      </div>,
      link: `/dashboard/submissions/${article?.id}/acceptance`,
      label: "Acceptance",
      icon: MessageSquare
    },
    {
      id: 9,
      style: "md:right-10 top-4 sm:top-12 h-fit",
      description: <div className="">
        <h2 className="font-semibold text-lg text-gray-800">Copyright compliance.</h2>
        <ul className="pt-3 list-disc list-inside ml-2">
          <li>Enabled after acceptance</li>
          <li>Download copyright form</li>
          <li>Author must update profile details to generate the form</li>
          <li>Upload manually signed copyright form</li>
        </ul>
      </div>,
      link: `/dashboard/submissions/${article?.id}/copyrights`,
      label: "Copyrights",
      icon: Copyright
    },
    {
      id: 10,
      style: " md:right-10 top-4 sm:top-12 h-fit",
      description: <div className="">
        <h2 className="font-semibold text-lg text-gray-800">Article Processing Charge (APC) handling.</h2>
        <ul className="pt-3 list-disc list-inside ml-2">
          <li>Enabled after acceptance</li>
          <li className="font-semibold text-gray-800">APC payment options:
            <ul className=" list-disc list-inside ml-4 text-gray-600 font-normal">
              <li>Indian Authors</li>
              <li>Non-Indian Authors</li>
            </ul>
          </li>
        </ul>
      </div>,
      link: `/dashboard/submissions/${article?.id}/payment`,
      label: "Payment",
      icon: CreditCard
    },
    {
      id: 11,
      style: " md:right-10 top-4 sm:top-12 h-fit",
      description: <div className="space-y-4">
        <h2 className="font-semibold text-lg">Final step before publication.</h2>
        <p className="text-lg"><span className="font-semibold text-xl text-gray-800">Timeline:</span> Must be completed within one week of acceptance</p>
        <div>
          <h3 className="font-semibold text-xl text-gray-800">Author must upload:</h3>
          <ol className="list-decimal list-inside ml-2 pt-2">
            <li>Final Manuscript (as per journal format)</li>
            <li>Signed Copyright Form</li>
            <li>Article Processing Fee Receipt
              <ul className="pt-3 list-disc list-inside ml-4">
                <li>With DOI / Without DOI (as applicable)</li>
              </ul>
            </li>
          </ol>
        </div>
        <p className="text-lg">After successful verification, the article proceeds to publication.</p>
      </div>,
      link: `/dashboard/submissions/${article?.id}/final-submission`,
      label: "Final Submission",
      icon: Flag
    },
  ];

  const { pathname } = useLocation();
  const review = useAppSelector((state) => state.article.acceptances);
  const navigate = useNavigate();
  const { tutorialStep, background } = useAppSelector(s => s.global)


  const visibleSteps = review.length > 0 ? steps : steps.slice(0, 4);

  // Check scroll position to show/hide buttons
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftBtn(scrollLeft > 0);
      setShowRightBtn(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
      return () => {
        container.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [visibleSteps]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const activeEl = document.querySelector(
      ".submission-btn"
    ) as HTMLElement | null;

    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [pathname, tutorialStep, visibleSteps.length]);


  return (
    <>
      {article && tutorialStep >= 4 && tutorialStep <= 11 &&
        <OnboardingCard
          icon={Info}
          title={steps[tutorialStep - 4].label}
          description={steps[tutorialStep - 4].description}
          iconBg='bg-teal-100'
          BgColor='bg-white'
          iconColor='text-amber-600'
          dotColors={['bg-blue-400', 'bg-(--journal-600)']}
          showTags={false}
          position={steps[tutorialStep - 4].style}
          nextTag={tutorialStep !== 11}
          finish={tutorialStep === 11}
          skip={true}
        />
      }
      <div className="relative w-full h-24 md:h-auto">
        {/* Left Scroll Button - Only on Mobile */}
        {showLeftBtn && (
          <button
            onClick={() => scroll("left")}
            className="leftBtn md:hidden absolute left-0 -bottom-4 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-100 transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} className="text-gray-700" />
          </button>
        )}

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="max-w-screen overflow-x-auto scrollbar-hide"
        >
          <div className="w-full flex justify-start gap-3 bg-transparent min-w-max md:min-w-0">
            {visibleSteps.map(({ id, link, label, icon: Icon }) => {
              const isActive = pathname === link;

              return (
                <button
                  key={label}
                  onClick={() => navigate(link)}
                  className={`${tutorialStep === id ? "submission-btn" : ""} flex items-center justify-center gap-2 px-6 py-4 w-fit rounded-xl border transition-all duration-200 font-medium text-sm max-h-14
              ${isActive && !background
                      ? "bg-(--journal-600) text-white border-(--journal-600)"
                      : "text-(--journal-600) bg-white border-blue-200 hover:bg-blue-50"
                    }  ${background && tutorialStep === id ? "relative z-9999 bg-white text-(--journal-600) border-(--journal-600)" : ""}`}
                >
                  <Icon size={18} className={isActive && !background ? "text-white" : "text-(--journal-600)"} />
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Scroll Button - Only on Mobile */}
        {showRightBtn && (
          <button
            onClick={() => scroll("right")}
            className="rightBtn md:hidden absolute right-7 -bottom-4 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-100 transition-all"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} className="text-gray-700" />
          </button>
        )}

        {/* Hide scrollbar with CSS */}
        <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      </div>
    </>

  );
}