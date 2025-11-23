import { Button } from "./ui/button";
import { Card, CardDescription, CardTitle } from "./ui/card"; // Adjust import path if necessary

interface LogOutDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const LogOutDialog = ({ onConfirm, onCancel, isLoading }: LogOutDialogProps) => {
  return (
    // Fixed overlay with z-index to ensure it sits on top of the sidebar
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200">
      <Card className="max-w-md w-full p-6 text-center shadow-2xl bg-white">
        <CardTitle className="text-lg font-bold text-dark-100">Confirm Logout</CardTitle>
        <CardDescription className="my-4 text-grey-800">
          Are you sure you want to logout? You will be redirected to the login page.
        </CardDescription>

        <div className="flex justify-center gap-4 mt-6">
          <Button
            onClick={onCancel}
            variant="ghost"
            disabled={isLoading}
            className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-none"
          >
            Cancel
          </Button>

          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 text-white hover:bg-red-700 min-w-[100px]"
          >
            {isLoading ? "Logging out..." : "Log Out"}
          </Button>
        </div>
      </Card>
    </div>
  );
};
