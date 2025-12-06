import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Contacts from "./pages/Contacts";
import ResetPassword from "./pages/ResetPassword";
import Protected from "./pages/Protected";
import Footer from "./components/Footer";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route
          path="/contacts"
          element={
            <Protected>
              <Contacts />
            </Protected>
          }
        />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
