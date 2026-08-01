import React from 'react';
import { Check, FileText, Users, Edit, Calendar, Eye, AlertCircle, Clock, User, ShieldCheck, GalleryVerticalIcon } from 'lucide-react';
import { useAppSelector } from '../../lib/store/store';
import usePusherTaskUpdates from '../../hook/useGetState';


const SubmissionTasks: React.FC = () => {

  const steps = useAppSelector(state => state.article.tasks);
  const desc: Record<string, string> = {
    "editorial check": "Editor verifies scope, formatting and basic suitability.",
    "plagiarism check": "Manuscript scanned for originality.",
    "peer-review": "Expert evaluation and feedback process.",
    "article acceptance": "Editor issues acceptance after reviews and revisions.",
    "proofreading": "Language, grammar and reference corrections.",
    "layout editing": "Format to the journal's template (figures, tables, styles).",
    "galley correction": "Author checks final proof and requests minor fixes.",
    "publishing": "Article published, assigned DOI, and indexed."
  };
  const authors: Record<string, string> = {
    "editorial check": " Editor-in-Chief/Managing Editor",
    "plagiarism check": "System",
    "peer-review": "Subject Editor / Associate Editor",
    "proofreading": "Editorial Office",
    "layout editing": "Editorial Office",
    "galley correction": "Editorial Office",
    "publishing": "Editorial Team",
    "article acceptance": "Editor Team"
  };

  const completedCount = steps.filter(s => s.status === 'Completed').length;
  const inProgressCount = steps.filter(s => s.status === 'In progress').length;
  const notStartedCount = steps.filter(s => s.status === 'Not Started').length;
  const deferredCount = steps.filter(s => s.status === 'Deferred').length;
  const editorCount = steps.filter(s => s.status === 'Editor approval').length;
  const totalSteps = 8;
  const progressPercentage = Math.round((completedCount / totalSteps) * 100);
  // socket fetching and updating state
  usePusherTaskUpdates()
  return (
    <div className=" max-w-screen pr-4 lg:pr-0">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Article Publication Workflow</h1>
        <p className="text-gray-600">Track your article's progress through the publication pipeline</p>
      </div>

      {/* Overall Progress */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Overall Progress</h2>
            <p className="text-sm text-gray-600">{completedCount} of {totalSteps} tasks completed</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-(--journal-500)">{progressPercentage}%</div>
            <div className="text-sm text-gray-600">Complete</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="bg-(--journal-600) h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        {/* Status Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="text-center">
            <div className={`w-3 h-3 bg-red-500 rounded-full mx-auto mb-2`}></div>
            <div className="text-sm text-gray-600 mb-1">Not Started</div>
            <div className="text-2xl font-bold text-gray-900">{notStartedCount}</div>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-2"></div>
            <div className="text-sm text-gray-600 mb-1">In Progress</div>
            <div className="text-2xl font-bold text-gray-900">{inProgressCount}</div>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-2"></div>
            <div className="text-sm text-gray-600 mb-1">Deferred</div>
            <div className="text-2xl font-bold text-gray-900">{deferredCount}</div>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 bg-purple-500  rounded-full mx-auto mb-2"></div>
            <div className="text-sm text-gray-600 mb-1">Editor Approval</div>
            <div className="text-2xl font-bold text-gray-900">{editorCount}</div>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
            <div className="text-sm text-gray-600 mb-1">Completed</div>
            <div className="text-2xl font-bold text-gray-900">{completedCount}</div>
          </div>
        </div>
      </div>

      {/* Workflow Steps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        {steps.map((step, idx) => (
          <div
            key={step.id}
            className={`rounded-lg border ${step.status === 'Completed' ? 'border-[#f0fdf4] bg-[#f0fdf4]' :
              step.status === 'Not Started' ? 'border-[#fef2f2] bg-[#fef2f2]' :
                step.status === 'In progress' ? 'border-[#d7ecfb] bg-[#d7ecfb]' :
                  step.status === 'Deferred' ? 'border-[#FFF9EC] bg-[#FFF9EC]' :
                    step.status === 'Editor approval' ? 'border-[#F4ECFE] bg-[#F4ECFE]' :
                      'border-gray-200 bg-gray-50'
              } p-6`}
          >
            {/* Icon centered at top */}
            <div className="flex md:justify-center mb-4">
              <div className={`p-4 rounded-full ${step.status === 'Completed' ? 'border-[#f0fdf4] bg-[#f0fdf4]' :
                step.status === 'Not Started' ? 'border-[#fef2f2] bg-[#fef2f2]' :
                  step.status === 'In progress' ? 'border-[#d7ecfb] bg-[#d7ecfb]' :
                    step.status === 'Deferred' ? 'border-[#FFF9EC] bg-[#FFF9EC]' :
                      'bg-gray-100 text-gray-600'
                }`}>
                {step.task_name.toLowerCase() == 'Editorial check'.toLowerCase() && <Check className="w-6 h-6" />}
                {step.task_name.toLowerCase() == "Article Acceptance".toLowerCase() && <ShieldCheck className="w-6 h-6" />}
                {step.task_name.toLowerCase() == 'Plagiarism Check'.toLowerCase() && <FileText className="w-6 h-6" />}
                {step.task_name.toLowerCase() == 'Peer-Review'.toLowerCase() && <Users className="w-6 h-6" />}
                {step.task_name.toLowerCase() == 'Proof-reading'.toLowerCase() && <Eye className="w-6 h-6" />}
                {step.task_name.toLowerCase() == 'Proofreading'.toLowerCase() && <Eye className="w-6 h-6" />}
                {step.task_name.toLowerCase() == 'Layout Editing'.toLowerCase() && <Edit className="w-6 h-6" />}
                {step.task_name.toLowerCase() == 'Galley Correction'.toLowerCase() && <GalleryVerticalIcon className="w-6 h-6" />}
                {step.task_name.toLowerCase() == 'Publishing'.toLowerCase() && <Calendar className="w-6 h-6" />}
              </div>
            </div>

            {/* Step Number centered */}
            <div className="md:text-center mb-4">
              <span className="text-lg font-semibold text-gray-900">Stage {idx + 1}</span>
            </div>

            {/* Title centered */}
            <h3 className="text-xl font-bold text-gray-900 mb-3">{step.task_name}</h3>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4">{desc[step.task_name.toString().toLowerCase()] ?? ""}</p>

            {/* Status Badge */}
            <div className="flex items-center justify-start gap-2 mb-4">
              {step.status === 'Completed' && (
                <>
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-semibold text-green-600">Completed</span>
                </>
              )}
              {step.status === 'Not Started' && (
                <>
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-semibold text-red-600">Not Started</span>
                </>
              )}
              {step.status === 'Deferred' && (
                <>
                  <Clock className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-semibold text-gray-600">Deferred</span>
                </>
              )}
              {step.status === 'Editor approval' && (
                <>
                  <Clock className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-semibold text-gray-600">Editor Approval</span>
                </>
              )}
              {step.status === 'In progress' && (
                <>
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-600">In progress</span>
                </>
              )}
            </div>

            {/* Assigned To */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2 font-bold">
              <User className="w-4 h-4" />
              <span>{authors[step.task_name.toLocaleLowerCase()]}</span>
            </div>

            {/* Due Date */}
            {step.due_date && (
              <div className="flex items-center gap-2 text-sm text-gray-600 font-bold">
                <Clock className="w-4 h-4" />
                <span>{step.status == "Completed" ? "Done" : "Due Date"}: {step.due_date}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Awaiting Processing */}
      {/* <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-yellow-600 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Awaiting Processing</h3>
              <p className="text-sm text-gray-600 mb-4">The following task is next in the publication workflow</p>
              
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Plagiarism Check</h4>
                  <p className="text-sm text-gray-600">This task will be processed by the editorial team</p>
                </div>
              </div>
            </div>
          </div>
          <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium text-sm transition-colors">
            Next Step
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default SubmissionTasks;