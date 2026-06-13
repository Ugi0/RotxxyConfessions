import "./ConfessionPage.css";
import ConfessionBox from "../components/ConfessionBox";
import { useEffect } from "react";
import { refreshToken } from "../helpers/submitConfession";

export default function ConfessionPage() {
  useEffect(() => {
    refreshToken();
  }, []);

  return (
    <div className="confession-page">
      <h1>Anonymous Confessions</h1>

      <div className="confession-content">
        <ConfessionBox />
      </div>
    </div>
  );
}