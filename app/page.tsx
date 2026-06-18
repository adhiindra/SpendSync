import { redirect } from "next/navigation";

export default function RootPage() {
  // Even though middleware intercepts this, we provide a fallback redirect
  // to ensure Next.js has a valid root page component.
  redirect("/dashboard");
}
