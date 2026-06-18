"use client";

import { useState } from "react";
import { createFamily } from "@/modules/family/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Loader2 } from "lucide-react";

export function CreateFamilyForm() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setLoading(true);
    setError("");
    
    try {
      await createFamily(name);
      window.location.href = "/family/transactions";
    } catch (err: any) {
      setError(err.message || "Failed to create family");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-card border border-border rounded-xl shadow-sm">
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
          <Users className="w-8 h-8" />
        </div>
      </div>
      
      <h2 className="text-xl font-bold text-center mb-2">Create a Family Ledger</h2>
      <p className="text-muted-foreground text-center text-sm mb-6">
        Share transactions and reports with your family members in real-time.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md">
            {error}
          </div>
        )}
        
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">Family Name</label>
          <Input 
            id="name"
            placeholder="e.g. The Smiths" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={loading || !name.trim()}>
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          Create Family
        </Button>
      </form>
    </div>
  );
}
