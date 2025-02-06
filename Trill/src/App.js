import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "../src/components/Auth/SignIn";
import MainPage from "../src/components/MainPage/MainPage";
import Navbar from "../src/Shared/Navbar";
import Footer from "../src/Shared/Footer";
import ProfilePage from "../src/components/ProfilePage/ProfilePage";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught in ErrorBoundary:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h1>Something went wrong!</h1>
          <details style={{ whiteSpace: "pre-wrap" }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

// App Component
const App = () => {
  return (
    <Router>
      <ErrorBoundary>
        <Navbar />
        <div style={{ minHeight: "calc(100vh - 150px)" }}> {/* Content area */}
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/mainpage" element={<MainPage />} />
            <Route path="/profilepage" element={<ProfilePage />} />
            <Route path="/" element={<Navigate to="/signin" />} />
          </Routes>
        </div>
        <Footer />
      </ErrorBoundary>
    </Router>
  );
};

export default App;
