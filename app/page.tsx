import { Suspense } from "react";
import { ClarityDashboard } from "@/components/ClarityDashboard";

// Loading component
function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 dark:border-slate-100 mx-auto mb-4"></div>
        <p className="text-slate-600 dark:text-slate-400">Loading Clarity...</p>
        </div>
    </div>
  );
}

// Main page component
export default function Home() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ClarityDashboard />
    </Suspense>
  );
}
