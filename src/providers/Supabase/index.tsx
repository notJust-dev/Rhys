import { AuthProvider } from "./AuthProvider";

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
