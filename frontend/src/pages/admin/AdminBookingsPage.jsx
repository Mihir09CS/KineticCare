import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { bookingService } from "../../services/bookingService.js";
import { formatDate, formatTime } from "../../utils/formatDate.js";
import { handleApiError } from "../../utils/errorHandler.js";
import Button from "../../components/common/Button.jsx";
import Badge from "../../components/common/Badge.jsx";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import ErrorState from "../../components/common/ErrorState.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import { ListItemSkeleton } from "../../components/common/Skeleton.jsx";
import {
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  Ban,
  Calendar,
  Clock,
  User,
} from "lucide-react";
import toast from "react-hot-toast";

const STATUSES = ["", "Confirmed", "Cancelled", "Completed"];
const statusVariantMap = { Confirmed: "success", Cancelled: "danger", Completed: "neutral" };

const AdminBookingsPage = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [confirmId, setConfirmId] = useState(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-bookings", { page, status }],
    queryFn: () =>
      bookingService.getAllBookings({ page, limit: 10, status: status || undefined }),
  });

  const cancelMutation = useMutation({
    mutationFn: (id) => bookingService.cancelBooking(id),
    onSuccess: () => {
      toast.success("Booking cancelled.");
      queryClient.invalidateQueries(["admin-bookings"]);
      queryClient.invalidateQueries(["admin-dashboard"]);
      setConfirmId(null);
    },
    onError: (err) => {
      handleApiError(err, "Failed to cancel booking.");
      setConfirmId(null);
    },
  });

  const handleStatusFilter = (st) => {
    setStatus(st === status ? "" : st);
    setPage(1);
  };

  const bookings = data?.bookings || [];
  const pagination = data?.pagination || { page: 1, totalPages: 1 };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bookings System"
        subtitle="Track and manage all client scheduling transactions."
      />

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm w-fit">
        {STATUSES.map((st) => (
          <button
            key={st}
            onClick={() => handleStatusFilter(st)}
            className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all duration-150 ${
              status === st
                ? "bg-amber-500 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            {st || "All"}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <ListItemSkeleton key={i} />)}
        </div>
      ) : isError ? (
        <ErrorState
          title="Failed to load bookings"
          description="We couldn't retrieve the bookings list. Please try again."
          onRetry={refetch}
        />
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
          <EmptyState
            icon={ClipboardList}
            title={status ? `No ${status.toLowerCase()} bookings` : "No bookings found"}
            description={
              status
                ? `There are no ${status.toLowerCase()} bookings in the system.`
                : "No bookings have been made in the system yet."
            }
            action={status ? () => setStatus("") : undefined}
            actionLabel={status ? "Show All" : undefined}
            actionVariant="outline"
          />
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b, idx) => {
            const isConfirmed = b.bookingStatus === "Confirmed";
            const isUpcoming = b.slot && new Date(b.slot.date) >= new Date();
            const showCancel = isConfirmed && isUpcoming;

            return (
              <motion.div
                key={b._id}
                className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md hover:border-slate-300 transition-all duration-200"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
              >
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="space-y-2 min-w-0">
                    {/* Status + ID */}
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant={statusVariantMap[b.bookingStatus] || "neutral"}
                        dot
                        pulse={b.bookingStatus === "Confirmed"}
                      >
                        {b.bookingStatus}
                      </Badge>
                      <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">
                        #{b._id.slice(-6).toUpperCase()}
                      </span>
                    </div>

                    {/* Service Name */}
                    <h3 className="text-base font-bold text-slate-900 truncate">{b.service?.name}</h3>

                    {/* Client Info */}
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-600">
                      <User className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      {b.user?.name}
                      <span className="text-slate-400 font-normal text-xs">({b.user?.email})</span>
                    </div>

                    {/* Date/Time */}
                    <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        {formatDate(b.slot?.date)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        {formatTime(b.slot?.startTime)} – {formatTime(b.slot?.endTime)}
                      </span>
                    </div>

                    {b.notes && (
                      <p className="text-xs text-slate-500 italic bg-slate-50 py-1.5 px-3 rounded-lg border border-slate-100 line-clamp-1">
                        📋 {b.notes}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 flex items-start sm:items-center">
                    {showCancel ? (
                      <Button
                        variant="danger-outline"
                        size="sm"
                        onClick={() => setConfirmId(b._id)}
                      >
                        <Ban className="w-3.5 h-3.5" />
                        Cancel Booking
                      </Button>
                    ) : (
                      <span className="text-xs text-slate-400 italic font-semibold">
                        {b.bookingStatus === "Cancelled" ? "Cancelled" : "Non-cancellable"}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-4">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => Math.max(p - 1, 1))}>
            <ChevronLeft className="w-4 h-4" /> Previous
          </Button>
          <span className="text-sm font-semibold text-slate-500">{pagination.page} / {pagination.totalPages}</span>
          <Button variant="outline" size="sm" disabled={page === pagination.totalPages} onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}>
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Confirm Cancel */}
      <ConfirmDialog
        isOpen={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={() => cancelMutation.mutate(confirmId)}
        title="Cancel Client Booking?"
        description="This will cancel the client's booking and restore slot availability. This action cannot be undone."
        confirmLabel="Cancel Booking"
        cancelLabel="Keep It"
        variant="danger"
        isLoading={cancelMutation.isPending}
      />
    </div>
  );
};

export default AdminBookingsPage;
