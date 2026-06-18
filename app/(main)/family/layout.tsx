import { getFamilyDetails } from "@/modules/family/actions";
import { FamilyNavigation } from "./navigation";

export default async function FamilyLayout({ children }: { children: React.ReactNode }) {
  const family = await getFamilyDetails();

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Family</h1>
        <p className="text-muted-foreground">Manage your shared family ledger and members.</p>
      </div>
      
      <FamilyNavigation hasFamily={!!family} />
      
      <div className="py-2">
        {children}
      </div>
    </div>
  );
}
