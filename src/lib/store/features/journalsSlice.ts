import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface JournalInfo {
  id: number;
  code: string;
  fullName: string;
  link: string;
  eissn: string;
}

export interface JournalState {
  active: JournalInfo | null;
}

const JOURNAL_MAP: Record<number, JournalInfo> = {
  1: {
    id: 1,
    code: "IJIRE",
    fullName: "International Journal of Innovative Research in Engineering ",
    link: "https://www.theijire.com",
    eissn: "2582-8746"
  },
  2: {
    id: 2,
    code: "IJSREAT",
    fullName: "International Journal of Scientific Research in Engineering & Technology",
    link: "https://www.ijsreat.com",
    eissn: "2583-1240"
  },
  3: {
    id: 3,
    code: "IJRTMR",
    fullName: "International Journal of Recent Trends in Multidisciplinary Research",
    link: "https://www.ijrtmr.com",
    eissn: "2583-0368"
  },
  4: {
    id: 4,
    code: "INDJEEE",
    fullName: "Indian Journal of Electrical and Electronics Engineering",
    link: "https://www.fdrpjournals.org/indjeee/",
    eissn: "Applied"
  },
  5: {
    id: 5,
    code: "INDJECE",
    fullName: "Indian Journal of Electronics and Communication Engineering",
    link: "https://www.fdrpjournals.org/indjece/",
    eissn: "3048-6408"
  },
  6: {
    id: 6,
    code: "INDJCST",
    fullName: "Indian Journal of Computer Science and Technology",
    link: "https://www.indjcst.com",
    eissn: "2583-5300"
  },
  7: {
    id: 7,
    code: "INDJCMR",
    fullName: "Indian Journal of Clinical and Medical Research",
    link: "https://www.fdrpjournals.org/indjcmr/",
    eissn: "Applied"
  },
  8: {
    id: 8,
    code: "INDJCPR",
    fullName: "Indian Journal of Clinical Pharmacy and Research",
    link: "https://www.fdrpjournals.org/indjcpr/",
    eissn: "Applied"
  },
};

const initialState: JournalState = {
  active: null,
};

export const journalSlice = createSlice({
  name: "journal",
  initialState,
  reducers: {
    setJournalById: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      state.active = JOURNAL_MAP[id] ?? null;
      // if (localStorage.getItem("journal_name") && localStorage.getItem("journal_id")) {
      //   return
      // }
      localStorage.setItem("journal_name", state.active ? state.active.fullName : "")
      localStorage.setItem("journal_id", state.active ? state.active.id.toString() : "")
    },
    clearJournal: (state) => {
      state.active = null;
    }
  }
});

export const { setJournalById, clearJournal } = journalSlice.actions;
export default journalSlice.reducer;
