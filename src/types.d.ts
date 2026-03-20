export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  user_type: string; // "W" for author
  journal_id: number;
  phone: string;
}

export interface RegisterResponse {
  status: string;
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
    user_type: string;
    journal_id: number;
    phone: string;
    created_at: string;
    updated_at: string;
  };
  token: string;
  token_type: string;
}


// submission types
interface SubmissionPayload {
  title: string;
  category: number;
  file: File | null;
  journal_type: number;
  article_type: number;
  issue_type: number;
  processing_type: number;
  ref_id: number;
  details: string;
  country: string;
}

interface SubmissionResponse {
  status: string;
  message: string;
  article_id: number,
}

// pusher event type
export interface ArticleUpdatePayload {
  article_id: string;
  field: string;
  value: any;
  article: Article;
}

// submission sub section

// types.ts

export interface Article {
  id: number;
  journalShortWithId: string
  category_id: number;
  writer_id: number;
  doi_link:string|null;
  reviewer_id: number | null;
  title: string;
  description: string;
  image_path: string;
  file_path: string;
  video_id: string | null;
  start_date: string | null;
  end_date: string | null;
  upload_status: number;
  review_status: number;
  status: number;
  journal_type: number;
  journal_short_form: string;
  article_type: number;
  issue_type: number;
  processing_type: number;
  status_type: number;
  journalnamewithissn:string;
  scheduled_on: string;
  notes: string;
  payment_status: string | null;
  freeze_data: number;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
  ref_id: string | null;
  country: string | null;
  articlename: string;
  issuename: string;
  processingname: string;
  statusname: string;
  colourflag: string;
  journalname: string;
  short_form: string;
  file_url: string;
  comments?:string;
  verified_by?:string;
}

export interface Task {
  id: number;
  article_id: number;
  task_name: string;
  to_staff: number;
  status: "In progress" | "Completed" | "Deferred" | "Editor approval" | "Not Started";
  due_date: string;
  description: string | null;
  create_at: string;
}

export interface Review {
  id: number;
  article_id: number;
  reviewer_id: number;
  due_date: string;
  status: string | "In progress" | "Completed" | "Deferred" | "Editor approval" | "Not Started";
  decision: string;
  create_at: string;
  user_id: number;
  reviewerid: string;
  name: string
}

export interface Acceptance {
  id: number;
  article_id: number;
  accepted_on: string;
  scheduled_to: string;
  published_on: string;
  status: string;
  action_for_author: string;
  journalShortWithId: string;
}

export interface FileItem {
  id: number;
  article_id: number;
  doc_title: string;
  file_path: string;
  create_at: string;
  category: number;
  url?: string; //files for submission/files 
  articletitle?: string;
  freeze_data?: number;
  file_url?: string;
  file?: File; // for upload purpose
  uploaded_by?: string;
  verified_by?: string;
  comments?: string;
}

export interface Profile {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  password: string;
  user_type: string;
  journal_id: number;
  department: string | null;
  dob: string | null;
  profile: string | null;
  phone: string;
  address: string | null;
  image_path: string | null;
  status: string | null;
  remember_token: string | null;
  created_at: string;
  updated_at: string;
  active_status: number;
  avatar: string;
  dark_mode: number;
  messenger_color: string | null;
  reviewerid: string | null;
}

export interface Payment {
  author_type: string;
  journal: string | "INDJECE" | "IJIRE" |
  "IJSREAT" |
  "IJRTMR" |
  "INDJCST" |
  "INDJEEE";
  prices:
  {
    Indian: Pricing,
    Others: Pricing
  };
}
interface Pricing {
  withdoi: string;
  withoutdoi: string;
}

export interface ArticleState {
  loading: boolean;
  error: string | null;
  success: boolean;
  article: Article | null;
  tasks: Task[];
  reviews: Review[];
  acceptances: Acceptance[];
  files_0: FileItem[];
  files_1: FileItem[];
  files_2: FileItem[];
  files_3: FileItem[];
  files_4: FileItem[];
  final_download_link: string;
  final_payment_scripts: FileItem[];
  final_manuscripts: FileItem[];
  final_copy_right_forms: FileItem[];
  copy_right_files: FileItem[];
  profile: Profile | null;
  gst: number;
  payment: Payment | null;
  journalShortWithId: string;
  final_download_link: string;
}


// workflow dashboard
export interface WorkflowTask {
  task_name: string;
  status: 'Completed' | 'In Process' | 'Not Started' | 'Pending' | string;
}

