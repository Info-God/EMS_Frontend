import Header from '../ui/Header'
import Sidebar from '../ui/Sidebar'
import InfoBar from '../ui/InfoBar'
import { Outlet, useLocation } from 'react-router-dom'
import { useDashboard } from '../../hook/useDashboardData';
import { useEffect, useRef, useState } from 'react';
import LoadingScreen from '../ui/LoadingScreen';
// import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../../lib/store/store';
import { useLogout } from '../../hook/useLogout';
import { setRefetchContent } from '../../lib/store/features/globle';
import DefaultScreen from '../ui/DefalutScreen';

function DashboardLayout() {
  const [toggleSidebar, setToggleSidebar] = useState<boolean>(false)
  const { garbageClear, loading:logout_loading } = useLogout()
  const dispatch = useAppDispatch(); 
  const { pathname } = useLocation();
  const { fetchDashboard, loading, error, data } = useDashboard()
  // const { isAuthenticated } = useAppSelector(s => s.auth)
  const { refetch } = useAppSelector(s => s.global)
  // const { data: Dashboard_Data } = useAppSelector(s => s.dashboard)
  // const { data: submission_list } = useAppSelector(s => s.submissionList)
  const token = localStorage.getItem("token");
  const { background } = useAppSelector(s => s.global)
  const outletSection = useRef<HTMLDivElement>(null)
  

  useEffect(() => {
    const scrollToTop = () => {
      if (outletSection.current) {
        outletSection.current.scrollIntoView();
      }
    };
    scrollToTop()
  }, [pathname]);


  useEffect(() => {
    if (!token) {
      // toast.error("Unauthenticated.");
      garbageClear()
    }
  }, [garbageClear, token]);

  // useEffect(() => {
  //   if (Dashboard_Data.status) {
  //     //->console.log("data exist")
  //     return
  //   }
  //   fetchDashboard();
  //   //->console.log("refetching")
  // }, [fetchDashboard, submission_list?.data?.data?.length, Dashboard_Data, isAuthenticated]);

  // refetiing if new submission is added
  useEffect(() => {
    if (pathname==="/dashboard/" || pathname==="/dashboard") {
      //->console.log("match")
      fetchDashboard();
      dispatch(setRefetchContent(false));
    }
  }, [refetch, fetchDashboard, dispatch, pathname]);


  const hideInfoBar =
    pathname.startsWith("/dashboard/acceptances") ||
    pathname.startsWith("/dashboard/new-submission") ||
    pathname.startsWith("/dashboard/edit-submission") ||
    pathname.startsWith("/dashboard/submissions/view") ||
    pathname.startsWith("/dashboard/submissions/tasks") ||
    pathname.startsWith("/dashboard/submissions/files") ||
    pathname.startsWith("/dashboard/submissions/review") ||
    pathname.startsWith("/dashboard/submissions/acceptance") ||
    pathname.startsWith("/dashboard/submissions/copyrights") ||
    pathname.startsWith("/dashboard/submissions/payment") ||
    pathname.startsWith("/dashboard/downloads") ||
    pathname.startsWith("/dashboard/profile") ||
    pathname.startsWith("/dashboard/article-information") ||
    pathname.startsWith("/dashboard/faq") ||
    pathname.startsWith("/dashboard/guidence-for-submission");
  if (logout_loading) {
    return <LoadingScreen title='User'/>
  }
  return (
    <section className="Dashboard w-screen h-screen flex overflow-x-hidden gap-3 bg-gray-200/70">
      <div className={`${background ? "h-screen w-screen bg-black/20 z-9990 top-0 left-0" : ""}  absolute `}>
      </div>
      <Sidebar toggleSidebar={setToggleSidebar} toggle={toggleSidebar} />
      <div ref={outletSection} id='mainContent' className="flex-1 flex flex-col text-sm relative">
        <Header toggleSidebar={setToggleSidebar} />
        <section className='relative h-full'>
          {
            loading ? <LoadingScreen title="Dashboard" /> :
              <>
                {
                  error && !data ? <DefaultScreen error="Unable to load data. Please check your connection and try again." /> :
                    <>
                      {!hideInfoBar && <InfoBar />}
                      {/* content is here */}
                      <main className="pr-4 px-4 lg:px-0">
                        <Outlet />
                      </main>
                    </>
                }
              </>
          }
        </section>
      </div>
    </section>
  );
}

export default DashboardLayout;
