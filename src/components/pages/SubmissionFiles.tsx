import React, { useState, useEffect, useCallback } from 'react';
import {
    Download, Trash, Upload, AlertCircle, Check,
    Eye
} from 'lucide-react';
import FileUploadCard from '../submissions/FileUploadCard';
import { useAppDispatch, useAppSelector } from '../../lib/store/store';
import { handleDownload } from '../../utils/utility';
import { useDeleteDocument } from '../../hook/useDeleteFIle';
import toast from 'react-hot-toast';
import LoadingScreen from '../ui/LoadingScreen';
import { removeFinalFile } from '../../lib/store/features/submission';
import { verifyGalleyFile } from '../../lib/store/features/submission';
import { useVerifyCorrection } from '../../hook/useVerifyCorrection';
import type { FileItem } from '../../types';
import { useArticleDetails } from '../../hook/useArticleDetails';

const SubmissionFiles: React.FC = () => {
    const [UploadCard, setUploadCard] = useState<boolean>(false);
    const [GalleyCard, setGalleyCard] = useState<boolean>(false)
    const [ShowComments, setShowComments] = useState<{ state: boolean, title: string, content: string }>({ state: false, title: '', content: '' })
    const dispatch = useAppDispatch()
    const [tempId, setTempId] = useState<string>("")
    const { deleteDocument, error, success, loading } = useDeleteDocument()
    const { article } = useAppSelector((state) => state.article);
    const documents_table0 = useAppSelector((state) => state.article.files_0);
    //  const { id: article_id } = useAppSelector((state) => state.article.article!);
    
    const article_id = article?.id;
    // const documents_table1 = useAppSelector((state) => state.article.files_1);
    const documents_table2 = useAppSelector((state) => state.article.files_2);
    const documents_table3 = useAppSelector((state) => state.article.files_3);
    const documents_table4 = useAppSelector((state) => state.article.files_4)
    const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; title: string } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedGalleyFile, setSelectedGalleyFile] = useState<FileItem | null>(null);
    const { fetchArticleDetails } = useArticleDetails();
    const { verifyGalleyFile: verifyApi } = useVerifyCorrection();
    const handleDelete = useCallback((id: string, title: string) => {
        setDeleteConfirm({ id, title });
    }, [])

    useEffect(() => {
        if (success) {
            dispatch(removeFinalFile({
                id: parseInt(tempId),
                type: "file"
            }));
            toast.success("File deleted successfully");
        }
        if (error) {
            toast.error(error);
        }
    }, [success, error, dispatch, tempId]);


    // for veryfying api
   const handleVerify = async (file_id: number) => {
    try {
        dispatch(verifyGalleyFile({ id: file_id }));
        const response = await verifyApi(file_id);
        if (response.success === true) {
            // dispatch(verifyGalleyFile({ id: file_id }));
            if (article_id) {
                await fetchArticleDetails(article_id);
            }  
            toast.success("Verification Successful");
        } else {
            toast.error(response.message || "Verification failed");
        }
    } catch (error: any) {
        toast.error(error?.response?.data?.message || "Error Verifying file");
    }
};
    const colorChange = (status: string) => {
        switch (status) {
            case "Proof Generated":
                return "bg-blue-100 text-blue-800";
            case "Under Editorial Verification":
                return "bg-purple-100 text-purple-800";
            case "Final Proof Approved":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const confirmDelete = async () => {
        if (!deleteConfirm) return;
        setIsDeleting(true);

        dispatch(removeFinalFile({ id: parseInt(deleteConfirm.id), type: 'file' }));
        setTempId(deleteConfirm.id);
        setDeleteConfirm(null);

        try {
            const res = await deleteDocument({ doc_title: deleteConfirm.title, id: deleteConfirm.id, file: null });
            if (res?.data?.status) {
                toast.success("File deleted successfully");
            }
        } catch (err) {
            toast.error('Failed to delete file. Refreshing list.');
            // ->console.log(err)
            window.location.reload();
        } finally {
            setIsDeleting(false);
        }
    }

    const cancelDelete = () => {
        setDeleteConfirm(null);
    }
    //     const approvedIndex = documents_table4.findIndex(
    //   (doc) => doc.verified_by === "Final Proof Approved"
    // );

    return (

        <div className="min-h-screen pr-4 lg:pr-0">
            {UploadCard && <FileUploadCard
                UploadCardToggle={setUploadCard}
                sectionType={"file"}
            />}
            {GalleyCard && (
                <FileUploadCard
                    UploadCardToggle={setGalleyCard}
                    sectionType={"galley"}
                    EditFile={selectedGalleyFile}
                />
            )}
            {loading && <LoadingScreen title='Data' />}
            <div className="">
                {/* Header */}
                <div className="flex items-center justify-between mb-2 flex-wrap space-y-4">
                    <div className=''>
                        <h1 className="text-2xl font-semibold text-gray-900">Document Manager</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage all files related to your article submission</p>
                    </div>
                    <button onClick={() => setUploadCard(true)} className="flex items-center gap-2 bg-(--journal-600) text-white px-4 py-2 rounded-lg hover:bg-(--journal-700) transition-colors">
                        <Upload className="w-4 h-4" />
                        Upload File
                    </button>
                </div>

                {/* Confirmation Modal */}
                {deleteConfirm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-lg max-w-sm w-full">
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-red-100 rounded-full">
                                        <AlertCircle className="w-6 h-6 text-red-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">Delete File?</h3>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">Are you sure you want to delete this file?</p>
                                <p className="text-sm font-medium text-gray-500 mb-6 p-3 bg-gray-50 rounded">
                                    <span className="text-gray-500">Title: </span>
                                    {deleteConfirm.title}
                                </p>
                                <div className="flex gap-3">
                                    <button onClick={cancelDelete} disabled={isDeleting} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50">Cancel</button>
                                    <button onClick={confirmDelete} disabled={isDeleting} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50">
                                        {isDeleting ? (<><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2" />Deleting...</>) : 'Delete'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Document Manager Table/Cards */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-8">
                    {/* Desktop Table View */}
                    <div className="hidden md:block">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-(--journal-500) border-b border-(--journal-500)">
                                    <th className="text-left py-4 px-6 text-sm font-medium text-white">S.NO</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-white">Title</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-white">Created At</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-white">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr key={article?.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="py-4 px-6 text-sm text-gray-900">1</td>
                                    <td className="py-4 px-6 text-sm text-gray-900">{article?.title}</td>
                                    <td className="py-4 px-6 text-sm text-gray-900">{article?.created_at}</td>
                                    <td className="py-4 px-6">
                                        <button onClick={() => handleDownload(article?.file_url ?? "", article?.title ?? "")} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                            <Download className="w-4 h-4 text-gray-600" />
                                        </button>
                                    </td>
                                </tr>
                                {documents_table0.map((doc, idx) => (
                                    <tr key={doc.article_id + idx} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="py-4 px-6 text-sm text-gray-900">{idx + 2}</td>
                                        <td className="py-4 px-6 text-sm text-gray-900">{doc.doc_title}</td>
                                        <td className="py-4 px-6 text-sm text-gray-900">{doc.create_at}</td>
                                        <td className="py-4 px-6 flex items-center gap-5">
                                            <button onClick={() => handleDownload(doc.url ?? "", doc.doc_title)} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                                <Download className="w-4 h-4 text-gray-600" />
                                            </button>
                                            <button onClick={() => handleDelete(doc.id.toString(), doc.doc_title)} className="p-2 border border-red-300 rounded-lg hover:bg-red-50 transition-colors">
                                                <Trash className="w-4 h-4 text-red-600" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden p-4 space-y-4">
                        {/* Article Card */}
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-base font-semibold text-gray-900">Title</h3>
                                <button onClick={() => handleDownload(article?.file_url ?? "", article?.title ?? "")} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                    <Download className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>
                            <p className="text-sm text-gray-900 mb-4">{article?.title}</p>
                            <div>
                                <p className="text-sm text-gray-500">Created at</p>
                                <p className="text-sm text-gray-900">{article?.created_at}</p>
                            </div>
                        </div>

                        {/* Documents Cards */}
                        {documents_table0.map((doc, idx) => (
                            <div key={doc.article_id + idx} className="bg-white rounded-lg border border-gray-200 p-4">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-base font-semibold text-gray-900">Title</h3>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleDownload(doc.url ?? "", doc.doc_title)} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                            <Download className="w-5 h-5 text-gray-600" />
                                        </button>
                                        <button onClick={() => handleDelete(doc.id.toString(), doc.doc_title)} className="p-2 border border-red-300 rounded-lg hover:bg-red-50 transition-colors">
                                            <Trash className="w-5 h-5 text-red-600 " />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-900 mb-4">{doc.doc_title}</p>
                                <div>
                                    <p className="text-sm text-gray-500">Created at</p>
                                    <p className="text-sm text-gray-900">{doc.create_at}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Plagiarism Report */}
                {/* <div className="mt-12"> */}
                {/* <h2 className="text-xl font-semibold text-gray-900 mb-4">Plagiarism report</h2> */}
                {/* <div className="bg-white rounded-lg shadow-sm overflow-hidden"> */}
                {/* Desktop Table */}
                {/* <div className="hidden md:block"> */}
                {/* <table className="w-full">
                                <thead>
                                    <tr className="bg-(--journal-500) border-b border-(--journal-500)">
                                        <th className="text-left py-4 px-6 text-sm font-medium text-white">S.NO</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-white">Title</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-white">Created At</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-white">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {documents_table1.map((doc, idx) => (
                                        <tr key={doc.article_id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="py-4 px-6 text-sm text-gray-900">{idx+1}</td>
                                            <td className="py-4 px-6 text-sm text-gray-900">{doc.doc_title}</td>
                                            <td className="py-4 px-6 text-sm text-gray-900">{doc.create_at}</td>
                                            <td className="py-4 px-6">
                                                <button onClick={() => handleDownload(doc.url ?? "", doc.doc_title)} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                                    <Download className="w-4 h-4 text-gray-600" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody> */}
                {/* </table> */}
                {/* </div> */}

                {/* Mobile Cards */}
                {/* <div className="md:hidden p-4 space-y-4">
                            {documents_table1.map((doc) => (
                                <div key={doc.article_id} className="bg-white rounded-lg border border-gray-200 p-4">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-base font-semibold text-gray-900">Title</h3>
                                        <button onClick={() => handleDownload(doc.url ?? "", doc.doc_title)} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                            <Download className="w-5 h-5 text-gray-600" />
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-900 mb-4">{doc.doc_title}</p>
                                    <div>
                                        <p className="text-sm text-gray-500">Created at</p>
                                        <p className="text-sm text-gray-900">{doc.create_at}</p>
                                    </div>
                                </div>
                            ))}
                        </div> */}
                {/* </div> */}
                {/* </div> */}
                {/* {UploadCard && <FileUploadCard
                UploadCardToggle={setUploadCard}
                sectionType={"galley"}
            />} */}
                <h2 className="text-xl font-semibold text-gray-900 mt-4 ">Galley Correction</h2>
                <div className="bg-white rounded-lg shadow-sm mt-4">

                    {/* Desktop Table View */}
                    <div className="hidden md:block">
                        {/* <button onClick={() => setUploadCard(true)} className="flex items-center gap-2 bg-(--journal-600) text-white px-4 py-2 rounded-lg hover:bg-(--journal-700) transition-colors">
                        <Upload className="w-4 h-4" />
                        Upload File
                    </button> */}
                        <table className="w-full relative">
                            <thead>
                                <tr className="bg-(--journal-500) border-b border-(--journal-500)">
                                    <th className="text-left py-4 px-6 text-sm font-medium text-white">S.NO</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-white">Title</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-white">Created By</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-white">Comments</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-white">Status</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-white">Actions</th>
                                </tr>
                            </thead>
                            <tbody >
                                {ShowComments.state && <div className='comment-box p-4 bg-gray-50 border border-gray-300 rounded-md  absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10 w-[300px] overflow-hidden break-all shadow-2xl'>
                                    <div className='flex items-center justify-between'>
                                        <h3 className='text-2xl pb-2'>{ShowComments.title}</h3> <button className='text-blue-500 hover:underline' onClick={() => setShowComments({ state: false, title: '', content: '' })}>Close</button>
                                    </div>
                                    <p>{ShowComments.content}</p>
                                </div>}
                                {documents_table4.map((doc, idx) => {
                                    const ApprovedIndex = documents_table4.findIndex((s) => s.verified_by === "Final Proof Approved");
                                    const isDisabled = ApprovedIndex !== -1 && idx <= ApprovedIndex;
                                    const isThisApproved = doc.verified_by?.toLowerCase() === "Final Proof Approved".toLowerCase();
                                    return (
                                        <tr key={doc.article_id + idx} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="py-4 px-6 text-sm text-gray-900">{idx + 1}</td>
                                            <td className="py-4 px-6 text-sm text-gray-900">{doc.doc_title}</td>
                                            <td className="py-4 px-6 text-sm text-gray-900">{doc.uploaded_by}</td>
                                            <td className="py-4 px-6 text-sm text-gray-900">{doc.comments && doc.comments?.length > 50 ?
                                                <div className='flex items-center gap-4'>
                                                    <p>{doc.comments?.slice(0, 50)}...</p>
                                                    <button className='p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors' onClick={() =>
                                                        setShowComments({ state: !ShowComments.state, title: doc.doc_title, content: doc.comments?.trim() ?? '' })}>
                                                        <Eye className='w-4 h-4 text-gray-600' />
                                                    </button>
                                                </div> : doc.comments}
                                            </td>
                                            <td className="py-4 px-6 text-sm">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${colorChange(doc.verified_by || '')}`}>
                                                    {doc.verified_by}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 flex items-center gap-5">
                                                {/* to show the download button only once */}
                                                <button onClick={() => handleDownload(doc.url ?? "", doc.doc_title)} className="p-2 border border-gray-300 rounded-lg transition-colors">
                                                    <Download className="w-4 h-4 text-gray-600" />
                                                </button>
                                                {/*to show upload before verifying*/}
                                                {documents_table4.length <= 1 && !isThisApproved && !isDisabled && (
                                                    <div className="py-4 px-6 flex items-center gap-5">

                                                        <span className="relative flex items-center justify-center group">
                                                            <button
                                                                onClick={() => {
                                                                    setGalleyCard(true);
                                                                    setSelectedGalleyFile(doc);
                                                                }}
                                                                className="flex items-center gap-2 p-2 border border-gray-300 rounded-lg transition-colors"
                                                            >
                                                                <Upload className="w-4 h-4 text-gray-600 " />
                                                                Request Correction
                                                            </button>

                                                            {/* <span className="absolute -top-10 text-sm px-3 py-2 bg-blue-50 shadow rounded-md text-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none">
                                                                Re-Upload
                                                            </span> */}
                                                        </span>


                                                        <span className="relative flex items-center justify-center group">
                                                            <button
                                                                onClick={() => handleVerify(doc.id)}
                                                                className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg border border-gray-300  transition-colors"
                                                            >
                                                                <Check className="w-4 h-4 text-green-600" />
                                                                Verify
                                                            </button>

                                                            {/* <span className="absolute -top-10 text-sm px-3 py-2 bg-blue-50 shadow rounded-md text-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none">
                                                                U
                                                            </span> */}
                                                        </span>

                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Mobile Card View */}
                 <div className="md:hidden bg-white rounded-lg p-4 space-y-4 ">
                            {ShowComments.state && <div className='comment-box p-4 bg-gray-50 border border-gray-300 rounded-md  fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  z-10 w-[300px] overflow-hidden break-all shadow-2xl'>
                                    <div className='flex items-center justify-between'>
                                        <h3 className='text-sm pb-2'>{ShowComments.title}</h3> <button className='text-blue-500 hover:underline' onClick={() => setShowComments({ state: false, title: '', content: '' })}>Close</button>
                                    </div>
                                    <p>{ShowComments.content}</p>
                                </div>}
                            {documents_table4.map((doc, idx) => {
                                    const ApprovedIndex = documents_table4.findIndex((s) => s.verified_by === "Final Proof Approved");
                                    const isDisabled = ApprovedIndex !== -1 && idx <= ApprovedIndex;
                                    const isThisApproved = doc.verified_by?.toLowerCase() === "Final Proof Approved".toLowerCase();
                                return (
                                
                                <div key={doc.article_id + idx} className="bg-white rounded-lg border border-gray-200 p-4">
                                    <div>
                                    <div className="flex justify-between items-start ">
                                        <h3 className="text-base font-semibold text-gray-900">Title</h3>
                                       
                                        <button onClick={() => handleDownload(doc.url ?? "", doc.doc_title)} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                            <Download className="w-5 h-5 text-gray-600" />
                                        </button>
                                    </div>
                                     <h3 className="text-base font-semibold text-gray-900">{doc.doc_title}</h3>
                                    </div>
                                    <p className="text-sm text-gray-400 mt-2 mb-2">Created By</p>
                                    <p className="text-sm text-gray-900 mb-4">{doc.uploaded_by}</p>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-2">Comments</p>
                                        <h6
                                         className=" text-sm text-gray-900 ">{doc.comments && doc.comments?.length > 10 ?
                                                <div>
                                                    <p>{doc.comments?.slice(0, 25)}...</p>
                                                    <button className='mt-2 p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors ' onClick={() =>
                                                        setShowComments({ state: !ShowComments.state, title: doc.doc_title, content: doc.comments?.trim() ?? '' })}>
                                                        <Eye className='w-4 h-4 text-gray-600 ' />
                                                    </button>
                                                </div> : doc.comments}
                                            </h6>
                                    </div>

                                    <div className='flex items center'>
                                        
                                        {documents_table4.length <= 1 && !isThisApproved && !isDisabled && (
                                                    <div className="py-4  flex items-center gap-5">

                                                        <span className="relative flex items-center justify-center group">
                                                            <button
                                                                onClick={() => {
                                                                    setGalleyCard(true);
                                                                    setSelectedGalleyFile(doc);
                                                                }}
                                                                className="flex items-center gap-2 p-2 border border-gray-300 rounded-lg transition-colors"
                                                            >
                                                                <Upload className="w-4 h-4 text-gray-600 " />
                                                                Request Correction
                                                            </button>
                                                        </span>


                                                        <span className="relative flex items-center justify-center group">
                                                            <button
                                                                onClick={() => handleVerify(documents_table4[0].id)}
                                                                className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg border border-gray-300  transition-colors"
                                                            >
                                                                <Check className="w-4 h-4 text-green-600" />
                                                                Verify
                                                            </button>
                                                        </span>

                                                    </div>
                                                )}</div>
                                </div>
                                  

                           );
                           } )}
                        </div>

                {/* Certificate Details */}
                <div className="mt-12">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Certificate Details & Similarity Report (Optional)</h2>
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        {/* Desktop Table */}
                        <div className="hidden md:block">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-(--journal-500) border-b border-(--journal-500)">
                                        <th className="text-left py-4 px-6 text-sm font-medium text-white">S.NO</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-white">Title</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-white">Created At</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-white">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {documents_table2.map((doc, idx) => (
                                        <tr key={doc.article_id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="py-4 px-6 text-sm text-gray-900">{idx + 1}</td>
                                            <td className="py-4 px-6 text-sm text-gray-900">{doc.doc_title}</td>
                                            <td className="py-4 px-6 text-sm text-gray-900">{doc.create_at}</td>
                                            <td className="py-4 px-6">
                                                <button onClick={() => handleDownload(doc.url ?? "", doc.doc_title)} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                                    <Download className="w-4 h-4 text-gray-600" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden p-4 space-y-4">
                            {documents_table2.map((doc) => (
                                <div key={doc.article_id} className="bg-white rounded-lg border border-gray-200 p-4">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-base font-semibold text-gray-900">Title</h3>
                                        <button onClick={() => handleDownload(doc.url ?? "", doc.doc_title)} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                            <Download className="w-5 h-5 text-gray-600" />
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-900 mb-4">{doc.doc_title}</p>
                                    <div>
                                        <p className="text-sm text-gray-500">Created at</p>
                                        <p className="text-sm text-gray-900">{doc.create_at}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Published Article Details */}
                <div className="mt-12">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Published article details</h2>
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        {/* Desktop Table */}
                        <div className="hidden md:block">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-(--journal-500) border-b border-(--journal-500)">
                                        <th className="text-left py-4 px-6 text-sm font-medium text-white">S.NO</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-white">Title</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-white">Created At</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-white">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {documents_table3.map((doc, idx) => (
                                        <tr key={doc.article_id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="py-4 px-6 text-sm text-gray-900">{idx + 1}</td>
                                            <td className="py-4 px-6 text-sm text-gray-900">{doc.doc_title}</td>
                                            <td className="py-4 px-6 text-sm text-gray-900">{doc.create_at}</td>
                                            <td className="py-4 px-6">
                                                <button onClick={() => handleDownload(doc.url ?? "", doc.doc_title)} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                                    <Download className="w-4 h-4 text-gray-600" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden p-4 space-y-4">
                            {documents_table3.map((doc) => (
                                <div key={doc.article_id} className="bg-white rounded-lg border border-gray-200 p-4">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-base font-semibold text-gray-900">Title</h3>
                                        <button onClick={() => handleDownload(doc.url ?? "", doc.doc_title)} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                            <Download className="w-5 h-5 text-gray-600" />
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-900 mb-4">{doc.doc_title}</p>
                                    <div>
                                        <p className="text-sm text-gray-500">Created at</p>
                                        <p className="text-sm text-gray-900">{doc.create_at}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubmissionFiles;