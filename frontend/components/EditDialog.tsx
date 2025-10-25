import { EditBookForm } from "./EditBookForm"; // Assuming you put the form in a file named EditBookForm

// Rename to EditModal or keep EditDialog, but its purpose is to contain the form
const EditDialog = ({ bookId, onCancel, onSuccess }: any) => {
  if (!bookId) return null;

  return (
    // Modal/Dialog Overlay
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      {/* The Card content will be the EditBookForm. 
        Note: The EditBookForm itself contains a Card, so you might adjust styling 
        or remove the outer Card here if you prefer. 
        I'm keeping it for the fixed positioning/animation of the dialog. 
      */}
      <div className="max-w-4xl w-full my-8 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200">
        <EditBookForm
          bookId={bookId}
          onSuccess={onSuccess} // Pass the success handler (e.g., close the modal, refresh data)
          onCancel={onCancel} // Pass the cancel handler (close the modal)
        />
      </div>
    </div>
  );
};

export default EditDialog;
