import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import StartPage from "./pages/startpage";
import Summary from "./pages/summary";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Default route → Start Page */}
        <Route path="/" element={<StartPage />} />

        {/* Summary page route */}
        <Route path="/summary" element={<Summary />} />

      </Routes>
    </BrowserRouter>
  );
}
