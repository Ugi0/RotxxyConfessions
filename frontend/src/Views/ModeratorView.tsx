import { useContext, useEffect, useRef, useState } from "react";
import { categories, type Confession } from "../types/Confession";
import ConfessionCard from "../components/ConfessionCard";
import "./ModeratorView.css";
import { AuthContext } from "../types/authContext";
import { logout } from "../helpers/actions";
import type { SearchParams } from "../types/searchParams";

export default function ModeratorView() {
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const currentUser = useContext(AuthContext).currentUser;

  const [searchParams, setSearchParams] = useState<SearchParams>(
    { reviewStatus: "pending" }
  );

  const [openProfile, setOpenProfile] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const toggleMenu = () => {
    setOpenProfile(prev => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpenProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let url = "/api/confessions";

    if (searchParams) {
      const { content, category, isNSFW, orderBy, orderDirection, reviewStatus } = searchParams;
      const params = new URLSearchParams();

      if (content) params.append("content", content);
      if (category) params.append("category", category);
      if (isNSFW !== undefined) params.append("isNSFW", isNSFW.toString());
      if (orderBy) params.append("orderBy", orderBy);
      if (orderDirection) params.append("orderDirection", orderDirection);
      if (reviewStatus) params.append("reviewStatus", reviewStatus);

      url += `?${params.toString()}`;
    }

    fetch(url, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => setConfessions(data !== null ? data : []));
  }, [searchParams]);

  const handleAction = async (id: string, action: string) => {
    await fetch(`/api/confessions/${id}/${action}`, {
      method: "POST",
      credentials: "include",
    });

    setConfessions(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="moderator-view">
      <div className="header">
        <button className="reviewed-button" onClick={() => setSearchParams({...searchParams, reviewStatus: searchParams.reviewStatus === "reviewed" ? "pending" : "reviewed"})}>
          {searchParams.reviewStatus === "reviewed" ? "Show Pending" : "Show Reviewed"} Confessions
        </button>
        <h2>{`${searchParams.reviewStatus === "reviewed" ? "Reviewed" : "Pending"} Confessions (${confessions.length})`}</h2>
        
        <div className="profile-container" ref={menuRef}>
          <button className="profile-button" onClick={toggleMenu}>
            <img
              src={currentUser?.profileImageUrl}
              alt="Profile"
              className="moderator-icon"
            />
          </button>

          {openProfile && (
            <div className="profile-menu">
              <p>{currentUser?.username}</p>
              <button onClick={logout}>Logout</button>
            </div>
          )}
        </div>

      </div>
      <div className="confession-container">
        <div className="outer-filter-container">
          <div className="filter-container">
            <div className="search-bar">
              <input type="text" placeholder="Search confessions..." onChange={(e) => setSearchParams({...searchParams, content: e.target.value})} />
            </div>
            <div className="filter-options">
              <select onChange={(e) => setSearchParams({...searchParams, category: e.target.value})}>
                <option value="">All Categories</option>
                {
                  categories.map(cat => (
                    <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                  ))
                }
              </select>
            </div>
            <div className="NSFW-toggle">
              <label>
                <input type="checkbox" onChange={(e) => setSearchParams({...searchParams, isNSFW: e.target.checked})} />
                NSFW
              </label>
            </div>
            <div className="sort-options">
              <p>Sort by:</p>
              <select onChange={(e) => setSearchParams({...searchParams, orderBy: e.target.value as "createdAt" | "title"})}>
                <option value="createdAt">Newest</option>
                <option value="title">Title</option>
              </select>
            </div>
          </div>
        </div>
        <div className="confession-grid">
          {confessions.map(c => (
            <div key={c.id} className="confession-item">
              <ConfessionCard confession={c} />

              {searchParams.reviewStatus === "reviewed" && (
                <div className="action-buttons">
                  <span className={`status ${c.isApproved ? "approved" : "rejected"}`}>
                    {c.isApproved ? "Approved" : "Rejected"}
                  </span>
                  <button onClick={() => handleAction(c.id!, "rereview")}>
                    Review again
                  </button>
                </div>
                )
              }
              
              {searchParams.reviewStatus === "pending" && (
              <div className="action-buttons">
                <button onClick={() => handleAction(c.id!, "reject")} className="reject">
                  Reject
                </button>
                <button onClick={() => handleAction(c.id!, "approve")} className="approve">
                  Approve
                </button>
              </div>
              )

              }
          </div>
          ))}
        </div>
        </div>
      </div>
  );
}