import { useEffect, useState } from "react";

interface Confession {
  id: string;
  text: string;
  status: string;
}

export default function ModeratorView() {
  const [confessions, setConfessions] = useState<Confession[]>([]);

  useEffect(() => {
    fetch("/api/confessions?status=pending", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => setConfessions(data));
  }, []);

  const handleAction = async (id: string, action: string) => {
    await fetch(`/api/confessions/${id}/${action}`, {
      method: "POST",
      credentials: "include",
    });

    // remove from UI instantly
    setConfessions(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div>
      <h1>Moderator Dashboard</h1>

      {confessions.map(c => (
        <div key={c.id} style={{ border: "1px solid gray", margin: 10, padding: 10 }}>
          <p>{c.text}</p>

          <button onClick={() => handleAction(c.id, "approve")}>
            Approve
          </button>
          <button onClick={() => handleAction(c.id, "reject")}>
            Reject
          </button>
        </div>
      ))}
    </div>
  );
}