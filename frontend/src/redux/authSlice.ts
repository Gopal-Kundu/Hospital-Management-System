import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: true,
    error: null,
    hideRoleSelection: false,
  },
  reducers: {
    fetchStart: (state) => {
      state.loading = true;
    },
    fetchSuccess: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    },
    fetchFailure: (state) => {
      state.user = null;
      state.loading = false;
    },
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    registerStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerSuccess: (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    registerFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
    updateProfilePictureSuccess: (state, action) => {
      if (state.user) {
        state.user.profilePicture = action.payload;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    setHideRoleSelection: (state, action) => {
      state.hideRoleSelection = action.payload;
    }
  }
});

export const {
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
  updateProfilePictureSuccess,
  clearError,
  setHideRoleSelection
} = authSlice.actions;

export default authSlice.reducer;
