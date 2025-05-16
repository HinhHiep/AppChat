import { createSlice
, createAsyncThunk
 } from "@reduxjs/toolkit";

import { login
, register ,updateStatus,updateUserProfile
} from "../../api/UserApi";


const initialState = {
  user: null,
  userNew: null,
  loading: false,
  error: null,
};
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await login(username, password); // đã throw nếu có lỗi rồi
      const res = await updateStatus(response.user.userID,"online");
      return res.user; // Trả user nếu thành công
    } catch (error) {
      console.error("LoginUser error:", error);
      return rejectWithValue(error.message); // dùng rejectWithValue để xử lý ở reducer
    }
  }
);


// sdt, name, ngaySinh, matKhau,emai

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async ({ phoneNumber, name, birth, password,email }) => {
    const response = await register(phoneNumber, name, birth,  password,email);
    return response.data;
  }
);

// sdt, newPassword
export const changePass = createAsyncThunk(
  "user/changePass",
  async ({ phoneNumber, newPassword }) => {
    const response = await changePass(phoneNumber,newPassword);
    return response.data;
  }
);

// update user 
export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await updateUserProfile(userData);
      return response; // giả sử API trả về user mới
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
        .addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    builder
        .addCase(registerUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(registerUser.fulfilled, (state, action) => {
            state.loading = false;
            state.userNew = action.payload;
        })
        .addCase(registerUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    builder
        .addCase(changePass.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(changePass.fulfilled, (state, action) => {
            state.loading = false;
            state.userNew = action.payload;
        })
        .addCase(changePass.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    builder
  .addCase(updateUser.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(updateUser.fulfilled, (state, action) => {
    state.loading = false;
    state.user = action.payload; // cập nhật user mới
  })
  .addCase(updateUser.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload || action.error.message;
  });
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;