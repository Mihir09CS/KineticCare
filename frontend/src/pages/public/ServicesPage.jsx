import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { serviceService } from "../../services/serviceService.js";
import { SERVICE_CATEGORIES } from "../../validations/serviceValidation.js";
import { formatCurrency } from "../../utils/formatCurrency.js";
import Button from "../../components/common/Button.jsx";
import Badge from "../../components/common/Badge.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import ErrorState from "../../components/common/ErrorState.jsx";
import { CardSkeleton } from "../../components/common/Skeleton.jsx";
import {
  Search,
  Clock,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  Stethoscope,
  ArrowRight,
  IndianRupee,
} from "lucide-react";
import useDebounce from "../../hooks/useDebounce.js";

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

const ServicesPage = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const limit = 6;
  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["services", { page, search: debouncedSearch, category }],
    queryFn: () =>
      serviceService.getAllServices({
        page,
        limit,
        search: debouncedSearch.trim() || undefined,
        category: category || undefined,
        isActive: "true",
      }),
  });

  const services = data?.services || [];
  const pagination = data?.pagination || { page: 1, totalPages: 1 };

  const handleCategorySelect = useCallback((cat) => {
    setCategory(cat === category ? "" : cat);
    setPage(1);
  }, [category]);

  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value);
    setPage(1);
  }, []);

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setPage(1);
  };

  const hasActiveFilters = search || category;

  return (
    <div className="min-h-screen">
      {/* Page Hero */}
      <div className="bg-gradient-to-br from-slate-50 via-teal-50/30 to-cyan-50/20 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-200 text-xs font-bold text-teal-700 uppercase tracking-widest">
              <Stethoscope className="w-3.5 h-3.5" />
              Our Programs
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Wellness Services
            </h1>
            <p className="text-slate-500 max-w-xl mx-auto leading-relaxed">
              Browse physical therapy, exercise, and stress-relief classes taught by certified senior care experts.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Search + Filters */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search wellness services..."
                value={search}
                onChange={handleSearchChange}
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500 hover:border-slate-300 transition-all shadow-sm"
              />
              {search && (
                <button
                  onClick={() => { setSearch(""); setPage(1); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-lg transition-colors text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters} size="md">
                <Filter className="w-4 h-4" />
                Clear Filters
              </Button>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategorySelect("")}
              className={`px-4 py-2 rounded-2xl text-sm font-semibold border transition-all duration-150 cursor-pointer ${
                !category
                  ? "bg-teal-600 text-white border-teal-600 shadow-sm shadow-teal-600/20"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              All Services
            </button>
            {SERVICE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`px-4 py-2 rounded-2xl text-sm font-semibold border transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
                  category === cat
                    ? "bg-teal-600 text-white border-teal-600 shadow-sm shadow-teal-600/20"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <span>{categoryIcons[cat]}</span>
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results Count */}
        {!isLoading && !isError && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500 font-medium">
              {services.length === 0
                ? "No services found"
                : `Showing ${services.length} service${services.length !== 1 ? "s" : ""}${
                    category ? ` in ${category}` : ""
                  }`}
            </p>
          </div>
        )}

        {/* Grid Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(limit)].map((_, idx) => (
              <CardSkeleton key={idx} />
            ))}
          </div>
        ) : isError ? (
          <ErrorState
            title="Failed to load services"
            description="We couldn't retrieve wellness services. Please check your connection and try again."
            onRetry={refetch}
          />
        ) : services.length === 0 ? (
          <EmptyState
            icon={Stethoscope}
            title="No services found"
            description={
              hasActiveFilters
                ? "No services match your current filters. Try a different category or search term."
                : "No wellness services are available right now. Check back soon."
            }
            action={hasActiveFilters ? clearFilters : undefined}
            actionLabel={hasActiveFilters ? "Clear Filters" : undefined}
            actionVariant="outline"
          />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${category}-${debouncedSearch}-${page}`}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {services.map((service, idx) => (
                <motion.div
                  key={service._id}
                  className="group bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-slate-300 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                >
                  {/* Image */}
                  <div className="relative h-48 bg-gradient-to-br from-teal-50 to-cyan-50 overflow-hidden">
                    {service.imageUrl ? (
                      <img
                        src={service.imageUrl}
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-6xl opacity-40">
                          {categoryIcons[service.category] || "🏥"}
                        </span>
                      </div>
                    )}
                    {/* Category overlay */}
                    <div className="absolute top-3 left-3">
                      <Badge variant="teal" className="shadow-sm">
                        {categoryIcons[service.category]} {service.category}
                      </Badge>
                    </div>
                    {/* Duration overlay */}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-xl px-2.5 py-1 flex items-center gap-1 text-xs font-bold text-slate-700 border border-white/60">
                      <Clock className="w-3 h-3 text-teal-600" />
                      {service.duration} min
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex-1 space-y-2 mb-4">
                      <h3 className="text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-teal-700 transition-colors">
                        {service.name}
                      </h3>
                      <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                        {service.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-1">
                        <IndianRupee className="w-4 h-4 text-teal-600" />
                        <span className="text-xl font-black text-slate-900">
                          {formatCurrency(service.price)}
                        </span>
                      </div>
                      <Link to={`/services/${service._id}`}>
                        <Button variant="primary" size="sm">
                          Book Now
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-6">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {[...Array(pagination.totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                    page === i + 1
                      ? "bg-teal-600 text-white shadow-sm"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={page === pagination.totalPages}
              onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;
