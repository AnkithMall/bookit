import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import { useBookingStore } from "../store/bookingStore";
import type { Experience } from "../data/dummy";
import { toast } from "sonner";
import api from "../lib/api";
import Spinner from "../components/Spinner";
import { Loader2, ArrowLeft } from "lucide-react";

const CheckoutPage = () => {
  const { experienceId, quantity, slotId } = useBookingStore();
  const location = useLocation();
  const state = (location as any).state as { experience?: Experience } | undefined;
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [applyingPromo, setApplyingPromo] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExperienceDetails = async () => {
      try {
        const response = await api.get(`/experiences/${experienceId}`);
        setExperience(response.data);
      } catch (error: any) {
        setError(error?.message ?? "Failed to fetch experience details");
      } finally {
        setLoading(false);
      }
    };

    // Prefer router state (from DetailsPage) to avoid refetch
    if (state?.experience) {
      setExperience(state.experience);
      setLoading(false);
      return;
    }

    if (experienceId) {
      fetchExperienceDetails();
    } else {
      setLoading(false);
    }
  }, [experienceId]);

  const handleApplyPromoCode = async () => {
    setApplyingPromo(true);
    try {
      const { data } = await api.post("/promo/validate", { code: promoCode });
      // data: { message, discountType: 'percent' | 'flat', amount, code }
      const currentSubtotal = (experience?.price ?? 0) * quantity;
      let computed = 0;
      if (data.discountType === 'percent') {
        computed = (currentSubtotal * Number(data.amount || 0)) / 100;
      } else if (data.discountType === 'flat') {
        computed = Number(data.amount || 0);
      }
      setDiscount(computed);
      toast.success(`Promo ${data.code} applied: ${data.discountType === 'percent' ? data.amount + '% off' : `-${data.amount}`}`);
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? error?.message ?? "Invalid promo code");
    } finally {
      setApplyingPromo(false);
    }
  };

  const handleBooking = async () => {
    if (!experience) return;

    try {
      setBookingLoading(true);
      await api.post("/bookings", {
        slot_id: slotId,
        user_name: name,
        user_email: email,
      });
      navigate("/confirmation");
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? error?.message ?? "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return <Spinner fullScreen label="Loading checkout..." />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!experience) {
    return <div>Experience not found</div>;
  }

  const subtotal = experience.price * quantity;
  const taxes = 0; // Replace with actual tax calculation if needed
  const total = subtotal + taxes - discount;

  return (
    <div className="p-4">
      <Link
        to={`/details/${experienceId}`}
        className="inline-flex items-center gap-2 text-gray-900 hover:text-gray-700"
        aria-label="Back to details"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to details</span>
      </Link>
      <div className="flex flex-col md:flex-row gap-4 mt-4">
        <div className="w-full md:w-2/3 md:pr-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name">Full Name</label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="email">Email</label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Promo Code</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <Button
                  className="rounded-lg bg-[#FFD643] text-[#161616] border border-[#FFD643] hover:bg-white hover:text-[#161616] transition-colors"
                  onClick={handleApplyPromoCode}
                  disabled={applyingPromo || !promoCode.trim()}
                >
                  {applyingPromo ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Applying...</>
                  ) : (
                    "Apply"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center space-x-2 mt-4">
            <Checkbox id="terms" />
            <label htmlFor="terms">
              I agree to the terms and safety policy
            </label>
          </div>
        </div>

        <div className="w-full md:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>Billing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <p className="font-bold">{experience.name}</p>
              </div>
              <div className="flex justify-between mt-2">
                <p>Quantity</p>
                <p>{quantity}</p>
              </div>
              <div className="flex justify-between mt-4">
                <p>Subtotal</p>
                <p>₹{subtotal}</p>
              </div>
              <div className="flex justify-between mt-2">
                <p>Taxes</p>
                <p>₹{taxes}</p>
              </div>
              {discount > 0 && (
                <div className="flex justify-between mt-2">
                  <p>Discount</p>
                  <p>-₹{discount}</p>
                </div>
              )}
              <div className="flex justify-between font-bold mt-4">
                <p>Total</p>
                <p>₹{total}</p>
              </div>
              <Button
                className="w-full mt-4 rounded-lg bg-[#FFD643] text-[#161616] border border-[#FFD643] hover:bg-white hover:text-[#161616] transition-colors"
                onClick={handleBooking}
                disabled={bookingLoading}
              >
                {bookingLoading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
                ) : (
                  "Pay and Confirm"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
