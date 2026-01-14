import AddSuccess from "@/components/AddSuccess";
import { Suspense } from 'react'

const AddSuccessPage = () => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading success details...</p>
      </div>
    }>
      <AddSuccess />
    </Suspense>
  );
};

export default AddSuccessPage;
