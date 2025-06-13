/**
 * Utility functions for the application
 */

/**
 * Format a date string to a human-readable format with time
 * @param dateString - ISO date string or any valid date string
 * @param includeTime - whether to include time (hours and minutes)
 * @returns formatted date string or 'No date' if invalid
 */
export function formatDate(
  dateString: string | null | undefined,
  includeTime: boolean = true
): string {
  if (!dateString) {
    return "No date";
  }

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "No date";
    }

    if (includeTime) {
      return date.toLocaleString();
    } else {
      return date.toLocaleDateString();
    }
  } catch (error) {
    console.error("Error formatting date:", error);
    return "No date";
  }
}

/**
 * Format a date string to show only date (no time)
 * @param dateString - ISO date string or any valid date string
 * @returns formatted date string or 'No date' if invalid
 */
export function formatDateOnly(dateString: string | null | undefined): string {
  return formatDate(dateString, false);
}

/**
 * Check if a date string is valid
 * @param dateString - date string to validate
 * @returns true if valid, false otherwise
 */
export function isValidDate(dateString: string | null | undefined): boolean {
  if (!dateString) return false;

  try {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  } catch {
    return false;
  }
}
