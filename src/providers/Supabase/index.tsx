import { AuthProvider } from "./AuthProvider";

export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
