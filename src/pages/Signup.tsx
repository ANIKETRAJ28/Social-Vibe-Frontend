import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { IRole } from "@/types";
import { toast } from "@/hooks/use-toast";
import useAuthStore from "@/store/auth";

const Signup: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<IRole>("USER");
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuthStore((state) => state);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await auth.setUser({ user_name: username, password, role });
      toast({
        title: "Account created!",
        description: "Welcome to SocialVibe! You can now start connecting.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during signup.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const user = auth.getUser();
    if (user.user_id !== null) {
      navigate("/");
    }
  }, [auth, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-indigo-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Social Feed</h1>
          <p className="text-white/80">Join the social revolution</p>
        </div>

        <Card className="w-full shadow-2xl border-0 animate-scale-in">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-social-purple to-social-pink bg-clip-text text-transparent">
              Create Account
            </CardTitle>
            <p className="text-gray-600">Join thousands of users worldwide</p>
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
                  placeholder="Choose a unique username"
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
                  placeholder="Create a secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-gray-200 focus:border-social-purple focus:ring-social-purple"
                />
              </div>
              <div className="space-y-3">
                <Label>Account Type</Label>
                <RadioGroup
                  value={role}
                  onValueChange={(value) => setRole(value as IRole)}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <RadioGroupItem
                      value="USER"
                      id="user"
                    />
                    <Label
                      htmlFor="user"
                      className="flex-1 cursor-pointer"
                    >
                      <div className="font-medium">User</div>
                      <div className="text-sm text-gray-500">
                        Regular account
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 transition-colors">
                    <RadioGroupItem
                      value="CELEBRITY"
                      id="celebrity"
                    />
                    <Label
                      htmlFor="celebrity"
                      className="flex-1 cursor-pointer"
                    >
                      <div className="font-medium flex items-center gap-1">
                        Celebrity <span className="text-yellow-500">⭐</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Verified account
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-social-purple to-social-pink hover:from-social-purple/90 hover:to-social-pink/90 transition-all duration-300"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create Account
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-social-purple hover:text-social-pink font-semibold transition-colors"
                >
                  Login In
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
