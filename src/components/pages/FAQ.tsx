
export default function FAQAccordion() {
    return (
        <section className=" mx-auto p-6 bg-white shadow-sm rounded-lg space-y-8 mt-4 lg:mr-4">
            <header>
                <h2 className="text-2xl font-semibold">FAQs</h2>
            </header>

            <div className="">

                {/* 1 */}
                <div className="border-b border-gray-200 pb-14">
                    <h3 className="font-semibold mb-1 text-lg">1) How do I submit an article?</h3>
                    <p>
                        To submit an article, first create an account with your Name, Email ID, and Mobile Number.
                        Then log in → click <strong>New Submission</strong> → fill required details → upload your article.
                    </p>
                </div>

                {/* 2 */}
                <div className="border-b border-gray-200 py-14">
                    <h3 className="font-semibold mb-1 text-lg">2) What details are required during article submission?</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Research Area</li>
                        <li>Mode of Process</li>
                        <li>Type of Article</li>
                        <li>Type of Issue</li>
                    </ul>
                </div>

                {/* 3 */}
                <div className="border-b border-gray-200 py-14">
                    <h3 className="font-semibold mb-1 text-lg">3) Why are my email and mobile number important?</h3>
                    <p>
                        All communication — including submission updates, review details, and acceptance notifications —
                        will be sent to your registered email & mobile number.
                    </p>
                </div>

                {/* 4 */}
                <div className="border-b border-gray-200 py-14">
                    <h3 className="font-semibold mb-1 text-lg">4) Can I track the progress of my article?</h3>
                    <p>
                        Yes. You can check real-time updates through your Author Dashboard → Track Article Progress.
                    </p>
                </div>

                {/* 5 */}
                <div className="border-b border-gray-200 py-14">
                    <h3 className="font-semibold mb-1 text-lg">5) What checks are done before publication?</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Plagiarism Check</li>
                        <li>Peer Review</li>
                    </ul>
                </div>

                {/* 6 */}
                <div className="border-b border-gray-200 py-14">
                    <h3 className="font-semibold mb-1 text-lg">6) How does the peer review process work?</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Article is assigned to expert reviewers based on research area.</li>
                        <li>Editor-in-Chief evaluates reviewer feedback.</li>
                        <li>Final decision is shared with the author.</li>
                    </ul>
                </div>

                {/* 7 */}
                <div className="border-b border-gray-200 py-14">
                    <h3 className="font-semibold mb-1 text-lg">7) What review outcomes might I receive?</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Accepted</li>
                        <li>Accepted with Minor Corrections</li>
                        <li>Rejected</li>
                    </ul>
                </div>

                {/* 8 */}
                <div className="border-b border-gray-200 py-14">
                    <h3 className="font-semibold mb-1 text-lg">8) How do I know if my article is accepted?</h3>
                    <p>
                        If accepted, you will receive an Acceptance Letter with a tentative publication date. You can
                        find it in your Acceptance Tab.
                    </p>
                </div>

                {/* 9 */}
                <div className="border-b border-gray-200 py-14">
                    <h3 className="font-semibold mb-1 text-lg">9) What must I submit after acceptance?</h3>
                    <p>Within 1 week, upload:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Final Manuscript (journal format)</li>
                        <li>Signed Copyright Form</li>
                        <li>APC Receipt (with/without DOI)</li>
                    </ul>
                </div>

                {/* 10 */}
                <div className="border-b border-gray-200 py-14">
                    <h3 className="font-semibold mb-1 text-lg">10) How do I generate the copyright form?</h3>
                    <p>
                        Update your profile details (ex: address) → download the form → print & sign
                        (corresponding author).
                    </p>
                </div>

                {/* 11 */}
                <div className="border-b border-gray-200 py-14">
                    <h3 className="font-semibold mb-1 text-lg">11) How long does publication take after acceptance?</h3>
                    <p>Your article will be published within 24–48 hours after all documents are submitted.</p>
                </div>

                {/* 12 */}
                <div className="border-b border-gray-200 py-14">
                    <h3 className="font-semibold mb-1 text-lg">12) How do I complete the final submission?</h3>
                    <p>
                        Go to → <strong>Final Submission Tab</strong> → upload required files → verify → click
                        <strong> Final Submit</strong>.
                    </p>
                </div>

                {/* 13 */}
                <div className="border-b border-gray-200 py-14">
                    <h3 className="font-semibold mb-1 text-lg">13) Will all authors receive certificates?</h3>
                    <p>Yes. Every author — including the corresponding author — will receive a certificate.</p>
                </div>

                {/* 14 */}
                <div className="border-b border-gray-200 py-14">
                    <h3 className="font-semibold mb-1 text-lg">14) Will I get a copy of the published article?</h3>
                    <p>Yes. You can download:</p>
                    <ul className="list-disc pl-5 space-y-1 my-2">
                        <li>Published article copy</li>
                        <li>Journal archive link</li>
                    </ul>
                    <p>from your author dashboard → File Tab.</p>
                </div>
            </div>
        </section>
    );
}