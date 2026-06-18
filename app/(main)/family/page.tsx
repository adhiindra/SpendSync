import { getFamilyDetails } from "@/modules/family/actions";
import { redirect } from "next/navigation";

export default async function FamilyPage() {
  const family = await getFamilyDetails();
  
  if (family) {
    redirect("/family/transactions");
  } else {
    redirect("/family/settings");
  }
}
