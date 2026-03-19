// import { useState } from 'react';

import { ArrowLeft, ArrowRight, X, type LucideIcon } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../lib/store/store";
import { setBackground, setRemoveTutorial, setTutorialStep } from "../../lib/store/features/globle";
import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";

export interface OnboardCardsInterface {
    icon: LucideIcon,
    title: string,
    description: string | ReactNode,
    iconBg: string,
    BgColor: string,
    iconColor: string,
    dotColors: string[],
    showTags: boolean,
    position?: string,
    nextTag?: boolean,
    finish?: boolean
    hideHandler?: (arg: boolean) => void
    skip?: boolean
}

export const OnboardingCard = ({ icon: Icon, title, description, iconBg, iconColor, dotColors, showTags = false, BgColor, position, nextTag = true, finish = false, hideHandler, skip = false }: OnboardCardsInterface) => {
    const path = useLocation().pathname
    const dispatch = useAppDispatch()
    const { tutorialStep } = useAppSelector(s => s.global)

    const handleNext = () => {
        dispatch(setTutorialStep(tutorialStep + 1))
    }
    const handlePrev = () => {
        if (tutorialStep > 1 && tutorialStep !== 4) {
            dispatch(setTutorialStep(tutorialStep - 1))
        }
    }
    const handleClose = () => {
        dispatch(setTutorialStep(tutorialStep + 1))
        dispatch(setBackground(false))
        localStorage.setItem("step", (tutorialStep + 1).toString())
    }
    const handleSkip = () => {
        if (skip) {
            dispatch(setRemoveTutorial())
        } else {
            localStorage.setItem("ProfileTutorial", "true")
            dispatch(setBackground(false))
        }
        if (hideHandler) {
            hideHandler(false)
        }
    }

    const handleFinish = () => {
        dispatch(setTutorialStep(tutorialStep + 1))
        dispatch(setRemoveTutorial())
        localStorage.setItem("step", (tutorialStep + 1).toString())
    }


    useEffect(() => {
        const peerreview = document.querySelector(".DashboardPeerReview")
        const table = document.querySelector(".AricleTableDashboard")
        const dashboard = document.querySelector(".Dashboard")


        if (tutorialStep === 2) {
            peerreview?.scrollIntoView()
        }
        if (tutorialStep === 3) {
            table?.scrollIntoView()
        }
        if (tutorialStep > 3 && tutorialStep <= 11) {
            dispatch(setBackground(true))
            dashboard?.scrollIntoView()

        }

    }, [tutorialStep, dispatch, path])
    return (
        <div className={`${BgColor} rounded-2xl shadow-2xl shadow-zinc-700 p-4 py-6 min-w-xl max-w-xl w-full absolute ${position} z-9999 scale-60 sm:scale-85`}>
            <div className="flex items-start gap-6 mb-8">
                <div className="relative">
                    <div className={`w-28 h-28 ${iconBg} rounded-full flex items-center justify-center`}>
                        <Icon className={`w-12 h-12 ${iconColor}`} strokeWidth={2} />
                    </div>
                    {dotColors.map((color, index) => (
                        <div
                            key={index}
                            className={`absolute w-4 h-4 ${color} rounded-full`}
                            style={{
                                top: index === 0 ? '10%' : index === 1 ? '85%' : '50%',
                                left: index === 0 ? '85%' : index === 1 ? '5%' : '95%',
                            }}
                        />
                    ))}
                </div>
                <div className="flex-1 pt-4">
                    <h2 className="text-3xl sm:text-2xl font-bold text-gray-900 mb-3">{title}</h2>
                    <p className="text-2xl sm:text-lg text-gray-600 leading-relaxed text-wrap">{description}</p>
                </div>
            </div>

            <div className="flex items-center justify-between pl-2">
                {nextTag && tutorialStep !== 1 && tutorialStep !== 4 &&
                    <div className="flex items-center w-full justify-start gap-4">
                        <button onClick={handlePrev} className="flex items-center gap-2  rounded-full text-blue-500 font-bold text-2xl sm:text-lg hover:text-blue-600 transition-colors">
                            <ArrowLeft />
                            Prev
                        </button>
                    </div>}
                {skip && <button onClick={handleSkip} className="text-gray-500 hover:text-gray-700 text-2xl sm:text-lg font-medium transition-colors">
                    Skip
                </button>}
                {showTags && (
                    <div className="flex items-center gap-3 text-2xl sm:text-lg whitespace-nowrap">
                        <span className="flex items-center gap-2 text-teal-600 font-medium bg-teal-100 px-3 py-1 rounded-full">
                            <span className="w-2 h-2 bg-teal-600 rounded-full"></span>
                            Fast Review
                        </span>
                        <span className="flex items-center gap-2 text-blue-600 font-medium bg-blue-100 px-3 py-1 rounded-full">
                            <span className="w-2 h-2 bg-(--journal-600) rounded-full"></span>
                            Secure
                        </span>
                    </div>
                )}
                {nextTag ?
                    <div className="flex items-center w-full justify-end gap-4">
                        <button onClick={handleNext} className="flex items-center gap-2  rounded-full text-blue-500 font-bold text-2xl sm:text-lg hover:text-blue-600 transition-colors">
                            Next
                            <ArrowRight />
                        </button>
                    </div> : !finish &&
                    <div className="flex items-center w-full justify-end gap-4 ">
                        <button onClick={handleClose} className="flex items-center gap-2  rounded-full text-blue-500 font-bold text-2xl sm:text-lg hover:text-blue-600 transition-colors">
                            Close
                            <X />
                        </button>
                    </div>}

                {finish && <div className="flex items-center w-full justify-end gap-4">
                    <button onClick={handleFinish} className="flex items-center gap-2  rounded-full text-blue-500 font-bold text-2xl sm:text-lg hover:text-blue-600 transition-colors">
                        Finish
                        <ArrowRight />
                    </button>
                </div>}
            </div>
        </div>
    );
};

