/**
 * Shared utility functions used across the application.
 */

/** Returns true if the value is a valid hex color code (e.g. #FF00AA). */
export const isColor = (value: string): boolean => /^#[0-9A-F]{6}$/i.test(value);

/** Returns true if the URL points to an image file. */
export const isImageUrl = (url: string): boolean =>
  /\.(jpeg|jpg|gif|png|svg)$/i.test(url);

/** Truncates text to maxLength and appends "..." if it exceeds. */
export const truncateText = (text: string, maxLength: number): string =>
  text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
