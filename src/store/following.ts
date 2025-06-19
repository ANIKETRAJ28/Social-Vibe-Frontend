import { IRole, IUser, IUserRequest } from "@/types";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  followCelebrity,
  getFollowers,
  getFollowings,
  unFollowCelebrity,
} from "@/apis/user";

interface IFollowerFollowingStore {
  follower: IUser[];
  following: IUser[];
  setFollower: () => Promise<void>;
  addFollower: (user: IUser) => Promise<void>;
  removeFollower: (user: IUser) => Promise<void>;
  getFollower: () => IUser[];
  clearFollower: () => Promise<void>;
  setFollowing: () => Promise<void>;
  addFollowing: (user: IUser) => Promise<void>;
  removeFollowing: (user: IUser) => Promise<void>;
  getFollowing: () => IUser[];
  clearFollowing: () => Promise<void>;
  fetched: boolean;
}

const followerFollowingStore = (
  set: (
    partial:
      | IFollowerFollowingStore
      | ((state: IFollowerFollowingStore) => IFollowerFollowingStore)
  ) => void,
  get: () => IFollowerFollowingStore
) => ({
  follower: [],
  following: [],
  fetched: false,
  setFollowing: async () => {
    const followings: IUser[] = await getFollowings();
    set((state) => ({
      ...state,
      fetched: true,
      following: followings,
    }));
  },
  addFollowing: async (user: IUser) => {
    await followCelebrity(user.id);
    set((state) => ({
      ...state,
      following: [user, ...state.following],
    }));
  },
  removeFollowing: async (user: IUser) => {
    await unFollowCelebrity(user.id);
    const { following } = get();
    const filteredFollowing = following.filter((f) => f.id !== user.id);
    set((state) => ({
      ...state,
      following: filteredFollowing,
    }));
  },
  getFollowing: () => {
    const { following } = get();
    return following;
  },
  clearFollowing: async () => {
    set((state) => ({
      ...state,
      following: [],
    }));
  },
  setFollower: async () => {
    const followers: IUser[] = await getFollowers();
    set((state) => ({
      ...state,
      fetched: true,
      follower: followers,
    }));
  },
  addFollower: async (user: IUser) => {
    set((state) => ({
      ...state,
      follower: [user, ...state.follower],
    }));
  },
  removeFollower: async (user: IUser) => {
    const { follower } = get();
    const filteredFollower = follower.filter((f) => f.id !== user.id);
    set((state) => ({
      ...state,
      following: filteredFollower,
    }));
  },
  getFollower: () => {
    const { follower } = get();
    return follower;
  },
  clearFollower: async () => {
    set((state) => ({
      ...state,
      follower: [],
    }));
  },
});

const useFollowFollowerStore = create<IFollowerFollowingStore>()(
  devtools(persist(followerFollowingStore, { name: "followFollower" }))
);
export default useFollowFollowerStore;
