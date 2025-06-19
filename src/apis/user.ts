import { axiosInstance } from "@/lib/axios";

export async function getUserById(id: string) {
  try {
    const response = await axiosInstance.get(`user/${id}`);
    return response.data;
  } catch (error) {
    console.log("Error fetching user by ID:", error);
    throw error; // Re-throw the error for further handling if needed
  }
}

export async function getUserByUserName(username: string) {
  try {
    const response = await axiosInstance.get(
      `user/username?user_name=${username}`
    );
    return response.data;
  } catch (error) {
    console.log("Error fetching user by username:", error);
    throw error; // Re-throw the error for further handling if needed
  }
}

export async function followCelebrity(celebrity_id: string) {
  try {
    await axiosInstance.post(`user/celebrity/follow/${celebrity_id}`);
  } catch (error) {
    console.log("Error following celebrity:", error);
    throw error; // Re-throw the error for further handling if needed
  }
}

export async function unFollowCelebrity(celebrity_id: string) {
  try {
    await axiosInstance.post(`user/celebrity/unfollow/${celebrity_id}`);
  } catch (error) {
    console.log("Error unfollowing celebrity:", error);
    throw error; // Re-throw the error for further handling if needed
  }
}

export async function getFollowings() {
  try {
    const response = await axiosInstance.get("user/followings");
    return response.data;
  } catch (error) {
    console.log("Error fetching followings:", error);
    throw error; // Re-throw the error for further handling if needed
  }
}

export async function getFollowers() {
  try {
    const response = await axiosInstance.get("user/followers");
    return response.data;
  } catch (error) {
    console.log("Error fetching followers:", error);
    throw error; // Re-throw the error for further handling if needed
  }
}
