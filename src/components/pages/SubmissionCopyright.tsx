import React from 'react';
import { Download } from 'lucide-react';
import { useAppSelector } from '../../lib/store/store';
import { handleDownload } from '../../utils/utility';
import { useFetchCopyrightForm } from '../../hook/useCopyrightForm_download';
import toast from 'react-hot-toast';


const SubmissionCopyright: React.FC = () => {
  const copyrightForms = useAppSelector((state) => state.article.copy_right_files);
  const { article, journalShortWithId } = useAppSelector((state) => state.article);
  const { fetchCopyrightForm} = useFetchCopyrightForm();

  const handleDownloadCopyrightLetter = async () => {
    if (article?.id) {
      const downloadTask = async () => {
        const res = await fetchCopyrightForm(article?.id.toString());
        if (!res) throw new Error("Failed to generate copyright form");

        if (!(res instanceof Blob)) {
          if (res.status === false) {
            throw new Error("Please Update Your Profile ( Go to profile → update address )");
          }
          throw new Error("Failed to generate copyright form");
        }

        const blob = res;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Copyright_Form.pdf";
        a.click();
        window.URL.revokeObjectURL(url);
      };

      toast.promise(downloadTask(), {
        loading: "Generating copyright form...",
        success: "Copyright form downloaded",
        error: (err) => err.message,
      });
    };
  }


  return (
    <div className="min-h-screen pr-4 lg:pr-0">
      
      <div className="w-full hidden md:block">
        {copyrightForms.length ? <div className="bg-white rounded-lg shadow-sm overflow-hidden p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Generate the Copyright Form</h2>

          <table className="w-full">
            <thead>
              <tr className="bg-(--journal-500) border-b border-(--journal-500)">
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {copyrightForms.map((form, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-5 text-sm text-gray-700 font-medium">
                    {form.id}
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-700">
                    {form.doc_title}
                  </td>
                  <td className="px-6 py-5">
                    <button

                      onClick={() => handleDownload(form.url ?? "", form.doc_title)}
                      className="inline-flex items-center gap-2 px-6 py-2 bg-(--journal-600) text-white rounded-lg hover:bg-(--journal-700) transition-colors font-medium"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> :
          <div className="bg-white rounded-lg shadow-sm overflow-hidden p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Generate the Copyright Form</h2>

            <table className="w-full">
              <thead>
                <tr className="bg-(--journal-500) border-b border-(--journal-500)  w-full">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Title
                  </th>
                  <th className="px-6 py-4  text-sm font-semibold text-white text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr key={journalShortWithId ?? article?.journalShortWithId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-5 text-sm text-gray-700 font-medium whitespace-nowrap">
                    {journalShortWithId ?? article?.journalShortWithId ?? "N/A"}
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-700 w-full">
                    {article?.title ?? "Untitled Article"}
                  </td>
                  <td className="px-6 py-5">
                    <button
                      onClick={handleDownloadCopyrightLetter}
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
        }
      </div>
      <div className="md:hidden space-y-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Generate the Copyright Form</h2>
          {/* Title Header with Download Button */}
          {copyrightForms.length ? copyrightForms.map((form, index) => (<div key={index} className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-base text-gray-900">Title</h3>
              <p className="text-base font-semibold text-gray-900 mb-4">{form?.doc_title ?? "Untitled Form"}</p>
            </div>
            <button onClick={() => handleDownload(form.url ?? "", form.doc_title ?? "Form")} className="text-base p-2 px-6 border border-gray-300 bg-(--journal-600) hover:bg-(--journal-700) text-white transition-colors rounded-md">
              Download
            </button>
          </div>
          )
          ) : (
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-base text-gray-900">Title</h3>
                <p className="text-base font-semibold text-gray-900 mb-4">{article?.title ?? "Untitled Article"}</p>
              </div>
              <button onClick={handleDownloadCopyrightLetter} className="text-base p-2 px-6 border border-gray-300 bg-(--journal-600) hover:bg-(--journal-700) text-white transition-colors rounded-md">
                Download
              </button>
            </div>
          )}

          {/* Created at (using journalShortWithId as ID reference) */}
          <div>
            <p className="text-base text-gray-500">Created at</p>
            <p className="text-base font-semibold text-gray-900">{journalShortWithId ?? article?.journalShortWithId ?? "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionCopyright;