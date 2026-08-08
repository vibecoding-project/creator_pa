import { BrandMark } from "@/components/brand-mark";

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-10 text-foreground">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center justify-center gap-2.5">
          <BrandMark />
          <div className="text-left">
            <p className="text-[13px] font-semibold tracking-tight">
              Creator Sponsorship Hub
            </p>
            <p className="text-[10px] text-muted-foreground">
              studio · creator assistant
            </p>
          </div>
        </div>

        <div className="rounded-none border border-border bg-card p-6">
          <div className="mb-5">
            <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
            <p className="mt-1 text-[13px] text-muted-foreground">{subtitle}</p>
          </div>
          {children}
        </div>

        <div className="mt-4 text-center text-[13px] text-muted-foreground">
          {footer}
        </div>
      </div>
    </div>
  );
}
