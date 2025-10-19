import { Button } from "./ui/button";
import { Card, CardDescription, CardTitle } from "./ui/card";

// Not used yet
const EditDialog2 = ({ bookId, onConfirm, onCancel }: any) => {
  if (!bookId) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4 ">
      <Card className="max-w-md w-full p-6 text-center shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200">
        <CardTitle>Confirm Deletion</CardTitle>
        <CardDescription className="my-4">Are you sure you want to edit this book?</CardDescription>
        <div className="flex justify-center gap-4 mt-4">
          <Button onClick={onCancel} className="bg-gray-300 text-gray-800 hover:bg-gray-400 border-none">
            Cancel
          </Button>
          <Button onClick={() => onConfirm(bookId)} className="bg-red-600 text-white hover:bg-red-700">
            Delete Permanently
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default EditDialog2;
