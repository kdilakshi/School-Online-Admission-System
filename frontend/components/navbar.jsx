// Top navigation bar used across the app.
// - Uses shadcn `Button` primitives for consistent styling.
// - Keeps accessible attributes (`aria-label`, `aria-current`) for screen readers.
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
	{ href: "/", label: "Home" },
	{ href: "/admission", label: "Admission Form" },
	{ href: "/dashboard", label: "Admin Dashboard" },
];

export default function Navbar() {
	const pathname = usePathname();

	return (
		<header className="sticky top-0 z-50 border-b border-white/10 bg-primary/95 text-primary-foreground backdrop-blur">
			<div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-8">
				<Link href="/" className="group flex items-center gap-3" aria-label="School Home">
					<div className="relative h-11 w-11 overflow-hidden rounded-2xl bg-white shadow-lg shadow-black/10 transition-transform group-hover:scale-105">
						<Image src="/school-logo.svg" alt="School logo" fill priority className="object-cover" />
					</div>
					<div>
						<p className="text-sm font-semibold uppercase tracking-[0.18em] text-white">School Admission</p>
						<p className="text-xs text-white/75">Student form and admin monitoring</p>
					</div>
				</Link>

				<nav className="flex flex-wrap items-center gap-2" role="navigation" aria-label="Primary Navigation">
					{NAV_ITEMS.map((item) => {
						const active = pathname === item.href;

						return (
							<Button
								key={item.href}
								asChild
								variant={active ? "secondary" : "outline"}
								className={active ? "rounded-full bg-white text-primary" : "rounded-full border-white/20 bg-transparent text-white hover:bg-white/10"}
							>
								<Link href={item.href} aria-current={active ? "page" : undefined}>{item.label}</Link>
							</Button>
						);
					})}
				</nav>
			</div>
		</header>
	);
}
