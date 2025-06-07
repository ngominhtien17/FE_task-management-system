// src/common/utils/constants.ts
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
    CHECK_AUTH: '/auth/me',
  },
  USERS: {
    GET_ALL: '/users/get',
    CREATE: '/users/create',
    UPDATE: (id: string) => `/users/update/${id}`,
    DELETE: (id: string) => `/users/delete/${id}`,
  },
  TASKS: {
    GET_ALL: '/tasks/get',
    CREATE: '/tasks/create',
    UPDATE: (id: string) => `/tasks/update/${id}`,
    DELETE: (id: string) => `/tasks/delete/${id}`,
  },
  DEPARTMENTS: {
    GET_ALL: '/departments',
    CREATE: '/departments/create',
    UPDATE: (id: string) => `/departments/update/${id}`,
    DELETE: (id: string) => `/departments/delete/${id}`,
  },
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_PREFERENCES: 'userPreferences',
  THEME: 'theme',
} as const;

export const ROLES = {
  ADMIN: 'ADMIN',
  LECTURER: 'LECTURER',
  COORDINATOR: 'COORDINATOR',
  USER: 'USER',
} as const;

export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;

export const TASK_STATUS = {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  OVERDUE: 'OVERDUE',
} as const;

export const EVALUATION_RATINGS = {
  NOT_COMPLETED: 'NotCompleted',
  WEAK: 'Weak',
  COMPLETED: 'Completed',
  ACTIVE: 'Active',
  GOOD: 'Good',
  EXCELLENT: 'Excellent',
} as const;