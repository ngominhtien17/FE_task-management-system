// src/features/users/hooks/useUsers.ts
import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  getUsersAsync,
  createUserAsync,
  updateUserAsync,
  clearUsersError,
  setCurrentUser,
  clearCurrentUser,
  selectUsers,
  selectCurrentUser,
  selectUsersLoading,
  selectUsersError,
} from '../slices';
import type { CreateUserRequest, UpdateUserRequest } from '../types';

export const useUsers = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUsers);
  const currentUser = useAppSelector(selectCurrentUser);
  const loading = useAppSelector(selectUsersLoading);
  const error = useAppSelector(selectUsersError);

  const getUsers = useCallback(async () => {
    const result = await dispatch(getUsersAsync());
    return result;
  }, [dispatch]);

  const createUser = useCallback(
    async (userData: CreateUserRequest) => {
      const result = await dispatch(createUserAsync(userData));
      return result;
    },
    [dispatch]
  );

  const updateUser = useCallback(
    async (id: string, userData: UpdateUserRequest) => {
      const result = await dispatch(updateUserAsync({ id, userData }));
      return result;
    },
    [dispatch]
  );

  const setUser = useCallback(
    (user: typeof currentUser) => {
      dispatch(setCurrentUser(user));
    },
    [dispatch]
  );

  const clearUser = useCallback(() => {
    dispatch(clearCurrentUser());
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearUsersError());
  }, [dispatch]);

  // Auto load users on mount
  useEffect(() => {
    if (users.length === 0 && loading === 'idle') {
      getUsers();
    }
  }, [getUsers, users.length, loading]);

  return {
    users,
    currentUser,
    loading,
    error,
    getUsers,
    createUser,
    updateUser,
    setCurrentUser: setUser,
    clearCurrentUser: clearUser,
    clearError,
  };
};
