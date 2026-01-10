import React, { FC, useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { useAuth } from "@/features/partner/auth/AuthContext";
import { useLeadService } from "../services/leadService";
import { Lead } from "../types";
import { Button } from "@/components/ui/button";
import { RefreshCw, Phone, Calendar, Home, User, Clock, Info, ChevronDown, ChevronUp } from "lucide-react";
import WebLayout from "@/components/layout/WebLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export const LeadsDashboard: FC = () => {
  const { logout: authLogout } = useAuth();
  const { getLeads } = useLeadService();
  const { toast } = useToast();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [expandedLeads, setExpandedLeads] = useState<Set<string>>(new Set());

  const toggleLeadExpanded = (leadKey: string) => {
    setExpandedLeads(prev => {
      const newSet = new Set(prev);
      if (newSet.has(leadKey)) {
        newSet.delete(leadKey);
      } else {
        newSet.add(leadKey);
      }
      return newSet;
    });
  };

  const formatMetadataKey = (key: string) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace(/_/g, ' ');
  };

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedLeads = await getLeads();
      setLeads(fetchedLeads);
      setLastRefreshed(new Date());
      toast({
        description: `Loaded ${fetchedLeads.length} leads`,
        variant: "default",
      });
    } catch (error: any) {
      toast({
        description: error.message || "Failed to fetch leads",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [getLeads, toast]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleLogout = useCallback(() => {
    authLogout();
    toast({
      description: "You have been logged out.",
      variant: "default",
    });
  }, [authLogout, toast]);

  const formatPhoneNumber = (phone: string) => {
    if (phone.length === 10) {
      return `${phone.slice(0, 5)} ${phone.slice(5)}`;
    }
    return phone;
  };

  return (
    <WebLayout>
      <div className="mx-auto w-full max-w-6xl flex-grow p-6">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-primary">Lead Tracking</h2>
            <p className="text-muted-foreground">
              Monitor and manage incoming leads
            </p>
          </div>
          <div className="flex items-center gap-4">
            {lastRefreshed && (
              <span className="text-sm text-muted-foreground">
                Last updated: {format(lastRefreshed, "h:mm:ss a")}
              </span>
            )}
            <Button
              onClick={fetchLeads}
              disabled={isLoading}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-3">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Leads</p>
                <p className="text-2xl font-bold text-foreground">{leads.length}</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-accent/10 p-3">
                <Calendar className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Today's Leads</p>
                <p className="text-2xl font-bold text-foreground">
                  {leads.filter(l => {
                    const today = new Date().toDateString();
                    return new Date(l.createdAt).toDateString() === today;
                  }).length}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-secondary/50 p-3">
                <Home className="h-6 w-6 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Most Common Size</p>
                <p className="text-2xl font-bold text-foreground">
                  {leads.length > 0
                    ? Object.entries(
                        leads.reduce((acc, l) => {
                          acc[l.moveDetails.moveSize] = (acc[l.moveDetails.moveSize] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      ).sort((a, b) => b[1] - a[1])[0]?.[0] || "-"
                    : "-"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="rounded-lg border bg-card shadow-sm">
          <div className="border-b px-6 py-4">
            <h3 className="text-lg font-semibold text-foreground">All Leads</h3>
          </div>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-10">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-r-transparent" />
              <p className="mt-4 text-lg font-medium text-muted-foreground">Loading leads...</p>
            </div>
          ) : leads.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground">
              No leads found. Check back later!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8"></TableHead>
                    <TableHead>Lead ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Move Size</TableHead>
                    <TableHead>Move Date</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => (
                    <Collapsible key={lead.leadKey} open={expandedLeads.has(lead.leadKey)} onOpenChange={() => toggleLeadExpanded(lead.leadKey)} asChild>
                      <>
                        <TableRow className="cursor-pointer" onClick={() => toggleLeadExpanded(lead.leadKey)}>
                          <TableCell className="w-8">
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                {expandedLeads.has(lead.leadKey) ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                            </CollapsibleTrigger>
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {lead.leadKey}
                          </TableCell>
                          <TableCell className="font-medium">
                            {lead.name}
                          </TableCell>
                          <TableCell>
                            <a
                              href={`tel:${lead.phoneNumber}`}
                              className="flex items-center gap-2 text-primary hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Phone className="h-4 w-4" />
                              {formatPhoneNumber(lead.phoneNumber)}
                            </a>
                          </TableCell>
                          <TableCell>
                            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                              <Home className="h-3 w-3" />
                              {lead.moveDetails.moveSize}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              {format(new Date(lead.moveDetails.desiredMoveOutDate), "MMM d, yyyy")}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              {format(new Date(lead.createdAt), "MMM d, yyyy h:mm a")}
                            </span>
                          </TableCell>
                        </TableRow>
                        <CollapsibleContent asChild>
                          <tr className="bg-muted/30">
                            <td colSpan={7} className="p-4">
                              <div className="flex items-start gap-2">
                                <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-sm font-medium text-foreground mb-2">Metadata</p>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                    {Object.entries(lead.metadata).map(([key, value]) => (
                                      <div key={key} className="flex flex-col rounded-md bg-background p-2 border">
                                        <span className="text-xs text-muted-foreground">{formatMetadataKey(key)}</span>
                                        <span className="text-sm font-medium text-foreground break-all">{value}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        </CollapsibleContent>
                      </>
                    </Collapsible>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </WebLayout>
  );
};
