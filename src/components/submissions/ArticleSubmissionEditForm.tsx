import { useNavigate, useParams } from "react-router-dom";
import { useSubmission } from "../../hook/useSubmission";
import { useEffect, useState } from "react";
import { BookOpen, Check, FileText, Loader2, Triangle, Upload } from "lucide-react";
import { useSubmissionPrelist } from "../../hook/usePrelist";
import type { SubmissionPayload } from "../../types";
import { useArticleDetails } from "../../hook/useArticleDetails";
import LoadingScreen from "../ui/LoadingScreen";
import { useAppSelector } from "../../lib/store/store";
import { useUpdateSubmission } from "../../hook/useEditSubmission";
import toast from "react-hot-toast";

const ArticleSubmissionEditForm: React.FC = () => {
  const url_id = useParams().id;
  const { article } = useAppSelector((state) => state.article);
  const { fetchArticleDetails, loading: article_loading, error: article_error } = useArticleDetails();
  const navigate = useNavigate();

  // Use both hooks - submission for new, update for editing
  const { submitPaper, loading: submitLoading, error: submitError } = useSubmission();
  const { updateSubmission, loading: updateLoading, error: updateError } = useUpdateSubmission();

  const { data: prelistData, loading: prelistLoading, error: prelistError } = useSubmissionPrelist();

  // Determine if we're in edit mode
  const isEditMode = !!url_id;
  const loading = isEditMode ? updateLoading : submitLoading;
  const error = isEditMode ? updateError : submitError;

  // Store original data for comparison
  const [originalData, setOriginalData] = useState<any>(null);


  useEffect(()=>{
    if (article_error) toast.error(article_error)
    if (prelistError) toast.error(article_error)

  },[article_error, prelistError])
  useEffect(() => {
    if (url_id) {
      fetchArticleDetails(parseInt(url_id));
    }
  }, [url_id, fetchArticleDetails]);

  // Form state - initialize with article data if editing
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    journal_type: '',
    article_type: '',
    issue_type: '',
    processing_type: '',
    ref_id: '',
    details: '',
    country: '',
  });

  // Update form data when article is loaded
  useEffect(() => {
    if (article && isEditMode) {
      const initialData = {
        title: article.title || '',
        category: article.category_id?.toString() || '',
        journal_type: article.journal_type?.toString() || '',
        article_type: article.article_type?.toString() || '',
        issue_type: article.issue_type?.toString() || '',
        processing_type: article.processing_type?.toString() || '',
        ref_id: article.ref_id?.toString() || '',
        details: article.description?.toString() || '',
        country: article.country?.toString() || '',
      };
      setFormData(initialData);
      setOriginalData(initialData); // Store original data for comparison
    }
  }, [article, isEditMode]);

  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>('');

  const [checklist, setChecklist] = useState([
    { id: 1, checked: true, text: "The submission has not been previously published, nor is it before another journal for consideration (or an explanation has been provided in Comments to the Editor)." },
    { id: 2, checked: true, text: "The submission file is in .pdf, .doc or .docx file format." },
    { id: 3, checked: true, text: "All references were prepared as per the journal guidelines. Where available, DOI or URLs for the references have been provided and cross cited in manuscript body text." },
    { id: 4, checked: true, text: "I/We agreed to pay Article Processing Charges (APC) if paper accepted. Also agreed that the total number of pages will not exceed more than 15-20 pages." },
    { id: 5, checked: true, text: "Any changes are not possible after the publication of your paper. Please send the paper in Journal template (or) Journal format to avoid any mistakes." },
    { id: 6, checked: true, text: "Journal is responsible only for publication of papers on the Journal website which is mentioned on acceptance letter." }
  ]);

  // const countries = [
  //   { code: 'India', name: 'India' },
  //   { code: 'Others', name: 'Others' },
  // ];

  const toggleCheckbox = (id: number) => {
    setChecklist(checklist.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData(prev => {
      // when country type changes
      if (name === "country_type") {
        return {
          ...prev,
          country_type: value,
          country: value === "India" ? "India" : "", // reset for Others
        };
      }
      
      // when article type changes to "8" (Thesis), reset issue_type and details
      if (name === "article_type" && value === "8") {
        return {
          ...prev,
          article_type: value,
          issue_type: "0",
          details: ""
        };
      }
      
      // normal input handling
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      // Validate file type
      const validTypes = ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(selectedFile.type) && !selectedFile.name.match(/\.(doc|docx)$/i)) {
        setFileError('Only Word documents (.doc, .docx) are accepted');
        setFile(null);
        return;
      }

      // Validate file size (10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setFileError('File size must be less than 10MB');
        setFile(null);
        return;
      }

      setFileError('');
      setFile(selectedFile);
    }
  };

  const validateForm = (): boolean => {
    // Check required fields
    if (!formData.title.trim()) {
      toast.error('Please enter article title');
      return false;
    }

    if (!formData.category) {
      toast.error('Please select research area');
      return false;
    }

    if (!formData.journal_type) {
      toast.error('Please select journal');
      return false;
    }

    if (!formData.country) {
      toast.error('Please select country');
      return false;
    }

    if (!formData.article_type) {
      toast.error('Please select article type');
      return false;
    }

    if (!formData.issue_type && formData.article_type !== "8") {
      toast.error('Please select issue type');
      return false;
    }

    if (!formData.processing_type) {
      toast.error('Please select processing mode');
      return false;
    }

    if (!formData.details.trim() && formData.article_type !== "8") {
      toast.error('Please enter abstract');
      return false;
    }

    // Only require file for new submissions
    if (!isEditMode && !file) {
      toast.error('Please upload your manuscript');
      return false;
    }

    // Check all checklist items are checked
    const allChecked = checklist.every(item => item.checked);
    if (!allChecked) {
      toast.error('Please acknowledge all submission requirements in the checklist');
      return false;
    }

    return true;
  };

  // Helper function to get only changed fields
  const getChangedFields = () => {
    const changes: any = {};

    // Compare each field with original data
    Object.keys(formData).forEach((key) => {
      const currentValue = formData[key as keyof typeof formData];
      const originalValue = originalData?.[key];

      // Only include if value has changed
      if (currentValue !== originalValue) {
        // Convert to appropriate type for submission
        if (['category', 'journal_type', 'article_type', 'issue_type', 'processing_type'].includes(key)) {
          changes[key] = parseInt(currentValue);
        } else if (key === 'ref_id') {
          changes[key] = currentValue ? parseInt(currentValue) : 0;
        } else {
          changes[key] = currentValue;
        }
      }
    });

    // Always include file if a new one was selected
    if (file) {
      changes.file = file;
    }

    return changes;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (isEditMode) {
        // Edit mode - only send changed fields
        const changedFields = getChangedFields();

        if (Object.keys(changedFields).length === 0) {
          toast.error('No changes detected');
          return;
        }

        const result = await updateSubmission(parseInt(url_id!), changedFields);

        if (result?.status) {
          toast.success('Article updated successfully!');
          navigate('/dashboard/submissions/' + result.article_id + '/view'); //dashboard/new-submission/view
        }
      } else {
        // New submission - send all fields
        const payload: SubmissionPayload = {
          title: formData.title,
          category: parseInt(formData.category),
          file: file,
          journal_type: parseInt(formData.journal_type),
          article_type: parseInt(formData.article_type),
          issue_type: parseInt(formData.issue_type),
          processing_type: parseInt(formData.processing_type),
          ref_id: formData.ref_id ? parseInt(formData.ref_id) : 0,
          details: formData.details,
          country: formData.country,
        };

        const result = await submitPaper(payload);

        if (result?.status === 'success') {
          toast.success('Article submitted successfully!');
          navigate('/dashboard/acceptances');
        }
      }
    } catch (err) {
      console.error('Submission error:', err);
    }
  };

  const handleSaveDraft = () => {
    toast.success('Draft saved successfully!');
  };

  // Show loading spinner while fetching data
  if (prelistLoading || article_loading) {
    return (
      <LoadingScreen title={isEditMode ? "Article..." : "Submission form"} />
    );
  }

  // Show error if data failed to load

  return (
    <div className="min-h-screen py-8">
      <div className="">
        <div className="mb-8 p-6 rounded-2xl bg-(--journal-500) shadow-sm text-white space-y-6">
          <h2 className='text-xl'>
            {isEditMode ? 'Edit Your Research Article' : 'Submit Your Research Article'}
          </h2>
          <p>
            {isEditMode
              ? 'Update your manuscript details below'
              : 'Complete the form below to submit your manuscript for peer review and publication'}
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded">
            <div className="flex gap-3">
              <Triangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Journal Selection Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start gap-3 mb-6">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <BookOpen className="w-5 h-5 text-(--journal-600)" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Journal Selection</h2>
                  <p className="text-sm text-gray-500 mt-1">Choose your target journal</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Journal Name <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="journal_type"
                    value={formData.journal_type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--journal-500) focus:border-(--journal-500) outline-none text-gray-700"
                  >
                    <option value="">Select a journal</option>
                    {prelistData?.journals.map((journal) => (
                      <option key={journal.id} value={journal.id}>
                        {journal.name} ({journal.short_form})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country <span className="text-red-500">*</span>
                  </label>
                  < input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="Enter Your Country"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--journal-500) focus:border-(--journal-500) outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Article Information Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start gap-3 mb-6">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Article Information</h2>
                  <p className="text-sm text-gray-500 mt-1">Details about your manuscript</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Article Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter the full title of your research article"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--journal-500) focus:border-(--journal-500) outline-none placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Research Area <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--journal-500) focus:border-(--journal-500) outline-none text-gray-700"
                    >
                      <option value="">Select field</option>
                      {prelistData?.categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Article Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="article_type"
                      value={formData.article_type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--journal-500) focus:border-(--journal-500) outline-none text-gray-700"
                    >
                      <option value="">Select type</option>
                      {prelistData?.articles.map((article) => (
                        <option key={article.id} value={article.id}>
                          {article.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Issue Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="issue_type"
                      disabled={formData.article_type === "8"}
                      value={formData.issue_type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--journal-500) focus:border-(--journal-500) outline-none text-gray-700"
                    >
                      <option value="">Select issue</option>
                      {prelistData?.issues.map((issue) => (
                        <option key={issue.id} value={issue.id}>
                          {issue.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Processing Mode <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="processing_type"
                      value={formData.processing_type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--journal-500) focus:border-(--journal-500) outline-none text-gray-700"
                    >
                      <option value="">Select mode</option>
                      {prelistData?.processings.map((processing) => (
                        <option key={processing.id} value={processing.id}>
                          {processing.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Abstract <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="details"
                    value={formData.details}
                    disabled={formData.article_type === "8"}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Enter your article abstract (150-250 words). Include objectives, methodology, and key findings."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--journal-500) focus:border-(--journal-500) outline-none resize-none placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Upload Document Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start gap-3 mb-6">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Upload className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Upload Document</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {isEditMode ? 'Upload a new file to replace the existing one (optional)' : 'Submit your manuscript file'}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reviewer Referral ID (Optional)
                </label>
                <input
                  type="text"
                  name="ref_id"
                  value={formData.ref_id}
                  onChange={handleInputChange}
                  placeholder="Enter referral ID if available"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--journal-500) focus:border-(--journal-500) outline-none placeholder:text-gray-400"
                />
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  id="file-upload"
                  accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                      <Upload className="w-8 h-8 text-gray-400" />
                    </div>
                    {file ? (
                      <div>
                        <p className="text-sm text-green-600 font-medium mb-1">✓ {file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-gray-700 font-medium mb-1">Click to upload or drag & drop</p>
                        <p className="text-xs text-gray-500">
                          Word Document (.doc, .docx) - Max 10MB
                          {isEditMode && ' (Optional - only if replacing existing file)'}
                        </p>
                      </div>
                    )}
                  </div>
                </label>
              </div>

              {fileError && (
                <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4 rounded">
                  <p className="text-sm text-red-800">{fileError}</p>
                </div>
              )}

              <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <div className="flex gap-3">
                  <Triangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-800">
                     Only PDF or Word Document format allowed; File size should be less than 10mb
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Submission Checklist */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Submission Checklist</h2>
              <p className="text-sm text-gray-600 mb-6">
                Please acknowledge all requirements before {isEditMode ? 'updating' : 'submitting'}
              </p>

              <div className="space-y-4">
                {checklist.map((item) => (
                  <div key={item.id} className="flex items-start gap-3">
                    <button
                      onClick={() => toggleCheckbox(item.id)}
                      disabled={loading}
                      className={`shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${item.checked
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300 hover:border-green-500'
                        }`}
                    >
                      {item.checked && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                    </button>
                    <p className="text-sm text-gray-700 leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 flex gap-3">
                <button
                  onClick={handleSaveDraft}
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save as Draft
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 bg-(--journal-600) rounded-lg text-sm font-medium text-white hover:bg-(--journal-600) transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {isEditMode ? 'Updating...' : 'Submitting...'}
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      {isEditMode ? 'Update Article' : 'Submit Article'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleSubmissionEditForm;