import React, { useEffect, useState } from 'react';
import { Eye, Edit, Cross, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../lib/store/store';
import { setActivePaperId } from '../../lib/store/features/globle';
import { useSubmissionList } from '../../hook/useGetSubmissionList';
import { useDeleteSubmission } from '../../hook/useDeleteSubmission';
import toast from 'react-hot-toast';
import { getStatusStyles } from '../../utils/getcolors';
import LoadingScreen from '../ui/LoadingScreen';
import { setDeleteDropdownItem } from '../../lib/store/features/dashboardSlice';
import { useLogout } from '../../hook/useLogout';
// import { useDashboard } from '../../hook/useDashboardData';


const ArticleListTable: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate();
  const { deleteSubmission} = useDeleteSubmission();
  const {logout} = useLogout()
  // const { fetchDashboard } = useDashboard()
  const { fetchSubmissionList, data, loading } = useSubmissionList()
  const [refetchFlag, setRefetchFlag] = React.useState(false);
  const [articles, setArticles] = React.useState<any[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: number; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAppSelector(state => state.auth)

  useEffect(() => {
    // Get user_id from localStorage or your auth context
    if (user) {
      try {
        fetchSubmissionList(user.id);
      } catch (err) {
        console.error('Failed to parse user data:', err);
      }
    }
    else if ((localStorage.getItem("user_id") !== "")) {
      fetchSubmissionList(parseInt(localStorage.getItem("user_id") ?? ""));
    }
    else {
      logout()
      toast.error("no user Id found")
      return
    }
  }, [fetchSubmissionList, user, navigate, refetchFlag, logout]);

  // Update articles from API data
  useEffect(() => {
    setArticles(data?.data?.data || []);
  }, [data]);

  const handelView = (id: number) => {
    dispatch(setActivePaperId(id));
    navigate('/dashboard/submissions/' + id + "/view");
  }
  const handelEdit = (id: number) => {
    dispatch(setActivePaperId(id));
    navigate('/dashboard/edit-submission/' + id);
  };
  const handleDeleteClick = (id: number, title: string) => {
    setDeleteConfirm({ id, title });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    setIsDeleting(true);

    // Optimistic update: remove from UI immediately
    setArticles(prevArticles => prevArticles.filter(a => a.id !== deleteConfirm.id));
    setDeleteConfirm(null);

    try {
      const result = await deleteSubmission(deleteConfirm.id);
      if (result?.status) {
        dispatch(setDeleteDropdownItem(deleteConfirm.id));
        toast.success('Submission deleted successfully');
      } else {
        throw new Error('Delete failed');
      }
    } catch (err) {
      // Revert on error
      setRefetchFlag(true);
      console.error(err)
      toast.error('Failed to delete submission');
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };


  return (
    <div className="min-h-screen max-w-screen px-0 relative lg:pr-4">
      {loading && <LoadingScreen title='Submission List' />}
      {/* Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full animate-slideUp">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Delete Submission?
                </h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Are you sure you want to delete this submission?
              </p>
              <p className="text-sm font-medium text-gray-700 mb-6 p-3 bg-gray-50 rounded">
                <span className="text-gray-500">Title: </span>
                {deleteConfirm.title}
              </p>
              <p className="text-xs text-gray-500 mb-6">
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={cancelDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full mt-6 md:mt-0 ">
        {/* Desktop Table View - Hidden on md and below */}
        <div className="hidden md:block bg-white rounded-lg shadow-sm p-4 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-(--journal-500) w-full">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-50">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-50">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-50">
                  Research Area
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-50">
                  <div className="flex items-center gap-2">
                    Status
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-50">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {articles.map((article, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-5 text-sm text-(--journal-600) font-medium whitespace-nowrap">
                    <button onClick={() => handelView(article.id)}>{article.journalShortWithId}</button>
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-700">
                    {article.title}
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-700">
                    {article.category}
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center px-5 py-1.5 rounded-full text-sm font-medium ${getStatusStyles(article.statusname)}`}>
                      {article.statusname}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <button onClick={() => handelView(article.id)} className="p-2 rounded-lg border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors">
                        <Eye className="w-3 h-3 text-gray-600 scale-125" />
                      </button>
                      <button onClick={() => handelEdit(article.id)} className="p-2 rounded-lg border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors hidden">
                        <Edit className="w-3 h-3 text-gray-600 scale-125" />
                      </button>
                      <button onClick={() => handleDeleteClick(article.id, article.title)} className="p-2 rounded-lg border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors hidden">
                        <Cross className="w-3 h-3 text-gray-600 rotate-45 scale-125" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View - Visible on md and below */}
        <div className="md:hidden space-y-4 pb-8">
          {articles.map((article, index) => (
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
                  <button
                    onClick={() => handelView(article.id)}
                    className="p-2 rounded-lg border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors"
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
    </div>
  );
};

export default ArticleListTable;