const STATUS_STYLES: Record<string, string> = {
  'new': 'bg-sky-500 text-white',
  'under plagiarism check': 'bg-yellow-500 text-white',
  'under editorial check': 'bg-yellow-500 text-white',
  'under peer review': 'bg-yellow-500 text-white',
  'accepted': 'bg-indigo-600 text-white',
  'under proofreading': 'bg-teal-600 text-white',
  'under layout editing': 'bg-teal-600 text-white',
  'under galley corrections': 'bg-teal-600 text-white',
  'scheduled for current issue': 'bg-pink-600 text-white',
  'scheduled for next issue': 'bg-pink-600 text-white',
  'scheduled for future issue': 'bg-pink-600 text-white',
  'scheduled for special issue': 'bg-pink-600 text-white',
  'scheduled for supplementary issue': 'bg-pink-600 text-white',
  'awaiting publication': 'bg-amber-900 text-white',
  'published': 'bg-green-600 text-white',
  'withdrawn': 'bg-black text-white',
  'rejected': 'bg-red-600 text-white',

  // ✅ Updated as requested
  'completed': 'bg-[#f0fdf4]',
  'not started': 'bg-red-100 text-red-700',        // gray → red
  'in progress': 'bg-[#d7ecfb]',
  'deferred': 'bg-yellow-100 text-yellow-800',     // purple → yellow
  'editor approval': 'bg-purple-100 text-purple-700', // yellow → purple
};

export const getStatusStyles = (status: string) =>
  STATUS_STYLES[status.toLowerCase()] ?? 'bg-gray-500 text-white';
