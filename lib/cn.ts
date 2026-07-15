/** Join truthy class fragments. Later strings win via source order (no conflict resolution). */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
