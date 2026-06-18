"use client";

import { useState } from "react";
import { inviteMember, removeMember, updateMemberAccess } from "@/modules/family/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, MailPlus, Trash2, UserCog, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";

type FamilyProps = {
  family: any;
  currentUserId: string;
}

export function FamilySettingsPanel({ family, currentUserId }: FamilyProps) {
  const [email, setEmail] = useState("");
  const [access, setAccess] = useState<"VIEW_ONLY" | "VIEW_EDIT">("VIEW_ONLY");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const currentUserMember = family.members.find((m: any) => m.userId === currentUserId);
  const isOrganizer = currentUserMember?.role === "ORGANIZER";

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !isOrganizer) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await inviteMember(family.id, email, access);
      setSuccess(`Invitation sent to ${email}`);
      setEmail("");
    } catch (err: any) {
      setError(err.message || "Failed to send invite");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (memberId: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await removeMember(family.id, memberId);
      if (memberId === currentUserId) {
        window.location.href = "/family";
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdateAccess = async (memberId: string, newAccess: string) => {
    try {
      await updateMemberAccess(family.id, memberId, newAccess as "VIEW_ONLY" | "VIEW_EDIT");
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-8">
      {/* Members List */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Family Members</h3>

        <div className="space-y-4">
          {family.members.map((member: any) => (
            <div key={member.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <UserCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{member.user.name || "Unknown User"} {member.userId === currentUserId ? "(You)" : ""}</p>
                  <p className="text-xs text-muted-foreground">{member.user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs font-semibold px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full">
                    {member.role}
                  </span>
                  {isOrganizer && member.userId !== currentUserId ? (
                    <Select value={member.access} onValueChange={(v) => handleUpdateAccess(member.userId, v)}>
                      <SelectTrigger className="h-7 text-xs w-[110px]">
                        <SelectValue>{member.access === "VIEW_EDIT" ? "View & Edit" : "View Only"}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="VIEW_ONLY">View Only</SelectItem>
                        <SelectItem value="VIEW_EDIT">View & Edit</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className="text-xs text-muted-foreground">{member.access === "VIEW_EDIT" ? "Can Edit" : "View Only"}</span>
                  )}
                </div>

                {(isOrganizer && member.userId !== currentUserId) || member.userId === currentUserId ? (
                  <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleRemove(member.userId)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invitations */}
      {isOrganizer && (
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <UserCog className="w-5 h-5" />
            Invite a Member
          </h3>

          <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-3 items-start">
            <div className="flex-1 space-y-2 w-full">
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="w-full sm:w-auto">
              <Select value={access} onValueChange={(v: any) => setAccess(v)} disabled={loading} >
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue>{access === "VIEW_EDIT" ? "View & Edit" : "View Only"}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VIEW_ONLY">View Only</SelectItem>
                  <SelectItem value="VIEW_EDIT">View & Edit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={loading || !email.trim()} className="w-full sm:w-auto">
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <MailPlus className="w-4 h-4 mr-2" />}
              Send Invite
            </Button>
          </form>

          {error && <p className="text-sm text-destructive mt-3">{error}</p>}
          {success && <p className="text-sm text-green-600 mt-3">{success}</p>}

          {family.invitations.length > 0 && (
            <div className="mt-6 border-t pt-4">
              <h4 className="text-sm font-semibold mb-3">Pending Invitations</h4>
              <div className="space-y-2">
                {family.invitations.map((inv: any) => (
                  <div key={inv.id} className="flex items-center justify-between text-sm p-2 bg-muted rounded-md">
                    <span className="text-muted-foreground">{inv.email}</span>
                    <span className="text-xs font-medium px-2 py-1 bg-background rounded-md border">{inv.access}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
