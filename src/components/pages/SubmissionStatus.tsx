import React, { useEffect, useState } from 'react';
import { Upload, Download, AlertCircle, Info, Edit, Send } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../lib/store/store';
import { handleDownload } from '../../utils/utility';
import FileUploadCard from '../submissions/FileUploadCard';
import type { FileItem, UploadType } from '../../types';
import { toast } from 'react-hot-toast';
import { useFrizeFinalSubmission } from '../../hook/useFinalSubmission';
// import { updateFile } from '../../lib/store/features/submission';
// import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useArticleDetails } from '../../hook/useArticleDetails';
import { setFrizee } from '../../lib/store/features/globle';


const SubmissionStatus: React.FC = () => {
  const {
    final_copy_right_forms: finalArticles,
    final_manuscripts: finalManuscripts,
    final_payment_scripts: finalScripts,
    article,
    final_download_link
  } = useAppSelector((state) => state.article);

  const { activePaperId, Frizee } = useAppSelector((state) => state.global)

  const article_id = article?.id ?? activePaperId ?? ""

  const dispatch = useAppDispatch()
  const [upload, setUploadCard] = useState<boolean>(false);
  const [activeFile, setActiveFile] = useState<FileItem | null>(null);
  const [sectionType, setSectionType] = useState<UploadType>('manuscript');
  const [isEdited, setIsEdited] = useState<boolean>(article?.freeze_data ? true : false);

  useEffect(()=>{
    dispatch(setFrizee(isEdited))
  },[isEdited])

  const {fetchArticleDetails} = useArticleDetails()
  const { frizeFinalDocument, loading } = useFrizeFinalSubmission();

  const handleUploadFile = (type: UploadType) => {
    setSectionType(type);
    setUploadCard(true);
  };

  const handleEditFile = (type: UploadType, file: FileItem) => {
    setSectionType(type);
    setActiveFile(file);
    setUploadCard(true);
  };

  const handleSubmitFinal = async () => {
    try {

      frizeFinalDocument(article_id.toString())
      // refetch
      fetchArticleDetails(article_id)


      toast.success("All final documents submitted successfully.");
      setIsEdited(true)
    }
    catch (err) {
      toast.error("Final submission failed.");
      //->console.log(err)
    }
  };

  // if (error) {
  //   toast.error(error)
  // }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto ">
        {upload && (
          <FileUploadCard
            UploadCardToggle={setUploadCard}
            EditFile={activeFile}
            setActiveFile={setActiveFile}
            sectionType={sectionType}
            setIsEdited={setIsEdited}
          />
        )}

        {/* Note Section */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex items-start">
            <Info className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Note</h3>
              <p className="text-sm text-gray-700 mb-2">
                Once you're Article Accepted for Publication, Author have to submit below mentioned Documents within a Week
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 mb-2 ml-3">
                <li>
                  Final Manuscript (As per our Journal format){" "}
                  <Link to={final_download_link} className="text-(--journal-600) hover:text-(--journal-700) underline">
                    Click here to Download
                  </Link>
                </li>
                <li>
                  Copyright form (Before generating copyright form-Author have to update profile)
                </li>
                <li>Article Processing fee receipt</li>
              </ol>
              <p className="text-sm text-gray-700 mb-3">
                Once you have submitted all required documents, your article will be processed and published within 24hrs to 48hrs.
              </p>
              <div className="flex items-start">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 mr-2 shrink-0" />
                <p className="text-sm text-red-600 font-medium">
                  Please ensure all documents are complete before final submission
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Final Article Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Final Manuscript</h2>
              <button
                onClick={() => handleUploadFile('manuscript')}
                className="flex items-center gap-2 px-4 py-2 bg-(--journal-600) text-white rounded-lg hover:bg-(--journal-700) transition-colors text-sm font-medium"
              >
                <Upload className="w-4 h-4" />
                Upload File
              </button>
            </div>
            {/* edit option setting */}
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <table className="w-full">
                <thead>
                  <tr className="bg-(--journal-500) border-b border-(--journal-500)">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">S.NO</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">Title</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">Created At</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {finalManuscripts.map((article, itr) => (
                    <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-700">{itr + 1}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {article.doc_title.length > 40
                          ? `${article.doc_title.slice(0, 40)}...`
                          : article.doc_title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{article.create_at}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            handleDownload(
                              article.file_url ?? "",
                              article.doc_title ?? article.article_id.toString()
                            )
                          }
                          className="p-2 rounded-lg border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                        >
                          <Download className="w-4 h-4 text-gray-600" />
                        </button>
                        {!article.freeze_data && (
                          <button
                            onClick={() => handleEditFile('manuscript', article)}
                            className="ml-4 p-2 rounded-lg border-2 border-green-300 hover:border-green-400 hover:bg-green-50 transition-colors"
                          >
                            <Edit className="w-4 h-4 text-green-600" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {finalManuscripts.map((article, itr) => (
                <div key={article.id + itr} className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-base font-semibold text-gray-900">Title</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleDownload(
                            article.file_url ?? "",
                            article.doc_title ?? article.article_id.toString()
                          )
                        }
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Download className="w-5 h-5 text-gray-600" />
                      </button>
                      {!article.freeze_data && (
                        <button
                          onClick={() => handleEditFile('manuscript', article)}
                          className="p-2 border border-green-300 rounded-lg hover:bg-green-50 transition-colors"
                        >
                          <Edit className="w-5 h-5 text-green-600" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-900 mb-4">
                    {article.doc_title.length > 40
                      ? `${article.doc_title.slice(0, 40)}...`
                      : article.doc_title}
                  </p>
                  <div>
                    <p className="text-sm text-gray-500">Created at</p>
                    <p className="text-sm text-gray-900">{article.create_at}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Copyrights Form</h2>
              <button
                onClick={() => handleUploadFile('copyright')}
                className="flex items-center gap-2 px-4 py-2 bg-(--journal-600) text-white rounded-lg hover:bg-(--journal-700) transition-colors text-sm font-medium"
              >
                <Upload className="w-4 h-4" />
                Upload File
              </button>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block">
              <table className="w-full">
                <thead>
                  <tr className="bg-(--journal-500) border-b border-(--journal-500)">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">S.NO</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">Title</th>
                    {/* <th className="px-6 py-3 text-left text-sm font-semibold text-white">Research Area</th> */}
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">Created At</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {finalArticles.map((article, itr) => (
                    <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-700">{itr + 1}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {article.doc_title.length > 40
                          ? `${article.doc_title.slice(0, 70)}...`
                          : article.doc_title}
                      </td>
                      {/* <td className="px-6 py-4 text-sm text-gray-700">{article.articletitle ?? "N/A"}</td> */}
                      <td className="px-6 py-4 text-sm text-gray-700">{article.create_at}</td>
                      <td className="px-6 py-4 flex">
                        <button
                          onClick={() =>
                            handleDownload(
                              article.file_url ?? "",
                              article.doc_title ?? article.article_id.toString()
                            )
                          }
                          className="p-2 rounded-lg border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                        >
                          <Download className="w-4 h-4 text-gray-600" />
                        </button>
                        {!article.freeze_data && (
                          <button
                            onClick={() => handleEditFile('copyright', article)}
                            className="ml-4 p-2 rounded-lg border-2 border-green-300 hover:border-green-400 hover:bg-green-50 transition-colors"
                          >
                            <Edit className="w-4 h-4 text-green-600" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {finalArticles.map((article, itr) => (
                <div key={article.id + itr} className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-base font-semibold text-gray-900">Title</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleDownload(
                            article.file_url ?? "",
                            article.doc_title ?? article.article_id.toString()
                          )
                        }
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Download className="w-5 h-5 text-gray-600" />
                      </button>
                      {!article.freeze_data && (
                        <button
                          onClick={() => handleEditFile('copyright', article)}
                          className="p-2 border border-green-300 rounded-lg hover:bg-green-50 transition-colors"
                        >
                          <Edit className="w-5 h-5 text-green-600" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-900 mb-4">
                    {article.doc_title.length > 40
                      ? `${article.doc_title.slice(0, 70)}...`
                      : article.doc_title}
                  </p>
                  <div>
                    <p className="text-sm text-gray-500">Created at</p>
                    <p className="text-sm text-gray-900">{article.create_at}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Receipt Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Payment Receipt</h2>
              <button
                onClick={() => handleUploadFile('payment')}
                className="flex items-center gap-2 px-4 py-2 bg-(--journal-600) text-white rounded-lg hover:bg-(--journal-700) transition-colors text-sm font-medium"
              >
                <Upload className="w-4 h-4" />
                Upload File
              </button>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block">
              <table className="w-full">
                <thead>
                  <tr className="bg-(--journal-500) border-b border-(--journal-500)">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">S.NO</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">Title</th>
                    {/* <th className="px-6 py-3 text-left text-sm font-semibold text-white">Research Area</th> */}
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">Created At</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {finalScripts.map((article, itr) => (
                    <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-700">{itr + 1}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {article.doc_title.length > 40
                          ? `${article.doc_title.slice(0, 40)}...`
                          : article.doc_title}
                      </td>
                      {/* <td className="px-6 py-4 text-sm text-gray-700">{article.articletitle ?? "N/A"}</td> */}
                      <td className="px-6 py-4 text-sm text-gray-700">{article.create_at}</td>
                      <td className="px-6 py-4 flex">
                        <button
                          onClick={() =>
                            handleDownload(
                              article.file_url ?? "",
                              article.doc_title ?? article.article_id.toString()
                            )
                          }
                          className="p-2 rounded-lg border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                        >
                          <Download className="w-4 h-4 text-gray-600" />
                        </button>
                        {!article.freeze_data && (
                          <button
                            onClick={() => handleEditFile('payment', article)}
                            className="ml-4 p-2 rounded-lg border-2 border-green-300 hover:border-green-400 hover:bg-green-50 transition-colors"
                          >
                            <Edit className="w-4 h-4 text-green-600" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {finalScripts.map((article, itr) => (
                <div key={article.id + itr} className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-base font-semibold text-gray-900">Title</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleDownload(
                            article.file_url ?? "",
                            article.doc_title ?? article.article_id.toString()
                          )
                        }
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Download className="w-5 h-5 text-gray-600" />
                      </button>
                      {!article.freeze_data && (
                        <button
                          onClick={() => handleEditFile('payment', article)}
                          className="p-2 border border-green-300 rounded-lg hover:bg-green-50 transition-colors"
                        >
                          <Edit className="w-5 h-5 text-green-600" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-900 mb-4">
                    {article.doc_title.length > 40
                      ? `${article.doc_title.slice(0, 40)}...`
                      : article.doc_title}
                  </p>
                  <div>
                    <p className="text-sm text-gray-500">Created at</p>
                    <p className="text-sm text-gray-900">{article.create_at}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmitFinal}
        disabled={Frizee}
        className="flex items-center gap-2 px-6 py-3 bg-(--journal-600) text-white rounded-lg hover:bg-(--journal-700) transition-colors text-sm font-medium mx-auto mt-5 disabled:bg-gray-400"
      >
        <Send className="w-4 h-4" />
        {loading ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
};

export default SubmissionStatus;