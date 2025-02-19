import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { signUpAPI, loginAPI, verifyOTPAPI } from '../../services/api';
import { LoginState, SignupState, UserState } from '../../utils/types';
import { setAuthToken, clearTokens } from '../../utils/auth';
import { fetchCatsAsync } from './catsSlice';
import { fetchSubscriptionsAsync } from './subscriptionSlice';

const initialState: UserState = {
  first_name: '',
  last_name: '',
  email: '',
  isAuthenticated: false,
  status: '',
  error: '',
};

export const signUpUserAsync = createAsyncThunk(
  'user/signUpUser',
  async (userData: SignupState, { rejectWithValue }) => {
    try {
      const response = await signUpAPI(userData);

      setAuthToken({
        token: response.token,
        expiresIn: response.expiresIn || '1h',
        email: userData.email,
        photo: response.photo || ''
      });
      
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const signUpUserWithOTPAsync = createAsyncThunk(
  'user/signUpUserWithOTP',
  async (credentials: SignupState, { rejectWithValue }) => {
    try {
      let response = await verifyOTPAPI(credentials.email, credentials.token || '');
      
      setAuthToken({
        token: response.session.access_token,
        expiresIn: response.session.expires_in,
        email: credentials.email,
        photo: response.user.user_metadata?.avatar_url || ''
      });
      
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const loginUserAsync = createAsyncThunk(
  'user/loginUser',
  async (credentials: LoginState, { rejectWithValue, dispatch }) => {
    try {
      const response = await loginAPI(credentials);

      setAuthToken({
        token: response.token,
        expiresIn: response.expiresIn || '1h',
        email: credentials.email,
        photo: response.photo || ''
      });

      try {
        await dispatch(fetchSubscriptionsAsync(response.token)).unwrap();
      } catch (error) {
        // Silently ignore any errors from fetchSubscriptionsAsync
      }

      try {
        await dispatch(fetchCatsAsync(response.token)).unwrap();
      } catch (error) {
        // Silently ignore any errors from fetchCatsAsync
      }

      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const loginUserWithOTPAsync = createAsyncThunk(
  'user/loginUserWithOTP',
  async (credentials: { email: string, token: string }, { rejectWithValue, dispatch }) => {
    try {
      const response = await verifyOTPAPI(credentials.email, credentials.token);

      setAuthToken({
        token: response.session.access_token,
        expiresIn: response.session.expires_in,
        email: credentials.email,
        photo: response.user.user_metadata?.avatar_url || ''
      });

      try {
        await dispatch(fetchSubscriptionsAsync(response.session.access_token)).unwrap();
      } catch (error) {
        // Silently ignore any errors from fetchSubscriptionsAsync
      }

      try {
        await dispatch(fetchCatsAsync(response.session.access_token)).unwrap();
      } catch (error) {
        // Silently ignore any errors from fetchCatsAsync
      }

      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);


export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signUpUser: (state, action: PayloadAction<Partial<UserState>>) => {
      return { ...state, ...action.payload };
    },
    logout: () => {
      clearTokens();
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUpUserAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(signUpUserAsync.fulfilled, (state, action) => {
        if (action.payload?.token) {
          Object.assign(state, {
            status: 'succeeded',
            isAuthenticated: true
          });
        }
      })
      .addCase(signUpUserAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(loginUserAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        if (action.payload?.token) {
          Object.assign(state, {
            status: 'succeeded',
            isAuthenticated: true
          });
        }
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
  },
});

export const { signUpUser, logout } = userSlice.actions;
export default userSlice.reducer; 