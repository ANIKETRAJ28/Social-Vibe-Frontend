import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import useAuthStore from "@/store/auth";
import { getRandomCelebrity, getRandomUser, login } from "@/apis/auth";
import { IUser } from "@/types";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuthStore((state) => state);
  const navigate = useNavigate();
  const [isRandomLoading, setIsRandomLoading] = useState(false);

  useEffect(() => {
    const user = auth.getUser();
    if (user.user_id !== null) {
      navigate("/");
      return;
    }
  }, [auth, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await auth.setUser({ user_name: username, password });
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during login.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-indigo-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">SocialVibe</h1>
          <p className="text-white/80">Connect with friends and celebrities</p>
        </div>

        <Card className="w-full shadow-2xl border-0 animate-scale-in">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-social-purple to-social-pink bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <p className="text-gray-600">Sign in to your account</p>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="border-gray-200 focus:border-social-purple focus:ring-social-purple"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-gray-200 focus:border-social-purple focus:ring-social-purple"
                />
              </div>
              <div className="w-full flex gap-1">
                <Button
                  onClick={async () => {
                    setIsRandomLoading(true);
                    const data = await getRandomUser();
                    setUsername(data.user_name);
                    setPassword(data.password);
                    setIsRandomLoading(false);
                  }}
                  disabled={isRandomLoading || isLoading}
                  className="w-full bg-gradient-to-r from-social-purple to-social-pink hover:from-social-purple/90 hover:to-social-pink/90 transition-all duration-300"
                >
                  {isRandomLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating...
                    </div>
                  ) : (
                    <>Generate User</>
                  )}
                </Button>
                <Button
                  onClick={async () => {
                    setIsRandomLoading(true);
                    const data = await getRandomCelebrity();
                    setUsername(data.user_name);
                    setPassword(data.password);
                    setIsRandomLoading(false);
                  }}
                  disabled={isRandomLoading || isLoading}
                  className="w-full bg-gradient-to-r from-social-purple to-social-pink hover:from-social-purple/90 hover:to-social-pink/90 transition-all duration-300"
                >
                  {isRandomLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating...
                    </div>
                  ) : (
                    <>Generate Celebrity</>
                  )}
                </Button>
              </div>
              <Button
                type="submit"
                disabled={isLoading || isRandomLoading}
                className="w-full bg-gradient-to-r from-social-purple to-social-pink hover:from-social-purple/90 hover:to-social-pink/90 transition-all duration-300"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-social-purple hover:text-social-pink font-semibold transition-colors"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
