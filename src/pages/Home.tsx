import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { IPost, IUser } from "@/types";
import PostCard from "@/components/PostCard";
import { toast } from "@/hooks/use-toast";
import useAuthStore from "@/store/auth";
import usePostStore from "@/store/post";
import { addPost, deletePost, getAllPosts } from "@/apis/post";
import { Skeleton } from "@/components/ui/skeleton";

const Home: React.FC = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [newPost, setNewPost] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const auth = useAuthStore((state) => state);
  const celebrityPost = usePostStore((state) => state);
  const [offset, setOffset] = useState(0);
  const limit = 5;
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const handleInfiniteScroll = () => {
    if (
      document.documentElement.scrollTop + window.innerHeight + 1 >=
      document.documentElement.scrollHeight
    ) {
      setTimeout(() => setOffset((prev) => prev + limit), 200);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleInfiniteScroll);
  }, []);

  const fetchPosts = async () => {
    const data: IPost[] = await getAllPosts(limit, offset);
    console.log("Fetched posts:", data);
    setIsLoading(true);
    if (data.length === 0) {
      window.removeEventListener("scroll", handleInfiniteScroll);
      setHasMore(false);
      setIsLoading(false);
      return;
    }
    setPosts([...posts, ...data]);
  };

  useEffect(() => {
    if (hasMore) {
      fetchPosts();
    }
  }, [offset]);

  const handleCreatePost = async () => {
    if (!newPost.trim()) {
      toast({
        title: "Error",
        description: "Please enter some content for your post.",
        variant: "destructive",
      });
    }
    const createdPost: IPost = await addPost(newPost);
    if (auth.user_role === "CELEBRITY") {
      celebrityPost.addPost(createdPost);
    }
    const updatedPost = [createdPost, ...posts];
    setPosts(updatedPost);
    setNewPost("");
    setImageFile(null);
    setImagePreview("");
    setShowCreatePost(false);

    toast({
      title: "Post created!",
      description: "Your post has been shared successfully.",
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-social-purple to-social-pink bg-clip-text text-transparent mb-2">
          Welcome to Your Feed
        </h1>
      </div>

      {/* Create Post Card */}
      {auth.user_role === "CELEBRITY" && (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create New Post
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!showCreatePost ? (
              <Button
                onClick={() => setShowCreatePost(true)}
                className="w-full bg-gradient-to-r from-social-purple to-social-pink hover:from-social-purple/90 hover:to-social-pink/90"
              >
                What's on your mind?
              </Button>
            ) : (
              <>
                <Textarea
                  placeholder="Share your thoughts..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="min-h-24 resize-none border-gray-200 focus:border-social-purple focus:ring-social-purple"
                />

                <div className="flex gap-2">
                  <Button
                    onClick={handleCreatePost}
                    className="flex-1 bg-gradient-to-r from-social-purple to-social-pink hover:from-social-purple/90 hover:to-social-pink/90"
                  >
                    Share Post
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowCreatePost(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

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
      {isLoading && (
        <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col gap-3 w-full max-w-2xl">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <Skeleton className="h-10 w-10 rounded-full" />

              <div className="flex flex-col gap-1">
                {/* Username and badge */}
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-20 rounded-md" />
                  <Skeleton className="h-4 w-6 rounded-md" />
                </div>

                {/* Date */}
                <Skeleton className="h-3 w-16 rounded-md" />
              </div>
            </div>
          </div>

          {/* Post content */}
          <Skeleton className="h-4 w-3/4 rounded-md" />
        </div>
      )}
    </div>
  );
};

export default Home;
