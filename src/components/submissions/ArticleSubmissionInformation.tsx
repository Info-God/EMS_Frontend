import { FileText, Download, User } from "lucide-react";

export default function ArticleSubmissionInformation() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 w-full mt-8">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FileText className="text-blue-600" size={22} />
          <h2 className="text-gray-800 font-semibold text-lg">Article Information</h2>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all">
          <Download size={16} />
          Download Document
        </button>
      </div>

      {/* Information Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 text-sm">
        {/* Title */}
        <div className="col-span-2">
          <p className="text-gray-500 mb-2">Title</p>
          <a
            href="#"
            className="flex items-center gap-2 text-blue-600 font-medium hover:underline"
          >
            <FileText size={16} />
            International Journal of Innovative Research in Engineering
          </a>
        </div>

        {/* Author */}
        <div>
          <p className="text-gray-500 mb-2">Author</p>
          <div className="flex items-center gap-2 text-gray-800 font-medium">
            <User size={16} />
            Sathya E
          </div>
        </div>

        {/* Research Area */}
        <div>
          <p className="text-gray-500 mb-2">Research Area</p>
          <p className="text-gray-800 font-medium">Management (All Branch)</p>
        </div>

        {/* Status */}
        <div>
          <p className="text-gray-500 mb-2">Status</p>
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-md text-sm font-medium">
            Accepted
          </span>
        </div>
      </div>

      {/* Publish Document */}
      <div className="mt-6">
        <p className="text-gray-500 mb-2">Publish Document</p>
      </div>

      {/* Details Box */}
      <div className="mt-3 bg-gray-50 rounded-2xl p-6 h-40"></div>
    </div>
  );
}
