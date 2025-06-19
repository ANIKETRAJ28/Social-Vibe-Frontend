import { axiosInstance } from "@/lib/axios";

export async function getAllPosts(limit: number, offset: number) {
  try {
    const response = await axiosInstance.get(
      `post/data?limit=${limit}&offset=${offset}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error; // Re-throw the error for further handling if needed
  }
}

export async function getCelebrityPosts() {
  try {
    const response = await axiosInstance.get("post/celebrity");
    return response.data;
  } catch (error) {
    console.error("Error fetching celebrity posts:", error);
    throw error; // Re-throw the error for further handling if needed
  }
}

export async function getFollowedCelebrityPosts() {
  try {
    const response = await axiosInstance.get(`post/celebrity/followed`);
    return response.data;
  } catch (error) {
    console.error("Error fetching followed celebrity posts:", error);
    throw error; // Re-throw the error for further handling if needed
  }
}

export async function getPostsOfCelebrity(celebrityId: string) {
  try {
    const response = await axiosInstance.get(`post/celebrity/${celebrityId}`);
    return response.data;
  } catch (error) {
    console.log("Error fetching posts of celebrity:", error);
    throw error; // Re-throw the error for further handling if needed
  }
}

export async function addPost(content: string, image?: File) {
  try {
    const response = await axiosInstance.post("post", {
      content,
      // ! check image for request
      image: image ? image : null,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding post:", error);
    throw error; // Re-throw the error for further handling if needed
  }
}

export async function deletePost(postId: string) {
  try {
    await axiosInstance.delete(`post/${postId}`);
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error; // Re-throw the error for further handling if needed
  }
}
