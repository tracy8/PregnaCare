import { useState } from "react";
import { useAuth } from "../lib/auth";

export default function ResetPassword() {
  const { updatePassword } = useAuth();
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    if (pw.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setBusy(true);
    const { error } = await updatePassword(pw);
    setBusy(false);
    if (error) setError(error);
    // on success, recovery clears and you land in the app automatically
  };

  return (
    <div className="grid min-h-screen place-items-center bg-canvas px-5">
      <div className="w-full max-w-sm rounded-2xl border border-stone-200 bg-white p-7 shadow-sm">
        <h1 className="font-display text-2xl font-semibold text-stone-900">Set a new password</h1>
        <p className="mt-1 text-sm text-stone-500">Enter a new password for your account.</p>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="New password"
          autoComplete="new-password"
          className="mt-5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <button
          onClick={submit}
          disabled={busy}
          className="mt-5 w-full rounded-lg bg-primary py-3 font-medium text-white transition hover:bg-primary-dark disabled:opacity-60"
        >
          {busy ? "Please wait…" : "Update password"}
        </button>
      </div>
    </div>
  );
}