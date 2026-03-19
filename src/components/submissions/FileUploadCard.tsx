import React, { useEffect, useState } from 'react';
import { X, FileText } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../lib/store/store';
import { addFinalFile, updateFile } from '../../lib/store/features/submission';
import type { FileItem, UploadType } from '../../types';
import { useEditFinalSubmission, useFinalSubmission } from '../../hook/useFinalSubmission';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import { setFrizee } from '../../lib/store/features/globle';

function FileUploadCard({
    UploadCardToggle,
    sectionType,
    setActiveFile,
    EditFile,
    setIsEdited

}: {
    UploadCardToggle: (i: boolean) => void,
    sectionType?: UploadType,
    EditFile?: FileItem | null,
    setActiveFile?: (arg: FileItem | null) => void,
    setIsEdited?: (isEdited: boolean) => void
}) {
    const pathname = useLocation().pathname;
    const { uploadFinalDocument, data, error, loading } = useFinalSubmission();
    const { editFinalDocument, data: editData, error: editErr, loading: editLoading } = useEditFinalSubmission();
    const { id: article_id } = useAppSelector((state) => state.article.article!);
    const dispatch = useAppDispatch();


    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [documentName, setDocumentName] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [existingFileUrl] = useState<string | null>(null);
    const [isFetchingFile, setIsFetchingFile] = useState(false);
    const [comments, setComments] = useState<string>('');
    const [isConfirmed,setIsConfirmed]= useState<boolean>(false);

    // Initialize with EditFile data if editing
    // useEffect(() => {
    //     if (EditFile) {
    //         setDocumentName(EditFile.doc_title);
    //         setExistingFileUrl(EditFile.file_url??null);
    //     }
    // }, [EditFile]);

    // Handle success messages
    useEffect(() => {
        if (data?.message) {
            toast.success(data.message);
            dispatch(setFrizee(true))
        }
    }, [data, dispatch]);

    useEffect(() => {
        if (editData?.message) {
            toast.success(editData.message);
            dispatch(setFrizee(true))
        }
    }, [editData, dispatch]);

    // Handle errors
    useEffect(() => {
        if (error) {
            toast.error("Failed file upload");
        }
    }, [error]);

    useEffect(() => {
        if (editErr) {
            toast.error("Failed file edit");
        }
    }, [editErr]);

    // Convert URL to File object
    const urlToFile = async (url: string, filename: string): Promise<File> => {
        const response = await fetch(url);
        const blob = await response.blob();
        return new File([blob], filename, { type: blob.type });
    };

    const handleUploadFile = async () => {
        //->console.log("Upload File");
        console.log("EditFile object:", EditFile);
        console.log("EditFile?.id:", EditFile?.id);
        console.log("article_id:", article_id);
        console.log("sectionType:", sectionType);

        if (!sectionType) {
            toast.error("Section type is required");
            return;
        }

        // Validate document name
        if (!documentName?.trim()) {
            toast.error("Please enter a document name");
            return;
        }

        try {
            if (EditFile) {
                // EDIT MODE - Always need a file to send
                let fileToUpload: File;

                if (selectedFile) {
                    // User uploaded a new file
                    fileToUpload = selectedFile;
                } else if (existingFileUrl) {
                    // No new file, fetch existing file from URL
                    setIsFetchingFile(true);
                    try {
                        fileToUpload = await urlToFile(existingFileUrl, EditFile.file_path || 'document');
                    } catch (fetchError) {
                        console.error("Error fetching existing file:", fetchError);
                        toast.error("Failed to load existing file");
                        setIsFetchingFile(false);
                        return;
                    }
                    setIsFetchingFile(false);
                    dispatch(setFrizee(false))

                } else {
                    toast.error("No file available to upload");
                    return;
                }

                // Prepare updated file item for Redux
                const updatedFileItem: FileItem = {
                    ...EditFile,
                    doc_title: documentName,
                    file_url: selectedFile ? URL.createObjectURL(selectedFile) : existingFileUrl || EditFile.file_url,
                    freeze_data: 0
                };

                // Call API to edit with the file
                await editFinalDocument({
                    type: sectionType,
                    file: fileToUpload,
                    submissionId: article_id,
                    id: EditFile.id,
                    doc_title: documentName,
                    comments: sectionType === "galley" ? comments : undefined,
                    galley_file_id: (EditFile as any)?.id

                });


                setIsEdited?.(true);
                toast.success(`${documentName} updated successfully`);
                if (sectionType === "galley") {
                    const newCorrectedFile: FileItem = {
                        id: parseInt(Date.now().toString().slice(9)),
                        article_id: article_id,
                        doc_title: documentName,
                        file_path: selectedFile?.name || '',
                        comments: comments || '',
                        create_at: new Date().toISOString(),
                        category: 4,
                        file_url: selectedFile ? URL.createObjectURL(selectedFile) : '',
                        freeze_data: 0,
                        uploaded_by: "Author",
                        verified_by: "proof generated"
                    };
                    dispatch(addFinalFile({ type: "galley", file: newCorrectedFile }))
                }
                else {
                    // Update Redux store
                    dispatch(updateFile({ type: sectionType, file: updatedFileItem }));
                }

            } else {
                // NEW UPLOAD MODE
                if (!selectedFile) {
                    toast.error("Please select a file to upload");
                    return;
                }

                // Create new file item
                const newFileItem: FileItem = {
                    id: parseInt(Date.now().toString().slice(9)), // temporary id
                    article_id: article_id,
                    doc_title: documentName,
                    file_path: selectedFile.name,
                    create_at: new Date().toISOString(),
                    category: sectionType === "galley" ? 4 : 0,
                    file_url: URL.createObjectURL(selectedFile), // temporary URL
                    freeze_data: 0
                };

                // Call API to upload
                await uploadFinalDocument({
                    type: sectionType,
                    file: selectedFile,
                    submissionId: article_id,
                    file_name: documentName,
                    comments: sectionType === "galley" ? comments : undefined,
                    galley_file_id: (EditFile as any)?.id
                });

                setIsEdited?.(false);
                toast.success(`${documentName} uploaded successfully`);
                // Add to Redux store immediately for optimistic UI
                dispatch(addFinalFile({ type: sectionType, file: newFileItem }));
            }

            // Close modal
            UploadCardToggle(false);

        } catch (err) {
            console.error("Upload error:", err);
            toast.error("An error occurred during upload");
        }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const validTypes = ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!validTypes.includes(file.type) || !file.name.match(/\.(doc|docx)$/i)) {
                toast.error("Only Word Documents(.doc,.docx) are accepted");
                return;
            }

            // Validate file size (50MB)
            if (file.size > 10 * 1024 * 1024) {
                toast.error("File size must be less than 10MB");
                return;
            }

            setSelectedFile(file);

            // Set document name if not already set
            if (!documentName) {
                const fileName = file.name.split(".")[0]; // Remove extension
                setDocumentName(fileName);
            }
        }
    };
    const handelClose = () => {
        setActiveFile?.(null)
        UploadCardToggle(false)
    }
    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault();
        setIsDragging(false);

        const file = event.dataTransfer.files?.[0];
        if (file) {
            // Validate file size (50MB)
            if (file.size > 10 * 1024 * 1024) {
                toast.error("File size must be less than 10MB");
                return;
            }

            setSelectedFile(file);

            // Set document name if not already set
            if (!documentName) {
                const fileName = file.name.split(".")[0]; // Remove extension
                setDocumentName(fileName);
            }
        }
    };

    const isSubmitDisabled = !sectionType || (!EditFile && !selectedFile) || !documentName?.trim() || loading || editLoading || isFetchingFile ||(sectionType === "galley" && !isConfirmed);

    return (
        <div className="min-h-screen bg-black/50 flex items-start justify-center p-4 fixed left-0 top-0 max-w-screen w-full h-full z-50">
            <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl sm:scale-80">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        {/* <button className="text-gray-600 hover:text-gray-900">
                            <ArrowLeft className="w-5 h-5" />
                        </button> */}
                        <h2 className="text-xl font-semibold text-gray-900 capitalize">
                            {sectionType} ({EditFile ? 'Edit Document' : 'Upload Document'})
                        </h2>
                    </div>
                    <button
                        onClick={() => handelClose()}
                        className="text-gray-400 hover:text-gray-600"
                        disabled={loading || editLoading || isFetchingFile}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Document Name Input */}
                    {sectionType!=="galley" && pathname.includes("/files") && (
                        <div className="mb-2">
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                Document Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={documentName ?? ""}
                                    onChange={(e) => setDocumentName(e.target.value)}
                                    required
                                    placeholder="Enter document name"
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-(--journal-500) focus:border-transparent"
                                />
                            </div>
                        </div>
                    )}
                    {sectionType === "galley" && (
                        <div className="mb-2">
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                Comments <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                placeholder="Enter Corrections"
                                required
                                rows={1}
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-(--journal-500) focus:border-transparent"
                                
                            />
                        </div>
                    )}

                    {/* Upload Area */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            {EditFile ? 'Replace Document (Optional)' : 'Upload Document'}
                            {!EditFile && <span className="text-red-500"> *</span>}
                        </label>

                        {/* Show existing file info if editing */}
                        {/* {EditFile && existingFileUrl && !selectedFile && (
                            <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-blue-800">
                                    <strong>Current file:</strong> {EditFile.doc_title}
                                </p>
                                <p className="text-xs text-blue-600 mt-1">
                                    Upload a new file to replace it, or keep the current file and just update the name
                                </p>
                            </div>
                        )} */}

                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${isDragging ? 'border-(--journal-500) bg-blue-50' : 'border-gray-300 bg-gray-50'
                                }`}
                        >
                            <input
                                type="file"
                                id="file-upload"
                                className="hidden"
                                onChange={handleFileSelect}
                                accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            />
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 mb-4 text-gray-400">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V8m0 0l-4 4m4-4l4 4M4 20h16" />
                                    </svg>
                                </div>
                                <div className="mb-2">
                                    <label htmlFor="file-upload" className="text-(--journal-600) hover:text-(--journal-700) cursor-pointer font-medium">
                                        Click to upload
                                    </label>
                                    <span className="text-gray-500"> or drag and drop</span>
                                </div>
                                <p className="text-sm text-gray-500">PDF, DOC, DOCX(max. 10MB)</p>
                                {selectedFile && (
                                    <div className="mt-4 text-sm text-green-600 font-medium">
                                        ✓ Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* File Requirements */}
                    <div className="hidden sm:block bg-blue-50 rounded-lg p-4 mb-6">
                        <div className="flex gap-3">
                            <FileText className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3">File Requirements</h3>
                                <ul className="space-y-2 text-sm text-gray-700">
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>Maximum file size: 10MB</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>Supported formats: PDF, DOC, DOCX</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>For best results, ensure your document follows journal guidelines</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    {sectionType==="galley" &&(
                        <div className="mb-2 ml-4  ">
                             {/* <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"></label> */}
                           <div className="flex justify-center gap-3">
                             <input className="w-4 h-6"
                             type="checkbox"
                             checked={isConfirmed}
                            required
                             onChange={(e)=>setIsConfirmed(e.target.checked)}
                             />
                             <span className="text-sm font-xl text-gray-700 mb-2">
                                  I confirm that only minor corrections (typographical/formatting) are made.
                             </span>
                             </div>
                            
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={() => handelClose()}
                            className="px-6 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                            disabled={loading || editLoading || isFetchingFile}
                        >
                            Cancel
                        </button>
                        <button
                            disabled={isSubmitDisabled}
                            onClick={handleUploadFile}
                            className={`px-6 py-2.5 bg-(--journal-600) text-white font-medium rounded-lg hover:bg-(--journal-700) transition-colors flex items-center gap-2 ${isSubmitDisabled ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            {(loading || editLoading || isFetchingFile) ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    {isFetchingFile ? 'Loading file...' : EditFile ? 'Updating...' : 'Uploading...'}
                                </>
                            ) : (
                                EditFile ? 'Update Document' : 'Upload Document'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FileUploadCard;