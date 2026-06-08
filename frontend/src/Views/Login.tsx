
import "./Login.css";

export default function Login() {
  const handleTwitchLogin = () => {
    window.location.href = "/api/auth/login";
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login with Twitch</h2>

        <button className="twitch-button" onClick={handleTwitchLogin}>
          <img id="twitch-logo" src="https://dev.twitch.tv/docs/assets/favicon.ico" alt="Twitch Logo" />
          Connect with Twitch
        </button>
      </div>
    </div>
  );
}

