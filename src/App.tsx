import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Search from "./pages/Search";
import Celebrities from "./pages/Celebrities";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Post from "./pages/Post";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/signup"
          element={<Signup />}
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Home />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <Layout>
                <Search />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/posts/following"
          element={
            <ProtectedRoute>
              <Layout>
                <Post />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/celebrity/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <Celebrities />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
