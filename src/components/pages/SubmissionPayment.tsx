import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../lib/store/store";
import { Link } from "react-router-dom";

const paymentLinks: Payment = {
  INDJECE: {
    without: "https://rzp.io/rzp/DaXI36l",
    with: "https://rzp.io/rzp/2gyImqHx",
    others: "https://rzp.io/rzp/2WWQHpy",
  },
  IJIRE: {
    without: "https://rzp.io/rzp/cgyflY4L",
    with: "https://rzp.io/rzp/xyGUazi",
    others: "https://rzp.io/rzp/tJsvF2bm",
  },
  IJSREAT: {
    without: "https://rzp.io/rzp/U5gDwAxT",
    with: "https://rzp.io/rzp/1xBlgaA",
    others: "https://rzp.io/rzp/0VMXV215",
  },
  IJRTMR: {
    without: "https://rzp.io/rzp/LRTDHjat",
    with: "https://rzp.io/rzp/Gf1xJimz",
    others: "https://rzp.io/rzp/9AWDPViy",
  },
  INDJCST: {
    without: "https://rzp.io/rzp/EEFghvj",
    with: "https://rzp.io/rzp/R9VVHi6",
    others: "https://rzp.io/rzp/rWh7nxe",
  },
  INDJEEE: {
    without: "https://rzp.io/rzp/DaXI36l",
    with: "https://rzp.io/rzp/2gyImqHx",
    others: "https://rzp.io/rzp/2WWQHpy",
  },
};

type Payment = {
  INDJECE: paymentLink
  IJIRE: paymentLink
  IJSREAT: paymentLink
  IJRTMR: paymentLink
  INDJCST: paymentLink
  INDJEEE: paymentLink

}
type paymentLink = {
  without: string
  with: string
  others: string
}

const SubmissionPayment: React.FC = () => {
  const { gst, payment, article } = useAppSelector((state) => state.article);
  const [paymentList, setPaymentList] = useState<paymentLink>()

  useEffect(() => {
    if (payment?.journal === "INDJECE") {
      setPaymentList(paymentLinks.INDJECE)
    }
    if (payment?.journal === "IJIRE") {
      setPaymentList(paymentLinks.IJIRE)
    }
    if (payment?.journal === "IJSREAT") {
      setPaymentList(paymentLinks.IJSREAT)
    }
    if (payment?.journal === "IJRTMR") {
      setPaymentList(paymentLinks.IJRTMR)
    }
    if (payment?.journal === "INDJCST") {
      setPaymentList(paymentLinks.INDJCST)
    }
    if (payment?.journal === "INDJEEE") {
      setPaymentList(paymentLinks.INDJEEE)
    }
  }, [payment?.journal])
  const pricingMatrix = [
    {
      id: "paid-1",
      title: "For Indian Author",
      price: payment?.prices?.Indian?.withoutdoi,
      currency: "INR",
      features: [
        "Without DOI",
        `APC (1200)  + ${gst}% GST`,
        "E-Certificate (All Authors)",
        "Online Publication",
        "Max. 10 (0–20 pages)",
      ],
      enabled: payment?.author_type === "Indian" || payment?.author_type === "Both",
      links: paymentList?.without,
      visibility: article?.payment_status === "paid-1",
    },
    {
      id: "paid-2",
      title: "For Indian Author",
      price: payment?.prices?.Indian?.withdoi,
      currency: "INR",
      features: [
        "With DOI (10.59256)",
        `APC (1400) + ${gst}% GST`,
        "E-Certificate (All Authors)",
        "Online Publication",
        "Max. 10 (0–20 pages)",
      ],
      links: paymentList?.with,
      enabled: payment?.author_type === "Indian" || payment?.author_type === "Both",
      visibility: article?.payment_status === "paid-2",
    },
    {
      id: "paid-3",
      title: "For Foreign Author",
      price: payment?.prices?.Others?.withdoi??'not set',
      currency: "USD",
      features: [
        "With DOI (10.59256)",
        `APC + ${gst}% GST`,
        "E-Certificate (All Authors)",
        "Online Publication",
        "Max. 10 (0–20 pages)",
      ],
      links: paymentList?.others,
      enabled: payment?.author_type === "Others" || payment?.author_type === "Both",
      visibility: article?.payment_status === "paid-3",
    },
  ];
  //->console.log(pricingMatrix)

  // const handlePayNow = () => {
  //   // Integrate gateway orchestration layer
  // };

  const visibleCards = pricingMatrix.filter(card => card.visibility);

  const cardsToRender =
    visibleCards.length > 0
      ? visibleCards
      : pricingMatrix;

  return (
    <div className="min-h-screen pr-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Payment Header */}
        <h2 className="text-3xl font-semibold text-gray-900 mb-6">Payment</h2>
        
        {article && ["INDJEEE", "INDJCPR", "INDJCMR", "INDJCPR"].includes(article.short_form) ? <h3 className="text-xl font-semibold py-2">there are no submission fees, publication fees or page charges for this journal. colour figures will be reproduced in color in your online article free of charges</h3> : 
          <>
          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cardsToRender.map((card) => (
              <div
                key={card.id}
                className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
              >
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">{card.title}</span>
                    <a
                      href="#"
                      className="text-sm text-(--journal-600) hover:text-(--journal-700)"
                    >
                      {payment?.journal}
                    </a>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {card.currency} {card.price}
                  </div>
                </div>

                <ul className="space-y-3 mb-6 list-inside list-disc">
                  {card.features.map((feature, i) => (
                    <li key={i} className={`text-sm text-gray-600 ${feature.includes("DOI") ? "font-bold" : ""}`}>
                      {feature}
                    </li>
                  ))}
                </ul>

                {article?.payment_status === card.id ? (
                  <button className="w-full py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                    Paid
                  </button>
                ) : (
                  <Link target="_blank" to={card.links ?? ""}>
                    <button
                      className="w-full py-2.5 bg-(--journal-600) text-white rounded-lg hover:bg-(--journal-700) transition-colors font-medium"
                    >
                      Pay Now
                    </button>
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Bank Payment Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mt-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Payment through Bank
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
              <InfoRow label="A/C Name:" value="Fifth Dimension Research Publication Private Limited" />
              <InfoRow label="BR.CODE" value="008076" />
              <InfoRow label="Account No." value="807620110000250" />
              <InfoRow label="MICR Code" value="621013002" />
              <InfoRow label="Name of Bank" value="Bank of India" />
              <InfoRow label="IFSC No." value="BKID0008076" />
              <InfoRow label="Branch" value="Ariyalur" />
            </div>
          </div>
        </>}
      </div>

    </div>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start ">
    <label className="text-sm font-semibold text-gray-600 min-w-38 text-nowrap flex justify-between">
      <h3>{label}</h3>
      <span className="text-sm font-semibold text-gray-400 mx-4">:</span>
    </label>
    <span className="text-sm  text-gray-900">{value}</span>
  </div>
);

export default SubmissionPayment;
