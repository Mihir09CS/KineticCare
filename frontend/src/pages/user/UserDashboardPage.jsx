import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { dashboardService } from "../../services/dashboardService.js";
import { bookingService } from "../../services/bookingService.js";
import { formatDate, formatTime } from "../../utils/formatDate.js";
import { handleApiError } from "../../utils/errorHandler.js";
import StatCard from "../../components/common/StatCard.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import { DashboardSkeleton } from "../../components/common/Skeleton.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import {
  Calendar,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Activity,
  Clock,
  Stethoscope,
  Ban,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";

const UserDashboardPage = () => {
  const queryClient = useQueryClient();
  const [confirmId, setConfirmId] = useState(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["user-dashboard"],
    queryFn: () => dashboardService.getUserDashboard(),
  });

  const cancelBookingMutation = useMutation({
    mutationFn: (id) => bookingService.cancelBooking(id),
    onSuccess: () => {
      toast.success("Appointment cancelled successfully.");
      queryClient.invalidateQueries(["user-dashboard"]);
      setConfirmId(null);
    },
    onError: (err) => {
      handleApiError(err, "Failed to cancel booking.");
      setConfirmId(null);
    },
  });

  if (isLoading) return <DashboardSkeleton />;

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 font-semibold mb-4">Failed to retrieve dashboard details.</p>
        <Button variant="outline" onClick={refetch} size="sm">Try Again</Button>
      </div>
    );
  }

  const { stats = {}, upcomingBookings = [], recentHistory = [] } = data || {};

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        subtitle="Track and manage your upcoming wellness sessions and history."
        badge={
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 bg-teal-50 border border-teal-100 px-3 py-1 rounded-full">
            <Sparkles className="w-3 h-3" />
            Member Portal
          </div>
        }
      >
        <Link to="/services">
          <Button variant="outline-teal" size="sm">
            <Stethoscope className="w-4 h-4" />
            Browse Services
          </Button>
        </Link>
      </PageHeader>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={Calendar}
          label="Total Sessions"
          value={stats.totalBookings ?? 0}
          color="teal"
          index={0}
          accentBorder
        />
        <StatCard
          icon={CheckCircle2}
          label="Confirmed"
          value={stats.confirmedBookings ?? 0}
          color="emerald"
          index={1}
          accentBorder
        />
        <StatCard
          icon={XCircle}
          label="Cancelled"
          value={stats.cancelledBookings ?? 0}
          color="red"
          index={2}
          accentBorder
        />
        <StatCard
          icon={Activity}
          label="Completed"
          value={stats.completedBookings ?? 0}
          color="sky"
          index={3}
          accentBorder
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Appointments */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-teal-600" />
              Upcoming Appointments
            </h3>
            <Link
              to="/my-bookings/upcoming"
              className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-0.5 transition-colors"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {upcomingBookings.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
              <EmptyState
                icon={Calendar}
                title="No upcoming appointments"
                description="Ready to book your next wellness session?"
                action={() => {}}
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
            <div className="space-y-3">
              {upcomingBookings.map((b, idx) => (
                <motion.div
                  key={b._id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md hover:border-slate-300 transition-all duration-200"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                    <div className="space-y-1.5">
                      <p className="text-xs font-bold text-teal-600 uppercase tracking-wide">
                        {b.service?.category}
                      </p>
                      <h4 className="text-base font-bold text-slate-800">{b.service?.name}</h4>
                      <div className="flex items-center gap-1.5 text-sm text-slate-500">
                        <Calendar className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                        {formatDate(b.slot?.date)} · {formatTime(b.slot?.startTime)} – {formatTime(b.slot?.endTime)}
                      </div>
                    </div>
                    <Button
                      variant="danger-outline"
                      size="sm"
                      className="self-start sm:self-center shrink-0"
                      onClick={() => setConfirmId(b._id)}
                    >
                      <Ban className="w-3.5 h-3.5" />
                      Cancel
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Recent History */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-600" />
              Recent Bookings
            </h3>
            <Link
              to="/my-bookings"
              className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-0.5 transition-colors"
            >
              Full History <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentHistory.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
              <EmptyState
                icon={Activity}
                title="No booking history"
                description="Your booked sessions will appear here."
              />
            </div>
          ) : (
            <div className="space-y-3">
              {recentHistory.map((b, idx) => {
                const statusVariant =
                  b.bookingStatus === "Confirmed" ? "success" :
                  b.bookingStatus === "Cancelled" ? "danger" : "neutral";

                return (
                  <motion.div
                    key={b._id}
                    className="bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-md hover:border-slate-300 transition-all duration-200 flex justify-between items-center gap-4"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06 }}
                  >
                    <div className="min-w-0 space-y-1">
                      <h4 className="text-sm font-bold text-slate-800 truncate">{b.service?.name}</h4>
                      <p className="text-xs text-slate-400">{formatDate(b.slot?.date)}</p>
                    </div>
                    <Badge variant={statusVariant} dot pulse={b.bookingStatus === "Confirmed"} className="shrink-0">
                      {b.bookingStatus}
                    </Badge>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Confirm Cancel Dialog */}
      <ConfirmDialog
        isOpen={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={() => cancelBookingMutation.mutate(confirmId)}
        title="Cancel Appointment?"
        description="Are you sure you want to cancel this appointment? The slot availability will be restored."
        confirmLabel="Yes, Cancel"
        cancelLabel="Keep Appointment"
        variant="danger"
        isLoading={cancelBookingMutation.isPending}
      />
    </div>
  );
};

export default UserDashboardPage;
