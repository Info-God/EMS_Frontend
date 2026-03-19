import React, { useEffect } from 'react';
import { useCopyrightAcceptance } from '../../hook/useCopyrightAcceptance';
import { AlertTriangle, Eye } from 'lucide-react';
import NoData from '../ui/NoData';
import LoadingScreen from '../ui/LoadingScreen';
import { useAppDispatch, useAppSelector } from '../../lib/store/store';
import { useNavigate } from 'react-router-dom';
import { setActivePaperId } from '../../lib/store/features/globle';
import toast from 'react-hot-toast';
import { getStatusStyles } from '../../utils/getcolors';
import { useLogout } from '../../hook/useLogout';

const Acceptance: React.FC = () => {
  const { data, loading, error, fetchCopyrightAcceptance } = useCopyrightAcceptance();
  const {logout} = useLogout()
  const dispatch = useAppDispatch()
  const navigate = useNavigate();
  const { user } = useAppSelector(state => state.auth)

  useEffect(() => {
    // Get user_id from localStorage or your auth context
    if (user) {
      try {
        fetchCopyrightAcceptance(user.id);
      } catch (err) {
        console.error('Failed to parse user data:', err);
      }
    } else if ((localStorage.getItem("user_id") !== "")) {
      fetchCopyrightAcceptance(parseInt(localStorage.getItem("user_id") ?? ""));
    }
    else {
      logout()
      toast.error("no user Id found")
      return
    }
  }, [fetchCopyrightAcceptance, user, navigate, logout]);

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch {
      return dateString;
    }
  };

  const formatPublishDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const handelView = (id: number) => {
    dispatch(setActivePaperId(id));
    navigate('/dashboard/submissions/' + id + '/view');
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded max-w-md">
          <div className="flex gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 shrink-0" />
            <div>
              <h3 className="text-red-800 font-semibold mb-2">Error Loading Data</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!data || data.length === 0 && loading === false) {
    return (
      <NoData title='Copyright Acceptances' />
    );
  }

  return (
    <div className="min-h-screen mt-8 lg:pr-4">
      {loading && <LoadingScreen title='Copyright Acceptances' />}
      <div className="w-full h-full relative">

        <div className="bg-white rounded-lg shadow-sm overflow-hidden p-4">
          <div className="flex justify-between items-center pb-8 py-2">
            <h1 className='text-3xl font-semibold'>Copyright Acceptances</h1>
            <span className="text-sm text-gray-500 font-medium">
              {data.length} {data.length === 1 ? 'record' : 'records'}
            </span>
          </div>

          {/* Desktop Table View - Hidden on md and below */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-(--journal-500) w-full">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-50">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-50">
                    Subject
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-50">
                    Date Created
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-50">
                    Date Published
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-50">
                    <div className="flex items-center justify-center gap-2">
                      Status
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((issue, index) => (
                  <tr key={issue.article_id || index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-5 text-sm text-(--journal-600) font-medium">
                      <button onClick={() => handelView(issue.article_id)}>{issue.journalShortWithId}</button>
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-700">
                      <div className="max-w-md" title={issue.articletitle}>
                        {issue.scheduled_to || issue.articletitle}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-700">
                      {formatDate(issue.accepted_on)}
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-700">
                      {formatPublishDate(issue.published_on)}
                    </td>
                    <td className="px-6 py-5 grid grid-cols-2 items-center justify-between">
                      <div className='flex items-center justify-center'>
                        <span className={`inline-flex items-center px-5 py-1.5 rounded-full text-sm font-medium ${getStatusStyles(issue.status)}`}>
                          {issue.status}
                        </span>
                      </div>
                      <div className='flex justify-center'>
                        <button onClick={() => handelView(issue.article_id)} className="p-2 rounded-lg border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors">
                          <Eye className="w-3 h-3 text-gray-600 scale-125" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View - Visible on md and below */}
          <div className="md:hidden space-y-4">
            {data.map((issue, index) => (
              <div key={issue.article_id || index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                {/* ID and Action Button */}
                <div className="flex justify-between items-start mb-4">
                  <button
                    onClick={() => handelView(issue.article_id)}
                    className="text-sm text-gray-600 font-medium"
                  >
                    ID: {issue.journalShortWithId}
                  </button>
                  <button
                    onClick={() => handelView(issue.article_id)}
                    className="p-2 rounded-lg border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                  >
                    <Eye className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* Subject/Title */}
                <h3 className="text-base font-semibold text-gray-900 mb-4">
                  {issue.scheduled_to || issue.articletitle}
                </h3>

                {/* Date Created */}
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm text-gray-500">Date Created</p>
                  <p className="text-sm text-gray-900">{formatDate(issue.accepted_on)}</p>
                </div>

                {/* Date Published */}
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-gray-500">Date Published</p>
                  <p className="text-sm text-gray-900">{formatPublishDate(issue.published_on)}</p>
                </div>

                {/* Status */}
                <div className='flex items-center justify-between'>
                  <p className="text-sm text-gray-500 mb-2">Status</p>
                  <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium ${getStatusStyles(issue.status)}`}>
                    {issue.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Acceptance;