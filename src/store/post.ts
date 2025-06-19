import { deletePost, getCelebrityPosts } from "@/apis/post";
import { IPost } from "@/types";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface IPostStore {
  posts: IPost[];
  setPosts: () => Promise<void>;
  addPost: (post: IPost) => Promise<void>;
  removePost: (post: IPost) => Promise<void>;
  removePostFromProfile: (postId: string) => Promise<void>;
  getPosts: () => IPost[];
  clearPosts: () => Promise<void>;
  fetched: boolean;
}

const postStore = (
  set: (partial: IPostStore | ((state: IPostStore) => IPostStore)) => void,
  get: () => IPostStore
) => ({
  posts: [],
  fetched: false,
  setPosts: async () => {
    const posts: IPost[] = await getCelebrityPosts();
    set((state) => ({
      ...state,
      fetched: true,
      posts: posts,
    }));
  },
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
  removePost: async (post: IPost) => {
    set((state) => ({
      ...state,
      posts: state.posts.filter((p) => p.id !== post.id),
    }));
  },
  removePostFromProfile: async (postId: string) => {
    await deletePost(postId);
    const { posts } = get();
    const filteredPosts = posts.filter((p) => p.id !== postId);
    set((state) => ({
      ...state,
      posts: filteredPosts,
    }));
  },
  clearPosts: async () => {
    set((state) => ({
      ...state,
      posts: [],
      fetched: false,
    }));
  },
});

const usePostStore = create<IPostStore>()(
  devtools(persist(postStore, { name: "post" }))
);
export default usePostStore;
