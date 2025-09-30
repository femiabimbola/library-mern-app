import { Card, CardTitle, CardDescription } from "./ui/card";
import { FallbackProps } from "react-error-boundary";

interface ErrorFallbackProps {
  errorMessage: string;
}

export const GlobalErrorFallback = ({ errorMessage }: ErrorFallbackProps) => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="p-4">
        <CardTitle className="text-red-500">Something went wrong</CardTitle>
        <CardDescription>{errorMessage}</CardDescription>
      </Card>
    </div>
  );
};

const ErrorBoundaryAdapter = ({ error }: FallbackProps) => {
  return <GlobalErrorFallback errorMessage={error.message} />;
};

export default ErrorBoundaryAdapter;
