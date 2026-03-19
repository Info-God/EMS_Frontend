import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../lib/store/store";
import { setJournalById } from "../lib/store/features/journalsSlice";

export const useJournal = () => {
  const location = useLocation();
  const dispatch: AppDispatch = useDispatch();

  const journal = useSelector((state: RootState) => state.journal.active);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const journalId = params.get("journal");

    if (journalId) {
      dispatch(setJournalById(parseInt(journalId)));
    }else{
      dispatch(setJournalById(parseInt(localStorage.getItem("journal_id")??"")))
    }
  }, [location.search, dispatch]);

  return { journal };
};
