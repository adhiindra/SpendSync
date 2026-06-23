import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { FlowSyncLogo } from "@/components/ui/flow-sync-logo";
import { OrbBackground } from "@/components/ui/orb-background";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, Wallet, Users, LineChart, Shield, Smartphone, CreditCard, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function RootPage() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="relative flex flex-col min-h-screen bg-background overflow-x-hidden">
      {/* Orb Background works best fixed behind everything */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <OrbBackground />
      </div>
      
      {/* Navbar / Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full bg-background/50 backdrop-blur-md border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 text-primary">
            <FlowSyncLogo />
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground">FlowSync</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className={buttonVariants({ variant: "ghost" })}>
            Log in
          </Link>
          <Link href="/register" className={buttonVariants({ variant: "default" })}>
            Sign up
          </Link>
        </div>
      </header>

      <main className="flex-1 z-10 w-full flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full flex flex-col items-center justify-center min-h-[90vh] px-4 pt-20 text-center">
          <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 zoom-in-95">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 border border-primary/20">
              <Sparkles className="w-4 h-4" />
              <span>Your financial companion</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance text-foreground leading-tight">
              Track your finances with <span className="text-gradient">FlowSync</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              A seamless, app-like experience to manage your monthly income, track expenses, and collaborate with your family in real-time.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Link 
                href="/register" 
                className={cn(buttonVariants({ variant: "default", size: "lg" }), "w-full sm:w-auto gap-2 rounded-full px-8 h-12 text-md")}
              >
                Get Started for Free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                href="/login" 
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full sm:w-auto rounded-full px-8 h-12 text-md bg-background/50 backdrop-blur-md")}
              >
                Sign in to your account
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="w-full max-w-7xl mx-auto px-6 py-24 border-t border-border/50 bg-background/40 backdrop-blur-xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">Everything you need</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Powerful tools designed to give you complete visibility and control over your financial life.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-card/50 backdrop-blur-sm border border-border hover:bg-card/80 transition-colors shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary border border-primary/20">
                <Wallet className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Income & Expenses</h3>
              <p className="text-muted-foreground leading-relaxed">Log your financial transactions effortlessly. Track where your money goes with detailed categories, dates, and personalized notes.</p>
            </div>
            <div className="p-8 rounded-3xl bg-card/50 backdrop-blur-sm border border-border hover:bg-card/80 transition-colors shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary border border-primary/20">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Family Ledgers</h3>
              <p className="text-muted-foreground leading-relaxed">Invite family members to view or edit shared ledgers. Role-based access control keeps you in charge while collaborating in real-time.</p>
            </div>
            <div className="p-8 rounded-3xl bg-card/50 backdrop-blur-sm border border-border hover:bg-card/80 transition-colors shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary border border-primary/20">
                <LineChart className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Detailed Reports</h3>
              <p className="text-muted-foreground leading-relaxed">Visualize your financial health month-to-month. Generate clean PDF reports for external record-keeping or simple peace of mind.</p>
            </div>
            <div className="p-8 rounded-3xl bg-card/50 backdrop-blur-sm border border-border hover:bg-card/80 transition-colors shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary border border-primary/20">
                <CreditCard className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Installment Tracking</h3>
              <p className="text-muted-foreground leading-relaxed">Stay on top of long-term payments. Automatically generate schedules for loans or electronics and mark off months as you pay.</p>
            </div>
            <div className="p-8 rounded-3xl bg-card/50 backdrop-blur-sm border border-border hover:bg-card/80 transition-colors shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary border border-primary/20">
                <Smartphone className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Access Anywhere</h3>
              <p className="text-muted-foreground leading-relaxed">FlowSync is beautifully optimized for any device. Enjoy a seamless, fast experience whether you're on your phone, tablet, or desktop.</p>
            </div>
            <div className="p-8 rounded-3xl bg-card/50 backdrop-blur-sm border border-border hover:bg-card/80 transition-colors shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary border border-primary/20">
                <Shield className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Secure & Private</h3>
              <p className="text-muted-foreground leading-relaxed">Your data is secured with modern encryption. Manage your finances confidently knowing your information is safe.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full max-w-5xl mx-auto px-6 py-32 text-center">
          <div className="p-12 md:p-16 rounded-[3rem] bg-gradient-to-b from-primary/10 to-background border border-primary/20 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="relative z-10 space-y-6">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
                Ready to take control?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto pb-6">
                Join FlowSync today and start tracking your path to financial freedom.
              </p>
              <Link 
                href="/register" 
                className={cn(buttonVariants({ variant: "default", size: "lg" }), "gap-2 rounded-full px-10 h-14 text-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow")}
              >
                Create your free account <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t border-border/50 bg-background/80 backdrop-blur-md z-10">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FlowSyncLogo className="w-6 h-6 text-primary" />
            <span className="font-semibold text-foreground">FlowSync</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} FlowSync. All rights reserved. Built for you and your family.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
