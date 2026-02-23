/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  /** Video analysis / survey / partner uploads microservice */
  readonly VITE_BACKEND_API_URL: string;
  /** Move management (MoveMgmt) microservice */
  readonly VITE_MOVE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
