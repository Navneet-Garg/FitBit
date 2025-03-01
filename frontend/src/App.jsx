import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from "./context/AuthContext";  // or the correct relative path
import { useAuth } from "./context/AuthContext"; 
import File from './Pages/File';
import Home from './Pages/Home';
import Auth from './Pages/Auth';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/auth" element={<Auth />} />

          {/* Private Route */}
          <Route
            path="/file"
            element={<PrivateRoute><File /></PrivateRoute>}
          />

          <Route path='/home' element={<Home />} />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/home" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/auth" />;
}

export default App;
