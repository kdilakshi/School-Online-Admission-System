// Home page component (landing) — uses shadcn UI primitives
// Purpose: simple, clear entry point for visitors and links to core flows.
// Keep this file focused on layout and content; behavior lives in small components.
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Exports the default page component used by Next.js route wrapper.
export default function HomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#ffffff_0%,#f8fafc_42%,#eef2ff_100%)] px-4 py-12 text-[#1f2937] md:px-8">
      <section className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
      

        <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-primary md:text-6xl">
          Welcome to the School Online Admission System
        </h1>

        <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">
          Welcome to the School Online Admission System — a simple and convenient platform for students and parents
          to apply for school admissions online.
        </p>

        <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">
          This system allows users to submit applications, upload required documents, and check admission details
          easily from anywhere. It helps schools manage student applications efficiently while saving time and
          reducing paperwork.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild className="rounded-full px-6 py-6 text-base">
            <Link href="/admission">Apply Now</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full border-primary/20 bg-white px-6 py-6 text-base text-primary hover:bg-slate-50">
            <Link href="/dashboard">Admin Dashboard</Link>
          </Button>
        </div>

        {/* Feature cards: brief highlights users care about */}
        <div className="mt-12 grid w-full gap-4 md:grid-cols-3">
          {[
            { title: "Apply Online", description: "Submit student admission details from home or on the go." },
            { title: "Upload Documents", description: "Attach photos and supporting documents with the application." },
            { title: "Track Admission", description: "Review status updates and manage submitted forms easily." },
          ].map((item) => (
            <Card key={item.title} className="border-slate-200 bg-white text-left shadow-[0_18px_60px_rgba(30,58,138,0.08)]">
              <CardContent className="p-6">
                <p className="text-lg font-semibold text-primary">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
