import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { IPost } from "@/types";
import PostCard from "@/components/PostCard";
import { getFollowedCelebrityPosts } from "@/apis/post";

const Post: React.FC = () => {
  const [posts, setPosts] = useState<IPost[]>([]);

  const fetchPosts = async () => {
    const post = await getFollowedCelebrityPosts();
    setPosts(post);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-social-purple to-social-pink bg-clip-text text-transparent mb-2">
          Welcome to Your Feed
        </h1>
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-gray-400 mb-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-social-purple to-social-pink rounded-full flex items-center justify-center">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  No posts yet
                </h3>
              </div>
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Post;
