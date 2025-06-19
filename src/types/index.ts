export type IRole = "USER" | "CELEBRITY";

export interface IUserFollowerFollowing {
  follower: string;
  following: string;
}

export interface IUserRequest {
  user_name: string;
  password: string;
  role?: IRole;
}

export interface IUser extends Omit<IUserRequest, "password"> {
  id: string;
  role: IRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPostRequest {
  content: string;
  imageURL?: string;
}

export interface IPost extends IPostRequest {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: IRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthContextType {
  user: IUser | null;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, password: string, role: IRole) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}
