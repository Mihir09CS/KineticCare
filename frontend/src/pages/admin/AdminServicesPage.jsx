import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { serviceService } from "../../services/serviceService.js";
import { createServiceSchema, SERVICE_CATEGORIES } from "../../validations/serviceValidation.js";
import { formatCurrency } from "../../utils/formatCurrency.js";
import { handleApiError } from "../../utils/errorHandler.js";
import Button from "../../components/common/Button.jsx";
import Badge from "../../components/common/Badge.jsx";
import Modal from "../../components/common/Modal.jsx";
import Input from "../../components/common/Input.jsx";
import Select from "../../components/common/Select.jsx";
import TextArea from "../../components/common/TextArea.jsx";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import ErrorState from "../../components/common/ErrorState.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import { CardSkeleton } from "../../components/common/Skeleton.jsx";
import {
  Plus,
  Edit,
  Ban,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  Clock,
  IndianRupee,
  Image,
} from "lucide-react";
import toast from "react-hot-toast";

const AdminServicesPage = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDeactivateId, setConfirmDeactivateId] = useState(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-services", page],
    queryFn: () =>
      serviceService.getAllServices({ page, limit: 8, isActive: "all" }),
  });

  const services = data?.services || [];
  const pagination = data?.pagination || { page: 1, totalPages: 1 };

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createServiceSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "Physiotherapy",
      duration: 60,
      price: 0,
      imageUrl: "",
    },
  });

  const openCreateModal = () => {
    setSelectedService(null);
    reset({ name: "", description: "", category: "Physiotherapy", duration: 60, price: 0, imageUrl: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (service) => {
    setSelectedService(service);
    setValue("name", service.name);
    setValue("description", service.description);
    setValue("category", service.category);
    setValue("duration", service.duration);
    setValue("price", service.price);
    setValue("imageUrl", service.imageUrl || "");
    setIsModalOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: (formData) => {
      if (selectedService) return serviceService.updateService(selectedService._id, formData);
      return serviceService.createService(formData);
    },
    onSuccess: () => {
      toast.success(selectedService ? "Service updated!" : "Service created!");
      setIsModalOpen(false);
      queryClient.invalidateQueries(["admin-services"]);
      queryClient.invalidateQueries(["services"]);
    },
    onError: (err) => handleApiError(err, "Failed to save service."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => serviceService.deleteService(id),
    onSuccess: () => {
      toast.success("Service deactivated.");
      queryClient.invalidateQueries(["admin-services"]);
      queryClient.invalidateQueries(["services"]);
      setConfirmDeactivateId(null);
    },
    onError: (err) => {
      handleApiError(err, "Failed to deactivate service.");
      setConfirmDeactivateId(null);
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Services Management"
        subtitle="Configure and manage wellness programs available to members."
      >
        <Button variant="amber" size="sm" onClick={openCreateModal}>
          <Plus className="w-4 h-4" />
          Create Service
        </Button>
      </PageHeader>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5">
              <CardSkeleton className="!p-0 !border-0 !shadow-none !rounded-none !bg-transparent" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <ErrorState
          title="Failed to load services"
          description="We couldn't retrieve the services list. Please try again."
          onRetry={refetch}
        />
      ) : services.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
          <EmptyState
            icon={Stethoscope}
            title="No services yet"
            description='Create your first wellness program by clicking "Create Service".'
            action={openCreateModal}
            actionLabel="Create Service"
          />
        </div>
      ) : (
        <div className="space-y-3">
          {services.map((s, idx) => (
            <motion.div
              key={s._id}
              className="bg-white rounded-2xl border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all duration-200 overflow-hidden"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <div className="flex flex-col sm:flex-row gap-4 p-5">
                {/* Image thumbnail */}
                <div className="w-16 h-16 rounded-xl bg-slate-100 shrink-0 overflow-hidden border border-slate-200 flex items-center justify-center">
                  {s.imageUrl ? (
                    <img src={s.imageUrl} alt={s.name} className="w-full h-full object-cover" />
                  ) : (
                    <Stethoscope className="w-7 h-7 text-slate-300" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-2 mb-1.5">
                    <Badge variant={s.isActive ? "success" : "danger"} dot>
                      {s.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant="teal">{s.category}</Badge>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 truncate">{s.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{s.description}</p>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs font-semibold text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-teal-500" />{s.duration} min
                    </span>
                    <span className="flex items-center gap-1">
                      <IndianRupee className="w-3 h-3 text-teal-500" />{formatCurrency(s.price)}
                    </span>
                    {s.imageUrl && (
                      <span className="flex items-center gap-1">
                        <Image className="w-3 h-3 text-teal-500" />Has image
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                  <Button variant="outline" size="sm" onClick={() => openEditModal(s)}>
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </Button>
                  {s.isActive && (
                    <Button
                      variant="danger-outline"
                      size="sm"
                      onClick={() => setConfirmDeactivateId(s._id)}
                    >
                      <Ban className="w-3.5 h-3.5" /> Deactivate
                    </Button>
                  )}
                  {!s.isActive && (
                    <span className="text-xs text-slate-400 italic font-semibold px-2">Deactivated</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
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

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedService ? "Edit Service" : "Create New Service"}
        size="lg"
      >
        <form onSubmit={handleSubmit((d) => saveMutation.mutate(d))} className="space-y-4">
          <Input
            label="Service Name"
            placeholder="e.g. Back Pain Physiotherapy"
            error={errors.name?.message}
            required
            {...register("name")}
          />
          <TextArea
            label="Description"
            placeholder="Describe what the service covers..."
            rows={3}
            error={errors.description?.message}
            required
            {...register("description")}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category"
              options={SERVICE_CATEGORIES.map((c) => ({ label: c, value: c }))}
              error={errors.category?.message}
              required
              {...register("category")}
            />
            <Input
              label="Duration (minutes)"
              type="number"
              error={errors.duration?.message}
              required
              {...register("duration")}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price (₹)"
              type="number"
              step="0.01"
              error={errors.price?.message}
              required
              {...register("price")}
            />
            <Input
              label="Image URL (Optional)"
              type="url"
              placeholder="https://..."
              error={errors.imageUrl?.message}
              {...register("imageUrl")}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="amber" isLoading={saveMutation.isPending}>
              {selectedService ? "Update Service" : "Create Service"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Deactivate */}
      <ConfirmDialog
        isOpen={!!confirmDeactivateId}
        onClose={() => setConfirmDeactivateId(null)}
        onConfirm={() => deleteMutation.mutate(confirmDeactivateId)}
        title="Deactivate Service?"
        description="This service will be hidden from members. Existing bookings and slots will be preserved in history."
        confirmLabel="Deactivate"
        cancelLabel="Cancel"
        variant="warning"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default AdminServicesPage;
