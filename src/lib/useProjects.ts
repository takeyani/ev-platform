"use client";
import { useState, useEffect } from "react";
import type { Project } from "./constants";
import { SAMPLE_PROJECTS } from "./constants";
import { fetchProjects } from "./db";

let cachedProjects: Project[] | null = null;
let cacheTime = 0;
const CACHE_TTL = 30000; // 30秒キャッシュ

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(cachedProjects || SAMPLE_PROJECTS);
  const [dbMode, setDbMode] = useState(!!cachedProjects);
  const [loading, setLoading] = useState(!cachedProjects);

  useEffect(() => {
    if (cachedProjects && Date.now() - cacheTime < CACHE_TTL) {
      setProjects(cachedProjects);
      setDbMode(true);
      setLoading(false);
      return;
    }
    fetchProjects()
      .then((data) => {
        cachedProjects = data;
        cacheTime = Date.now();
        setProjects(data);
        setDbMode(true);
      })
      .catch(() => { /* フォールバック: SAMPLE_PROJECTS */ })
      .finally(() => setLoading(false));
  }, []);

  function refresh() {
    cachedProjects = null;
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
  }

  return { projects, dbMode, loading, refresh };
}
