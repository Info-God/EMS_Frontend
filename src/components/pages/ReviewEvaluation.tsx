import React, { useEffect } from "react";
import { useReviewEvaluation } from "../../hook/useReviewEvaluation";
import toast from "react-hot-toast";
import LoadingScreen from "../ui/LoadingScreen";

export default function ReviewEvaluationSection({ reviewId }: { reviewId: string }) {
  const { fetchReviewEvaluation, data, loading, error } = useReviewEvaluation();

  useEffect(() => {
    if (!reviewId) {
      toast.error("Review ID error");
      return;
    }
    fetchReviewEvaluation(reviewId);
  }, [reviewId, fetchReviewEvaluation]);

  // Handle loading state
  if (loading) return <LoadingScreen title="Review Evaluation" />;

  // Handle API error or false status
  if (error || (data && data.status === false)) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-yellow-50 border-l-8 border-yellow-500 p-6 rounded-lg shadow-sm">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-yellow-800">Review Form Updated</h3>
              <p className="mt-2 text-sm text-yellow-700">
                {data?.message || "The review form has been updated. Please ask the reviewer to submit a new review using the updated form."}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle no data
  if (!data || !data.data || data.data.length === 0) {
    return <div className="container mx-auto p-6 text-center">No Review Evaluation Found</div>;
  }

  const row = data.data[0];

  // Helper function to convert null to string
  const getAnswer = (value: any): string => {
    return value || "Not answered";
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Section 1: Title & Abstract */}
      <Section title="🔹 1. Title & Abstract">
        <QuestionItem question="1.1 Does the title clearly represent the manuscript content?" answer={getAnswer(row.q1_title_clarity)} />
        <QuestionItem question="1.2 Is the abstract clear and well-structured?" answer={getAnswer(row.q2_abstract_clarity)} />
        <QuestionItem question="1.3 Does the abstract include objectives, methods, results, and conclusion?" answer={getAnswer(row.q3_abstract_completeness)} />
      </Section>

      {/* Section 2: Introduction & Literature Review */}
      <Section title="🔹 2. Introduction & Literature Review">
        <QuestionItem question="2.1 Is the research problem clearly defined?" answer={getAnswer(row.q4_research_problem)} />
        <QuestionItem question="2.2 Is the literature review relevant and up-to-date?" answer={getAnswer(row.q5_literature_review)} />
        <QuestionItem question="2.3 Are research gaps identified?" answer={getAnswer(row.q6_research_gaps)} />
      </Section>

      {/* Section 3: Methodology */}
      <Section title="🔹 3. Methodology">
        <QuestionItem question="3.1 Is the research methodology appropriate?" answer={getAnswer(row.q7_methodology_appropriateness)} />
        <QuestionItem question="3.2 Are methods described clearly for replication?" answer={getAnswer(row.q8_methodology_clarity)} />
        <QuestionItem question="3.3 Are tools/techniques justified?" answer={getAnswer(row.q9_tools_justification)} />
        <QuestionItem question="3.4 Ethical considerations addressed?" answer={getAnswer(row.q10_ethical_considerations)} />
      </Section>

      {/* Section 4: Results & Analysis */}
      <Section title="🔹 4. Results & Analysis">
        <QuestionItem question="4.1 Are results clearly presented?" answer={getAnswer(row.q11_results_clarity)} />
        <QuestionItem question="4.2 Are tables/figures appropriate and labeled?" answer={getAnswer(row.q12_tables_figures)} />
        <QuestionItem question="4.3 Is data analysis valid and accurate?" answer={getAnswer(row.q13_data_analysis)} />
      </Section>

      {/* Section 5: Discussion */}
      <Section title="🔹 5. Discussion">
        <QuestionItem question="5.1 Are results properly interpreted?" answer={getAnswer(row.q14_interpretation)} />
        <QuestionItem question="5.2 Are findings compared with existing literature?" answer={getAnswer(row.q15_comparision)} />
        <QuestionItem question="5.3 Are limitations discussed?" answer={getAnswer(row.q16_limitations)} />
      </Section>

      {/* Section 6: Conclusion */}
      <Section title="🔹 6. Conclusion">
        <QuestionItem question="6.1 Are conclusions supported by results?" answer={getAnswer(row.q17_conclusions_supported)} />
        <QuestionItem question="6.2 Are future research directions provided?" answer={getAnswer(row.q18_future_research)} />
      </Section>

      {/* Section 7: Originality & Contribution */}
      <Section title="🔹 7. Originality & Contribution">
        <QuestionItem question="7.1 Is the work original?" answer={getAnswer(row.q19_originality)} />
        <QuestionItem question="7.2 Contribution to the field:" answer={getAnswer(row.q20_contribution)} />
        <QuestionItem question="7.3 Any signs of plagiarism?" answer={getAnswer(row.q21_plagiarism)} />
      </Section>

      {/* Section 8: Language & Formatting */}
      <Section title="🔹 8. Language & Formatting">
        <QuestionItem question="8.1 Language quality:" answer={getAnswer(row.q22_language_quality)} />
        <QuestionItem question="8.2 Adherence to journal format:" answer={getAnswer(row.q23_format_compliance)} />
      </Section>

      {/* Section 9: References */}
      <Section title="🔹 9. References">
        <QuestionItem question="9.1 Are references relevant and recent?" answer={getAnswer(row.q24_references_relevance)} />
        <QuestionItem question="9.2 Citation style accuracy:" answer={getAnswer(row.q25_citation_accuracy)} />
      </Section>

      {/* Section 10: Ethical Compliance */}
      <Section title="🔹 10. Ethical Compliance">
        <QuestionItem question="10.1 Conflict of interest disclosed?" answer={getAnswer(row.q26_conflict_of_interest)} />
        <QuestionItem question="10.2 Ethical approval obtained (if applicable)?" answer={getAnswer(row.q27_ethical_approval)} />
      </Section>

      {/* Section 11: Overall Recommendation */}
      <Section title="🔹 11. Overall Recommendation">
        <div className="question-item">
          <div className="question-text mb-4 ml-2">Overall Recommendation:</div>
          <div className="answer-display mb-2 ml-2">
            <RecommendationBadge  recommendation={row.q28_overall_recommendation || "Not answered"} />
          </div>
        </div>
      </Section>

      {/* Section 12: Scoring Section (Rate 1-5) */}
      <Section title="🔹 12. Scoring Section (Rate 1-5)">
        <ScoreItem label="Originality" score={row.score_originality} />
        <ScoreItem label="Methodology" score={row.score_methodology} />
        <ScoreItem label="Clarity" score={row.score_clarity} />
        <ScoreItem label="Relevance" score={row.score_relevance} />
        <ScoreItem label="Overall Quality" score={row.score_overall_quality} />
      </Section>

      {/* Section 13: Reviewer Comments */}
      <Section title="🔹 13. Reviewer Comments">
        <div className="question-item">
          <div className="question-text ml-4 mb-2">Comments to Author:</div>
          <div className="answer-display ml-3">
            <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>
             <b> {row.comments_to_author || "No comments provided."}</b>
            </p>
          </div>
        </div>
      </Section>

      {/* Section 14: Admin Section (Editor-in-Chief Only) */}
      <Section title="🔒 Admin Section (Editor-in-Chief Only)" isAdmin={true}>
        <div className="question-item">
          <div className="question-text mb-2">Admin Editorial Decision:</div>
          <div className="answer-display">
            <strong>Decision:</strong> 
            <span className="admin-badge">
              {row.admin_editorial_decision || "Not decided yet"}
            </span>
          </div>
        </div>

        <div className="question-item">
          <div className="question-text mb-2">Overall comments to the Editor(s)-in-Chief:</div>
          <div className="answer-display mb-2">
            <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>
              {row.admin_comments_to_editor_in_chief || "No comments provided."}
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}

