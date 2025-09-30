import { Card, CardTitle, CardDescription } from "@/components/ui/card"; // Adjust import path as needed

const ErrorFallback = ({ errorMessage }: { errorMessage: string }) => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="p-4">
        <CardTitle className="text-red-500">Something went wrong</CardTitle>
        <CardDescription>{errorMessage}</CardDescription>
      </Card>
    </div>
  );
};

export default ErrorFallback;
