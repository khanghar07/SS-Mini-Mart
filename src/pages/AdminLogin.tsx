import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdminAuth } from "@/context/AdminAuthContext";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login, loading, error } = useAdminAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await login(username.trim(), password);
    if (ok) navigate("/admin");
    else alert(error || "Invalid credentials");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-emerald-50">
      <div className="card w-full max-w-md p-6">
        <h1 className="text-2xl font-heading font-bold text-ink-900">Admin Login</h1>
        <p className="text-sm text-ink-700 mt-1">Sign in to manage the store.</p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </main>
  );
};

export default AdminLogin;
