import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useBookingStore } from "../store/bookingStore";
import type { Experience } from "../data/dummy";
import api from "../lib/api";
import { toast } from "sonner";
import Spinner from "../components/Spinner";
import { ArrowLeft } from "lucide-react";

const DetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const navigate = useNavigate();
  const [confirmLoading, setConfirmLoading] = useState(false);

  const { quantity, setExperienceId, setDate, setTime, setQuantity, setSlotId } =
    useBookingStore();

  useEffect(() => {
    const fetchExperienceDetails = async () => {
      try {
        const response = await api.get(`/experiences/${id}`);
        setExperience(response.data);
        console.log('Experience data:', response.data);
      } catch (error) {
        console.error('Error fetching experience details:', error);
        // The caught error can be of any type; ensure we set a string message.
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(String(error));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchExperienceDetails();
  }, [id]);

  useEffect(() => {
    if (experience) {
      setExperienceId(experience.id);
    }
  }, [experience, setExperienceId]);

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Please select a date and time.");
      return;
    }
    setConfirmLoading(true);
    // Simulate async step to avoid double clicks; navigation happens immediately
    navigate("/checkout", { state: { experience } });
  };

  if (loading) {
    return <Spinner fullScreen label="Loading details..." />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!experience) {
    return <div>Experience not found</div>;
  }

  const availableDates = Array.from({ length: 5 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date.toISOString().split("T")[0];
  });

  return (
    <div className="p-4">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-gray-900 hover:text-gray-700"
        aria-label="Back"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back</span>
      </Link>
      <div className="flex flex-col md:flex-row gap-4 mt-4">
        <div className="w-full md:w-2/3 md:pr-4">
          <img
            src={experience.image}
            alt={experience.name}
            className="w-full h-56 sm:h-72 md:h-96 object-cover rounded-lg"
          />
          <h1 className="text-4xl font-bold mt-4">{experience.name}</h1>
          <p className="text-gray-700 mt-2">{experience.description}</p>

          <div className="mt-4">
            <h2 className="text-2xl font-bold">Choose Date</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {availableDates.map((date) => (
                <Button
                  key={date}
                  variant={selectedDate === date ? "default" : "outline"}
                  onClick={() => {
                    setSelectedDate(date);
                    setDate(date);
                  }}
                  style={{
                    backgroundColor: selectedDate === date ? "#FFD643" : "",
                    color: "#161616",
                    borderRadius: "8px",
                  }}
                >
                  {date}
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h2 className="text-2xl font-bold">Choose Time</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {experience.slots.map((slot) => {
                const booked = (slot as any).is_booked ?? (slot as any).isBooked ?? false;
                return (
                <Button
                  key={slot.id}
                  variant={
                    selectedTime === slot.start_time ? "default" : "outline"
                  }
                  disabled={booked}
                  onClick={() => {
                    setSelectedTime(slot.start_time);
                    setTime(slot.start_time);
                    setSlotId(slot.id);
                  }}
                  style={{
                    backgroundColor:
                      selectedTime === slot.start_time ? "#FFD643" : "",
                    color: "#161616",
                    borderRadius: "8px",
                  }}
                >
                  {slot.start_time}
                </Button>
                );
              })}
              </div>
          </div>

          <div className="mt-4">
            <h2 className="text-2xl font-bold">About</h2>
            <p className="text-gray-700 mt-2">{experience.about}</p>
          </div>
        </div>

        <div className="w-full md:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>Billing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <p>Start at</p>
                <p>₹{experience.price}</p>
              </div>
              <div className="flex justify-between items-center mt-4">
                <p>Quantity</p>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity - 1)}
                    disabled={quantity <= 1}
                    style={{
                      backgroundColor: "#FFD643",
                      color: "#161616",
                      borderRadius: "8px",
                    }}
                  >
                    -
                  </Button>
                  <span>{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    style={{
                      backgroundColor: "#FFD643",
                      color: "#161616",
                      borderRadius: "8px",
                    }}
                  >
                    +
                  </Button>
                </div>
              </div>
              <div className="flex justify-between mt-4">
                <p>Subtotal</p>
                <p>₹{experience.price * quantity}</p>
              </div>
              <div className="flex justify-between mt-2">
                <p>Taxes</p>
                <p>₹0</p>
              </div>
              <div className="flex justify-between font-bold mt-4">
                <p>Total</p>
                <p>₹{experience.price * quantity}</p>
              </div>
              <Button
                className="w-full mt-4"
                style={{
                  backgroundColor: "#FFD643",
                  color: "#161616",
                  borderRadius: "8px",
                }}
                onClick={handleConfirm}
                disabled={confirmLoading}
              >
                {confirmLoading ? "Processing..." : "Confirm"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;
