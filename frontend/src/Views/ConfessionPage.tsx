import "./ConfessionPage.css";
import ConfessionBox from "../components/ConfessionBox";
import { useEffect } from "react";

export default function ConfessionPage() {
  useEffect(() => {
    fetch("/api/confession", {
      method: "GET",
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        console.log("Session created:", data.sessionId);
      })
      .catch(err => console.error(err));
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