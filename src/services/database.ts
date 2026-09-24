import {
  StudentUser,
  StudentSkill,
  SessionRequest,
  SessionRating,
  EarnedBadge,
  AppNotification,
} from '../types';
import { INITIAL_STUDENTS } from './mockData';

const DB_KEYS = {
  STUDENTS: 'cse_db_students',
  SKILLS: 'cse_db_skills',
  REQUESTS: 'cse_db_session_requests',
  RATINGS: 'cse_db_ratings',
  BADGES: 'cse_db_badges',
  NOTIFICATIONS: 'cse_db_notifications',
};

// Seed database if empty
export const initializeDatabase = () => {
  if (!localStorage.getItem(DB_KEYS.STUDENTS)) {
    localStorage.setItem(DB_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));

    // Seed relational skills table (SCRUM07-F001-DB-001)
    const skillsList: StudentSkill[] = [];
    INITIAL_STUDENTS.forEach((student) => {
      student.skillsToTeach.forEach((skill) => {
        skillsList.push({
          id: `sk-${student.id}-teach-${skill.toLowerCase().replace(/\s+/g, '-')}`,
          studentId: student.id,
          skillName: skill,
          type: 'teach',
        });
      });
      student.skillsToLearn.forEach((skill) => {
        skillsList.push({
          id: `sk-${student.id}-learn-${skill.toLowerCase().replace(/\s+/g, '-')}`,
          studentId: student.id,
          skillName: skill,
          type: 'learn',
        });
      });
    });
    localStorage.setItem(DB_KEYS.SKILLS, JSON.stringify(skillsList));

    // Seed badges table (SCRUM07-F003-DB-001)
    const badgesList: EarnedBadge[] = [];
    INITIAL_STUDENTS.forEach((student) => {
      student.badges.forEach((b) => badgesList.push(b));
    });
    localStorage.setItem(DB_KEYS.BADGES, JSON.stringify(badgesList));

    // Initial empty requests, ratings, notifications
    localStorage.setItem(DB_KEYS.REQUESTS, JSON.stringify([]));
    localStorage.setItem(DB_KEYS.RATINGS, JSON.stringify([]));
    localStorage.setItem(DB_KEYS.NOTIFICATIONS, JSON.stringify([]));
  }
};

// Generic read/write helpers
export const db = {
  getStudents: (): StudentUser[] => {
    initializeDatabase();
    return JSON.parse(localStorage.getItem(DB_KEYS.STUDENTS) || '[]');
  },
  saveStudents: (students: StudentUser[]) => {
    localStorage.setItem(DB_KEYS.STUDENTS, JSON.stringify(students));
  },

  getSkills: (): StudentSkill[] => {
    initializeDatabase();
    return JSON.parse(localStorage.getItem(DB_KEYS.SKILLS) || '[]');
  },
  saveSkills: (skills: StudentSkill[]) => {
    localStorage.setItem(DB_KEYS.SKILLS, JSON.stringify(skills));
  },

  getRequests: (): SessionRequest[] => {
    initializeDatabase();
    return JSON.parse(localStorage.getItem(DB_KEYS.REQUESTS) || '[]');
  },
  saveRequests: (requests: SessionRequest[]) => {
    localStorage.setItem(DB_KEYS.REQUESTS, JSON.stringify(requests));
  },

  getRatings: (): SessionRating[] => {
    initializeDatabase();
    return JSON.parse(localStorage.getItem(DB_KEYS.RATINGS) || '[]');
  },
  saveRatings: (ratings: SessionRating[]) => {
    localStorage.setItem(DB_KEYS.RATINGS, JSON.stringify(ratings));
  },

  getBadges: (): EarnedBadge[] => {
    initializeDatabase();
    return JSON.parse(localStorage.getItem(DB_KEYS.BADGES) || '[]');
  },
  saveBadges: (badges: EarnedBadge[]) => {
    localStorage.setItem(DB_KEYS.BADGES, JSON.stringify(badges));
  },

  getNotifications: (): AppNotification[] => {
    initializeDatabase();
    return JSON.parse(localStorage.getItem(DB_KEYS.NOTIFICATIONS) || '[]');
  },
  saveNotifications: (notifications: AppNotification[]) => {
    localStorage.setItem(DB_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  },

  resetAll: () => {
    Object.values(DB_KEYS).forEach((k) => localStorage.removeItem(k));
    initializeDatabase();
  },
};
