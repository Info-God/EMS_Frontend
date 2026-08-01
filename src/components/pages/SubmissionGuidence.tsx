import { useState} from 'react';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { useAppSelector } from '../../lib/store/store';

const EMSDashboardGuide = () => {
  const {active} = useAppSelector(s=>s.journal); // Mock data for demo
  
  const sections = [
   {
     id: 'top-dashboard',
     title: 'Top Dashboard Sections (Quick Access Cards)',
     image: `/guidance/${active?.code}/G1.png`,
     content: (
       <div className="space-y-4 sm:text-lg">
         <ol className="space-y-3 list-decimal list-inside">
           <li>
             <span className="font-semibold text-(--journal-500)">
               New Submission
             </span>
             <ul className="ml-6 mt-1 list-disc list-inside text-gray-600">
               <li>Submit a new manuscript</li>
             </ul>
           </li>
           <li>
             <span className="font-semibold text-(--journal-500)">
               Submission Guidelines
             </span>
             <ul className="ml-6 mt-1 list-disc list-inside text-gray-600">
               <li>Step-by-step guidance for authors</li>
             </ul>
           </li>
           <li>
             <span className="font-semibold text-(--journal-500)">
               View Article Process Timeline
             </span>
             <ul className="ml-6 mt-1 list-disc list-inside text-gray-600">
               <li>
                 Visual article progress (
                 <span className="text-(--journal-600) font-medium">
                   Submission → Publication
                 </span>
                 )
               </li>
             </ul>
           </li>
           <li>
             <span className="font-semibold text-(--journal-500)">
               Review Process
             </span>
             <ul className="ml-6 mt-1 list-disc list-inside text-gray-600">
               <li>Review stages and real-time status</li>
             </ul>
           </li>
           <li>
             <span className="font-semibold text-(--journal-500)">
               Action Required
             </span>
             <ul className="ml-6 mt-1 list-disc list-inside text-gray-600">
               <li>Pending author actions</li>
               <li className="italic text-gray-500">
                 (Revisions, profile update, copyright, payment, final submission)
               </li>
             </ul>
           </li>
         </ol>
       </div>
     )
   },
 
   {
     id: 'article-list',
     title: 'Article List Section',
     image: `/guidance/${active?.code}/G1.png`,
     content: (
       <div className="space-y-4 sm:text-lg">
         <p className="font-semibold text-gray-800">In Article List View:</p>
         <ul className="ml-6 list-disc list-inside text-gray-600">
           <li>Article ID / Paper ID</li>
           <li>Article Title</li>
           <li>Journal Name</li>
           <li>Current Status</li>
         </ul>
 
         <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-l-4 border-(--journal-500) shadow-sm">
           <p className="font-semibold text-gray-800">
              Clicking the Paper ID opens the Detailed Article View:
           </p>
           <ul className="ml-6 mt-2 list-disc list-inside text-gray-600">
             <li>Article details & workflow status</li>
             <li>Review reports</li>
             <li>Acceptance / Payment / Final Submission tabs</li>
           </ul>
         </div>
       </div>
     )
   },
 
   {
     id: 'new-submission',
     title: 'New Submission – Submit Your Article',
     image: `/guidance/${active?.code}/G2.png`,
     content: (
       <div className="space-y-4 sm:text-lg">
         <p className="text-gray-700">
           To submit a new manuscript, follow the structured workflow below:
         </p>
 
         <ol className="ml-4 space-y-3 list-decimal list-inside">
           <li>
             <span className="font-semibold text-gray-800">Start Submission</span>
             <ul className="ml-6 list-disc list-inside text-gray-600">
               <li>Click <b>New Submission</b> from the dashboard</li>
             </ul>
           </li>
 
           <li>
             <span className="font-semibold text-gray-800">Enter Article Details</span>
             <ul className="ml-6 list-disc list-inside text-gray-600">
               <li>Research Area</li>
               <li>Mode of Process (Normal / Fast / Express Track)</li>
               <li>Type of Article (Research, Review, Case Study, etc.)</li>
               <li>Type of Issue (Regular / Special Issue)</li>
               <li>Reviewer Referral ID (Optional)</li>
             </ul>
           </li>
 
           <li>
             <span className="font-semibold text-gray-800">Upload Manuscript</span>
             <ul className="ml-6 list-disc list-inside text-gray-600">
               <li>Accepted formats: PDF or Word</li>
               <li>Maximum file size: 10 MB</li>
               <li>Must comply with journal formatting guidelines</li>
             </ul>
           </li>
 
           <li>
             <span className="font-semibold text-gray-800">Submit</span>
             <ul className="ml-6 list-disc list-inside text-gray-600">
               <li>Review all entered details</li>
               <li>Click <b>Submit</b> to complete submission</li>
             </ul>
           </li>
         </ol>
       </div>
     )
   },
 
   {
     id: 'details-tab',
     title: 'Details Tab',
     image: `/guidance/${active?.code}/G3.png`,
     content: (
       <div className="space-y-3 sm:text-lg">
         <p className="text-gray-700">
           <b className="text-gray-800">Purpose:</b> Provides complete manuscript and journal information
         </p>
         <ul className="ml-6 list-disc list-inside text-gray-600">
           <li>Journal Details</li>
           <li>Article Information</li>
           <li>Processing Information</li>
           <li>Type of Article</li>
           <li>Mode of Processing (Normal / Fast / Express Track)</li>
         </ul>
       </div>
     )
   },
 
   {
     id: 'task-tab',
     title: 'Task Tab – Workflow Overview',
     image: `/guidance/${active?.code}/G4.png`,
     content: (
       <div className="space-y-3 sm:text-lg">
         <p className="text-gray-700"><b className="text-gray-800">Purpose:</b> Displays real-time editorial progress</p>
         <ol className="ml-6 list-decimal list-inside text-gray-600">
           <li>Editorial Check</li>
           <li>Plagiarism Check</li>
           <li>Peer Review</li>
           <li>Acceptance</li>
           <li>Proofreading</li>
           <li>Layout Editing</li>
           <li>Galley Correction</li>
           <li>Publishing</li>
         </ol>
       </div>
     )
   },
 
   {
     id: 'files-tab',
     title: 'Files Tab',
     image: `/guidance/${active?.code}/G5.png`,
     content: (
       <ul className="ml-6 list-disc list-inside sm:text-lg text-gray-600">
         <li>Initially Submitted Manuscript</li>
         <li>Plagiarism Report</li>
         <li>Certificates (All Authors)</li>
         <li>Published Article (Final PDF)</li>
       </ul>
     )
   },
 
   {
     id: 'review-tab',
     title: 'Review Tab',
     image: `/guidance/${active?.code}/G6.png`,
     content: (
       <ul className="ml-6 list-disc list-inside sm:text-lg text-gray-600">
         <li>Review Status</li>
         <li>Reviewer Comments / Reports</li>
       </ul>
     )
   },
 
   {
     id: 'acceptance-tab',
     title: 'Acceptance Tab',
     image: `/guidance/${active?.code}/G7.png`,
     content: (
       <ul className="ml-6 list-disc list-inside sm:text-lg text-gray-600">
         <li>Auto-enabled after acceptance</li>
         <li>Acceptance Status</li>
         <li>Tentative Publication Date</li>
         <li>Acceptance Letter (generated post profile update)</li>
       </ul>
     )
   },
 
   {
     id: 'copyright-tab',
     title: 'Copyright Tab',
     image: `/guidance/${active?.code}/G8.png`,
     content: (
       <ul className="ml-6 list-disc list-inside sm:text-lg text-gray-600">
         <li>Enabled after acceptance</li>
         <li>Download copyright form</li>
         <li>Profile completion required</li>
         <li>Upload manually signed form</li>
       </ul>
     )
   },
 
   {
     id: 'payment-tab',
     title: 'Payment Tab',
     image: `/guidance/${active?.code}/G9.png`,
     content: (
       <ul className="ml-6 list-disc list-inside sm:text-lg text-gray-600">
         <li>Enabled after acceptance</li>
         <li>APC payment options for Indian & Non-Indian authors</li>
       </ul>
     )
   },
 
   {
     id: 'final-submission-tab',
     title: 'Final Submission Tab',
     image: `/guidance/${active?.code}/G10.png`,
     content: (
       <div className="space-y-2 sm:text-lg">
         <p className="text-gray-700"><b className="text-gray-800">Timeline:</b> Must be completed within one week of acceptance</p>
         <ol className="ml-6 list-decimal list-inside text-gray-600">
           <li>Final Manuscript (journal format)</li>
           <li>Signed Copyright Form</li>
           <li>APC Receipt (With / Without DOI)</li>
         </ol>
         <p className="font-semibold text-green-700">
           Upon verification, the article proceeds to publication
         </p>
       </div>
     )
   }
 ];
 
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({"top-dashboard": true });

  const toggleSection = (sectionId:string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 mt-4 rounded-lg">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-(--journal-500) to-(--journal-700) rounded-lg shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center gap-4 mb-3">
            <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
              <BookOpen className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold">
              User Manual and Guidance Section
            </h1>
          </div>
          <p className="text-blue-100 text-lg ml-16">Complete guide to using the EMS Dashboard</p>
        </div>

        <div className="space-y-5">
          {sections.map((section, idx) => (
            <div 
              key={section.id} 
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-5 flex items-center justify-between hover:bg-gradient-to-r hover:from-(--journal-500)/5 hover:to-(--journal-700)/5 transition-all duration-200 group"
              >
                <h2 className="text-xl font-semibold text-gray-800 group-hover:text-(--journal-500) transition-colors">
                  {section.title}
                </h2>
                <div className="bg-(--journal-500)/10 group-hover:bg-(--journal-500)/10 p-2 rounded-full transition-colors">
                  {openSections[section.id] ? (
                    <ChevronUp className="w-5 h-5 text-(--journal-500)" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-(--journal-500)" />
                  )}
                </div>
              </button>

              {openSections[section.id] && (
                <div className="px-6 pb-6 pt-2">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className={`${idx % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
                      <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-4 shadow-inner">
                        <img
                          src={section.image}
                          alt={section.title}
                          className="w-full h-auto rounded-lg shadow-md"
                          // onError={(e) => {
                          //   e.target.style.display = 'none';
                          //   e.target.parentElement.innerHTML = '<div class="flex items-center justify-center h-64 text-gray-400"><BookOpen class="w-16 h-16" /></div>';
                          // }}
                        />
                      </div>
                    </div>

                    <div className={`${idx % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`}>
                      <div className="prose prose-sm max-w-none">
                        {section.content}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EMSDashboardGuide;