import { LoginForm } from "./LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;

  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-slate-50">
      <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-lg font-semibold text-slate-900">Wholesale Ops</h1>
        <p className="mb-6 text-sm text-slate-500">Your Products B.V. — order management</p>
        <LoginForm redirectTo={redirect ?? "/"} />
      </div>
    </div>
  );
}
