import ErrorBoundaryAdapter from "./GlobalErrorFallback";
import { ErrorBoundary } from "react-error-boundary";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

const BorrowBookRecord = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorBoundaryAdapter}>
      <Card className="my-10">
        <CardHeader>
          <CardTitle className=""> List of all the books</CardTitle>
          <CardDescription> These are the lists of your books </CardDescription>
        </CardHeader>
      </Card>
    </ErrorBoundary>
  );
};

export default BorrowBookRecord;
