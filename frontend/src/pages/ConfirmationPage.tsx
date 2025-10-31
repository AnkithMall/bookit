import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

const ConfirmationPage = () => {
  const referenceId = Math.random().toString(36).substring(2, 15).toUpperCase();

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Booking Confirmed!</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Your booking has been confirmed.</p>
          <p className="mt-2">
            Reference ID: <strong>{referenceId}</strong>
          </p>
          <Link to="/">
            <Button
              className="w-full mt-4"
              style={{
                backgroundColor: "#FFD643",
                color: "#161616",
                borderRadius: "8px",
              }}
            >
              Back to Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfirmationPage;
