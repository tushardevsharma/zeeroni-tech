import React, { FC, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { moveService } from "../services/moveService";
import { MoveHouse, MoveRoom } from "../types";
import WebLayout from "@/components/layout/WebLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft, Plus, Eye, Trash2, MapPin, DoorOpen, Video, CheckCircle2, Loader2, AlertCircle,
} from "lucide-react";

const ANALYSIS_STATUS_UI: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  none: { icon: <Video className="h-4 w-4" />, label: "No scan", color: "text-muted-foreground" },
  uploading: { icon: <Loader2 className="h-4 w-4 animate-spin" />, label: "Uploading…", color: "text-amber-600" },
  processing: { icon: <Loader2 className="h-4 w-4 animate-spin" />, label: "AI Processing…", color: "text-primary" },
  completed: { icon: <CheckCircle2 className="h-4 w-4" />, label: "Scan Complete", color: "text-green-600" },
  failed: { icon: <AlertCircle className="h-4 w-4" />, label: "Failed", color: "text-destructive" },
};

export const HouseDetail: FC = () => {
  const { moveId, houseId } = useParams<{ moveId: string; houseId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [house, setHouse] = useState<MoveHouse | null>(null);
  const [rooms, setRooms] = useState<MoveRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [newRoom, setNewRoom] = useState({ name: "", notes: "" });

  const fetchData = async () => {
    if (!moveId || !houseId) return;
    setLoading(true);
    const [allHouses, allRooms] = await Promise.all([
      moveService.getHouses(moveId),
      moveService.getRooms(houseId),
    ]);
    setHouse(allHouses.find((h) => h.id === houseId) || null);
    setRooms(allRooms);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [moveId, houseId]);

  const handleAddRoom = async () => {
    if (!houseId || !newRoom.name) return;
    await moveService.createRoom({ houseId, name: newRoom.name, notes: newRoom.notes || undefined });
    toast({ description: "Room added!" });
    setShowAddRoom(false);
    setNewRoom({ name: "", notes: "" });
    fetchData();
  };

  const handleDeleteRoom = async (id: string) => {
    await moveService.deleteRoom(id);
    toast({ description: "Room removed" });
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

  if (!house) {
    return (
      <WebLayout>
        <div className="p-10 text-center">
          <p className="text-muted-foreground">House not found.</p>
          <Button variant="outline" onClick={() => navigate(`/moves/${moveId}`)} className="mt-4">Back to Move</Button>
        </div>
      </WebLayout>
    );
  }

  return (
    <WebLayout>
      <div className="mx-auto w-full max-w-6xl flex-grow p-4 sm:p-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(`/moves/${moveId}`)} className="mb-4 gap-1.5 text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Move
        </Button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Badge variant="outline" className={
              house.type === "Source" ? "bg-blue-500/10 text-blue-700 border-blue-200" :
              house.type === "Destination" ? "bg-green-500/10 text-green-700 border-green-200" :
              "bg-amber-500/10 text-amber-700 border-amber-200"
            }>
              {house.type}
            </Badge>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">{house.address}</h1>
              <p className="text-sm text-muted-foreground">Floor {house.floor} · {house.hasLift ? "Lift available" : "No lift"}</p>
            </div>
          </div>
        </div>

        {/* Rooms */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <DoorOpen className="h-5 w-5 text-primary" /> Rooms
          </h2>
          <Button size="sm" onClick={() => setShowAddRoom(true)} className="gap-1.5">
            <Plus className="h-4 w-4" /> Add Room
          </Button>
        </div>

        {rooms.length === 0 ? (
          <Card><CardContent className="p-8 text-center text-muted-foreground">No rooms yet. Add rooms to start inventorying.</CardContent></Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => {
              const statusUI = ANALYSIS_STATUS_UI[room.videoAnalysisStatus || "none"];
              return (
                <Card key={room.id} className="group relative">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground">{room.name}</h3>
                      <Button variant="ghost" size="sm" className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDeleteRoom(room.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    {room.notes && <p className="text-xs text-muted-foreground">{room.notes}</p>}
                    <div className={`flex items-center gap-1.5 text-xs ${statusUI.color}`}>
                      {statusUI.icon}
                      <span>{statusUI.label}</span>
                      {room.detectedItemsCount && room.detectedItemsCount > 0 && (
                        <Badge variant="secondary" className="ml-auto text-xs">{room.detectedItemsCount} items</Badge>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-1.5"
                      onClick={() => navigate(`/moves/${moveId}/houses/${houseId}/rooms/${room.id}`)}
                    >
                      <Eye className="h-3.5 w-3.5" /> View Room
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Add Room Dialog */}
        <Dialog open={showAddRoom} onOpenChange={setShowAddRoom}>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Room</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Room Name</Label>
                <Input value={newRoom.name} onChange={(e) => setNewRoom((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Living Room, Kitchen" />
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea value={newRoom.notes} onChange={(e) => setNewRoom((p) => ({ ...p, notes: e.target.value }))} placeholder="Optional notes" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddRoom(false)}>Cancel</Button>
              <Button onClick={handleAddRoom}>Add Room</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </WebLayout>
  );
};
