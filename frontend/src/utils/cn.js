// Utility for merging class names (simple version without clsx dependency)
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
