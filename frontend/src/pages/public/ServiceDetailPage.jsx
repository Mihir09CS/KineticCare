import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext.jsx";
import { serviceService } from "../../services/serviceService.js";
import { slotService } from "../../services/slotService.js";
import { bookingService } from "../../services/bookingService.js";
import { formatDate, formatTime } from "../../utils/formatDate.js";
import { formatCurrency } from "../../utils/formatCurrency.js";
import { handleApiError } from "../../utils/errorHandler.js";
import Button from "../../components/common/Button.jsx";
import Badge from "../../components/common/Badge.jsx";
import Modal from "../../components/common/Modal.jsx";
import TextArea from "../../components/common/TextArea.jsx";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";
import { CardSkeleton } from "../../components/common/Skeleton.jsx";
import {
  HeartPulse,
  Clock,
  IndianRupee,
  ChevronLeft,
  CalendarDays,
  CheckCircle2,
  Calendar,
  Users,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Activity,
} from "lucide-react";
import toast from "react-hot-toast";

const categoryIcons = {
  Physiotherapy: "🦴",
  Yoga: "🧘",
  Meditation: "🧠",
  Nutrition: "🥗",
  "Massage Therapy": "💆",
  "Mental Wellness": "💚",
  Fitness: "💪",
  "Occupational Therapy": "🤝",
  Hydrotherapy: "🌊",
  "Balance & Mobility": "⚖️",
};

