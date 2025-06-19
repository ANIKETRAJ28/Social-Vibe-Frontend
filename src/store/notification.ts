import { deletePost, getCelebrityPosts } from "@/apis/post";
import { IPost } from "@/types";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface INotificationPostStore {
  posts: IPost[];
  addPost: (post: IPost) => Promise<void>;
  getPosts: () => IPost[];
  removePost: (post: IPost) => void;
  filterPost: (authorId: string) => void;
  clearPosts: () => Promise<void>;
}

const notificationStore = (
  set: (
    partial:
      | INotificationPostStore
      | ((state: INotificationPostStore) => INotificationPostStore)
  ) => void,
  get: () => INotificationPostStore
) => ({
  posts: [],
  getPosts: () => {
    const { posts } = get();
    return posts;
  },
  addPost: async (post: IPost) => {
    set((state) => ({
      ...state,
      posts: [post, ...state.posts],
    }));
  },
  removePost: (post: IPost) => {
    set((state) => ({
      ...state,
      posts: state.posts.filter((p) => p.authorId !== post.authorId),
    }));
  },
  filterPost: (authorId: string) => {
    set((state) => ({
      ...state,
      posts: state.posts.filter((p) => p.authorId !== authorId),
    }));
  },
  clearPosts: async () => {
    set((state) => ({
      ...state,
      posts: [],
    }));
  },
});

const useNotificationStore = create<INotificationPostStore>()(
  devtools(persist(notificationStore, { name: "notification" }))
);
export default useNotificationStore;
