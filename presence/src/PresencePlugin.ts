export class PresencePlugin {
  private container: HTMLDivElement;

  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'presence-plugin';
    this.setupStyles();
    
    // Setup mock API if it doesn't exist
    if (!window.RPGCore) {
      window.RPGCore = {
        presence: {
          bindJSONPath: (path: string, callback: (value: any) => void) => {
            // Simulate random HP changes
            if (path.endsWith('.stats.hp')) {
              setInterval(() => {
                callback(Math.floor(Math.random() * 100));
              }, 3000);
            }
          },
          getConnectedUsers: () => [
            { id: '1', name: 'Dungeon Master', role: 'Master', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=dm' },
            { id: '2', name: 'Aragorn', role: 'Player', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=aragorn' },
            { id: '3', name: 'Legolas', role: 'Player', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=legolas' }
          ]
        }
      };
    }
  }

  private setupStyles() {
    const style = document.createElement('style');
    style.textContent = `
      body {
        background-color: #111827;
        color: #f3f4f6;
        margin: 0;
        padding: 1rem;
        font-family: sans-serif;
        height: 100vh;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .presence-plugin {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        background: #1e1e24;
        color: #e0e0e0;
        border-radius: 8px;
        padding: 15px;
        box-sizing: border-box;
        overflow-y: auto;
      }

      .presence-section {
        margin-bottom: 20px;
      }

      .presence-section-title {
        font-size: 12px;
        text-transform: uppercase;
        color: #888;
        margin-bottom: 10px;
        border-bottom: 1px solid #333;
        padding-bottom: 5px;
      }

      .presence-user {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
        padding: 8px;
        border-radius: 6px;
        background: #2a2a35;
      }

      .presence-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #444;
        flex-shrink: 0;
      }

      .presence-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .presence-name {
        font-size: 14px;
        font-weight: bold;
      }

      .presence-bars {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .presence-bar-container {
        height: 12px;
        background: #4b5563; /* Grey background wrapper */
        border-radius: 6px;
        overflow: hidden;
        border: 1px solid #374151;
      }

      .presence-bar-fill {
        height: 100%;
        transition: width 0.3s ease;
      }

      .presence-hp-fill {
        background: linear-gradient(90deg, #dc2626, #ef4444); /* Red inner bar */
      }

      .presence-mana-fill {
        background: linear-gradient(90deg, #2563eb, #3b82f6); /* Blue inner bar */
      }
    `;
    document.head.appendChild(style);
  }

  private createUserElement(user: { id: string, name: string, role: string, avatar?: string }) {
    const el = document.createElement('div');
    el.className = 'presence-user';
    
    const avatar = document.createElement('img');
    avatar.className = 'presence-avatar';
    avatar.src = user.avatar || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23444"/></svg>';
    
    const info = document.createElement('div');
    info.className = 'presence-info';
    
    const name = document.createElement('div');
    name.className = 'presence-name';
    name.textContent = user.name;
    
    const bars = document.createElement('div');
    bars.className = 'presence-bars';
    
    if (user.role === 'Player') {
      // HP Bar
      const hpContainer = document.createElement('div');
      hpContainer.className = 'presence-bar-container';
      const hpFill = document.createElement('div');
      hpFill.className = 'presence-bar-fill presence-hp-fill';
      hpFill.style.width = '100%';
      hpContainer.appendChild(hpFill);
      bars.appendChild(hpContainer);
      
      // Bind HP changes
      window.RPGCore.presence.bindJSONPath(`users.${user.id}.stats.hp`, (value: number) => {
        hpFill.style.width = `${Math.max(0, Math.min(100, value))}%`;
      });
      
      // Initialize with full HP
      window.RPGCore.presence.bindJSONPath(`users.${user.id}.stats.hp`, (value: number) => {
          hpFill.style.width = `${Math.max(0, Math.min(100, value))}%`;
      });
      // Initial state is full but our mock will update it
    }
    
    info.appendChild(name);
    info.appendChild(bars);
    
    el.appendChild(avatar);
    el.appendChild(info);
    
    return el;
  }

  public render() {
    this.container.innerHTML = '';
    
    const users = window.RPGCore.presence.getConnectedUsers();
    const masters = users.filter(u => u.role === 'Master');
    const players = users.filter(u => u.role === 'Player');
    
    if (masters.length > 0) {
      const masterSection = document.createElement('div');
      masterSection.className = 'presence-section';
      
      const title = document.createElement('div');
      title.className = 'presence-section-title';
      title.textContent = 'Master(s)';
      masterSection.appendChild(title);
      
      masters.forEach(master => {
        masterSection.appendChild(this.createUserElement(master));
      });
      
      this.container.appendChild(masterSection);
    }
    
    if (players.length > 0) {
      const playerSection = document.createElement('div');
      playerSection.className = 'presence-section';
      
      const title = document.createElement('div');
      title.className = 'presence-section-title';
      title.textContent = 'Players';
      playerSection.appendChild(title);
      
      players.forEach(player => {
        playerSection.appendChild(this.createUserElement(player));
      });
      
      this.container.appendChild(playerSection);
    }
  }

  public mount(target: HTMLElement) {
    this.render();
    target.appendChild(this.container);
  }
}
