import type { User } from "@/types/user";
import { useAuthStore } from '@/store/authStore';
// --- INTERFACES CHO DỮ LIỆU GỬI ĐI ---

/**
 * Dữ liệu cần thiết để thực hiện đăng nhập.
 */
interface LoginCredentials {
    email: string;
    password: string;
}

/**
 * Dữ liệu cần thiết để thực hiện đăng ký.
 * Kế thừa từ LoginCredentials và thêm trường `name`.
 */
interface RegisterCredentials extends LoginCredentials {
    name: string;
}

// --- INTERFACES CHO DỮ LIỆU NHẬN VỀ ---

/**
 * Cấu trúc dữ liệu trả về từ API Login (dạng phẳng).
 * Kế thừa các thuộc tính của User và thêm `token`.
 */
export interface LoginResponse extends User {
    token: string;
}

/**
 * Cấu trúc dữ liệu trả về từ API Register (dạng lồng nhau).
 */
export interface RegisterResponse {
    user: User;
    token: string;
}

/**
 * Cấu trúc dữ liệu trả về chung cho các API chỉ có status và message.
 */
interface StatusResponse {
    status: string;
    message: string;
}

// --- CÁC HÀM GỌI API ---

const getApiUrl = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!apiUrl) {
        throw new Error("Lỗi cấu hình: Vui lòng thiết lập NEXT_PUBLIC_API_BASE_URL trong file .env.local");
    }
    return apiUrl;
}

/**
 * Gửi yêu cầu đăng nhập đến server.
 * @param credentials - Email và mật khẩu của người dùng.
 * @returns Promise chứa thông tin user và token (dạng phẳng).
 */
export async function loginUser(credentials: LoginCredentials): Promise<LoginResponse> {
    const apiUrl = getApiUrl();
    try {
        const res = await fetch(`${apiUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.message || 'Đăng nhập không thành công.');
        }
        return data;
    } catch (error) {
        console.error('API Error (loginUser):', error);
        throw error;
    }
}

/**
 * Gửi yêu cầu đăng ký tài khoản mới.
 * @param credentials - Tên, email và mật khẩu.
 * @returns Promise chứa thông tin user và token (dạng lồng nhau).
 */
export async function registerUser(credentials: RegisterCredentials): Promise<RegisterResponse> {
    const apiUrl = getApiUrl();
    try {
        const res = await fetch(`${apiUrl}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.message || 'Đăng ký không thành công.');
        }
        return data;
    } catch (error) {
        console.error('API Error (registerUser):', error);
        throw error;
    }
}

/**
 * Gửi yêu cầu quên mật khẩu.
 * @param email - Email của tài khoản cần reset mật khẩu.
 * @returns Promise chứa status và message.
 */
export async function forgotPassword(email: string): Promise<StatusResponse> {
    const apiUrl = getApiUrl();
    try {
        const res = await fetch(`${apiUrl}/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        return await res.json();
    } catch (error) {
        console.error('API Error (forgotPassword):', error);
        throw error;
    }
}

/**
 * Gửi yêu cầu đặt lại mật khẩu mới với token.
 * @param token - Token reset được gửi qua email.
 * @param password - Mật khẩu mới.
 * @returns Promise chứa status và message.
 */
export async function resetPassword(token: string, password: string): Promise<StatusResponse> {
    const apiUrl = getApiUrl();
    try {
       const res = await fetch(`${apiUrl}/auth/reset-password/${token}`, {
           method: 'PUT',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ password }),
       });
       const data = await res.json();
       if (!res.ok) throw new Error(data.message || 'Token không hợp lệ hoặc đã hết hạn.');
       return data;
   } catch (error) {
       console.error('API Error (resetPassword):', error);
       throw error;
   }
}
export async function updateProfile(profileData: Partial<{ name: string; email: string; password: string; }>): Promise<LoginResponse> {
    const apiUrl = `${getApiUrl()}/auth/profile`;
    const { token } = useAuthStore.getState();

    if (!token) throw new Error('Yêu cầu xác thực.');

    try {
        const res = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(profileData),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Cập nhật không thành công.');
        return data;
    } catch (error) {
        console.error('API Error (updateProfile):', error);
        throw error;
    }
}


export async function loginWithFirebase(idToken: string): Promise<LoginResponse> {
    const apiUrl = `${getApiUrl()}/auth/firebase-login`;
    try {
        const res = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Đăng nhập bằng Firebase thất bại.');
        return data;
    } catch (error) {
        console.error('API Error (loginWithFirebase):', error);
        throw error;
    }
}