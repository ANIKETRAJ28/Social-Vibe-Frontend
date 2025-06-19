import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IPost, IUser, IUserFollowerFollowing } from "@/types";
import PostCard from "@/components/PostCard";
import UserCard from "@/components/UserCard";
import CelebrityBadge from "@/components/CelebrityBadge";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/store/auth";
import useFollowFollowerStore from "@/store/following";
import usePostStore from "@/store/post";

const Profile: React.FC = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [followers, setFollowers] = useState<IUser[]>([]);
  const [following, setFollowing] = useState<IUser[]>([]);
  const auth = useAuthStore((state) => state);
  const user = auth.getUser();
  const followFollower = useFollowFollowerStore((state) => state);
  const celebrityPost = usePostStore((state) => state);

  const handleDeletePost = async (post: IPost) => {
    await celebrityPost.removePostFromProfile(post.id);
    setPosts(celebrityPost.getPosts());
    toast({
      title: "Post deleted",
      description: "Your post has been removed from your profile.",
    });
  };

  const handleUnfollow = async (celebrity: IUser) => {
    if (!celebrity.id) return;
    await followFollower.removeFollowing(celebrity);
    toast({
      title: "Unfollowed",
      description: "You have unfollowed this user.",
    });
    setFollowing(followFollower.getFollowing);

    // setFollowingRelations(updatedFollowing);

    // Update the following state
    // const updatedFollowingUsers = following.filter((u) => u.id !== userId);
    // setFollowing(updatedFollowingUsers);
    toast({
      title: "Unfollowed",
      description: "You have unfollowed this user.",
    });
  };

  useEffect(() => {
    if (user.user_role === "USER") {
      if (!followFollower.fetched) {
        async function fetchFollowings() {
          await followFollower.setFollowing();
        }
        fetchFollowings();
      }
      setFollowing(followFollower.getFollowing());
    } else {
      if (!followFollower.fetched) {
        async function fetchData() {
          await followFollower.setFollower();
          await celebrityPost.setPosts();
        }
        fetchData();
      }
      setFollowers(followFollower.getFollower());
      setPosts(celebrityPost.getPosts());
    }
  }, [user.user_role, followFollower, celebrityPost]);

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card className="animate-fade-in">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Avatar className="h-24 w-24 ring-4 ring-social-purple/20">
              <AvatarFallback className="bg-gradient-to-r from-social-purple to-social-pink text-white text-3xl font-bold">
                {user.user_name && user.user_name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {user.user_name}
              </h1>
              {user.user_role === "CELEBRITY" && <CelebrityBadge />}
            </div>
            <p className="text-gray-600 capitalize">
              {user.user_role && user.user_role.toLowerCase()} Account
            </p>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8 mt-6">
            {user.user_role === "CELEBRITY" && (
              <>
                <div className="text-center">
                  <div className="text-2xl font-bold text-social-purple">
                    {posts.length}
                  </div>
                  <div className="text-sm text-gray-600">Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-social-pink">
                    {followers.length}
                  </div>
                  <div className="text-sm text-gray-600">Followers</div>
                </div>
              </>
            )}
            <div className="text-center">
              {user.user_role === "USER" && (
                <div className="text-2xl font-bold text-social-indigo">
                  {following.length}
                </div>
              )}
              {user.user_role == "USER" && (
                <div className="text-sm text-gray-600">Following</div>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Tabs
        defaultValue={user.user_role === "CELEBRITY" ? "posts" : "following"}
        className="w-full"
      >
        {user.user_role === "CELEBRITY" ? (
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="followers">Followers</TabsTrigger>
          </TabsList>
        ) : (
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>
        )}

        <TabsContent
          value="posts"
          className="space-y-4 mt-6"
        >
          {auth.user_role === "CELEBRITY" && posts.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-gray-400 mb-4">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-social-purple to-social-pink rounded-full flex items-center justify-center">
                    <span className="text-2xl">📝</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    No posts yet
                  </h3>
                  <p className="text-gray-500">
                    Start sharing your thoughts with the world!
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onDelete={handleDeletePost}
              />
            ))
          )}
        </TabsContent>

        <TabsContent
          value="followers"
          className="space-y-3 mt-6"
        >
          {auth.user_role === "CELEBRITY" && followers.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-gray-400 mb-4">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-social-purple to-social-pink rounded-full flex items-center justify-center">
                    <span className="text-2xl">👥</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    No followers yet
                  </h3>
                  <p className="text-gray-500">
                    Share great content to attract followers!
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            followers.map((follower) => (
              <UserCard
                key={follower.id}
                user={follower}
                isFollowing={true}
              />
            ))
          )}
        </TabsContent>

        <TabsContent
          value="following"
          className="space-y-3 mt-6"
        >
          {auth.user_role === "USER" && following.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-gray-400 mb-4">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-social-purple to-social-pink rounded-full flex items-center justify-center">
                    <span className="text-2xl">🔍</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    Not following anyone
                  </h3>
                  <p className="text-gray-500">
                    Discover and follow interesting people!
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            following.map((followedUser) => (
              <UserCard
                key={followedUser.id}
                user={followedUser}
                onFollow={handleUnfollow}
                isFollowing={true}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
