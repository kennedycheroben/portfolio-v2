import type { Project } from "../lib/projects/types";

/**
 * Zero hardcoded projects in production.
 * All projects are managed and loaded dynamically from the persistent backend database.
 */
export const projects: Project[] = [];