/* -------------------------- Shared Components -------------------------- */

const Section = ({ title, children, isAdmin = false }: { title: string; children: React.ReactNode; isAdmin?: boolean }) => (
  <div className={`bg-white p-6 rounded-lg shadow-sm border-l-4 ${isAdmin ? 'border-l-amber-500' : 'border-l-blue-600'}`}>
    <h4 className={`text-lg font-semibold mb-4 ${isAdmin ? 'text-amber-600' : 'text-blue-600'}`}>{title}</h4>
    <div className="space-y-4">{children}</div>
  </div>
);

const QuestionItem = ({ question, answer }: { question: string; answer: string }) => (
  <div className="question-item" style={{ marginBottom: "20px", padding: "12px", backgroundColor: "#fafafa", borderRadius: "6px" }}>
    <div className="question-text" style={{ fontWeight: 600, marginBottom: "10px", color: "#333", fontSize: "14px" }}>
      {question}
    </div>
    <div className="answer-display" style={{ backgroundColor: "#e8f0fe", padding: "10px 15px", borderRadius: "6px", borderLeft: "3px solid #007bff", marginTop: "8px" }}>
      <strong>Answer:</strong> <span style={{ color: "#007bff", fontWeight: 500 }}>{answer}</span>
    </div>
  </div>
);

