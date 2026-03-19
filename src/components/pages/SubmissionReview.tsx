import React, { useState } from 'react';
import { Eye, EyeClosed } from 'lucide-react';
import { useAppSelector } from '../../lib/store/store';
import ReviewEvaluationSection from './ReviewEvaluation';
import { getStatusStyles } from '../../utils/getcolors';

const SubmissionReview: React.FC = () => {
  const reviews = useAppSelector(state => state.article.reviews);
  const [reviewId, setReviewId] = useState<string>("")

  const handleView = (id: string | number) => {
    setReviewId(reviewId === id.toString() ? "" : id.toString())
  };

  return (
    <div className="min-h-screen pr-4 lg:pr-0">
      <div className="w-full">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Review Table</h2>

          {/* Desktop Table View - Hidden on md and below */}
          <div className="hidden md:block">
            <table className="w-full">
              <thead>
                <tr className="bg-(--journal-500) border-b border-(--journal-500)">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Assigned To
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Assigned On
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Due To
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    <div className="flex items-center gap-2">
                      Status
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reviews.map((review, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-5 text-sm text-gray-700 font-medium">
                      {review.name}
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-700">
                      {review.create_at}
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-700">
                      {review.due_date}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center px-5 py-1.5 rounded-full text-sm font-medium ${getStatusStyles(review.status)}`}>
                        {review.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      {review.decision === "view" && <button
                        onClick={() => handleView(review.id)}
                        className="p-2 rounded-lg border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                      >
                        {review.id.toString() !== reviewId ? <Eye className="w-5 h-5 text-gray-600" /> : <EyeClosed className="w-5 h-5 text-gray-600" />}
                      </button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View - Visible on md and below */}
          <div className="md:hidden space-y-4">
            {reviews.map((review, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
                {/* Assigned to */}
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-base text-gray-500">Assigned to</p>
                  <p className="text-base text-gray-900 font-semibold">{review.name}</p>
                </div>

                {/* Assigned On */}
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-base text-gray-500">Assigned On</p>
                  <p className="text-base text-gray-900">{review.create_at}</p>
                </div>

                {/* Due to */}
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-base text-gray-500">Due to</p>
                  <p className="text-base text-gray-900">{review.due_date}</p>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between">
                  <p className="text-base text-gray-500 mb-2">Status</p>
                  <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium ${getStatusStyles(review.status)}`}>
                    {review.status}
                  </span>
                </div>

                {/* Action */}
                {review.decision === "view" && (
                  <div className='flex items-center justify-between'>
                    <p className="text-base text-gray-500 mb-2">Action</p>
                    <button
                      onClick={() => handleView(review.id)}
                      className="p-2 rounded-lg border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                    >
                      {review.id.toString() !== reviewId ? <Eye className="w-5 h-5 text-gray-600" /> : <EyeClosed className="w-5 h-5 text-gray-600" />}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        {reviewId && <ReviewEvaluationSection reviewId={reviewId} />}
      </div>
    </div>
  );
};

export default SubmissionReview;