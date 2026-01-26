import { useCallback } from "react";
import { useAuth } from "@/features/partner/auth/AuthContext";
import { Lead } from "../types";

export const useLeadService = () => {
  const { getToken } = useAuth();
  const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;

  const getHeaders = useCallback(() => {
    const token = getToken();
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "version": import.meta.env.VITE_API_VERSION,
    };
  }, [getToken]);

  const getLeads = useCallback(async (): Promise<Lead[]> => {
    const response = await fetch(`${API_BASE_URL}/marketing/leads`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch leads");
    }
    return response.json();
  }, [API_BASE_URL, getHeaders]);

  return {
    getLeads,
  };
};
