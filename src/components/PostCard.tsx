import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trash2 } from "lucide-react";
import { IPost, IRole, IUser, IUserRequest } from "@/types";
import CelebrityBadge from "./CelebrityBadge";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/store/auth";
// import { useAuth } from '@/contexts/AuthContext';

interface PostCardProps {
  post: IPost;
  onDelete?: (post: IPost) => void;
  param?: string;
}

const PostCard: React.FC<PostCardProps> = ({ post, onDelete, param }) => {
  const auth = useAuthStore((state) => state);
  const navigate = useNavigate();
  const user = auth.getUser();
  const canDelete = user?.user_id === post.authorId;

  return (
    <Card className="w-full mb-4 animate-fade-in hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between cursor-default">
          <div
            onClick={(e) => {
              e.preventDefault();
              if (auth.user_role === "USER" && post.authorId !== param)
                navigate(`/celebrity/${post.authorId}`);
            }}
            className="flex items-center space-x-3"
          >
            <Avatar className="h-10 w-10 ring-2 ring-social-purple/20">
              <AvatarFallback className="bg-gradient-to-r from-social-purple to-social-pink text-white font-semibold">
                {post.authorName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">
                  {post.authorName}
                </span>
                {post.authorRole === "CELEBRITY" && <CelebrityBadge />}
              </div>
              <span className="text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          {canDelete && onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(post)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-gray-800 mb-3 leading-relaxed">{post.content}</p>
        {post.imageURL && (
          <div className="rounded-lg overflow-hidden">
            <img
              src={post.imageURL}
              alt="Post content"
              className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PostCard;
