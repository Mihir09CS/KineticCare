// Skeleton base with shimmer effect
export const Skeleton = ({ className = "", rounded = "rounded-xl" }) => (
  <div
    className={`skeleton-shimmer ${rounded} ${className}`}
    aria-hidden="true"
  />
);

// Card skeleton for service/booking cards
export const CardSkeleton = ({ className = "" }) => (
  <div className={`bg-white rounded-2xl border border-slate-200 p-6 space-y-4 ${className}`}>
    <Skeleton className="h-44 w-full" rounded="rounded-xl" />
    <div className="space-y-3">
      <div className="flex justify-between">
        <Skeleton className="h-5 w-20" rounded="rounded-full" />
        <Skeleton className="h-5 w-16" rounded="rounded-full" />
      </div>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
    <div className="flex justify-between items-center pt-2 border-t border-slate-100">
      <Skeleton className="h-7 w-16" />
      <Skeleton className="h-9 w-28" rounded="rounded-xl" />
    </div>
  </div>
);

// Stat card skeleton
export const StatCardSkeleton = ({ className = "" }) => (
  <div className={`bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 ${className}`}>
    <Skeleton className="w-12 h-12 shrink-0" rounded="rounded-2xl" />
    <div className="space-y-2 flex-1">
      <Skeleton className="h-3.5 w-20" rounded="rounded-full" />
      <Skeleton className="h-7 w-12" />
    </div>
  </div>
);

// Table row skeleton
export const TableRowSkeleton = ({ cols = 4, className = "" }) => (
  <div className={`flex items-center gap-4 p-4 border-b border-slate-100 ${className}`}>
    {[...Array(cols)].map((_, i) => (
      <Skeleton
        key={i}
        className={`h-4 ${i === 0 ? "w-1/4" : i === cols - 1 ? "w-20" : "flex-1"}`}
        rounded="rounded-full"
      />
    ))}
  </div>
);

// List item skeleton (for booking cards)
export const ListItemSkeleton = ({ className = "" }) => (
  <div className={`bg-white rounded-2xl border border-slate-200 p-5 space-y-3 ${className}`}>
    <div className="flex justify-between">
      <Skeleton className="h-4 w-24" rounded="rounded-full" />
      <Skeleton className="h-5 w-20" rounded="rounded-full" />
    </div>
    <Skeleton className="h-5 w-3/5" />
    <Skeleton className="h-4 w-2/5" rounded="rounded-full" />
  </div>
);

// Text line skeletons
export const TextSkeleton = ({ lines = 3, className = "" }) => (
  <div className={`space-y-2 ${className}`}>
    {[...Array(lines)].map((_, i) => (
      <Skeleton
        key={i}
        className="h-4"
        rounded="rounded-full"
        style={{ width: i === lines - 1 ? "60%" : "100%" }}
      />
    ))}
  </div>
);

// Dashboard section skeleton
export const DashboardSkeleton = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-3">
        <Skeleton className="h-6 w-48" />
        {[...Array(3)].map((_, i) => <ListItemSkeleton key={i} />)}
      </div>
      <div className="space-y-3">
        <Skeleton className="h-6 w-40" />
        {[...Array(3)].map((_, i) => <ListItemSkeleton key={i} />)}
      </div>
    </div>
  </div>
);

export default Skeleton;
