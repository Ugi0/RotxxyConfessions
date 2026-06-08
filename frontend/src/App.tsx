import { BrowserRouter, Route, Routes } from "react-router";
import ConfessionPage from "./Views/ConfessionPage";

export default function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ConfessionPage />} />
        </Routes>
      </BrowserRouter>
  );
}