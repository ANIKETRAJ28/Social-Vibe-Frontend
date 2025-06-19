import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { IUser } from "@/types";
import CelebrityBadge from "./CelebrityBadge";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/store/auth";

interface UserCardProps {
  user: IUser;
  onFollow?: (user: IUser, isFollowing: boolean) => void;
  isFollowing: boolean;
}

const UserCard: React.FC<UserCardProps> = ({ user, onFollow, isFollowing }) => {
  const navigate = useNavigate();
  const auth = useAuthStore((state) => state);
  return (
    <Card className="w-full mb-3 hover:shadow-md transition-shadow duration-300 animate-scale-in">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div
            onClick={(e) => {
              e.preventDefault();
              if (auth.user_role === "USER") navigate(`/celebrity/${user.id}`);
            }}
            className="flex items-center space-x-3 cursor-default"
          >
            <Avatar className="h-12 w-12 ring-2 ring-social-purple/20">
              <AvatarFallback className="bg-gradient-to-r from-social-purple to-social-pink text-white font-semibold text-lg">
                {user.user_name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">
                  {user.user_name}
                </span>
                {user.role === "CELEBRITY" && <CelebrityBadge />}
              </div>
              <span className="text-sm text-gray-500 capitalize">
                {user.role.toLowerCase()}
              </span>
            </div>
          </div>
          {onFollow && (
            <Button
              onClick={() => onFollow(user, isFollowing)}
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
      </CardContent>
    </Card>
  );
};

export default UserCard;
