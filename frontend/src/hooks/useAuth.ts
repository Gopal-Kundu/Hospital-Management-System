import { useDispatch } from 'react-redux';
import axios from 'axios';
import { baseURL } from '../config';
import {
  fetchStart,
  fetchSuccess,
  fetchFailure,
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logoutSuccess,
  updateProfilePictureSuccess
} from '../redux/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();

  const fetchCurrentUser = async () => {
    dispatch(fetchStart());
    try {
      const response = await axios.get(`${baseURL}/auth/me`, {
        withCredentials: true,
      });
      if (response.data.success) {
        dispatch(fetchSuccess(response.data.user));
        return { success: true, user: response.data.user };
      } else {
        dispatch(fetchFailure());
        return { success: false };
      }
    } catch (error: any) {
      dispatch(fetchFailure());
      return { success: false };
    }
  };

  const loginUser = async (credentials: any) => {
    const { email, password } = credentials;
    dispatch(loginStart());
    try {
      const response = await axios.post(`${baseURL}/auth/login`, { email, password }, {
        withCredentials: true,
      });
      if (response.data.success) {
        dispatch(loginSuccess(response.data.user));
        return { success: true, user: response.data.user };
      } else {
        const errorMsg = response.data.message || 'Login failed';
        dispatch(loginFailure(errorMsg));
        return { success: false, error: errorMsg };
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Login failed';
      dispatch(loginFailure(errorMsg));
      return { success: false, error: errorMsg };
    }
  };

  const registerUser = async (userData: any) => {
    const { name, email, password, role } = userData;
    dispatch(registerStart());
    try {
      const response = await axios.post(`${baseURL}/auth/register`, { name, email, password, role }, {
        withCredentials: true,
      });
      if (response.data.success) {
        const result = await loginUser({ email, password });
        if (result.success) {
          dispatch(registerSuccess(result.user));
          return { success: true, user: result.user };
        } else {
          dispatch(registerFailure(result.error));
          return { success: false, error: result.error };
        }
      } else {
        const errorMsg = response.data.message || 'Registration failed';
        dispatch(registerFailure(errorMsg));
        return { success: false, error: errorMsg };
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Registration failed';
      dispatch(registerFailure(errorMsg));
      return { success: false, error: errorMsg };
    }
  };

  const logoutUser = async () => {
    try {
      await axios.post(`${baseURL}/auth/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch(logoutSuccess());
    }
  };

  const updateProfilePicture = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.put(`${baseURL}/auth/profile-picture`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true,
      });

      if (response.data.success) {
        dispatch(updateProfilePictureSuccess(response.data.user.profilePicture));
        return { success: true, profilePicture: response.data.user.profilePicture };
      } else {
        return { success: false, error: response.data.message || 'Failed to update profile picture' };
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Failed to update profile picture';
      return { success: false, error: errorMsg };
    }
  };

  return {
    fetchCurrentUser,
    loginUser,
    registerUser,
    logoutUser,
    updateProfilePicture
  };
};
