/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_DD_CLIENT_TOKEN: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
  }