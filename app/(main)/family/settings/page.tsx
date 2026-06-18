import { getFamilyDetails } from "@/modules/family/actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CreateFamilyForm } from "@/components/family/create-family-form";
import { FamilySettingsPanel } from "@/components/family/family-settings";

export default async function FamilySettingsPage() {
  const session = await getServerSession(authOptions);
  const family = await getFamilyDetails();

  if (!family) {
    return <CreateFamilyForm />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Settings for {family.name}</h2>
        <span className="text-sm text-muted-foreground">
          Created on {new Date(family.createdAt).toLocaleDateString()}
        </span>
      </div>
      
      <FamilySettingsPanel family={family} currentUserId={session?.user?.id || ""} />
    </div>
  );
}
