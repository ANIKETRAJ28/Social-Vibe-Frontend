import { IRole, IUser, IUserRequest } from "@/types";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { login, logout, signup, verify } from "@/apis/auth";

interface IAuthStore {
  user_id: string | null;
  user_name: string | null;
  user_role: IRole | null;
  setUser: (user: IUserRequest) => Promise<void>;
  verifyUser: () => Promise<IUser>;
  getUser: () => {
    user_id: string | null;
    user_name: string | null;
    user_role: IRole | null;
  };
  clearUser: () => Promise<void>;
}

const authStore = (
  set: (partial: IAuthStore | ((state: IAuthStore) => IAuthStore)) => void,
  get: () => IAuthStore
) => ({
  user_id: null,
  user_name: null,
  user_role: null,
  verifyUser: async () => {
    const response = await verify();
    set((state) => ({
      ...state,
      user_id: response.id,
      user_name: response.user_name,
      user_role: response.role,
    }));
    return response;
  },
  setUser: async (user: IUserRequest) => {
    if (user.role) await signup(user);
    else await login(user.user_name, user.password);
    await verify();
  },
  getUser: () => {
    const { user_id, user_name, user_role } = get();
    return {
      user_id,
      user_name,
      user_role,
    };
  },
  clearUser: async () => {
    await logout();
    localStorage.clear();
    set((state) => ({
      ...state,
      user_id: null,
      user_name: null,
      user_role: null,
    }));
  },
});

const useAuthStore = create<IAuthStore>()(
  devtools(persist(authStore, { name: "auth" }))
);
export default useAuthStore;
