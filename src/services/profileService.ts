import { StudentUser, StudentSkill } from '../types';
import { db } from './database';

export interface ProfileUpdatePayload {
  name: string;
  department: string;
  year: string;
  bio: string;
  availability: string;
  skillsToTeach: string[];
  skillsToLearn: string[];
}

/**
 * Story ID: SCRUM07-F001-BE-001
 * Story ID: SCRUM07-F001-DB-001
 * CRUD API for student profiles and associated skill entries.
 */
export const profileService = {
  getProfile: async (studentId: string): Promise<StudentUser | null> => {
    const students = db.getStudents();
    const student = students.find((s) => s.id === studentId);
    if (!student) return null;

    // Relational skills retrieval (SCRUM07-F001-DB-001)
    const allSkills = db.getSkills();
    const teachSkills = allSkills
      .filter((s) => s.studentId === studentId && s.type === 'teach')
      .map((s) => s.skillName);
    const learnSkills = allSkills
      .filter((s) => s.studentId === studentId && s.type === 'learn')
      .map((s) => s.skillName);

    // Retrieve badges
    const allBadges = db.getBadges();
    const studentBadges = allBadges.filter((b) => b.studentId === studentId);

    return {
      ...student,
      skillsToTeach: teachSkills,
      skillsToLearn: learnSkills,
      badges: studentBadges,
    };
  },

  getAllProfiles: async (): Promise<StudentUser[]> => {
    const students = db.getStudents();
    const allSkills = db.getSkills();
    const allBadges = db.getBadges();

    return students.map((s) => ({
      ...s,
      skillsToTeach: allSkills
        .filter((sk) => sk.studentId === s.id && sk.type === 'teach')
        .map((sk) => sk.skillName),
      skillsToLearn: allSkills
        .filter((sk) => sk.studentId === s.id && sk.type === 'learn')
        .map((sk) => sk.skillName),
      badges: allBadges.filter((b) => b.studentId === s.id),
    }));
  },

  updateProfile: async (
    studentId: string,
    payload: ProfileUpdatePayload
  ): Promise<StudentUser> => {
    // AC2 Validation: Must have at least one 'teach' or 'learn' skill
    const totalSkills = payload.skillsToTeach.length + payload.skillsToLearn.length;
    if (totalSkills === 0) {
      throw new Error('Validation Error: You must list at least one skill you can teach or want to learn.');
    }

    const students = db.getStudents();
    const index = students.findIndex((s) => s.id === studentId);
    if (index === -1) {
      throw new Error(`Student ${studentId} not found.`);
    }

    // Update student core profile
    const updatedStudent: StudentUser = {
      ...students[index],
      name: payload.name.trim() || students[index].name,
      department: payload.department || students[index].department,
      year: payload.year || students[index].year,
      bio: payload.bio.trim() || students[index].bio,
      availability: payload.availability.trim() || students[index].availability,
      skillsToTeach: payload.skillsToTeach,
      skillsToLearn: payload.skillsToLearn,
    };

    students[index] = updatedStudent;
    db.saveStudents(students);

    // Relational skills update: clear old skills for student and insert new
    let skills = db.getSkills().filter((sk) => sk.studentId !== studentId);
    const newSkills: StudentSkill[] = [
      ...payload.skillsToTeach.map((name) => ({
        id: `sk-${studentId}-teach-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        studentId,
        skillName: name.trim(),
        type: 'teach' as const,
      })),
      ...payload.skillsToLearn.map((name) => ({
        id: `sk-${studentId}-learn-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        studentId,
        skillName: name.trim(),
        type: 'learn' as const,
      })),
    ];

    skills = [...skills, ...newSkills];
    db.saveSkills(skills);

    return updatedStudent;
  },
};
