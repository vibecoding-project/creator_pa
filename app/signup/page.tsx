import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Create an account — Creator Sponsorship Hub",
  description: "Create your creator sponsorship studio account.",
};

export default function SignupPage() {
  return (
    <AuthCard
      title="Create your account"
      subtitle="Vet brand deals, run your pipeline, and keep the books straight."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="text-foreground underline-offset-4 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthCard>
  );
}
