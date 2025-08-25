import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export default async function AuthLayout({ children }: {
    children: React.ReactNode
}) {
    const session = await getSession();
    console.log('session in login layout', session)
    if (session) {
        redirect("/dashboard");
    }
    return children;
}
