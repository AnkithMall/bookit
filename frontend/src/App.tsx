import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ExperiencePage from "./pages/ExperiencePage";
import DetailsPage from "./pages/DetailsPage";
import CheckoutPage from "./pages/CheckoutPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ExperiencePage />} />
        <Route
          path="/details/:id"
          element={
            <Layout searchDisabled>
              <DetailsPage />
            </Layout>
          }
        />
        <Route
          path="/checkout"
          element={
            <Layout searchDisabled>
              <CheckoutPage />
            </Layout>
          }
        />
        <Route
          path="/confirmation"
          element={
            <Layout searchDisabled>
              <ConfirmationPage />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
