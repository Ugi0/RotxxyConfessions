import type { Confession } from "../types/Confession";
import "./ConfessionCard.css";

export default function ConfessionCard({ confession }: { confession: Confession }) {
  const { title, content, category } = confession;

  return (
    <div className="confession-card">
      {(category || title) && 
        <div className="confession-card-header">
          <div className={`category-card-badge ${category ? 'active' : ''}`}>{category}</div>

          {title && <h2 className="confession-card-title">{title}</h2>}
        </div>
      }

      <p className="confession-card-content">{content}</p>
    </div>
  );
}