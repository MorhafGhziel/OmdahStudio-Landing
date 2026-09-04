"use client";

import { useCallback, useState } from "react";
import type { ClientType, ServiceType, WorkType } from "./types";
import { defaultWorks, defaultServices, defaultClients } from "./seed";

export function useWorks() {
  const [items] = useState<WorkType[]>(defaultWorks as WorkType[]);
  const featured = items.find((work) => work.featured) ?? items[0];
  const rest = items.filter((work) => work !== featured);

  return {
    works: items,
    featured,
    rest,
    loading: false,
    refresh: useCallback(() => Promise.resolve(), []),
  };
}

export function useServices() {
  const [items] = useState<ServiceType[]>(defaultServices as ServiceType[]);

  return {
    services: items,
    loading: false,
    refresh: useCallback(() => Promise.resolve(), []),
  };
}

export function useClients() {
  const [items] = useState<ClientType[]>(defaultClients as ClientType[]);

  return {
    clients: items,
    loading: false,
    refresh: useCallback(() => Promise.resolve(), []),
  };
}

export function authHeaders(): HeadersInit {
  return { "Content-Type": "application/json" };
}
