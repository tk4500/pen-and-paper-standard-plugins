// Definitions mirroring the VTT SDK
declare global {
  interface RPGCoreAPI {
    storage: {
      uploadFile(file: File): Promise<{ url: string }>;
      listFiles?(): Promise<Array<{ id: string, name: string, url: string, type: string }>>;
    };
  }

  interface Window {
    RPGCore: RPGCoreAPI;
  }
}

export {}; // Ensure it's treated as a module augmenting global
