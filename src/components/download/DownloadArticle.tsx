import { Download } from 'lucide-react';
import { Link, useOutletContext } from 'react-router-dom';
import type { DownloadsFilesResponse } from '../../hook/useDownloads';

function DownloadTable({ title }: { title: string }) {
  const { data } = useOutletContext<{ data: DownloadsFilesResponse }>()
  const articleData = [{
    doc_title: "Article Template",
    file_url: data.files
  }]

  //->console.log("data ->", data)

  // Get the appropriate data array based on title
  const getDataArray = () => {
    if (title === "Manuscript Files") return data.manuscripts;
    if (title === "Copyright Form") return data.final_copy_right_forms;
    if (title === "Article") return articleData;
    return [];
  };

  const dataArray = getDataArray();

  return (
    <div className="min-h-screen px-0">
      <div className="w-full">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">{title}</h2>

          {/* Desktop Table View - Hidden on md and below */}
          <div className="hidden md:block">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {title === "Manuscript Files" && data.manuscripts.map((template, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-5 text-sm text-gray-700">
                      {template.title}
                    </td>
                    <td className="px-6 py-5">
                      <Link to={template.file_url}>
                        <button
                          className="inline-flex items-center gap-2 px-6 py-2 bg-(--journal-600) text-white rounded-lg hover:bg-(--journal-700) transition-colors font-medium"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
                {title === "Copyright Form" && data.final_copy_right_forms.map((template, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-5 text-sm text-gray-700">
                      {template.doc_title}
                    </td>
                    <td className="px-6 py-5">
                      <Link to={template.file_url}>
                        <button
                          className="inline-flex items-center gap-2 px-6 py-2 bg-(--journal-600) text-white rounded-lg hover:bg-(--journal-700) transition-colors font-medium"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
                {title === "Article" && articleData.map((template, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-5 text-sm text-gray-700">
                      {template.doc_title}
                    </td>
                    <td className="px-6 py-5">
                      <Link to={template.file_url}>
                        <button
                          className="inline-flex items-center gap-2 px-6 py-2 bg-(--journal-600) text-white rounded-lg hover:bg-(--journal-700) transition-colors font-medium"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View - Visible on md and below */}
          <div className="md:hidden space-y-4">
            {dataArray.map((item: any, index) => {
              const itemTitle = item.title || item.doc_title;
              const itemUrl = item.file_url;

              return (
                <div key={index} className="flex justify-between items-center bg-white rounded-lg border border-gray-200 p-6">
                  {/* Name/Title */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Name</p>
                    <p className="text-base text-gray-900 font-medium">
                      {itemTitle}
                    </p>
                  </div>

                  {/* Download Button */}
                  <Link className='ml-4' to={itemUrl}>
                    <button
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-(--journal-500) text-white rounded-lg hover:bg-(--journal-600) transition-colors font-medium"
                    >
                      <Download className="w-5 h-5" />
                      Download
                    </button>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DownloadTable;