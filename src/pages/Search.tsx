import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search as SearchIcon } from "lucide-react";
import { IUser, IUserFollowerFollowing } from "@/types";
import UserCard from "@/components/UserCard";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/store/auth";
import {
  followCelebrity,
  getUserByUserName,
  unFollowCelebrity,
} from "@/apis/user";
import useFollowFollowerStore from "@/store/following";

const Search: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<IUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);
  const [following, setFollowing] = useState<IUser[]>([]);
  const auth = useAuthStore((state) => state);
  const user = auth.getUser();
  const followFollower = useFollowFollowerStore((state) => state);

  useEffect(() => {
    if (!followFollower.fetched) {
      async function fetchFollowing() {
        await followFollower.setFollowing();
      }
      fetchFollowing();
    }
    setFollowing(followFollower.getFollowing);
  }, [followFollower]);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchTerm.trim() === "") {
        setFilteredUsers([]);
      } else {
        const response: IUser[] = await getUserByUserName(searchTerm);
        setFilteredUsers(response);
      }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, users]);

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
    setFollowing(followFollower.getFollowing());
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-social-purple to-social-pink bg-clip-text text-transparent mb-2">
          Discover People
        </h1>
        <p className="text-gray-600">Find and connect with amazing people</p>
      </div>

      {/* Search Bar */}
      <Card className="animate-fade-in">
        <CardContent className="p-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search users by name or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-200 focus:border-social-purple focus:ring-social-purple"
            />
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      <div className="space-y-3">
        {filteredUsers.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-gray-400 mb-4">
                <SearchIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  {searchTerm ? "No users found" : "Start searching"}
                </h3>
                <p className="text-gray-500">
                  {searchTerm
                    ? "Try searching with different keywords"
                    : "Enter a name or role to find people"}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="text-sm text-gray-600 mb-4">
              Found {filteredUsers.length} user
              {filteredUsers.length !== 1 ? "s" : ""}
            </div>
            {filteredUsers.map((searchUser) => {
              if (following.some((user) => user.id === searchUser.id)) {
                return (
                  <UserCard
                    key={searchUser.id}
                    user={searchUser}
                    onFollow={handleFollow}
                    isFollowing={true}
                  />
                );
              } else {
                return (
                  <UserCard
                    key={searchUser.id}
                    user={searchUser}
                    onFollow={handleFollow}
                    isFollowing={false}
                  />
                );
              }
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
