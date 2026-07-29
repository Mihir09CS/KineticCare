import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { slotService } from "../../services/slotService.js";
import { serviceService } from "../../services/serviceService.js";
import { createSlotSchema } from "../../validations/slotValidation.js";
import { formatDate, formatTime } from "../../utils/formatDate.js";
import { handleApiError } from "../../utils/errorHandler.js";
import Button from "../../components/common/Button.jsx";
import Badge from "../../components/common/Badge.jsx";
import Modal from "../../components/common/Modal.jsx";
import Input from "../../components/common/Input.jsx";
import Select from "../../components/common/Select.jsx";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import ErrorState from "../../components/common/ErrorState.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import {
  Plus,
  Ban,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Clock,
  Users,
  Calendar,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

const AdminSlotsPage = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterDate, setFilterDate] = useState("");
  const [confirmDeactivateId, setConfirmDeactivateId] = useState(null);

  const { data: slotData, isLoading: isLoadingSlots, isError: isErrorSlots, refetch } = useQuery({
    queryKey: ["admin-slots", { page, filterDate }],
    queryFn: () => slotService.getAllSlots({ page, limit: 9, date: filterDate || undefined }),
  });

  const { data: serviceData } = useQuery({
    queryKey: ["active-services-dropdown"],
    queryFn: () => serviceService.getAllServices({ limit: 100, isActive: "true" }),
  });

  const slots = slotData?.slots || [];
  const pagination = slotData?.pagination || { page: 1, totalPages: 1 };
  const services = serviceData?.services || [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createSlotSchema),
    defaultValues: { service: "", date: "", startTime: "09:00", endTime: "10:00", maxBookings: 5 },
  });

  const createMutation = useMutation({
    mutationFn: (formData) => slotService.createSlot(formData),
    onSuccess: () => {
      toast.success("Slot created!");
      setIsModalOpen(false);
      reset();
      queryClient.invalidateQueries(["admin-slots"]);
    },
    onError: (err) => handleApiError(err, "Failed to create slot. It may overlap with existing schedule."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => slotService.deleteSlot(id),
    onSuccess: () => {
      toast.success("Slot deactivated.");
      queryClient.invalidateQueries(["admin-slots"]);
      setConfirmDeactivateId(null);
    },
    onError: (err) => {
      handleApiError(err, "Failed to deactivate slot.");
      setConfirmDeactivateId(null);
    },
  });

  const serviceOptions = [
    { label: "Select Service", value: "" },
    ...services.map((s) => ({ label: `${s.name} (${s.category})`, value: s._id })),
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Slots Management"
        subtitle="Configure and manage wellness program time slots and capacity."
      >
        <Button variant="amber" size="sm" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4" />
          Create Slot
        </Button>
      </PageHeader>

      {/* Date Filter */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm w-fit">
        <div className="relative">
          <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => { setFilterDate(e.target.value); setPage(1); }}
            className="pl-10 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500 hover:border-slate-300 transition-all"
          />
        </div>
        {filterDate && (
          <button
            onClick={() => setFilterDate("")}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {filterDate && (
          <span className="text-xs font-semibold text-teal-600 bg-teal-50 border border-teal-100 px-2.5 py-1 rounded-full">
            Filtered: {filterDate}
          </span>
        )}
      </div>

      {isLoadingSlots ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
              <div className="flex justify-between">
                <div className="h-5 w-20 skeleton-shimmer rounded-full" />
                <div className="h-5 w-16 skeleton-shimmer rounded-full" />
              </div>
              <div className="h-5 w-3/4 skeleton-shimmer rounded-lg" />
              <div className="h-4 w-1/2 skeleton-shimmer rounded-lg" />
              <div className="h-8 skeleton-shimmer rounded-xl" />
            </div>
          ))}
        </div>
      ) : isErrorSlots ? (
        <ErrorState
          title="Failed to load slots"
          description="We couldn't retrieve the slots list. Please try again."
          onRetry={refetch}
        />
      ) : slots.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
          <EmptyState
            icon={Calendar}
            title={filterDate ? "No slots on this date" : "No slots created yet"}
            description={
              filterDate
                ? "No slots are scheduled for this date. Try a different date or create a new slot."
                : 'Start scheduling by clicking "Create Slot".'
            }
            action={() => setIsModalOpen(true)}
            actionLabel="Create Slot"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {slots.map((slot, idx) => {
            const capacityPct = slot.maxBookings > 0
              ? Math.round(((slot.maxBookings - slot.availableBookings) / slot.maxBookings) * 100)
              : 0;
            const isFull = slot.availableBookings === 0;

            return (
              <motion.div
                key={slot._id}
                className="bg-white rounded-2xl border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all duration-200 overflow-hidden flex flex-col"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
              >
                {/* Top bar */}
                <div className={`h-1 ${isFull ? "bg-red-400" : slot.availableBookings <= 2 ? "bg-amber-400" : "bg-teal-400"}`} />

                <div className="p-5 flex-1 flex flex-col gap-4">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant={slot.isActive ? "success" : "danger"} dot>
                        {slot.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant={isFull ? "danger" : "teal"}>
                        {slot.status || (isFull ? "Full" : "Available")}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-sm font-bold text-slate-800 line-clamp-1">{slot.service?.name}</h3>
                    <p className="text-xs font-bold text-teal-600">{slot.service?.category}</p>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Calendar className="w-3 h-3 text-amber-500 shrink-0" />
                      {formatDate(slot.date)}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Clock className="w-3 h-3 text-amber-500 shrink-0" />
                      {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                    </div>
                  </div>

                  {/* Capacity Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-500">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        Capacity
                      </span>
                      <span>{slot.maxBookings - slot.availableBookings}/{slot.maxBookings}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          capacityPct === 100 ? "bg-red-400" :
                          capacityPct >= 75 ? "bg-amber-400" : "bg-teal-400"
                        }`}
                        style={{ width: `${capacityPct}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-400">{slot.availableBookings} spots remaining</p>
                  </div>

                  <div className="border-t border-slate-100 pt-3 mt-auto flex justify-end">
                    {slot.isActive ? (
                      <Button
                        variant="danger-outline"
                        size="sm"
                        onClick={() => setConfirmDeactivateId(slot._id)}
                      >
                        <Ban className="w-3.5 h-3.5" />
                        Deactivate
                      </Button>
                    ) : (
                      <span className="text-xs text-slate-400 italic font-semibold">Deactivated</span>
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

      {/* Create Slot Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Slot">
        <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
          <Select
            label="Wellness Service"
            options={serviceOptions}
            error={errors.service?.message}
            required
            {...register("service")}
          />
          <Input
            label="Date"
            type="date"
            min={new Date().toISOString().split("T")[0]}
            error={errors.date?.message}
            required
            {...register("date")}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Time"
              type="text"
              placeholder="09:00"
              error={errors.startTime?.message}
              required
              {...register("startTime")}
            />
            <Input
              label="End Time"
              type="text"
              placeholder="10:00"
              error={errors.endTime?.message}
              required
              {...register("endTime")}
            />
          </div>
          <Input
            label="Max Bookings"
            type="number"
            error={errors.maxBookings?.message}
            required
            {...register("maxBookings")}
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="amber" isLoading={createMutation.isPending}>
              Create Slot
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Deactivate */}
      <ConfirmDialog
        isOpen={!!confirmDeactivateId}
        onClose={() => setConfirmDeactivateId(null)}
        onConfirm={() => deleteMutation.mutate(confirmDeactivateId)}
        title="Deactivate Slot?"
        description="This slot will be cancelled. Any existing bookings for this slot will be affected."
        confirmLabel="Deactivate Slot"
        cancelLabel="Cancel"
        variant="warning"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default AdminSlotsPage;
