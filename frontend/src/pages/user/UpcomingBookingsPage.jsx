import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { bookingService } from "../../services/bookingService.js";
import { formatDate, formatTime } from "../../utils/formatDate.js";
import { formatCurrency } from "../../utils/formatCurrency.js";
import { handleApiError } from "../../utils/errorHandler.js";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import ErrorState from "../../components/common/ErrorState.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import { ListItemSkeleton } from "../../components/common/Skeleton.jsx";
import {
  Calendar,
  Ban,
  Clock,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";

const UpcomingBookingsPage = () => {
  const queryClient = useQueryClient();
  const [confirmId, setConfirmId] = useState(null);

  const { data: bookings = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["user-upcoming-bookings"],
    queryFn: () => bookingService.getMyUpcomingBookings(),
  });

  const cancelMutation = useMutation({
    mutationFn: (id) => bookingService.cancelBooking(id),
    onSuccess: () => {
      toast.success("Appointment cancelled.");
      queryClient.invalidateQueries(["user-upcoming-bookings"]);
      queryClient.invalidateQueries(["user-dashboard"]);
      queryClient.invalidateQueries(["user-bookings"]);
      setConfirmId(null);
    },
    onError: (err) => {
      handleApiError(err, "Failed to cancel appointment.");
      setConfirmId(null);
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Upcoming Appointments"
        subtitle="View and manage sessions scheduled for today and future dates."
      >
        <Link to="/services">
          <Button variant="outline-teal" size="sm">
            Book Another
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </PageHeader>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <ListItemSkeleton key={i} />)}
        </div>
      ) : isError ? (
        <ErrorState
          title="Failed to load appointments"
          description="We couldn't retrieve your upcoming appointments. Please try again."
          onRetry={refetch}
        />
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
          <EmptyState
            icon={Calendar}
            title="No upcoming appointments"
            description="You don't have any scheduled sessions. Browse services to book your next wellness session."
          >
            <Link to="/services">
              <Button variant="primary" size="sm">
                Browse Services
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </EmptyState>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Summary banner */}
          <div className="flex items-center gap-2.5 bg-teal-50 border border-teal-100 rounded-2xl px-4 py-3">
            <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
            <p className="text-sm font-semibold text-teal-800">
              You have <strong>{bookings.length}</strong> upcoming session{bookings.length !== 1 ? "s" : ""} scheduled.
            </p>
          </div>

          {bookings.map((b, idx) => (
            <motion.div
              key={b._id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md hover:border-teal-200 transition-all duration-200"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
            >
              {/* Top accent bar */}
              <div className="h-1 bg-gradient-to-r from-teal-500 to-cyan-400" />

              <div className="p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="success" dot pulse>Confirmed</Badge>
                    <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">
                      #{b._id.slice(-6).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-teal-600 uppercase tracking-wide mb-0.5">
                      {b.service?.category}
                    </p>
                    <h3 className="text-lg font-bold text-slate-900">{b.service?.name}</h3>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                      {formatDate(b.slot?.date)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                      {formatTime(b.slot?.startTime)} – {formatTime(b.slot?.endTime)}
                    </span>
                    {b.service?.price && (
                      <span className="font-semibold text-teal-700">
                        {formatCurrency(b.service.price)}
                      </span>
                    )}
                  </div>
                  {b.notes && (
                    <p className="text-xs text-slate-500 italic bg-slate-50 py-1.5 px-3 rounded-lg border border-slate-100">
                      📋 {b.notes}
                    </p>
                  )}
                </div>

                <Button
                  variant="danger-outline"
                  size="sm"
                  className="self-start sm:self-center shrink-0"
                  onClick={() => setConfirmId(b._id)}
                >
                  <Ban className="w-3.5 h-3.5" />
                  Cancel Booking
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={() => cancelMutation.mutate(confirmId)}
        title="Cancel Appointment?"
        description="This will cancel your session and restore slot availability. Are you sure?"
        confirmLabel="Yes, Cancel"
        cancelLabel="Keep Appointment"
        variant="danger"
        isLoading={cancelMutation.isPending}
      />
    </div>
  );
};

export default UpcomingBookingsPage;
