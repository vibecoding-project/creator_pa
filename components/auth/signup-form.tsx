"use client";

import { useActionState, useTransition } from "react";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  signup,
  signInWithOAuth,
  type SignupFormState,
} from "@/app/actions/auth";
import { GitHubIcon, GoogleIcon } from "@/components/auth/provider-icons";

const EMPTY_STATE: SignupFormState = {};

export function SignupForm() {
  const [state, formAction, pending] = useActionState(signup, EMPTY_STATE);
  const [oauthPending, startOAuthTransition] = useTransition();

  const startOAuth = (provider: "github" | "google") =>
    startOAuthTransition(() => {
      void signInWithOAuth(provider);
    });

  const busy = pending || oauthPending;

  if (state.ok) {
    return (
      <div className="grid justify-items-center gap-3 py-4 text-center">
        <MailCheck className="size-8 text-accent-primary" />
        <div className="space-y-1">
          <p className="text-sm font-semibold tracking-tight">
            Check your email for a verification link
          </p>
          <p className="text-[13px] text-muted-foreground">
            We sent you a confirmation email. Click the link to activate your
            account, then sign in.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-2">
        <Button
          variant="default"
          className="w-full"
          onClick={() => startOAuth("github")}
          disabled={busy}
        >
          <GitHubIcon className="size-4" />
          Sign up with GitHub
        </Button>
        <Button
          variant="default"
          className="w-full"
          onClick={() => startOAuth("google")}
          disabled={busy}
        >
          <GoogleIcon className="size-4" />
          Sign up with Google
        </Button>
      </div>

      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-[11px] tracking-wider text-muted-foreground uppercase">
          or
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <form action={formAction} className="grid gap-3.5">
        <div className="grid gap-1.5">
          <Label htmlFor="signup-name">Full name</Label>
          <Input
            id="signup-name"
            name="full_name"
            type="text"
            autoComplete="name"
            placeholder="Alex Rivera"
            required
          />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="signup-email">Email</Label>
          <Input
            id="signup-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="signup-password">Password</Label>
          <Input
            id="signup-password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 6 characters"
            minLength={6}
            required
          />
        </div>

        {state.error && <p className="text-[13px] text-destructive">{state.error}</p>}

        <Button
          type="submit"
          variant="accent"
          className="mt-1 w-full"
          disabled={busy}
        >
          {pending ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </>
  );
}
