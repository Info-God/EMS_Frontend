import React from 'react';
import { useAppSelector } from '../../lib/store/store';
import { Download } from 'lucide-react';
import { getStatusStyles } from '../../utils/getcolors';
import { useFetchAcceptanceLetter } from '../../hook/useAcceptanceLetter';

const AcceptanceTable: React.FC = () => {
  const acceptances = useAppSelector(state => state.article.acceptances);
  const { fetchAcceptanceLetter } = useFetchAcceptanceLetter()
  const { article, journalShortWithId } = useAppSelector((state) => state.article);

  const handleDownloadAcceptanceLetter = async () => {
    if (article?.id) {

      const blob = await fetchAcceptanceLetter(article?.id.toString());
      //->console.log(blob)
      if (!blob) return;

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Acceptance-form.pdf";
      a.click();
      window.URL.revokeObjectURL(url);
    };
  }
  return (
    <div className="min-h-screen pr-4 lg:pr-0">
      <div className="w-full">
        {/* Main Acceptance Table/Cards */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Acceptance</h2>

          {/* Desktop Table View - Hidden on md and below */}
          <div className="hidden md:block">
            <table className="w-full">
              <thead>
                <tr className="bg-(--journal-500) border-b border-(--journal-500)">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Accepted On
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Scheduled To
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Published On
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    <div className="flex items-center gap-2">
                      Status
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {acceptances.map((acceptance, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-5 text-sm text-gray-700 font-medium">
                      {acceptance.journalShortWithId}
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-700">
                      {acceptance.accepted_on}
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-700">
                      {acceptance.scheduled_to}
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-700">
                      {acceptance.published_on}
                    </td>
                    <td className="px-6 py-5 items-center justify-between flex">
                      <span className={`inline-flex items-center px-5 py-1.5 rounded-full text-sm font-medium ${getStatusStyles(acceptance.status)}`}>
                        {acceptance.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View - Visible on md and below */}
          <div className="md:hidden space-y-4">
            {acceptances.map((acceptance, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
                {/* ID */}
                <div className="mb-3">
                  <p className="text-sm text-gray-500">ID</p>
                  <p className="text-base text-gray-900 font-medium">{acceptance.journalShortWithId}</p>
                </div>

                {/* Accepted On */}
                <div className="mb-3">
                  <p className="text-sm text-gray-500">Accepted On</p>
                  <p className="text-base text-gray-900">{acceptance.accepted_on}</p>
                </div>

                {/* Scheduled to */}
                <div className="mb-3">
                  <p className="text-sm text-gray-500">Scheduled to</p>
                  <p className="text-base text-gray-900">{acceptance.scheduled_to}</p>
                </div>

                {/* Published On */}
                <div className="mb-3">
                  <p className="text-sm text-gray-500">Published On</p>
                  <p className="text-base text-gray-900">{acceptance.published_on}</p>
                </div>

                {/* Status */}
                <div>
                  <p className="text-sm text-gray-500 mb-2">Status</p>
                  <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium ${getStatusStyles(acceptance.status)}`}>
                    {acceptance.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Download Section */}
        {acceptances[0]?.action_for_author === 'View' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden p-8 mt-6">
            {/* Desktop Table View - Hidden on md and below */}
            <h2 className="text-2xl font-semibold text-gray-900 ">Generate the Acceptance Letter</h2>

            <div className="hidden md:block">
              <table className="w-full mt-6">
                <thead>
                  <tr className="bg-(--journal-500) border-b border-(--journal-500) w-full">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                      Title
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-white text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr key={journalShortWithId ?? article?.journalShortWithId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-5 text-sm text-gray-700 font-medium whitespace-nowrap">
                      {journalShortWithId ?? article?.journalShortWithId ?? "fasdfasdfa"}
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-700 w-full">
                      {article?.title}
                    </td>
                    <td className="px-6 py-5">
                      <button onClick={handleDownloadAcceptanceLetter}

                        className="inline-flex items-center gap-2 px-6 py-2 bg-(--journal-600) text-white rounded-lg hover:bg-(--journal-700) transition-colors font-medium"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Mobile Card View - Visible on md and below */}
            <div className="md:hidden space-y-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                {/* Title Header with Download Button */}
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-base text-gray-900">Title</h3>
                    <p className="text-base font-semibold text-gray-900 mb-4">{article?.title}</p>
                  </div>
                  <button onClick={handleDownloadAcceptanceLetter} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Download className="w-5 h-5 text-gray-600" />
                  </button>
                </div>


                {/* Created at (using journalShortWithId as ID reference) */}
                <div>
                  <p className="text-base text-gray-500">Created at</p>
                  <p className="text-base font-semibold text-gray-900">{journalShortWithId ?? article?.journalShortWithId}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AcceptanceTable;