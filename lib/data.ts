"use client";

import { useCallback, useEffect, useState } from "react";
import type { ClientType, ServiceType, WorkType } from "./types";

/**
 * Client-side collection fetching.
 *
 * Several places need the same list — the hero and the works grid both want
 * the featured project. A module-level promise cache means the first caller
 * starts the request and everyone else awaits that same one; `refresh()`
 * drops the entry so an admin write shows up immediately.
 */
const cache = new Map<string, Promise<unknown[]>>();

type Payload = Record<string, unknown>;

function load<T>(url: string, key: string, force = false): Promise<T[]> {
  if (force) cache.delete(url);

  const cached = cache.get(url);
  if (cached) return cached as Promise<T[]>;

  const request = fetch(url)
    .then((res) => (res.ok ? (res.json() as Promise<Payload>) : null))
    .then((json) => {
      const items = json?.[key];
      return Array.isArray(items) ? (items as T[]) : [];
    })
    .catch(() => []);

  cache.set(url, request);
  return request as Promise<T[]>;
}

/** Drop every cached collection — used after a write from the admin. */
export function invalidateCollections() {
  cache.clear();
}

function useCollection<T>(url: string, key: string) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    load<T>(url, key).then((data) => {
      if (cancelled) return;
      setItems(data);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [url, key]);

  const refresh = useCallback(() => {
    setLoading(true);
    return load<T>(url, key, true).then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, [url, key]);

  return { items, loading, refresh };
}

export function useWorks() {
  const { items, loading, refresh } = useCollection<WorkType>(
    "/api/works",
    "works"
  );

  // Nothing guarantees a featured flag exists, so fall back to the first
  // entry rather than leaving the hero with an empty frame.
  const featured = items.find((work) => work.featured) ?? items[0];

  // The featured piece already plays as the hero showreel; listing it again
  // in the grid reads as a mistake.
  const rest = items.filter((work) => work !== featured);

  return { works: items, featured, rest, loading, refresh };
}

export function useServices() {
  const { items, loading, refresh } = useCollection<ServiceType>(
    "/api/services",
    "services"
  );
  return { services: items, loading, refresh };
}

export function useClients() {
  const { items, loading, refresh } = useCollection<ClientType>(
    "/api/clients",
    "clients"
  );
  return { clients: items, loading, refresh };
}

/** Authorization header for admin writes. */
export function authHeaders(): HeadersInit {
  const token =
    typeof window === "undefined"
      ? ""
      : localStorage.getItem("adminToken") ?? "";

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}
