"use client";

import { useUser } from "@auth0/nextjs-auth0/client";

export default function AuthButton() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <button className="btn btn-primary loading">Loading...</button>;
  }

  return user ? (
    <div>
      <a href="/api/auth/logout" className="btn btn-primary">
        Sign Out
      </a>
      <a href="/select-role" className="btn btn-primary">
        Dashboard
      </a>
    </div>
  ) : (
    <a href="/select-role" className="btn btn-primary">
      Sign In
    </a>
  );
}
