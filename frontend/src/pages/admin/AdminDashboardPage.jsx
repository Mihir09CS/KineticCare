import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { dashboardService } from "../../services/dashboardService.js";
import { formatDate, formatTime } from "../../utils/formatDate.js";
import StatCard from "../../components/common/StatCard.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import { DashboardSkeleton } from "../../components/common/Skeleton.jsx";
import {
  Users,
  Stethoscope,
  CalendarRange,
  ClipboardList,
  Shield,
  ChevronRight,
  Clock,
  Calendar,
  Plus,
} from "lucide-react";

const AdminDashboardPage = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () => dashboardService.getAdminDashboard(),
  });

  if (isLoading) return <DashboardSkeleton />;

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 font-semibold mb-4">Failed to load admin dashboard.</p>
        <Button variant="outline" size="sm" onClick={refetch}>Try Again</Button>
      </div>
    );
  }

  const { stats = {}, todaysAppointments = [], upcomingAppointments = [] } = data || {};

  return (
    <div className="space-y-8">
      <PageHeader
        title="Admin Overview"
        subtitle="View platform metrics, manage services, slots, and appointments."
        badge={
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
            <Shield className="w-3 h-3" />
            Admin Panel
          </div>
        }
      >
        <Link to="/admin/services">
          <Button variant="amber" size="sm">
            <Plus className="w-4 h-4" />
            New Service
          </Button>
        </Link>
      </PageHeader>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Total Clients"
          value={stats.totalUsers ?? 0}
          color="teal"
          index={0}
          accentBorder
        />
        <StatCard
          icon={Stethoscope}
          label="Active Services"
          value={stats.totalServices ?? 0}
          color="sky"
          index={1}
          accentBorder
        />
        <StatCard
          icon={CalendarRange}
          label="Open Slots"
          value={stats.totalSlots ?? 0}
          color="amber"
          index={2}
          accentBorder
        />
        <StatCard
          icon={ClipboardList}
          label="Total Bookings"
          value={stats.totalBookings ?? 0}
          color="indigo"
          index={3}
          accentBorder
        />
      </div>

      {/* Appointments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Appointments */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              Today's Sessions
              {todaysAppointments.length > 0 && (
                <span className="text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                  {todaysAppointments.length}
                </span>
              )}
            </h3>
            <Link
              to="/admin/bookings"
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-0.5 transition-colors"
            >
              Manage <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {todaysAppointments.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
              <EmptyState
                icon={Clock}
                title="No sessions today"
                description="No appointments are scheduled for today."
              />
            </div>
          ) : (
            <div className="space-y-3">
              {todaysAppointments.map((b, idx) => (
                <motion.div
                  key={b._id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-md hover:border-amber-200 transition-all duration-200 overflow-hidden"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="space-y-1.5 min-w-0">
                      <h4 className="text-sm font-bold text-slate-800 truncate">{b.service?.name}</h4>
                      <p className="text-xs font-semibold text-slate-500">
                        👤 {b.user?.name}
                      </p>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-500 shrink-0" />
                        {formatTime(b.slot?.startTime)} – {formatTime(b.slot?.endTime)}
                      </p>
                    </div>
                    <Badge variant="success" dot pulse className="shrink-0">Confirmed</Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Appointments */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-500" />
              Upcoming Sessions
            </h3>
            <Link
              to="/admin/bookings"
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-0.5 transition-colors"
            >
              All Bookings <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {upcomingAppointments.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
              <EmptyState
                icon={Calendar}
                title="No upcoming sessions"
                description="No appointments are scheduled beyond today."
              />
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingAppointments.map((b, idx) => (
                <motion.div
                  key={b._id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-md hover:border-amber-200 transition-all duration-200"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="space-y-1.5 min-w-0">
                      <h4 className="text-sm font-bold text-slate-800 truncate">{b.service?.name}</h4>
                      <p className="text-xs font-semibold text-slate-500">👤 {b.user?.name}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-amber-500 shrink-0" />
                        {formatDate(b.slot?.date)} · {formatTime(b.slot?.startTime)} – {formatTime(b.slot?.endTime)}
                      </p>
                    </div>
                    <Badge variant="teal" className="shrink-0">{b.service?.category}</Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-amber-500" />
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/services">
            <Button variant="outline" size="sm">
              <Stethoscope className="w-4 h-4 text-teal-600" />
              Manage Services
            </Button>
          </Link>
          <Link to="/admin/slots">
            <Button variant="outline" size="sm">
              <CalendarRange className="w-4 h-4 text-amber-600" />
              Manage Slots
            </Button>
          </Link>
          <Link to="/admin/bookings">
            <Button variant="outline" size="sm">
              <ClipboardList className="w-4 h-4 text-indigo-600" />
              View All Bookings
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
