import { RefreshCw } from 'lucide-react';

export default function DefaultScreen({error}: {error: string}) {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className='w-full h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4'>
      <div className='max-w-md w-full text-center space-y-6'>
        {/* Error Icon */}
        <div className='flex justify-center'>
          <div className='w-16 h-16 md:w-20 md:h-20 bg-red-100 rounded-full flex items-center justify-center'>
            <svg 
              className='w-8 h-8 md:w-10 md:h-10 text-red-600' 
              fill='none' 
              stroke='currentColor' 
              viewBox='0 0 24 24'
            >
              <path 
                strokeLinecap='round' 
                strokeLinejoin='round' 
                strokeWidth={2} 
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' 
              />
            </svg>
          </div>
        </div>

        {/* Error Message */}
        <div className='space-y-2'>
          <h1 className='text-2xl md:text-3xl font-bold text-gray-900'>
            Oops! Something went wrong
          </h1>
          <p className='text-base md:text-lg text-gray-600 break-words px-4'>
            {error}
          </p>
        </div>

        {/* Refresh Button */}
        <button
          onClick={handleRefresh}
          className='inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl active:scale-95 transform'
        >
          <RefreshCw className='w-5 h-5' />
          Refresh Page
        </button>
      </div>
    </div>
  );
}

