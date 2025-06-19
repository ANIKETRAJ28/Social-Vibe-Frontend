import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { IPost, IUser } from "@/types";
import UserCard from "@/components/UserCard";
import useAuthStore from "@/store/auth";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { getUserById } from "@/apis/user";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import CelebrityBadge from "@/components/CelebrityBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import PostCard from "@/components/PostCard";
import { getPostsOfCelebrity } from "@/apis/post";
import { Button } from "@/components/ui/button";
import useFollowFollowerStore from "@/store/following";
import { toast } from "@/hooks/use-toast";
import useNotificationStore from "@/store/notification";

const Celebrities: React.FC = () => {
  const [celebrity, setCelebrity] = useState<IUser | null>(null);
  const [posts, setPosts] = useState<IPost[]>([]);
  const auth = useAuthStore((state) => state);
  const navigate = useNavigate();
  const user = auth.getUser();
  const params = useParams();
  const followFollower = useFollowFollowerStore((state) => state);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const userId = params.id;
  const notifications = useNotificationStore((state) => state);

  async function getUser(id: string) {
    try {
      const user = await getUserById(id);
      setCelebrity(user);
    } catch (error) {
      console.log("Error fetching user:", error);
    }
  }

  async function getCelebrityPosts(id: string) {
    try {
      const celebrityPosts = await getPostsOfCelebrity(id);
      setPosts(celebrityPosts);
    } catch (error) {
      console.log("Error fetching user:", error);
    }
  }

  const handleFollow = async (user: IUser, isFollowing: boolean) => {
    if (!user.id) return;
    if (isFollowing) {
      await followFollower.removeFollowing(user);
      toast({
        title: "Unfollowed",
        description: "You have unfollowed this user.",
      });
    } else {
      await followFollower.addFollowing(user);
      toast({
        title: "Followed",
        description: "You have followed this user.",
      });
    }
  };

  useEffect(() => {
    if (auth.user_role !== "USER") {
      navigate("/");
      return;
    }
    const x = followFollower.following.some((f) => f.id === params.id);
    setIsFollowing(x);
    getUser(params.id);
    getCelebrityPosts(params.id);
  }, [params, auth, navigate, followFollower.following]);

  useEffect(() => {
    notifications.filterPost(userId);
  }, []);

  return (
    celebrity && (
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card className="animate-fade-in">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24 ring-4 bg-gradient-to-r from-social-purple to-social-pink ring-social-purple/20 flex items-center justify-center rounded-full">
                <AvatarFallback className="text-white text-3xl font-bold">
                  {celebrity.user_name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {celebrity.user_name}
                </h1>
                {<CelebrityBadge />}
              </div>
              <p className="text-gray-600 capitalize">
                {user.user_role && user.user_role.toLowerCase()} Account
              </p>
              {auth.user_role === "USER" && (
                <Button
                  onClick={() => handleFollow(celebrity, isFollowing)}
                  variant={isFollowing ? "outline" : "default"}
                  size="sm"
                  className={
                    isFollowing
                      ? "border-social-purple text-social-purple hover:bg-social-purple hover:text-white"
                      : "bg-gradient-to-r from-social-purple to-social-pink hover:from-social-purple/90 hover:to-social-pink/90"
                  }
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </Button>
              )}
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-8 mt-6">
              <>
                <div className="text-center">
                  <div className="text-2xl font-bold text-social-purple">
                    {posts.length}
                  </div>
                  <div className="text-sm text-gray-600">Posts</div>
                </div>
              </>
            </div>
          </CardHeader>
        </Card>

        {/* Tabs */}
        <Tabs
          defaultValue="posts"
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="posts">Posts</TabsTrigger>
          </TabsList>
          <TabsContent
            value="posts"
            className="space-y-4 mt-6"
          >
            {posts.length === 0 ? (
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
                  param={userId}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    )
  );
};

export default Celebrities;
