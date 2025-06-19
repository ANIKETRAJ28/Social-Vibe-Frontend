import { axiosInstance } from "@/lib/axios";
import { IUser, IUserRequest } from "@/types";

export async function signup(data: IUserRequest) {
  await axiosInstance.post("auth/signup", {
    user_name: data.user_name,
    password: data.password,
    role: data.role,
  });
}

export async function login(user_name: string, password: string) {
  await axiosInstance.post("auth/login", { user_name, password });
}

export async function logout() {
  await axiosInstance.get("auth/logout");
}

export async function verify(): Promise<IUser> {
  const response = await axiosInstance.get("auth/verify");
  return response.data.data;
}

export async function getRandomUser(): Promise<IUser & { password: string }> {
  try {
    const response = await axiosInstance.get("auth/random/user");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching random user:", error);
    throw error; // Re-throw the error for further handling if needed
  }
}

export async function getRandomCelebrity(): Promise<
  IUser & { password: string }
> {
  try {
    const response = await axiosInstance.get("auth/random/celebrity");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching random celebrity:", error);
    throw error; // Re-throw the error for further handling if needed
  }
}
