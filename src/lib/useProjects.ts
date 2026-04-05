"use client";
import { useState, useEffect, useCallback } from "react";
import type { Project } from "./constants";
import { SAMPLE_PROJECTS } from "./constants";
import { fetchProjects } from "./db";

let cachedProjects: Project[] | null = null;
let cacheTime = 0;
const CACHE_TTL = 15000;
let refreshListeners: (() => void)[] = [];

/** グローバルキャッシュを破棄して全コンポーネントに通知 */
export function invalidateProjectsCache() {
  cachedProjects = null;
  cacheTime = 0;
  refreshListeners.forEach((fn) => fn());
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(cachedProjects || SAMPLE_PROJECTS);
  const [dbMode, setDbMode] = useState(!!cachedProjects);
  const [loading, setLoading] = useState(!cachedProjects);

  const doFetch = useCallback(() => {
    setLoading(true);
    fetchProjects()
      .then((data) => {
        cachedProjects = data;
        cacheTime = Date.now();
        setProjects(data);
        setDbMode(true);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (cachedProjects && Date.now() - cacheTime < CACHE_TTL) {
      setProjects(cachedProjects);
      setDbMode(true);
      setLoading(false);
    } else {
      doFetch();
    }
    // リフレッシュ通知を受け取る
    refreshListeners.push(doFetch);
    return () => { refreshListeners = refreshListeners.filter((fn) => fn !== doFetch); };
  }, [doFetch]);

  return { projects, dbMode, loading, refresh: doFetch };
}