export interface ArticleInfo {
  title: string
  journal_short_form: string;
  shortFormWithId: string;
}
export interface WorkflowPayload {
  article_id: number;
  tasks: WorkflowTask[];
  peer_review_tasks: WorkflowTask[];
  article_info: ArticleInfo;
} 

export interface WorkflowState {
  loading: boolean;
  error: string | null;
  data: WorkflowPayload | null;
}


//finalSubmission

export interface FinalUploadResponse {
  success: boolean;
  message: string;
  file_name: string;
}

//galleyUploadResponse
export interface GalleyUploadResponse{
  success:boolean;
  message:string;
  file_id:number;
  file_url:string
}

export type UploadType = "copyright" | "payment" | "manuscript" | "file" | "final_submission_freeze"|"galley";

export interface FinalUploadParams {
  submissionId: number | string; // e.g. 110
  file: File;
  file_name?: string;
  type: UploadType;
  comments?:string;
  galley_file_id:number|string
}
export interface FinalEditParams {
  submissionId: number | string; // e.g. 110
  file?: File;
  doc_title?: string;
  freeze_data?: number;
  type: UploadType;
  id: number // file id to be edited
  comments?:string;
  galley_file_id:number|string
}

export interface GalleyUploadParams{
  comments:string;
  file?:File;
  type: UploadType;
  galley_file_id:number;
}


// dashboard data 
export interface DashboardCounts {
  approve: number;
  pending: number;
  accepted: number;
  published: number;
}

export interface DashboardArticleItem {
  id: number;
  category_id: number;
  writer_id: number;
  reviewer_id: number | null;
  title: string;
  description: string;
  image_path: string;
  file_path: string;
  video_id: string | null;
  start_date: string | null;
  end_date: string | null;
  upload_status: number;
  review_status: number;
  status: number;
  journal_type: number;
  journal_short_form: string;
  article_type: number;
  newuser?:boolean
  issue_type: number;
  processing_type: number;
  status_type: number;
  scheduled_on: string | null;
  notes: string | null;
  payment_status: string | null;
  freeze_data: number;
  created_by: number;
  updated_by: number | null;
  created_at: string;
  updated_at: string;
  ref_id: string | null;
  country: string | null;
  statusname: string;
  category: string;
  colourflag: string;
  journalShortWithId: string
}

export interface DashboardLatest {
  article: DashboardArticleItem;
  task: { task_name: string; status: string }[];
  peer_review: { task_name: string; status: string }[];
}

export interface DashboardDropdownItem {
  id: number;
  label: string;
}
export interface DashboardNotification {
  article_id:number
  message: string
  papername: string
  type: string
}

export interface DashboardResponse {
  status: boolean;
  counts: DashboardCounts;
  articles_table: DashboardArticleItem[];
  latest: DashboardLatest | null;
  dropdown_list: DashboardDropdownItem[];
  notifications:DashboardNotification[]
}

export interface DashboardState {
  loading: boolean;
  error: string | null;
  data: DashboardResponse;
}


// submission list
export interface SubmissionListItem {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
  category: string;
  statusname: string;
  journalShortWithId: string
}

export interface SubmissionListPaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface SubmissionListData {
  current_page: number;
  data: SubmissionListItem[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: SubmissionListPaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface SubmissionListResponse {
  success: boolean;
  message: string;
  data: SubmissionListData;
}

export interface SubmissionListState {
  loading: boolean;
  error: string | null;
  data: SubmissionListResponse | null;
}


// review evaluation
export interface ReviewEvaluationItem {
  id: number;
  article_id: number;
  review_id: number;
  comment_1: string | null;
  comment_2: string | null;
  comment_3: string | null;
  comment_4: string | null;
  comment_5: string | null;
  comment_6: string | null;
  comment_7: string | null;
  comment_8: string | null;
  comment_9: string | null;
  comment_10: string | null;
  comment_11: string | null;
  comment_12: string | null;
  comment_13: string | null;
  comment_14: string | null;
  comment_15: string | null;
  created_at: string;
}

export interface ReviewEvaluationResponse {
  status: boolean;
  message: string;
  data: ReviewEvaluationItem[];
}




interface CopyrightAcceptance {
  id: number;
  article_id: number;
  accepted_on: string;
  scheduled_to: string;
  published_on: string;
  status: string;
  action_for_author: string | null;
  articletitle: string;
  journal_short_form: string;
  journalShortWithId: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: CopyrightAcceptance[];
}