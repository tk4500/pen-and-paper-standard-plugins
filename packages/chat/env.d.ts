// Definitions mirroring the VTT SDK
declare global {
  interface Profile {
    id: string;
    name: string;
    avatarUrl?: string;
    role: 'System' | 'User' | 'Narrator' | 'NPC';
  }

  interface ChatMessage {
    id: string;
    text: string;
    profileId: string;
    timestamp: number;
  }

  interface DiceResult {
    rollId: string;
    total: number;
    formula: string;
    faces: number[];
  }

  interface RPGCoreAPI {
    storage: {
      uploadFile(file: File): Promise<{ url: string }>;
    };
    chat: {
      sendMessage(message: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<ChatMessage>;
      onMessage(callback: (msg: ChatMessage) => void): void;
      onDiceRoll(callback: (result: DiceResult) => void): void;
    };
    user: {
      getProfiles(): Promise<Profile[]>;
      getActiveProfile(): Profile;
    };
  }

  interface Window {
    RPGCore: RPGCoreAPI;
  }
}

export {}; // Ensure it's treated as a module augmenting global