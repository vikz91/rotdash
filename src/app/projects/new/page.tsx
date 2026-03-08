import Link from "next/link";
import CreateProjectWizard from "@/components/project/CreateProjectWizard";

export default function NewProjectPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            ← RotDash
          </Link>
          <h1 className="text-lg font-semibold">New project</h1>
          <span className="w-16" aria-hidden />
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-10">
        <CreateProjectWizard />
      </main>
    </div>
  );
}
