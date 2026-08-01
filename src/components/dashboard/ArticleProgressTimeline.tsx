import React, { useEffect, useState } from 'react';
import {
  ChevronDown, ChevronUp, FileText, Search, Users, CheckCircle,
  Edit, Layout, Image, Globe, RefreshCwIcon,
  Check
} from 'lucide-react';
import ActionRequired from './ActionRequired';
import { useWorkflow } from '../../hook/useWorkFlow';
import LoadingScreen from '../ui/LoadingScreen';
import { useAppSelector } from '../../lib/store/store';
import { useDispatch } from 'react-redux';
import { setActivePaperId, setBackground, setTutorialStep } from '../../lib/store/features/globle';
import { useNavigate } from 'react-router-dom';
import { getStatusStyles } from '../../utils/getcolors';
import usePusherTaskUpdates from '../../hook/useGetState';
import { OnboardingCard } from '../onboardcards/OnboardingCards';
// import useGetStatus from '../../hook/useGetStatus';

interface SubStep {
  id: number;
  label: string;
  completed: boolean;
  inProgress?: boolean;
  status: string;
}

interface Stage {
  id: string;
  title: string;
  description: string;
  status: 'Completed' | 'In Process' | 'Not Started' | 'Pending';
  icon: React.ReactNode;
  expandable?: boolean;
  subSteps?: SubStep[];
}



