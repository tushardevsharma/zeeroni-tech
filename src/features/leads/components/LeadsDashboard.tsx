import React, { FC, useState, useEffect, useCallback, useMemo } from "react";
import { format } from "date-fns";
import { useAuth } from "@/features/partner/auth/AuthContext";
import { useLeadService } from "../services/leadService";
import { Lead } from "../types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RefreshCw, Phone, Calendar, Home, User, Clock, Info, ChevronDown, ChevronUp, Download, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
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

type SortField = "moveDate" | "createdAt" | null;
type SortDirection = "asc" | "desc";

export const LeadsDashboard: FC = () => {
  const { logout: authLogout } = useAuth();
  const { getLeads } = useLeadService();
  const { toast } = useToast();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [expandedLeads, setExpandedLeads] = useState<Set<string>>(new Set());
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

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

  const toggleLeadSelected = (leadKey: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedLeads(prev => {
      const newSet = new Set(prev);
      if (newSet.has(leadKey)) {
        newSet.delete(leadKey);
      } else {
        newSet.add(leadKey);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedLeads.size === leads.length) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(new Set(leads.map(l => l.leadKey)));
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedLeads = useMemo(() => {
    if (!sortField) return leads;
    
    return [...leads].sort((a, b) => {
      let dateA: Date, dateB: Date;
      
      if (sortField === "moveDate") {
        dateA = new Date(a.moveDetails.desiredMoveOutDate);
        dateB = new Date(b.moveDetails.desiredMoveOutDate);
      } else {
        dateA = new Date(a.createdAt);
        dateB = new Date(b.createdAt);
      }
      
      const comparison = dateA.getTime() - dateB.getTime();
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [leads, sortField, sortDirection]);

  const formatMetadataKey = (key: string) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace(/_/g, ' ');
  };

  const downloadCSV = () => {
    const leadsToExport = selectedLeads.size > 0 
      ? sortedLeads.filter(l => selectedLeads.has(l.leadKey))
      : sortedLeads;

    if (leadsToExport.length === 0) {
      toast({
        description: "No leads to export",
        variant: "destructive",
      });
      return;
    }

    // Get all unique metadata keys
    const allMetadataKeys = new Set<string>();
    leadsToExport.forEach(lead => {
      Object.keys(lead.metadata).forEach(key => allMetadataKeys.add(key));
    });
    const metadataKeys = Array.from(allMetadataKeys).sort();

    // Build CSV headers
    const headers = [
      "Lead ID",
      "Name",
      "Phone",
      "Move Size",
      "Move Date",
      "Created At",
      ...metadataKeys.map(k => formatMetadataKey(k))
    ];

    // Build CSV rows
    const rows = leadsToExport.map(lead => [
      lead.leadKey,
      lead.name,
      lead.phoneNumber,
      lead.moveDetails.moveSize,
      lead.moveDetails.desiredMoveOutDate,
      format(new Date(lead.createdAt), "yyyy-MM-dd HH:mm:ss"),
      ...metadataKeys.map(k => lead.metadata[k] || "")
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    // Download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `leads_${format(new Date(), "yyyy-MM-dd_HH-mm")}.csv`;
    link.click();

    toast({
      description: `Exported ${leadsToExport.length} leads to CSV`,
    });
  };

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedLeads = await getLeads();
      setLeads(fetchedLeads);
      setLastRefreshed(new Date());
      setSelectedLeads(new Set()); // Clear selection on refresh
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

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 ml-1" />;
    }
    return sortDirection === "asc" 
      ? <ArrowUp className="h-4 w-4 ml-1" />
      : <ArrowDown className="h-4 w-4 ml-1" />;
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
          <div className="flex items-center gap-4 flex-wrap">
            {lastRefreshed && (
              <span className="text-sm text-muted-foreground">
                Last updated: {format(lastRefreshed, "h:mm:ss a")}
              </span>
            )}
            <Button
              onClick={downloadCSV}
              variant="outline"
              className="gap-2"
              disabled={leads.length === 0}
            >
              <Download className="h-4 w-4" />
              {selectedLeads.size > 0 ? `Export ${selectedLeads.size} Selected` : "Export All"}
            </Button>
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
          <div className="border-b px-6 py-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">All Leads</h3>
            {selectedLeads.size > 0 && (
              <span className="text-sm text-muted-foreground">
                {selectedLeads.size} of {leads.length} selected
              </span>
            )}
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
                    <TableHead className="w-10">
                      <Checkbox
                        checked={selectedLeads.size === leads.length && leads.length > 0}
                        onCheckedChange={toggleSelectAll}
                        aria-label="Select all"
                      />
                    </TableHead>
                    <TableHead className="w-8"></TableHead>
                    <TableHead>Lead ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Move Size</TableHead>
                    <TableHead 
                      className="cursor-pointer select-none hover:bg-muted/50"
                      onClick={() => handleSort("moveDate")}
                    >
                      <span className="flex items-center">
                        Move Date
                        <SortIcon field="moveDate" />
                      </span>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer select-none hover:bg-muted/50"
                      onClick={() => handleSort("createdAt")}
                    >
                      <span className="flex items-center">
                        Created
                        <SortIcon field="createdAt" />
                      </span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedLeads.map((lead) => (
                    <Collapsible key={lead.leadKey} open={expandedLeads.has(lead.leadKey)} onOpenChange={() => toggleLeadExpanded(lead.leadKey)} asChild>
                      <>
                        <TableRow className="cursor-pointer" onClick={() => toggleLeadExpanded(lead.leadKey)}>
                          <TableCell className="w-10" onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              checked={selectedLeads.has(lead.leadKey)}
                              onCheckedChange={() => {
                                setSelectedLeads(prev => {
                                  const newSet = new Set(prev);
                                  if (newSet.has(lead.leadKey)) {
                                    newSet.delete(lead.leadKey);
                                  } else {
                                    newSet.add(lead.leadKey);
                                  }
                                  return newSet;
                                });
                              }}
                              aria-label={`Select ${lead.name}`}
                            />
                          </TableCell>
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
                            <td colSpan={8} className="p-4">
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
