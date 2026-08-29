interface Window {
  RPGCore: {
    presence: {
      bindJSONPath(path: string, callback: (value: any) => void): void;
      getConnectedUsers(): { id: string, name: string, role: string, avatar?: string }[];
    }
  }
}
