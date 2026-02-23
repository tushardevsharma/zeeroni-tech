import React, { FC, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useMoveService } from "../services/moveService";
import { Move, MoveHouse, MoveLogistics, MoveStatus, HouseType } from "../types";
import WebLayout from "@/components/layout/WebLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft, Plus, Home, Eye, Trash2, Building2, MapPin, TruckIcon, DollarSign, Users, Gauge,
} from "lucide-react";

const STATUS_OPTIONS: MoveStatus[] = ["lead_converted", "scheduled", "in_progress", "completed", "cancelled"];
const STATUS_LABELS: Record<MoveStatus, string> = {
  lead_converted: "Lead Converted",
  scheduled: "Scheduled",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const MoveDetail: FC = () => {
  const { moveId } = useParams<{ moveId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const moveService = useMoveService();
  const [move, setMove] = useState<Move | null>(null);
  const [houses, setHouses] = useState<MoveHouse[]>([]);
  const [logistics, setLogistics] = useState<MoveLogistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddHouse, setShowAddHouse] = useState(false);
  const [newHouse, setNewHouse] = useState({ address: "", type: "Source" as HouseType, floor: 0, hasLift: false, notes: "" });

  const fetchData = async () => {
    if (!moveId) return;
    setLoading(true);
    const [m, h, l] = await Promise.all([
      moveService.getMove(moveId),
      moveService.getHouses(moveId),
      moveService.getLogistics(moveId),
    ]);
    setMove(m || null);
    setHouses(h);
    setLogistics(l || null);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [moveId]);

  const handleStatusChange = async (status: MoveStatus) => {
    if (!moveId) return;
    await moveService.updateMoveStatus(moveId, status);
    toast({ description: `Status updated to ${STATUS_LABELS[status]}` });
    fetchData();
  };

  const handleAddHouse = async () => {
    if (!moveId || !newHouse.address) return;
    await moveService.createHouse({ moveId, ...newHouse });
    toast({ description: "House added!" });
    setShowAddHouse(false);
    setNewHouse({ address: "", type: "Source", floor: 0, hasLift: false, notes: "" });
    fetchData();
  };

  const handleDeleteHouse = async (id: string) => {
    await moveService.deleteHouse(id);
    toast({ description: "House removed" });
    fetchData();
  };

  if (loading) {
    return (
      <WebLayout>
        <div className="flex items-center justify-center p-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-r-transparent" />
        </div>
      </WebLayout>
    );
  }

  if (!move) {
    return (
      <WebLayout>
        <div className="p-10 text-center">
          <p className="text-muted-foreground">Move not found.</p>
          <Button variant="outline" onClick={() => navigate("/moves")} className="mt-4">Back to Moves</Button>
        </div>
      </WebLayout>
    );
  }

  return (
    <WebLayout>
      <div className="mx-auto w-full max-w-6xl flex-grow p-4 sm:p-6">
        {/* Back + Header */}
        <Button variant="ghost" size="sm" onClick={() => navigate("/moves")} className="mb-4 gap-1.5 text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Moves
        </Button>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{move.leadName}</h1>
            <p className="text-sm text-muted-foreground font-mono">{move.id} · Lead {move.leadId}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Move Date: {format(new Date(move.moveDate), "MMMM d, yyyy")}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={move.status} onValueChange={(v) => handleStatusChange(v as MoveStatus)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="houses">
          <TabsList className="mb-6">
            <TabsTrigger value="houses" className="gap-1.5"><Building2 className="h-4 w-4" /> Houses</TabsTrigger>
            <TabsTrigger value="logistics" className="gap-1.5"><TruckIcon className="h-4 w-4" /> Logistics</TabsTrigger>
          </TabsList>

          {/* Houses Tab */}
          <TabsContent value="houses">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Houses</h2>
              <Button size="sm" onClick={() => setShowAddHouse(true)} className="gap-1.5">
                <Plus className="h-4 w-4" /> Add House
              </Button>
            </div>

            {houses.length === 0 ? (
              <Card><CardContent className="p-8 text-center text-muted-foreground">No houses added yet. Add source and destination houses.</CardContent></Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {houses.map((house) => (
                  <Card key={house.id} className="group relative">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className={
                          house.type === "Source" ? "bg-blue-500/10 text-blue-700 border-blue-200" :
                          house.type === "Destination" ? "bg-green-500/10 text-green-700 border-green-200" :
                          "bg-amber-500/10 text-amber-700 border-amber-200"
                        }>
                          {house.type}
                        </Badge>
                        <Button variant="ghost" size="sm" className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDeleteHouse(house.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <p className="text-sm font-medium">{house.address}</p>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Floor {house.floor}</span>
                        <span>{house.hasLift ? "✓ Lift" : "✗ No Lift"}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-1.5 mt-2"
                        onClick={() => navigate(`/moves/${moveId}/houses/${house.id}`)}
                      >
                        <Eye className="h-3.5 w-3.5" /> View Rooms
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Logistics Tab */}
          <TabsContent value="logistics">
            {logistics ? (
              <Card>
                <CardHeader><CardTitle>Move Logistics</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                      { icon: MapPin, label: "Distance", value: `${logistics.distanceKm} km` },
                      { icon: TruckIcon, label: "Truck Size", value: logistics.truckSizeType },
                      { icon: Users, label: "Crew Estimate", value: `${logistics.crewCountEst} people` },
                      { icon: Gauge, label: "Complexity", value: `${logistics.complexityScore} / 10` },
                      { icon: DollarSign, label: "Quoted Amount", value: `$${logistics.quotedAmount.toLocaleString()}` },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-3 rounded-lg border p-4">
                        <div className="rounded-full bg-muted p-2"><item.icon className="h-4 w-4 text-primary" /></div>
                        <div>
                          <p className="text-xs text-muted-foreground">{item.label}</p>
                          <p className="font-semibold text-foreground">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {logistics.specialNotes && (
                    <div className="mt-4 rounded-lg bg-muted/50 p-4">
                      <p className="text-sm text-muted-foreground"><strong>Notes:</strong> {logistics.specialNotes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card><CardContent className="p-8 text-center text-muted-foreground">No logistics data yet.</CardContent></Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Add House Dialog */}
        <Dialog open={showAddHouse} onOpenChange={setShowAddHouse}>
          <DialogContent>
            <DialogHeader><DialogTitle>Add House</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Address</Label>
                <Input value={newHouse.address} onChange={(e) => setNewHouse((p) => ({ ...p, address: e.target.value }))} placeholder="Full address" />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={newHouse.type} onValueChange={(v) => setNewHouse((p) => ({ ...p, type: v as HouseType }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Source">Source</SelectItem>
                    <SelectItem value="Destination">Destination</SelectItem>
                    <SelectItem value="Storage">Storage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Floor</Label>
                  <Input type="number" value={newHouse.floor} onChange={(e) => setNewHouse((p) => ({ ...p, floor: parseInt(e.target.value) || 0 }))} />
                </div>
                <div className="flex items-end gap-2 pb-1">
                  <Checkbox checked={newHouse.hasLift} onCheckedChange={(v) => setNewHouse((p) => ({ ...p, hasLift: !!v }))} id="hasLift" />
                  <Label htmlFor="hasLift">Has Lift</Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea value={newHouse.notes} onChange={(e) => setNewHouse((p) => ({ ...p, notes: e.target.value }))} placeholder="Optional notes" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddHouse(false)}>Cancel</Button>
              <Button onClick={handleAddHouse}>Add House</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </WebLayout>
  );
};
