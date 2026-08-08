"use client";

import { useActionState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, signInWithOAuth, type AuthFormState } from "@/app/actions/auth";
import { GitHubIcon, GoogleIcon } from "@/components/auth/provider-icons";

const EMPTY_STATE: AuthFormState = {};

export function LoginForm({
  next,
  callbackError,
}: {
  next: string;
  callbackError?: string;
}) {
  const [state, formAction, pending] = useActionState(login, EMPTY_STATE);
  const [oauthPending, startOAuthTransition] = useTransition();

  const startOAuth = (provider: "github" | "google") =>
    startOAuthTransition(() => {
      void signInWithOAuth(provider);
    });

  const busy = pending || oauthPending;

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
          Continue with GitHub
        </Button>
        <Button
          variant="default"
          className="w-full"
          onClick={() => startOAuth("google")}
          disabled={busy}
        >
          <GoogleIcon className="size-4" />
          Continue with Google
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
        <input type="hidden" name="next" value={next} />

        <div className="grid gap-1.5">
          <Label htmlFor="login-email">Email</Label>
          <Input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="login-password">Password</Label>
          <Input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            required
          />
        </div>

        {callbackError && (
          <p className="text-[13px] text-destructive">{callbackError}</p>
        )}
        {state.error && <p className="text-[13px] text-destructive">{state.error}</p>}

        <Button
          type="submit"
          variant="accent"
          className="mt-1 w-full"
          disabled={busy}
        >
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </>
  );
}
