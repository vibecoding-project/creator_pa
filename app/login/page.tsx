import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in — Creator Sponsorship Hub",
  description: "Sign in to your creator sponsorship studio.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;

  return (
    <AuthCard
      title="Sign in to your studio"
      subtitle="Vet brand deals, run your pipeline, and keep the books straight."
      footer={
        <>
          New here?{" "}
          <Link href="/signup" className="text-foreground underline-offset-4 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <LoginForm next={next ?? "/"} callbackError={error} />
    </AuthCard>
  );
}
