import { redirect } from "next/navigation";
// import { getSession } from "@/lib/auth";
// import UseRouter from "@/hooks/UseRouter";

export default async function Page() {
  // const session = await getSession();
  // redirect(session ? "/dashboard" : "/auth/login");
  // UseRouter('/auth/login')
  redirect('/auth/login');
}
