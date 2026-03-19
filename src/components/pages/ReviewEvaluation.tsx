import React, { useEffect } from "react";
import { useReviewEvaluation } from "../../hook/useReviewEvaluation";
import toast from "react-hot-toast";
import LoadingScreen from "../ui/LoadingScreen";

export default function ReviewEvaluationSection({reviewId}:{reviewId:string}) {
    const { fetchReviewEvaluation, data, loading } = useReviewEvaluation();

    useEffect(() => {
        if (!reviewId){
            toast.error("review id error")
            return;
        }
        fetchReviewEvaluation(reviewId);
    }, [reviewId, fetchReviewEvaluation]);

    if (!data || data.data.length === 0) return <div className="p-8 text-center">No Review Evaluation Found</div>;

    const row = data.data[0];

    // Compute total score (same logic as Laravel)
    const totalScore =
        (Number(row.comment_1) || 0) +
        (Number(row.comment_2) || 0) +
        (Number(row.comment_3) || 0) +
        (Number(row.comment_4) || 0) +
        (Number(row.comment_5) || 0) +
        (Number(row.comment_6) || 0) +
        (Number(row.comment_7) || 0) +
        (Number(row.comment_8) || 0) +
        (Number(row.comment_9) || 0) +
        (Number(row.comment_10) || 0) +
        (Number(row.comment_11) || 0) +
        (Number(row.comment_12) || 0);

    const yesNo = (value: any, yesValue: any) => (value == yesValue ? "Yes" : "No");

    return (
        <div className="container mx-auto p-6 space-y-6 relative">
            {loading && <LoadingScreen title="Review Evaluation"/>}
            {/* Total Score Box */}
            <div className="bg-green-50 border-l-8 border-green-600 p-6 rounded-lg shadow-sm text-center">
                <h3 className="text-2xl font-bold text-green-700">
                    Total Score: {totalScore} / 100
                </h3>
            </div>

            {/* SECTION TEMPLATE */}
            <Section title="1. Clarity of Research Question (10 points)">
                <ListItem label={yesNo(row.comment_1, 10)} />
            </Section>

            <Section title="2. Contribution to the Field (20 points)">
                <p className="text-sm text-gray-600">Does the manuscript present a novel contribution to the field?</p>
                <ListItem label={yesNo(row.comment_2, 10)} />

                <p className="text-sm text-gray-600 mt-3">Is the contribution of significant importance to the field?</p>
                <ListItem label={yesNo(row.comment_3, 10)} />
            </Section>

            <Section title="3. Research Methodology (20 points)">
                <p className="text-sm text-gray-600">Are the research methods appropriate?</p>
                <ListItem label={yesNo(row.comment_4, 10)} />

                <p className="text-sm text-gray-600 mt-3">Are they applied correctly and described in detail?</p>
                <ListItem label={yesNo(row.comment_5, 10)} />
            </Section>

            <Section title="4. Data Presentation and Results (15 points)">
                <p className="text-sm text-gray-600">Are the results presented clearly and logically?</p>
                <ListItem label={yesNo(row.comment_6, 7.5)} />

                <p className="text-sm text-gray-600 mt-3">Do the results support the research question?</p>
                <ListItem label={yesNo(row.comment_7, 7.5)} />
            </Section>

            <Section title="5. Quality of Analysis (10 points)">
                <p className="text-sm text-gray-600">Is the analysis sufficient and thorough?</p>
                <ListItem label={yesNo(row.comment_8, 10)} />
            </Section>

            <Section title="6. Justification of Conclusions (10 points)">
                <p className="text-sm text-gray-600">Are the conclusions well-supported?</p>
                <ListItem label={yesNo(row.comment_9, 10)} />
            </Section>

            <Section title="7. Organization and Writing (10 points)">
                <p className="text-sm text-gray-600">Is the manuscript well-organized?</p>
                <ListItem label={yesNo(row.comment_10, 5)} />

                <p className="text-sm text-gray-600 mt-3">Is the writing clear and professional?</p>
                <ListItem label={yesNo(row.comment_11, 5)} />
            </Section>

            <Section title="8. Ethical Considerations (5 points)">
                <p className="text-sm text-gray-600">Are there ethical concerns?</p>
                <ListItem label={yesNo(row.comment_12, 5)} />
            </Section>

            <Section title="Your Editorial Decision:">
                <ListItem label={row.comment_13 || "N/A"} />
            </Section>

            <Section title="Overall comments to the Editor(s)-in-Chief:">
                <ListItem label={row.comment_14 || "N/A"} />
            </Section>
        </div>
    );
}

/* -------------------------- Shared Components -------------------------- */

const Section = ({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-600">
        <h4 className="text-lg font-semibold mb-3">{title}</h4>
        <div className="space-y-2">{children}</div>
    </div>
);

const ListItem = ({ label }: { label: string }) => (
    <ul className="pl-5 list-disc">
        <li className="text-base font-medium text-gray-700">{label}</li>
    </ul>
);
