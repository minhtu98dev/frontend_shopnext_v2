import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
// Chỉ import những hàm service thực sự được sử dụng trong store này
import { loginUser, registerUser, loginWithFirebase } from '@/services/authService';
import type { User } from '@/types/user';

/**
 * Interface định nghĩa "hình dạng" của auth store.
 */
interface AuthState {
  user: User | null;
  token: string | null;
  login: (credentials: { email: string; password: string; }) => Promise<void>;
  registerAndLogin: (credentials: { name: string, email: string; password: string; }) => Promise<void>;
  firebaseLogin: (idToken: string) => Promise<void>;
  logout: () => void;
}

/**
 * Store quản lý trạng thái xác thực người dùng.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // --- TRẠNG THÁI BAN ĐẦU ---
      user: null,
      token: null,

      // --- CÁC HÀNH ĐỘNG (ACTIONS) ---

      /**
       * Xử lý logic đăng nhập bằng email/password.
       */
      login: async (credentials) => {
        try {
          const response = await loginUser(credentials);
          if (response && response._id && response.token) {
            const token = response.token;
            const user: User = {
              _id: response._id,
              name: response.name,
              email: response.email,
              isAdmin: response.isAdmin,
            };
            set({ user: user, token: token });
          } else {
            throw new Error('Dữ liệu đăng nhập trả về không hợp lệ.');
          }
        } catch (error) {
          console.error("Lỗi trong action login:", error);
          throw error;
        }
      },

      /**
       * Xử lý logic đăng nhập bằng Firebase.
       */
      firebaseLogin: async (idToken) => {
        try {
            const response = await loginWithFirebase(idToken);
            // API này trả về cấu trúc phẳng giống login thường
             if (response && response._id && response.token) {
                const token = response.token;
                // SỬA LỖI Ở ĐÂY: Tạo object user đầy đủ từ response
                const user: User = {
                    _id: response._id,
                    name: response.name,
                    email: response.email,
                    isAdmin: response.isAdmin,
                };
                set({ user, token });
            } else {
                throw new Error('Dữ liệu Firebase login trả về không hợp lệ.');
            }
        } catch (error) {
            console.error("Lỗi trong action firebaseLogin:", error);
            throw error;
        }
      },

      /**
       * Xử lý logic đăng ký và tự động đăng nhập.
       */
      registerAndLogin: async (credentials) => {
        try {
            const response = await registerUser(credentials);
            if (response && response.user && response.token) {
                set({ user: response.user, token: response.token });
            } else {
                throw new Error('Dữ liệu đăng ký trả về không hợp lệ.');
            }
        } catch (error) {
            console.error("Lỗi trong action registerAndLogin:", error);
            throw error;
        }
      },

      /**
       * Xử lý logic đăng xuất.
       */
      logout: () => {
        set({ user: null, token: null });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);