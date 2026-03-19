import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Dashboard from './components/pages/Dashboard'
import DashboardLayout from './components/Layout/DashboardLayout'
import ArticleListTable from './components/submissions/ArticleListTable'
import ArticleSubmissionForm from './components/submissions/ArticleSubmissionForm'
import Accaptance from './components/accaptance/Accaptance'
import ArticleSubmissionInformation from './components/submissions/ArticleSubmissionInformation'
import SubmissionView from './components/pages/SubmissionView'
import SubmissionViewLayout from './components/Layout/SubmissionViewLayout'
import SubmissionTasks from './components/pages/SubmissionTasks'
import AuthLayout from './components/Layout/AuthLayout'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import ForgotPassword from './components/auth/ForgotPassword'
import SubmissionFiles from './components/pages/SubmissionFiles'
import SubmissionReview from './components/pages/SubmissionReview'
import SubmisstionAcceptance from './components/pages/SubmisstionAcceptance'
import SubmissionCopyright from './components/pages/SubmissionCopyright'
import SubmissionPayment from './components/pages/SubmissionPayment'
import SubmissionStatus from './components/pages/SubmissionStatus'
import DownloadLayout from './components/Layout/DownloadLayout'
import DownloadTable from './components/download/DownloadArticle'
import ProfileSettingForm from './components/pages/ProfileSettingForm'
import ArticleSubmissionEditForm from './components/submissions/ArticleSubmissionEditForm'
import { useJournal } from './hook/useJournal'
import { setJournalById } from './lib/store/features/journalsSlice'
import { useDispatch } from 'react-redux'
import FAQAccordion from './components/pages/FAQ'
import SubmissionGuidence from './components/pages/SubmissionGuidence'
import { useEffect } from 'react'
import { useAppSelector } from './lib/store/store'
import ResetPassword from './components/auth/ResetPassword'
import { useUser } from './hook/useUser'
import NotFound from './components/pages/NotFound'
// import SubnussionReview from './components/pages/FileUploadCard'

function RoutingControl() {
  const location = useLocation()
  const { journal } = useJournal()
  const { active } = useAppSelector(s => s.journal)
  const { fetchUser } = useUser()

  useEffect(() => {
    fetchUser();
  }, [fetchUser, location.pathname]);

  const dispatch = useDispatch()
  if (!journal) {
    dispatch(setJournalById(parseInt(localStorage.getItem("journal_id") ?? "")))
  }
  const journalColorMap: Record<
    string,
    { 500: string; 600: string; 700: string }
  > = {
    ijire: {
      500: "var(--color-ijire-500)",
      600: "var(--color-ijire-600)",
      700: "var(--color-ijire-700)",
    },
    ijsreat: {
      500: "var(--color-ijsreat-500)",
      600: "var(--color-ijsreat-600)",
      700: "var(--color-ijsreat-700)",
    },
    ijrtmr: {
      500: "var(--color-ijrtmr-500)",
      600: "var(--color-ijrtmr-600)",
      700: "var(--color-ijrtmr-700)",
    },
    indjeee: {
      500: "var(--color-indjeee-500)",
      600: "var(--color-indjeee-600)",
      700: "var(--color-indjeee-700)",
    },
    indjece: {
      500: "var(--color-indjece-500)",
      600: "var(--color-indjece-600)",
      700: "var(--color-indjece-700)",
    },
    indjcst: {
      500: "var(--color-indjcst-500)",
      600: "var(--color-indjcst-600)",
      700: "var(--color-indjcst-700)",
    },
    indjcmr: {
      500: "var(--color-indjcmr-500)",
      600: "var(--color-indjcmr-600)",
      700: "var(--color-indjcmr-700)",
    },
    indjcpr: {
      500: "var(--color-indjcpr-500)",
      600: "var(--color-indjcpr-600)",
      700: "var(--color-indjcpr-700)",
    },
  };

  useEffect(() => {
    const key = active?.code?.toLowerCase() ?? "ijire";
    const colors = journalColorMap[key];

    if (!colors) return;

    const root = document.documentElement;

    root.style.setProperty("--journal-500", colors[500]);
    root.style.setProperty("--journal-600", colors[600]);
    root.style.setProperty("--journal-700", colors[700]);
  }, [active?.code]);


  return (
    <Routes>
      {/* <Route path='/' element={<h1>ruinng</h1>} /> */}

      <Route path='/dashboard' element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path='guidence-for-submission' element={<SubmissionGuidence />} />
        <Route path='profile' element={<ProfileSettingForm />} />
        {/* <Route path='submissions' element={<ArticleListTable />} /> */}
        <Route path='new-submission' element={<ArticleSubmissionForm />} />
        <Route path='edit-submission/:id' element={<ArticleSubmissionEditForm />} />
        <Route path='submissions'>
          <Route index element={<ArticleListTable />} />
          <Route path=':id' element={<SubmissionViewLayout />}>
            <Route index path='view' element={<SubmissionView />} />
            <Route path='tasks' element={<SubmissionTasks />} />
            <Route path='files' element={<SubmissionFiles />} />
            <Route path='review' element={<SubmissionReview />} />
            {/* <Route path='review/review-evaluation/:id' element={<SubmissionReview />} /> */}
            <Route path='acceptance' element={<SubmisstionAcceptance />} />
            <Route path='copyrights' element={<SubmissionCopyright />} />
            <Route path='payment' element={<SubmissionPayment />} />
            <Route path='final-submission' element={<SubmissionStatus />} />
          </Route>
        </Route>
        <Route path='new-submission/view' element={<ArticleSubmissionInformation />} />
        <Route path='acceptances' element={<Accaptance />} />
        <Route path='faq' element={<FAQAccordion />} />

        <Route path='downloads' element={<DownloadLayout />} >
          <Route index element={<DownloadTable title='Article' />} />
          <Route path='manuscript-files' element={<DownloadTable title='Manuscript Files' />} />
          <Route path='copyright-form' element={<DownloadTable title='Copyright Form' />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/*" element={<NotFound/>} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forget-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

    </Routes>
  )
}

export default RoutingControl
