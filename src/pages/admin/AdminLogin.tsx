import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ADMIN_CREDENTIALS } from "@/data/admin";

const CRED_KEY = "freshmart-admin-credentials";

const getStoredCredentials = () => {
  const raw = localStorage.getItem(CRED_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.username && parsed?.password) return parsed;
  } catch {
    return null;
  }
  return null;
};

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [resetUser, setResetUser] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetMsg, setResetMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Enter username and password");
      return;
    }

    const stored = getStoredCredentials();
    const effective = stored || ADMIN_CREDENTIALS;

    if (username === effective.username && password === effective.password) {
      try {
        localStorage.setItem("freshmart-admin", JSON.stringify({ username, ts: Date.now() }));
      } catch {
        setError("Unable to save session. Please clear storage and try again.");
        return;
      }
      navigate("/admin/dashboard");
      return;
    }

    setError("Invalid credentials");
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setResetMsg("");
    if (!resetUser || !resetCode || !newPassword) {
      setResetMsg("Fill all reset fields");
      return;
    }
    if (resetCode !== ADMIN_CREDENTIALS.resetCode) {
      setResetMsg("Invalid reset code");
      return;
    }
    try {
      localStorage.setItem(CRED_KEY, JSON.stringify({ username: resetUser, password: newPassword }));
    } catch {
      setResetMsg("Unable to save new password. Please clear storage and try again.");
      return;
    }
    setResetMsg("Password updated. You can sign in now.");
    setShowReset(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-emerald-50">
      <div className="card w-full max-w-md p-6">
        <h1 className="text-2xl font-heading font-bold text-ink-900">Admin Login</h1>
        <p className="text-sm text-ink-700 mt-1">Sign in to manage products and orders.</p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p className="text-sm text-rose-500">{error}</p>}
          <Button className="w-full" type="submit">Sign In</Button>
        </form>
        <button
          className="mt-3 text-sm text-brand-700"
          type="button"
          onClick={() => setShowReset((v) => !v)}
        >
          Forgot password?
        </button>

        {showReset && (
          <form className="mt-4 space-y-3" onSubmit={handleReset}>
            <Input placeholder="Username" value={resetUser} onChange={(e) => setResetUser(e.target.value)} />
            <Input placeholder="Reset Code" value={resetCode} onChange={(e) => setResetCode(e.target.value)} />
            <Input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            {resetMsg && <p className="text-xs text-ink-700">{resetMsg}</p>}
            <Button variant="outline" className="w-full" type="submit">Reset Password</Button>
          </form>
        )}
      </div>
    </main>
  );
};

export default AdminLogin;
