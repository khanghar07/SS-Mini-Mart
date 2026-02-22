import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const AdminAccount = () => {
  const { updateCredentials, loading, error, currentUsername } = useAdminAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newUsername, setNewUsername] = useState(currentUsername ?? "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword.trim() || !newUsername.trim() || !newPassword.trim()) {
      alert("Please fill all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    const ok = await updateCredentials(currentPassword.trim(), newUsername.trim(), newPassword);
    if (ok) {
      alert("Credentials updated.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      alert(error || "Update failed");
    }
  };

  return (
    <AdminLayout>
      <div className="card p-6 max-w-xl">
        <h2 className="text-lg font-semibold text-ink-900">Admin Account</h2>
        <p className="text-sm text-ink-700 mt-1">Update your admin username and password.</p>
        <form className="mt-6 space-y-4" onSubmit={handleUpdate}>
          <Input
            placeholder="Current password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <Input
            placeholder="New username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />
          <Input
            placeholder="New password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Input
            placeholder="Confirm new password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Credentials"}
          </Button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminAccount;
