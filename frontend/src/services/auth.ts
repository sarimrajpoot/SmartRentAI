import api from "../api/api";

export interface RegisterRequest {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  role: "CUSTOMER" | "SHOWROOM" | "ADMIN";
  cnic: string;
  driving_license: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: "CUSTOMER" | "SHOWROOM" | "ADMIN";
  cnic?: string;
  driving_license?: string;
  address?: string;
  profile_picture?: string;
  is_verified?: boolean;
}

export interface UserUpdate {
  full_name?: string;
  phone?: string;
  address?: string;
  cnic?: string;
  driving_license?: string;
}

export interface PasswordChange {
  current_password: string;
  new_password: string;
}

export interface ActiveSession {
  id: string;
  device: string;
  ip: string;
  location: string;
  last_active: string;
  is_current: boolean;
}

export async function register(data: RegisterRequest) {
  const response = await api.post("/auth/register", data);
  return response.data;
}

export async function login(data: LoginRequest) {
  const formData = new URLSearchParams();

  formData.append("username", data.email);
  formData.append("password", data.password);

  const response = await api.post(
    "/auth/login",
    formData,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data;
}

export async function getCurrentUser(): Promise<User> {
  const response = await api.get("/auth/me");
  return response.data;
}

export async function updateProfile(data: UserUpdate): Promise<User> {
  const response = await api.patch("/auth/profile", data);
  return response.data;
}

export async function uploadProfilePicture(file: File): Promise<User> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post("/auth/profile/picture", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function changePassword(data: PasswordChange): Promise<any> {
  const response = await api.patch("/auth/change-password", data);
  return response.data;
}

export async function getActiveSessions(): Promise<ActiveSession[]> {
  const response = await api.get("/auth/sessions");
  return response.data;
}

export async function logoutAllDevices(): Promise<any> {
  const response = await api.post("/auth/sessions/logout-all");
  return response.data;
}

export async function deleteAccount(): Promise<any> {
  const response = await api.delete("/auth/account");
  return response.data;
}