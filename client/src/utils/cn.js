/**
 * Combines multiple class names into a single string
 * @param {...string} classes - The class names to combine
 * @returns {string} The combined class names
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}