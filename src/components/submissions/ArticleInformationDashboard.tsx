import React from 'react';
import { FileText, Zap } from 'lucide-react';
import { useAppSelector } from '../../lib/store/store';

const ArticleInformationDashboard: React.FC = () => {
  const { article, journalShortWithId } = useAppSelector((state) => state.article);

  return (
    <div className="">
      <div className="">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Article Information Section */}
          <div className='shadow-sm border bg-white border-gray-200 p-8 rounded-lg'>
            <div className="flex items-center gap-2 mb-6">
              <FileText className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Article Information</h2>
            </div>

            <div className="space-y-6">
              <div className='flex flex-col sm:flex-row justify-between gap-8'>
                {/* id */}
                <div className=''>
                  <label className="block text-sm text-gray-500 mb-2">ID</label>
                  <h3 className="text-gray-900 font-medium md:whitespace-nowrap">{journalShortWithId}</h3>
                </div>
                {/* Article Title */}
                <div>
                  <label className="block text-sm text-gray-500 mb-2">Title</label>
                  <h3 className="text-gray-900 font-medium">{article?.title ?? "N/A"}</h3>
                </div>

              </div>
              {/* Journal Name */}
              <div>
                <label className="block text-sm text-gray-500 mb-2">Journal Name</label>
                <a href="#" className="text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  {article?.journalnamewithissn ?? article?.journalname ?? "N/A"}
                </a>
              </div>

              {/* Type of Article and Type of Issue */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm text-gray-500 mb-2">Type of Article</label>
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded text-sm font-medium">
                    {article?.articlename ?? "N/A"}
                  </span>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-2">Type of Issue</label>
                  <span className="text-gray-700 text-sm font-medium">{article?.issuename ?? "N/A"}</span>
                </div>
                {/* Reviewer Referral ID */}
                <div>
                  <label className="block text-sm text-gray-500 mb-2">Reviewer Referral ID</label>
                  <span className="text-gray-700 text-sm">{article?.ref_id ?? "N/A"}</span>
                </div>
              </div>

            </div>
          </div>

          {/* Processing Information Section */}
          <div className='shadow-sm border bg-white border-gray-200 p-8 rounded-lg'>
            <div className="flex items-center gap-2 mb-6">
              <Zap className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-semibold text-gray-900">Processing Information</h2>
            </div>

            <div className="space-y-6">
              {/* Current Status and Processing Mode */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-500 mb-2">Current Status</label>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium">
                    {article?.statusname ?? "N/A"}
                  </span>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-2">Processing Mode</label>
                  <span className="inline-flex items-center gap-1.5 text-green-600 font-medium text-sm">
                    <Zap className="w-4 h-4 fill-current" />
                    {article?.processingname ?? "N/A"}
                  </span>
                </div>
              </div>

              {/* Activation Status and Scheduled Date */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-500 mb-2">Activation Status</label>
                  <span className="inline-flex items-center gap-2 text-gray-700 text-sm font-medium">
                    <span className={`w-2 h-2 rounded-full ${article?.status === 1 ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                    {article?.status===1?"Active":"Inactive"}
                  </span>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-2">Scheduled Date</label>
                  <span className="text-gray-700 text-sm">{article?.scheduled_on ?? "N/A"}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-500 mb-2">Country</label>
                  <span className="text-gray-700 text-sm font-medium">{article?.country ?? "N/A"}</span>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-2">Research Area</label>
                  <span className="text-gray-700 text-sm font-medium">{article?.research_area ?? "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleInformationDashboard;