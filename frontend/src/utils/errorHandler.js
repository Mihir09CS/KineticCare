import toast from "react-hot-toast";

/**
 * Parses and displays standard API or generic JavaScript error messages via toast.
 * Highly robust to prevent failure regardless of the error shape passed.
 *
 * @param {any} error - The error object, Axios error, or error string
 * @param {string} fallbackMessage - Fallback message if no clear message is parsed
 */
export const handleApiError = (error, fallbackMessage = "An unexpected error occurred.") => {
  console.error("API Error Logged:", error);

  // Case 1: Simple string error
  if (typeof error === "string") {
    toast.error(error);
    return;
  }

  // Case 2: Object containing a list of validation errors (interceptor format: { data: [...] })
  if (error?.data && Array.isArray(error.data) && error.data.length > 0) {
    error.data.forEach((err) => {
      toast.error(err.message || "Validation error");
    });
    return;
  }

  // Case 3: Raw Axios validation errors fallback (e.g., error.response.data.data as array)
  const rawValidationErrors = error?.response?.data?.data || error?.raw?.response?.data?.data;
  if (Array.isArray(rawValidationErrors) && rawValidationErrors.length > 0) {
    rawValidationErrors.forEach((err) => {
      toast.error(err.message || "Validation error");
    });
    return;
  }

  // Case 4: Standard error message from our interceptor object
  if (error?.message) {
    toast.error(error.message);
    return;
  }

  // Case 5: Message from backend JSON directly (response.data.message)
  const backendMessage =
    error?.response?.data?.message ||
    error?.raw?.response?.data?.message;
  if (backendMessage) {
    toast.error(backendMessage);
    return;
  }

  // Case 6: Generic Error object message field
  if (error?.message || error?.raw?.message) {
    toast.error(error.message || error.raw.message);
    return;
  }

  // Case 7: Absolute fallback
  toast.error(fallbackMessage);
};
export default handleApiError;
