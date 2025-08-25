import { createSlice } from "@reduxjs/toolkit";



const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    user: null,
    token: null,
    error: null,
    showBox:false,
    file:null,
    // isUploading:false
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setShowBox:(state,action)=>{
      state.showBox = action.payload
    },
    setFile:(state,action)=>{
      state.file = action.payload
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      state.loading = false;
    },
  },
});

export const { setLoading, setUser, setToken, setError, logout,setShowBox,setFile } = authSlice.actions;
export default authSlice.reducer;
