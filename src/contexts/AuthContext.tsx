// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { IUser, IRole, AuthContextType } from '@/types';

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<IUser | null>(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     const storedUser = localStorage.getItem('socialMediaUser');
//     if (storedUser) {
//       const userData = JSON.parse(storedUser);
//       setUser(userData);
//       setIsAuthenticated(true);
//     }
//   }, []);

//   const login = async (username: string, password: string): Promise<boolean> => {
//     // Simulate API call - in real app, this would be an actual API call
//     const users = JSON.parse(localStorage.getItem('socialMediaUsers') || '[]');
//     const foundUser = users.find((u: IUser) => u.user_name === username && u.password === password);

//     if (foundUser) {
//       setUser(foundUser);
//       setIsAuthenticated(true);
//       localStorage.setItem('socialMediaUser', JSON.stringify(foundUser));
//       return true;
//     }
//     return false;
//   };

//   const signup = async (username: string, password: string, role: IRole): Promise<boolean> => {
//     // Simulate API call - in real app, this would be an actual API call
//     const users = JSON.parse(localStorage.getItem('socialMediaUsers') || '[]');
//     const existingUser = users.find((u: IUser) => u.user_name === username);

//     if (existingUser) {
//       return false; // User already exists
//     }

//     const newUser: IUser = {
//       id: Date.now().toString(),
//       user_name: username,
//       password,
//       role,
//       createdAt: new Date(),
//       updatedAt: new Date()
//     };

//     users.push(newUser);
//     localStorage.setItem('socialMediaUsers', JSON.stringify(users));

//     setUser(newUser);
//     setIsAuthenticated(true);
//     localStorage.setItem('socialMediaUser', JSON.stringify(newUser));
//     return true;
//   };

//   const logout = () => {
//     setUser(null);
//     setIsAuthenticated(false);
//     localStorage.removeItem('socialMediaUser');
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