const ServiceDetailPage = () => {
  const { id: serviceId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingNotes, setBookingNotes] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  // Fetch Service Details
  const { data: service, isLoading: isLoadingService } = useQuery({
    queryKey: ["service", serviceId],
    queryFn: () => serviceService.getServiceById(serviceId),
  });

  // Fetch Available Slots
  const { data: slots = [], isLoading: isLoadingSlots } = useQuery({
    queryKey: ["service-slots", serviceId, selectedDate],
    queryFn: () =>
      slotService.getSlotsByService(serviceId, {
        date: selectedDate || undefined,
      }),
    enabled: !!serviceId,
  });

  // Booking Mutation
  const createBookingMutation = useMutation({
    mutationFn: (bookingData) => bookingService.createBooking(bookingData),
    onSuccess: (data) => {
      toast.success("Appointment booked successfully!");
      setBookingSuccess(data);
      setShowConfirmModal(false);
      setShowBookingDialog(false);
      queryClient.invalidateQueries(["service-slots", serviceId]);
    },
    onError: (err) => {
      handleApiError(err, "Failed to book appointment. The slot might be full.");
    },
  });

  const handleSlotSelect = (slot) => {
    if (!isAuthenticated) {
      toast("Please sign in to book an appointment.", { icon: "🔒" });
      navigate("/login", { state: { from: { pathname: `/services/${serviceId}` } } });
      return;
    }
    setSelectedSlot(slot);
    setShowConfirmModal(true);
  };

  const handleProceedToConfirm = () => {
    setShowConfirmModal(false);
    setShowBookingDialog(true);
  };

  const handleConfirmBooking = () => {
    if (!selectedSlot) return;
    createBookingMutation.mutate({
      service: serviceId,
      slot: selectedSlot._id,
      notes: bookingNotes.trim() || undefined,
    });
  };

  if (isLoadingService) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <CardSkeleton className="max-w-3xl" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <HeartPulse className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-700 mb-4">Service not found</h2>
        <Link to="/services">
          <Button variant="primary">Back to Services</Button>
        </Link>
      </div>
    );
  }

  // Booking success screen
  if (bookingSuccess) {
    return (
      <motion.div
        className="max-w-2xl mx-auto px-4 py-20 text-center"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-100"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <CheckCircle2 className="w-10 h-10" />
        </motion.div>
        <h1 className="text-3xl font-black text-slate-900 mb-2">Booking Confirmed!</h1>
        <p className="text-slate-500 max-w-md mx-auto leading-relaxed mb-8">
          Your appointment is booked. A confirmation email with all details has been sent to your registered address.
        </p>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 text-left space-y-3 max-w-md mx-auto shadow-sm mb-8">
          <div className="flex justify-between items-center py-2 border-b border-slate-50">
            <span className="text-sm text-slate-500 font-medium">Service</span>
            <span className="text-sm font-bold text-slate-900">{service.name}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-slate-50">
            <span className="text-sm text-slate-500 font-medium">Date</span>
            <span className="text-sm font-bold text-slate-900">{formatDate(selectedSlot?.date)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-slate-50">
            <span className="text-sm text-slate-500 font-medium">Time</span>
            <span className="text-sm font-bold text-slate-900">
              {formatTime(selectedSlot?.startTime)} – {formatTime(selectedSlot?.endTime)}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm font-bold text-teal-700">Total</span>
            <span className="text-lg font-extrabold text-teal-700">{formatCurrency(service.price)}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link to="/my-bookings/upcoming">
            <Button variant="primary" size="lg">
              View My Appointments
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/services">
            <Button variant="outline" size="lg">Browse Other Services</Button>
          </Link>
        </div>
      </motion.div>
    );
  }

  const availableSlots = slots.filter((s) => s.availableBookings > 0 && s.status !== "full");
  const fullSlots = slots.filter((s) => s.availableBookings === 0 || s.status === "full");

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Breadcrumb */}
        <Link
          to="/services"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-teal-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Services
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left: Service Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image + Info */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              {service.imageUrl ? (
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={service.imageUrl}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    <Badge variant="teal" className="shadow-sm">
                      {categoryIcons[service.category]} {service.category}
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="relative h-48 bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center">
                  <span className="text-8xl opacity-30">
                    {categoryIcons[service.category] || "🏥"}
                  </span>
                  <div className="absolute bottom-4 left-4">
                    <Badge variant="teal" className="shadow-sm">
                      {categoryIcons[service.category]} {service.category}
                    </Badge>
                  </div>
                </div>
              )}

              <div className="p-7 space-y-4">
                <div className="flex flex-wrap gap-3 items-center">
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                    <Clock className="w-4 h-4 text-teal-600" />
                    {service.duration} minutes
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                    <IndianRupee className="w-4 h-4 text-teal-600" />
                    {formatCurrency(service.price)} per session
                  </div>
                </div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                  {service.name}
                </h1>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                  {service.description}
                </p>
              </div>
            </div>

            {/* Benefits Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-7 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-600" />
                Why Join This Program?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: ShieldCheck, title: "Certified Instructors", desc: "All sessions led by qualified professionals" },
                  { icon: Activity, title: "Personalized Care", desc: "Programs adapted for your wellness level" },
                  { icon: HeartPulse, title: "Health Focused", desc: "Designed specifically for active seniors" },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 mb-1">{title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Booking Panel */}
          <div className="sticky top-24 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Panel Header */}
              <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-5">
                <h3 className="text-white font-bold text-lg">Book Your Session</h3>
                <p className="text-teal-100 text-sm mt-0.5">Select a date and available time</p>
              </div>

              <div className="p-5 space-y-5">
                {/* Price */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-sm font-semibold text-slate-600">Session Price</span>
                  <span className="text-2xl font-black text-teal-700">
                    {formatCurrency(service.price)}
                  </span>
                </div>

                {/* Date Filter */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-slate-700">Filter by Date</label>
                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type="date"
                      value={selectedDate}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500 hover:border-slate-300 transition-all"
                    />
                  </div>
                  {selectedDate && (
                    <button
                      onClick={() => setSelectedDate("")}
                      className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
                    >
                      Clear date filter
                    </button>
                  )}
                </div>

                {/* Available Slots */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-teal-600" />
                      Available Times
                    </h4>
                    {!isLoadingSlots && slots.length > 0 && (
                      <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
                        {availableSlots.length} open
                      </span>
                    )}
                  </div>

                  {isLoadingSlots ? (
                    <div className="space-y-2 py-2">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-16 rounded-xl bg-slate-100 skeleton-shimmer" />
                      ))}
                    </div>
                  ) : slots.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-2xl">
                      <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-slate-400">
                        No slots available
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Try a different date
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-72 overflow-y-auto pr-0.5">
                      {/* Available slots */}
                      {availableSlots.map((slot) => (
                        <motion.button
                          key={slot._id}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => handleSlotSelect(slot)}
                          className="w-full text-left p-4 border-2 border-slate-200 rounded-2xl hover:border-teal-500 hover:bg-teal-50/50 transition-all duration-150 cursor-pointer group"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-xs font-bold text-slate-400 mb-0.5">
                                {formatDate(slot.date)}
                              </p>
                              <p className="text-sm font-bold text-slate-800 group-hover:text-teal-700 transition-colors">
                                {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                                <Users className="w-3 h-3" />
                                {slot.availableBookings} left
                              </div>
                            </div>
                          </div>
                        </motion.button>
                      ))}

                      {/* Full slots */}
                      {fullSlots.map((slot) => (
                        <div
                          key={slot._id}
                          className="w-full p-4 border border-slate-100 rounded-2xl bg-slate-50 opacity-60 cursor-not-allowed"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-xs font-bold text-slate-400 mb-0.5">
                                {formatDate(slot.date)}
                              </p>
                              <p className="text-sm font-bold text-slate-400">
                                {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                              </p>
                            </div>
                            <Badge variant="danger" dot>Fully Booked</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {!isAuthenticated && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-center">
                    <p className="text-xs font-semibold text-amber-700">
                      <Link to="/login" className="underline">Sign in</Link> to book a session
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Modal (before confirm) */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Review Your Booking"
      >
        <div className="space-y-5">
          <p className="text-sm text-slate-600">
            You're booking a session for <strong>{service.name}</strong>.
          </p>

          {/* Booking summary */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
            {[
              { label: "Service", value: service.name },
              { label: "Date", value: formatDate(selectedSlot?.date) },
              {
                label: "Time",
                value: `${formatTime(selectedSlot?.startTime)} – ${formatTime(selectedSlot?.endTime)}`,
              },
              { label: "Duration", value: `${service.duration} mins` },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">{label}</span>
                <span className="font-bold text-slate-800">{value}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm pt-2 border-t border-slate-200">
              <span className="font-bold text-teal-700">Total</span>
              <span className="font-extrabold text-teal-700">{formatCurrency(service.price)}</span>
            </div>
          </div>

          <TextArea
            label="Appointment Notes (Optional)"
            placeholder="Any health conditions or instructions for the instructor..."
            value={bookingNotes}
            onChange={(e) => setBookingNotes(e.target.value)}
            rows={3}
          />

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              fullWidth
              onClick={() => setShowConfirmModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={handleProceedToConfirm}
            >
              Continue to Confirm
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Modal>

      {/* Final Confirm Dialog */}
      <ConfirmDialog
        isOpen={showBookingDialog}
        onClose={() => setShowBookingDialog(false)}
        onConfirm={handleConfirmBooking}
        title="Confirm Your Booking"
        description={`Book ${service.name} on ${formatDate(selectedSlot?.date)} at ${formatTime(selectedSlot?.startTime)}? You'll receive a confirmation email.`}
        confirmLabel="Confirm Booking"
        cancelLabel="Go Back"
        variant="info"
        isLoading={createBookingMutation.isPending}
      />
    </div>
  );
};

export default ServiceDetailPage;
