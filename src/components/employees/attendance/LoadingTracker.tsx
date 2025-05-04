
export function LoadingTracker() {
  return (
    <div className="animate-pulse flex flex-col items-center">
      <div className="h-8 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-10 w-32 mt-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
  );
}
