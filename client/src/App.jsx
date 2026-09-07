import { useEffect, useState } from "react";
import { getSession, logout } from "./lib/api";
import { Welcome } from "./pages/Welcome";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { RoleDashboard } from "./pages/RoleDashboard";
import { Profiles } from "./pages/Profiles";

export default function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [session, setSession] = useState(null);

  useEffect(() => {
    getSession().then((result) => {
      setSession(result);
      if (result) setPath(result.role === "patient" ? "/profiles" : `/dashboard/${result.role}`);
    }).catch(() => setSession(null));
  }, []);

  const go = (next) => {
    window.history.pushState({}, "", next);
    setPath(new URL(next, window.location.origin).pathname);
    window.scrollTo(0, 0);
  };

  const signOut = async () => {
    await logout();
    setSession(null);
    go("/");
  };

  if (path === "/login") {
    return <Login go={go} onAuthenticated={setSession} />;
  }

  if (path === "/register") {
    return <Register session={session} go={go} onAuthenticated={setSession} />;
  }

  if (path === "/profiles") {
    return <Profiles session={session} go={go} onSelected={setSession} signOut={signOut} />;
  }

  if (path.startsWith("/dashboard")) {
    return (
      <RoleDashboard
        session={session}
        go={go}
        signOut={signOut}
      />
    );
  }

  return <Welcome go={go} />;
}