const ArticleProgressTimeline: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();


  const { dropdown_list, articles_table, latest } = useAppSelector((state) => state.dashboard.data);
  const { data: workflowData } = useAppSelector((state) => state.workflow);
  const { data, fetchWorkflow, loading } = useWorkflow();
  const [selectedArticle, setSelectedArticle] = useState(dropdown_list.length > 0 ? dropdown_list[0].id : '');
  const [selectedArticleTitle, setSelectedArticleTitle] = useState(latest?.article?.title);
  const [expandedStage, setExpandedStage] = useState<string | null>('peer-review');
  const { tutorialStep } = useAppSelector(s => s.global)

  useEffect(() => {
    const article = articles_table.filter((i) => i.id == selectedArticle)
    if (article.length) setSelectedArticleTitle(article[0].title)
  }, [selectedArticle, articles_table])

  useEffect(() => {
    if (!workflowData?.peer_review_tasks) {
      if (selectedArticle) {
        fetchWorkflow(selectedArticle);
      }
    }
  }, [fetchWorkflow, workflowData?.peer_review_tasks, selectedArticle])

  useEffect(() => {
    if (selectedArticle) {
      fetchWorkflow(selectedArticle);
    }
  }, [selectedArticle, fetchWorkflow]);

  useEffect(() => {
    if (tutorialStep > 3) {
      dispatch(setBackground(false))
    }
  }, [tutorialStep, dispatch])

  const handelView = (id: number) => {
    if (articles_table.length && !articles_table[0].newuser) {
      dispatch(setActivePaperId(id));
      navigate('/dashboard/submissions/' + id + '/view');
    } else {
      if (tutorialStep < 4) dispatch(setTutorialStep(tutorialStep + 1))
      dispatch(setBackground(false))
      dispatch(setActivePaperId(65755555));
      navigate('/dashboard/submissions/' + 65755555 + '/view');
    }

  }

  // socket fetching and updating state
  usePusherTaskUpdates(selectedArticle.toString())

  const handelEdit = (id: number) => {
    dispatch(setActivePaperId(id));
    navigate('/dashboard/edit-submission/' + id);
  };
  const stages: Stage[] = workflowData
    ?
    workflowData.tasks.map((t) => {
      // Map API statuses → UI statuses
      const mappedStatus =
        t.status === 'Completed'
          ? 'Completed'
          : t.status === 'In progress'
            ? 'In Process'
            : t.status === 'Not Started'
              ? 'Not Started'
              : 'Pending';

      // Map icons based on task names
      const icon =
        t.task_name === 'Editorial check' ? (
          <FileText className="w-5 h-5" />
        ) : t.task_name === 'Plagiarism Check' ? (
          <Search className="w-5 h-5" />
        ) : t.task_name === 'Peer-Review' ? (
          <Users className="w-5 h-5" />
        ) : t.task_name === 'Proofreading' ? (
          <Edit className="w-5 h-5" />
        ) : t.task_name === 'Layout Editing' ? (
          <Layout className="w-5 h-5" />
        ) : t.task_name === 'Galley Correction' ? (
          <Image className="w-5 h-5" />
        ) : t.task_name === 'Article Acceptance' ? (
          <Check className="w-5 h-5" />
        ) : <Globe className="w-5 h-5" />;

      const isPeerReview = t.task_name === 'Peer-Review';

      return {
        id: t.task_name.toLowerCase().replace(/\s+/g, '-'),
        title: t.task_name,
        description:
          t.task_name === 'Editorial check'
            ? 'Editor verifies scope, formatting and basic suitability.'
            : t.task_name === 'Plagiarism Check'
              ? 'Manuscript scanned for originality.'
              : t.task_name === 'Proofreading'
                ? 'Language, grammar and reference corrections.'
                : t.task_name === 'Layout Editing'
                  ? "Format to the journal's template (figures, tables, styles)."
                  : t.task_name === 'Galley Correction'
                    ? 'Author checks final proof and requests minor fixes.'
                    : t.task_name === 'Publishing'
                      ? 'Article published, assigned DOI, and indexed.'
                      : t.task_name === 'Peer-Review'
                        ? 'Expert evaluation and feedback process.'
                        : t.task_name === 'Article Acceptance'
                          ? 'Editor issues acceptance after reviews and revisions.'
                          : '',
        status: mappedStatus,
        icon,
        expandable: isPeerReview,
        subSteps: isPeerReview
          ? workflowData.peer_review_tasks.map((p, index) => ({
            id: index + 1,
            label: p.task_name,
            completed: p.status === 'Completed' || p.status === 'No',
            inProgress: p.status === 'In Progress' || p.status === 'Yes',
            status: p.status,
          }))
          : undefined
      };
    })
    : [];

  const completedStages = stages.filter((s) => s.status === 'Completed').length;
  const totalStages = stages.length;
  const progressPercentage = (completedStages / totalStages) * 100;
  //->console.log(stages)
  // Colors remain unchanged
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in process': return 'bg-blue-100 text-blue-700';
      case 'not started': return 'bg-gray-100 text-gray-600';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'yes': return 'bg-yellow-100 text-yellow-700';
      case 'no': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen px-0 p-8 relative w-full">
      <div className="flex flex-wrap gap-4 relative">
        {loading && <LoadingScreen title='Article Progress' />}


        {dropdown_list.length ? <section className='.DashboardPeerReview flex-1 relative'>
          {tutorialStep === 2 &&
            <OnboardingCard
              icon={Search}
              title='Submitted Articles'
              description='Switch between articles to view their current status'
              iconBg='bg-teal-100'
              BgColor='bg-white'
              iconColor='text-amber-600'
              dotColors={['bg-blue-400', 'bg-(--journal-600)']}
              showTags={false}
              position='-right-28 sm:right-0 -right-12 -top-50  sm:bottom-30 lg:right-0 lg:right-0 h-fit'
              nextTag={true}
            />}
          {/* Header Card */}
          <div className="bg-(--journal-600) rounded-lg p-6 mb-6 text-white">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold mb-1">Article Progress Timeline</h1>
                <p className="text-sm text-blue-100">ID: {data?.article_info.shortFormWithId}</p>
              </div>
              <select
                className={`bg-white text-gray-800 px-4 py-2 rounded border-none outline-none cursor-pointer ${tutorialStep === 2 ? "relative z-9999 bg-white scale-125" : ""}`}
                value={selectedArticle}
                onChange={(e) => setSelectedArticle(e.target.value)}
              >
                {dropdown_list.map((item, idx) => <option key={idx} value={item.id}>{item.label}</option>)}
              </select>
            </div>

            <p className="text-sm mb-4">
              Tracking Title: <span className="font-semibold">{selectedArticleTitle ?? "N/A"}</span>
            </p>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm">{completedStages} of {totalStages} stages completed</span>
              </div>
              <div className="w-full bg-(--journal-500) rounded-full h-3">
                <div
                  className="bg-white rounded-full h-3 transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
          {/* Stages List */}
          <div className="space-y-6">
            {stages.map((stage) => (
              <div key={stage.id} className="">
                <div className="">
                  <div className="flex items-start gap-4">
                    <div className={`relative p-4 rounded-full flex items-center justify-center ${stage.status === 'Completed' ? 'bg-green-100 text-green-600' :
                      stage.status === 'In Process' ? 'bg-blue-100 text-blue-600' :
                        'bg-white text-gray-400'
                      }`}>
                      {stage.icon}
                      <div className='absolute px-[1.2px] bg-gray-300 h-8 -bottom-10 mx-auto'></div>
                    </div>

                    <div className="flex-1 bg-white rounded-lg shadow-sm border border-blue-200 p-5">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold text-gray-900 text-base">{stage.title}</h3>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(stage.status)}`}>
                            {stage.status}
                          </span>
                          {stage.expandable && (
                            <button
                              onClick={() => setExpandedStage(expandedStage === stage.id ? null : stage.id)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              {expandedStage === stage.id ?
                                <ChevronUp className="w-5 h-5" /> :
                                <ChevronDown className="w-5 h-5" />
                              }
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{stage.description}</p>
                      {/* Expandable Sub-steps */}
                      {stage.expandable && expandedStage === stage.id && stage.subSteps && (
                        <div className="mt-4 space-y-3 bg-white">
                          {stage.subSteps.map((subStep, idx) => (
                            <div key={subStep.id} className={`flex items-center justify-between bg-gray-100 p-5 rounded-lg ${idx == 0 || idx == 6 ? "hidden" : ""}`}>
                              <div className="flex items-center gap-3">
                                {subStep.completed ? (
                                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                                ) : subStep.inProgress ? (
                                  <RefreshCwIcon className="w-5 h-5 animate-spin rounded-full flex items-center justify-center shrink-0 text-blue-600" />
                                ) : (
                                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full shrink-0"></div>
                                )}
                                <span className={`text-sm ${subStep.completed ? 'text-green-600' :
                                  subStep.inProgress ? 'text-blue-600 font-medium' :
                                    'text-gray-500'
                                  }`}>
                                  {subStep.id - 1}. {subStep.label}
                                </span>
                                {subStep.label && (
                                  <span className="text-xs text-gray-400 ml-2">{subStep.status}</span>
                                )}
                              </div>
                              {subStep.completed ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : subStep.inProgress ? (
                                <div className="w-5 h-5 border-2 border-blue-500 rounded-full flex items-center justify-center">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                </div>
                              ) : (
                                <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>


                </div>
              </div>
            ))}
          </div>
        </section>
          : <section className="flex-1 p-10 bg-white shadow-sm rounded-lg text-center space-y-6">
            <h1 className="text-2xl font-semibold">No Submission Data Available</h1>
            <p className="text-gray-600">
              You currently have no active submissions. Kickstart your publishing workflow by
              initiating a new article submission.
            </p>
            <button onClick={() => navigate("/dashboard/new-submission")}
              className="px-6 py-3 bg-(--journal-600) text-white rounded-md shadow hover:bg-(--journal-700) transition"
            >
              Start New Submission
            </button>
          </section>
        }
        <ActionRequired />
        {/* Article List */}
        <section className='AricleTableDashboard relative mt-8 w-full bg-white rounded-lg shadow-sm border border-gray-200 '>
          {tutorialStep === 3 &&
            <OnboardingCard
              icon={Search}
              title='View Article Details'
              description='Access complete information about this article including status and history'
              iconBg='bg-teal-100'
              BgColor='bg-white'
              iconColor='text-blue-500'
              dotColors={['bg-orange-400', 'bg-orange-300', 'bg-teal-300']}
              showTags={false}
              position='-right-28 sm:right-0 -right-12 -top-35 md:-top-30 sm:bottom-30  h-fit'
              nextTag={false}
              skip={false}
            />}
          <div className="overflow-x-auto">
            <div className="p-5 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Article List</h2>
            </div>

            <div className="overflow-x-auto hidden md:block">
              <table className="w-full">
                <thead className="bg-(--journal-500) border-b border-blue-200 ">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider">Research Area</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        Status
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {articles_table.map((article, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-(--journal-600)"><button onClick={() => handelView(article.id)}>{article.journalShortWithId}</button></td>
                      <td className="px-6 py-4 text-sm text-gray-900">{article.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{article.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyles(article.statusname)}`}>
                          {article.statusname}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm"
                      >
                        <div className="flex justify-start gap-2">

                          <button onClick={() => handelView(article.id)} className={`p-2 rounded-lg border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors mr-auto ${tutorialStep === 3 ? "relative z-9999 bg-white scale-125" : ""}`}>
                            <Eye className="w-3 h-3 text-gray-600 scale-125" />
                          </button>
                          <button onClick={() => handelEdit(article.id)} className="p-2 rounded-lg border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors hidden">
                            <Edit className="w-3 h-3 text-gray-600 scale-125 " />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View - Visible on md and below */}
            <div className="AricleTableDashboard tableView md:hidden space-y-4">
              {articles_table.map((article, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  {/* ID and Actions Row */}
                  <div className="flex justify-between items-start mb-4">
                    <button
                      onClick={() => handelView(article.id)}
                      className="text-sm text-gray-600 font-medium"
                    >
                      ID: {article.journalShortWithId}
                    </button>
                    <div className="flex items-center gap-2">

                      <button onClick={() => handelView(article.id)} className={`p-2 rounded-lg border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors ${tutorialStep === 3 ? "relative z-9999 bg-white" : ""}`}
                      >
                        <Eye className="w-5 h-5 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handelEdit(article.id)}
                        className="p-2 rounded-lg border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors hidden"
                      >
                        <Edit className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-medium text-gray-900 mb-3">
                    {article.title}
                  </h3>

                  {/* Research Area */}
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm text-gray-500 w-fit">Research Area</p>
                    <p className="text-sm text-gray-900 w-fit">{article.category}</p>
                  </div>

                  {/* Status */}
                  <div className="mb-0 flex items-center justify-between">
                    <p className="text-sm text-gray-500 mb-2">Status</p>
                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium ${getStatusStyles(article.statusname)}`}>
                      {article.statusname}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

// Eye icon component
const Eye: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export default ArticleProgressTimeline;