const ScoreItem = ({ label, score }: { label: string; score?: number | null }) => {
  const displayScore = score || 0;
  
  return (
    <div className="question-item" style={{ marginBottom: "20px", padding: "12px", backgroundColor: "#fafafa", borderRadius: "6px" }}>
      <div className="question-text" style={{ fontWeight: 600, marginBottom: "10px", color: "#333", fontSize: "14px" }}>
        {label}:
      </div>
      <div className="answer-display" style={{ backgroundColor: "#e8f0fe", padding: "10px 15px", borderRadius: "6px", borderLeft: "3px solid #007bff", marginTop: "8px" }}>
        <strong>Score:</strong>
        {displayScore > 0 ? (
          <>
            {[...Array(5)].map((_, i) => (
              <span key={i} style={{ fontSize: "18px", color: i < displayScore ? "#ffc107" : "#ddd", marginLeft: "2px" }}>
                ●
              </span>
            ))}
            <span style={{ marginLeft: "8px", fontWeight: 600, color: "#007bff" }}>
              {displayScore} / 5
            </span>
          </>
        ) : (
          <span className="no-answer" style={{ color: "#999", fontStyle: "italic", marginLeft: "8px" }}>
            Not scored
          </span>
        )}
      </div>
    </div>
  );
};

const RecommendationBadge = ({ recommendation }: { recommendation: string }) => {
  const rec = recommendation || "Not answered";
  let badgeClass = "recommendation-default";
  
  if (rec === "Accept") badgeClass = "recommendation-accept";
  else if (rec === "Minor Revision") badgeClass = "recommendation-minor";
  else if (rec === "Major Revision") badgeClass = "recommendation-major";
  else if (rec === "Reject") badgeClass = "recommendation-reject";
  
  const styleMap: Record<string, React.CSSProperties> = {
    "recommendation-accept": { backgroundColor: "#28a745", color: "white", padding: "8px 20px", borderRadius: "25px", display: "inline-block", fontWeight: 600 },
    "recommendation-minor": { backgroundColor: "#ffc107", color: "#333", padding: "8px 20px", borderRadius: "25px", display: "inline-block", fontWeight: 600 },
    "recommendation-major": { backgroundColor: "#fd7e14", color: "white", padding: "8px 20px", borderRadius: "25px", display: "inline-block", fontWeight: 600 },
    "recommendation-reject": { backgroundColor: "#dc3545", color: "white", padding: "8px 20px", borderRadius: "25px", display: "inline-block", fontWeight: 600 },
    "recommendation-default": { backgroundColor: "#6c757d", color: "white", padding: "8px 20px", borderRadius: "25px", display: "inline-block", fontWeight: 600 },
  };
  
  return <div style={styleMap[badgeClass]}>{rec}</div>;
};
