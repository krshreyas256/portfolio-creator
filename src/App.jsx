import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import CreatePortfolio from "./pages/CreatePortfolio";
import PortfolioBuilder from "./pages/PortfolioBuilder";
import PortfolioPreview from "./pages/PortfolioPreview";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create"
          element={
          <ProtectedRoute>
            <CreatePortfolio />
          </ProtectedRoute>
          }
        />

        <Route
  path="/create/:portfolioId"
  element={
    <ProtectedRoute>
      <PortfolioBuilder />
    </ProtectedRoute>
  }
/>

<Route
  path="/preview/:portfolioId"
  element={
    <ProtectedRoute>
      <PortfolioPreview />
    </ProtectedRoute>
  }
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;