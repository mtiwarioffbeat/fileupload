// redux/fileSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { UserService } from "@/services/UserService";

// Async thunk (export it for use in components)
export const FileSubmit = createAsyncThunk(
  "file/upload",
  async (file: File, { rejectWithValue }) => {
    try {
      return await UserService.FileSubmit(file);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


const fileSlice = createSlice({
  name: "file",
  initialState: {
    loading: false,
    fileInfo: null as any,
    error: null as string | null,
    files:[],
    showModal:false,
    editFile: null,
  },
  reducers: {
      setFiles: (state, action) => {
      state.files = action.payload;
    },
    setShowModal:(state,action)=>{
      state.showModal = action.payload
    },
    setEditFile: (state, action) => {
  state.editFile = action.payload;
},
  },
  extraReducers: (builder) => {
    builder
      .addCase(FileSubmit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(FileSubmit.fulfilled, (state, action) => {
        state.loading = false;
        state.fileInfo = action.payload;
      })
      .addCase(FileSubmit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {setFiles,setShowModal,setEditFile} = fileSlice.actions
export default fileSlice.reducer;
