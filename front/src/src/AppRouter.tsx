import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { routes, ProtectedRoute } from './routes/routes';
import { useAuth } from './contexts/AuthContext';
export function AppRouter() {
  const {
    currentUser,
    userRole,
    loading
  } = useAuth();
  return <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        {routes.filter(route => route.public).map((route, index) => <Route key={index} path={route.path} element={route.element} />)}
        {/* Protected Route with Layout */}
        {routes.filter(route => route.protected).map((route, index) => <Route key={index} path={route.path} element={<ProtectedRoute element={route.element} allowedRoles={route.allowedRoles} />}>
              {/* Nested Routes */}
              {route.children?.map((childRoute, childIndex) => <Route key={childIndex} path={childRoute.path} element={<ProtectedRoute element={childRoute.element} allowedRoles={childRoute.allowedRoles} />} />)}
            </Route>)}
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/landing" />} />
      </Routes>
    </BrowserRouter>;
}
