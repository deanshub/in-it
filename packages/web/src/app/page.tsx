export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between p-24">
      <div className="flex flex-col items-center justify-center w-96 h-96 border-2 border-dashed rounded-lg">
        <p className="text-2xl font-bold text-center">Drag & Drop</p>
        <p className="text-xl text-center my-2">Or</p>
        <button className="px-4 py-2 text-lg font-bold text-white bg-blue-500 rounded-lg">
          Browse
        </button>
        <p className="mt-4 text-xl text-center">in-it stats file</p>
      </div>
    </main>
  );
}
