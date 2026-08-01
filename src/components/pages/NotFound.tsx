
function NotFound() {
  return (
    <main className="w-screen h-screen bg-gray-100">
      <div className=" left-4 top-4 flex justify-between items-center max-w-8xl mx-auto  px-6 py-3">
        <img src="./logo.jpg" alt="Logo" className=" w-1/9" />
        <button onClick={() => window.location.replace('/')} className=" bg-(--journal-500) text-white px-4 py-2 rounded hover:bg-(--journal-600) transition ">
          Go to Home
        </button>
      </div>
      <div className=" flex flex-col justify-center items-center h-[70vh]">
        <h2 className="text-5xl font-bold text-center">404 - Not Found</h2>
        <p className="text-xl mt-4 text-center">The page you are looking for does not exist.</p>
        <button onClick={() => window.location.replace('/')} className=" bg-(--journal-500) text-white px-4 py-2 rounded hover:bg-(--journal-600) transition text-xl mt-8">
          Go to Home
        </button>
      </div>

    </main>
  )
}

export default NotFound
