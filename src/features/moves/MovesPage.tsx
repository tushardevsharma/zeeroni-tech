import React, { FC, useCallback } from "react";
import { useAuth } from "@/features/partner/auth/AuthContext";
import { PartnerAuth } from "@/features/partner/components/PartnerAuth";
import { Routes, Route } from "react-router-dom";
import { MoveCommandCenter } from "./components/MoveCommandCenter";
import { MoveDetail } from "./components/MoveDetail";
import { HouseDetail } from "./components/HouseDetail";
import { RoomDetail } from "./components/RoomDetail";
import { ItemDetail } from "./components/ItemDetail";

export const MovesPage: FC = () => {
  const { isAuthenticated } = useAuth();

  const handleLoginSuccess = useCallback(() => {
    console.log("Login successful, rendering moves dashboard.");
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="moves-container">
        <PartnerAuth onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <Routes>
      <Route index element={<MoveCommandCenter />} />
      <Route path=":moveId" element={<MoveDetail />} />
      <Route path=":moveId/houses/:houseId" element={<HouseDetail />} />
      <Route path=":moveId/houses/:houseId/rooms/:roomId" element={<RoomDetail />} />
      <Route path=":moveId/items/:itemId" element={<ItemDetail />} />
    </Routes>
  );
};
