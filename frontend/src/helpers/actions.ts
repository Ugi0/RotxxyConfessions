export function logout() {
  fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  }).catch((error) => {
    console.error("Logout failed", error);
  });

  localStorage.removeItem("sessionId");
  window.location.href = "/login";
}