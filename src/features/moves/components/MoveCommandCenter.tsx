import React, { FC, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import { useMoveService } from "../services/moveService";
import { Move, MoveStatus } from "../types";
import WebLayout from "@/components/layout/WebLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Truck, Plus, Eye, Trash2, CalendarDays, Activity, CheckCircle2, XCircle, ArrowRight, LayoutDashboard,
} from "lucide-react";

const STATUS_CONFIG: Record<MoveStatus, { label: string; color: string }> = {
  lead_converted: { label: "Lead Converted", color: "bg-blue-500/10 text-blue-700 border-blue-200" },
  scheduled: { label: "Scheduled", color: "bg-amber-500/10 text-amber-700 border-amber-200" },
  in_progress: { label: "In Progress", color: "bg-primary/10 text-primary border-primary/20" },
  completed: { label: "Completed", color: "bg-green-500/10 text-green-700 border-green-200" },
  cancelled: { label: "Cancelled", color: "bg-destructive/10 text-destructive border-destructive/20" },
};

export const MoveCommandCenter: FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const moveService = useMoveService();
  const [moves, setMoves] = useState<Move[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newMoveDate, setNewMoveDate] = useState("");
  const [newLeadId, setNewLeadId] = useState("");
  const [newLeadName, setNewLeadName] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [creatingMove, setCreatingMove] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchMoves = async () => {
    setLoading(true);
    try {
      const data = await moveService.getMoves();
      setMoves(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoves();
  }, []);

  // Auto-open create dialog when coming from leads page
  useEffect(() => {
    const leadId = searchParams.get("leadId");
    const leadName = searchParams.get("leadName");
    if (leadId) {
      setNewLeadId(leadId);
      setNewLeadName(leadName || "");
      setShowCreateDialog(true);
    }
  }, [searchParams]);

  const handleCreate = async () => {
    if (!newLeadId || !newMoveDate) {
      toast({ description: "Please fill all required fields", variant: "destructive" });
      return;
    }
    setCreatingMove(true);
    try {
      await moveService.createMove({ leadId: newLeadId, moveDate: newMoveDate, leadName: newLeadName });
      toast({ description: "Move created successfully!" });
      setShowCreateDialog(false);
      setNewMoveDate("");
      setNewLeadId("");
      setNewLeadName("");
      fetchMoves();
    } finally {
      setCreatingMove(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await moveService.deleteMove(id);
      toast({ description: "Move deleted" });
      fetchMoves();
    } finally {
      setDeletingId(null);
    }
  };

  const filteredMoves = filterStatus === "all" ? moves : moves.filter((m) => m.status === filterStatus);

  const stats = {
    total: moves.length,
    inProgress: moves.filter((m) => m.status === "in_progress").length,
    scheduled: moves.filter((m) => m.status === "scheduled").length,
    completed: moves.filter((m) => m.status === "completed").length,
  };

  return (
    <WebLayout>
      <div className="mx-auto w-full max-w-6xl flex-grow p-4 sm:p-6">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="rounded-lg bg-primary/10 p-2">
                <LayoutDashboard className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Move Command Center</h1>
            </div>
            <p className="text-muted-foreground ml-12">Manage and track all moving operations</p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
            <Plus className="h-4 w-4" /> New Move
          </Button>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Total Moves", value: stats.total, icon: Truck, accent: "text-primary" },
            { label: "In Progress", value: stats.inProgress, icon: Activity, accent: "text-amber-600" },
            { label: "Scheduled", value: stats.scheduled, icon: CalendarDays, accent: "text-blue-600" },
            { label: "Completed", value: stats.completed, icon: CheckCircle2, accent: "text-green-600" },
          ].map((s) => (
            <Card key={s.label} className="border">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="rounded-full bg-muted p-2.5">
                  <s.icon className={`h-5 w-5 ${s.accent}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold text-foreground">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filter */}
        <div className="mb-4 flex items-center gap-3">
          <Label className="text-sm text-muted-foreground">Filter:</Label>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <Card>
          <div className="border-b px-6 py-4">
            <h3 className="text-lg font-semibold text-foreground">All Moves</h3>
          </div>
          {loading ? (
            <div className="flex items-center justify-center p-10">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-r-transparent" />
            </div>
          ) : filteredMoves.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground">
              No moves found. Create one to get started!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Move ID</TableHead>
                    <TableHead>Lead</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Move Date</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMoves.map((move) => {
                    const sc = STATUS_CONFIG[move.status];
                    return (
                      <TableRow key={move.id}>
                        <TableCell className="font-mono text-sm">{move.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{move.leadName}</p>
                            <p className="text-xs text-muted-foreground">{move.leadId}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={sc.color}>
                            {sc.label}
                          </Badge>
                        </TableCell>
                        <TableCell>{format(new Date(move.moveDate), "MMM d, yyyy")}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(new Date(move.createdAt), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1.5"
                              onClick={() => navigate(`/moves/${move.id}`)}
                            >
                              <Eye className="h-3.5 w-3.5" /> View
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDelete(move.id)}
                              loading={deletingId === move.id}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>

        {/* Create Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Move</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Lead ID</Label>
                <Input value={newLeadId} onChange={(e) => setNewLeadId(e.target.value)} placeholder="e.g. LEAD-101" />
              </div>
              <div className="space-y-2">
                <Label>Lead Name</Label>
                <Input value={newLeadName} onChange={(e) => setNewLeadName(e.target.value)} placeholder="e.g. John Doe" />
              </div>
              <div className="space-y-2">
                <Label>Move Date</Label>
                <Input type="date" value={newMoveDate} onChange={(e) => setNewMoveDate(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
              <Button onClick={handleCreate} className="gap-2" loading={creatingMove}>
                <ArrowRight className="h-4 w-4" /> Create Move
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </WebLayout>
  );
};
