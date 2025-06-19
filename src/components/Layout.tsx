import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  Users,
  User,
  LogOut,
  Bell,
  UserCheck,
  CircleUser,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CelebrityBadge from "./CelebrityBadge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import useAuthStore from "@/store/auth";
import { toast } from "@/hooks/use-toast";
import { connectSocket } from "@/lib/socket";
import { IPost } from "@/types";
import useNotificationStore from "@/store/notification";

interface LayoutProps {
  children: React.ReactNode;
}

type IPostSocket = {
  type: "NEW_POST" | "DELETE_POST";
  post: IPost;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const auth = useAuthStore((state) => state);
  const navigate = useNavigate();
  const user = auth.getUser();
  const [notification, setNotification] = useState<IPost[]>([]);
  const notifications = useNotificationStore((state) => state);

  useEffect(() => {
    if (user.user_id === null) {
      navigate("/login");
      return;
    }
    setNotification(notifications.getPosts());
  }, [navigate, user, notifications]);

  const navItems =
    user.user_role === "CELEBRITY"
      ? [
          {
            path: "/",
            icon: (
              <div className="w-6 h-6 rounded bg-gradient-to-r from-social-purple to-social-pink flex items-center justify-center text-white text-sm font-bold">
                H
              </div>
            ),
            label: "Home",
          },
          {
            path: "/profile",
            icon: <User className="w-5 h-5" />,
            label: "Profile",
          },
        ]
      : [
          {
            path: "/",
            icon: (
              <div className="w-6 h-6 rounded bg-gradient-to-r from-social-purple to-social-pink flex items-center justify-center text-white text-sm font-bold">
                H
              </div>
            ),
            label: "Home",
          },
          {
            path: "/search",
            icon: <Search className="w-5 h-5" />,
            label: "Search",
          },
          {
            path: "/posts/following",
            icon: <UserCheck className="w-5 h-5" />,
            label: "Following",
          },
          {
            path: "/profile",
            icon: <CircleUser className="w-5 h-5" />,
            label: "Profile",
          },
        ];
  useEffect(() => {
    if (!auth.user_id) {
      return;
    }
    const socket = connectSocket(auth.user_id);
    socket.addEventListener("message", (event) => {
      const response = JSON.parse(event.data) as IPostSocket;
      if (response.type === "DELETE_POST") {
        notifications.removePost(response.post);
      } else {
        notifications.addPost(response.post);
      }
    });
  }, [auth.user_id, notifications]);

  const handleNotificationClick = (notification: IPost) => {
    notifications.removePost(notification);
    navigate(`/celebrity/${notification.authorId}`);
  };

  const handleLogout = async () => {
    await auth.clearUser();
    toast({
      title: "Logged out",
      description: "You have successfully logged out.",
    });
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      {/* Navigation Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <div className="text-2xl font-bold bg-gradient-to-r from-social-purple to-social-pink bg-clip-text text-transparent">
                SocialVibe
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                >
                  <Button
                    variant={
                      location.pathname === item.path ? "default" : "ghost"
                    }
                    size="sm"
                    className={
                      location.pathname === item.path
                        ? "bg-gradient-to-r from-social-purple to-social-pink hover:from-social-purple/90 hover:to-social-pink/90"
                        : "hover:bg-purple-50"
                    }
                  >
                    {item.icon}
                    {item.label !== "Home" && (
                      <span className="ml-2">{item.label}</span>
                    )}
                  </Button>
                </Link>
              ))}
            </nav>
            <div className="flex items-center space-x-3">
              {user.user_id && (
                <>
                  {auth.user_role === "USER" && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="relative"
                        >
                          <Bell className="w-5 h-5" />
                          {notification.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                              {notification.length}
                            </span>
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-80 max-h-96 overflow-y-auto bg-white border shadow-lg"
                        align="end"
                      >
                        {notification.length === 0 ? (
                          <div className="p-4 text-center text-gray-500">
                            <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                            <p className="text-sm">No notifications</p>
                            <p className="text-xs text-gray-400">
                              Follow celebrities to see their posts here
                            </p>
                          </div>
                        ) : (
                          <>
                            <div className="p-3 border-b">
                              <h3 className="font-semibold text-sm">
                                Celebrity Posts
                              </h3>
                            </div>
                            {notification.map((notification) => (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleNotificationClick(notification)
                                }
                                key={notification.id}
                                className="p-3 flex-col items-start space-y-2"
                              >
                                <div className="flex items-center space-x-2 w-full">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs">
                                      {notification.authorName
                                        .charAt(0)
                                        .toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex items-center gap-1">
                                    <span className="font-medium text-sm">
                                      {notification.authorName}
                                    </span>
                                    <CelebrityBadge className="scale-75" />
                                  </div>
                                  <span className="text-xs text-gray-400 ml-auto">
                                    {new Date(
                                      notification.createdAt
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-700 line-clamp-2">
                                  {/* {.content} */}
                                </p>
                                {notification.imageURL && (
                                  <img
                                    src={notification.imageURL}
                                    alt="Post preview"
                                    className="w-full h-16 object-cover rounded"
                                  />
                                )}
                              </DropdownMenuItem>
                            ))}
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}

                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8 ring-2 ring-social-purple/20">
                      <AvatarFallback className="bg-gradient-to-r from-social-purple to-social-pink text-white text-sm font-semibold">
                        {user.user_name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:flex flex-col">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-semibold text-gray-900">
                          {user.user_name}
                        </span>
                        {user.user_role === "CELEBRITY" && (
                          <CelebrityBadge className="rounded-full" />
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-white/80 backdrop-blur-md border-t border-purple-100 fixed bottom-0 left-0 right-0 z-50">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center p-2"
            >
              <div
                className={`p-2 rounded-lg ${
                  location.pathname === item.path
                    ? "bg-gradient-to-r from-social-purple to-social-pink text-white"
                    : "text-gray-600"
                }`}
              >
                {item.icon}
              </div>
              <span className="text-xs mt-1 text-gray-700">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6 pb-20 md:pb-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;
