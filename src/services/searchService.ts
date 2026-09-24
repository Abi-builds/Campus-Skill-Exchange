import { StudentUser } from '../types';
import { profileService } from './profileService';

export interface SearchFilters {
  department?: string;
  minRating?: number;
  year?: string;
}

/**
 * Story ID: SCRUM07-F002-BE-001
 * Skill search API querying profiles where searched skill appears under 'Can Teach'.
 */
export const searchService = {
  searchPeersBySkill: async (
    skillQuery: string,
    filters?: SearchFilters,
    currentStudentId?: string
  ): Promise<StudentUser[]> => {
    const allProfiles = await profileService.getAllProfiles();
    const query = skillQuery.trim().toLowerCase();

    return allProfiles.filter((peer) => {
      // Exclude self from peer search results
      if (currentStudentId && peer.id === currentStudentId) {
        return false;
      }

      // Check if peer has at least 1 skill in 'Can Teach' or 'Want to Learn' to be searchable
      const hasSkills = peer.skillsToTeach.length > 0 || peer.skillsToLearn.length > 0;
      if (!hasSkills) return false;

      // Filter by skill matching 'Can Teach' (SCRUM07-F002-BE-001)
      const matchesSkill =
        !query ||
        peer.skillsToTeach.some((s) => s.toLowerCase().includes(query));

      if (!matchesSkill) return false;

      // Optional filters
      if (filters?.department && filters.department !== 'ALL') {
        if (!peer.department.toLowerCase().includes(filters.department.toLowerCase())) {
          return false;
        }
      }

      if (filters?.year && filters.year !== 'ALL') {
        if (!peer.year.toLowerCase().includes(filters.year.toLowerCase())) {
          return false;
        }
      }

      if (filters?.minRating && peer.rating < filters.minRating) {
        return false;
      }

      return true;
    });
  },

  getAllAvailableSkills: async (): Promise<string[]> => {
    const allProfiles = await profileService.getAllProfiles();
    const skillsSet = new Set<string>();
    allProfiles.forEach((p) => {
      p.skillsToTeach.forEach((s) => skillsSet.add(s));
    });
    return Array.from(skillsSet).sort();
  },
};
