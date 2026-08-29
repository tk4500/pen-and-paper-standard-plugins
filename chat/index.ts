/// <reference path="./env.d.ts" />

export class ChatPlugin {
    private container: HTMLElement;
    private messageList: HTMLElement;
    private input: HTMLInputElement;
    private uploadBtn: HTMLButtonElement;
    private submitBtn: HTMLButtonElement;
    private profiles: Map<string, Profile> = new Map();

    constructor(containerId: string) {
        const root = document.getElementById(containerId);
        if (!root) {
            throw new Error(`Container #${containerId} not found`);
        }
        this.container = root;

        // Inject standard Dark Theme styling
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
            .chat-plugin-container {
                display: flex;
                flex-direction: column;
                height: 100%;
                width: 100%;
            }
            .chat-messages {
                flex-grow: 1;
                overflow-y: auto;
                border: 1px solid #374151;
                padding: 10px;
                margin-bottom: 10px;
                border-radius: 6px;
                background-color: #1f2937;
            }
            .chat-controls {
                display: flex;
                gap: 10px;
            }
            .chat-input {
                flex: 1;
                padding: 8px 12px;
                border-radius: 6px;
                border: 1px solid #374151;
                background-color: #374151;
                color: #f3f4f6;
                outline: none;
            }
            .chat-input:focus {
                border-color: #60a5fa;
            }
            button {
                padding: 8px 16px;
                border: none;
                border-radius: 6px;
                background-color: #3b82f6;
                color: white;
                cursor: pointer;
            }
            button:hover {
                background-color: #2563eb;
            }
        `;
        document.head.appendChild(style);

        // Wrap everything in a flex container
        const wrapper = document.createElement('div');
        wrapper.className = 'chat-plugin-container';

        // Initialize UI
        this.messageList = document.createElement('div');
        this.messageList.className = 'chat-messages';

        const controls = document.createElement('div');
        controls.className = 'chat-controls';

        this.input = document.createElement('input');
        this.input.type = 'text';
        this.input.className = 'chat-input';
        this.input.placeholder = 'Type a message...';

        this.submitBtn = document.createElement('button');
        this.submitBtn.textContent = 'Send';

        this.uploadBtn = document.createElement('button');
        this.uploadBtn.textContent = 'Upload';

        controls.appendChild(this.input);
        controls.appendChild(this.submitBtn);
        controls.appendChild(this.uploadBtn);

        wrapper.appendChild(this.messageList);
        wrapper.appendChild(controls);

        this.container.appendChild(wrapper);

        this.bindEvents();
    }

    public async init() {
        if (!window.RPGCore) {
            console.error("RPGCore SDK is not available.");
            return;
        }

        // Fetch profiles
        const profileList = await window.RPGCore.user.getProfiles();
        profileList.forEach(p => this.profiles.set(p.id, p));

        // Listen for new messages
        window.RPGCore.chat.onMessage((msg: ChatMessage) => {
            this.renderMessage(msg);
        });

        // Listen for dice rolls
        window.RPGCore.chat.onDiceRoll((result: DiceResult) => {
            this.renderDiceRoll(result);
        });
    }

    private bindEvents() {
        this.submitBtn.addEventListener('click', () => this.sendMessage());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        this.uploadBtn.addEventListener('click', () => this.triggerUpload());
    }

    private async sendMessage() {
        const text = this.input.value.trim();
        if (!text) return;

        if (window.RPGCore) {
            const activeProfile = window.RPGCore.user.getActiveProfile();
            try {
                await window.RPGCore.chat.sendMessage({
                    text,
                    profileId: activeProfile.id
                });
                this.input.value = '';
            } catch (err) {
                console.error("Failed to send message", err);
            }
        } else {
            // For testing without SDK
            this.renderMessage({
                id: Math.random().toString(),
                text,
                profileId: 'local',
                timestamp: Date.now()
            });
            this.input.value = '';
        }
    }

    private triggerUpload() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*, .pdf';
        fileInput.onchange = async (e: Event) => {
            const target = e.target as HTMLInputElement;
            if (target.files && target.files.length > 0 && window.RPGCore) {
                const file = target.files[0];
                try {
                    const result = await window.RPGCore.storage.uploadFile(file);
                    // Send message with file URL
                    const activeProfile = window.RPGCore.user.getActiveProfile();
                    await window.RPGCore.chat.sendMessage({
                        text: `Uploaded file: ${result.url}`,
                        profileId: activeProfile.id
                    });
                } catch (err) {
                    console.error("Upload failed", err);
                }
            }
        };
        fileInput.click();
    }

    private parseBBCode(text: string): string {
        let parsed = text
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\[b\](.*?)\[\/b\]/gi, "<strong>$1</strong>")
            .replace(/\[i\](.*?)\[\/i\]/gi, "<em>$1</em>")
            .replace(/\[color=(.*?)\](.*?)\[\/color\]/gi, "<span style='color:$1'>$2</span>")
            .replace(/\[img\](.*?)\[\/img\]/gi, "<img src='$1' style='max-width:100%' />");

        return parsed;
    }

    private renderMessage(msg: ChatMessage) {
        const el = document.createElement('div');
        el.className = 'chat-message';
        el.style.marginBottom = '8px';

        const profile = this.profiles.get(msg.profileId);
        const name = profile ? profile.name : (msg.profileId === 'local' ? 'You' : 'Unknown');
        const role = profile ? profile.role : 'User';

        // Basic styling based on role
        let roleStyle = 'color: #9ca3af'; // Lighter grey for regular users
        if (role === 'System') roleStyle = 'color: #ef4444; font-weight: bold;'; // Red-500
        if (role === 'Narrator') roleStyle = 'color: #a855f7; font-style: italic;'; // Purple-500
        if (role === 'NPC') roleStyle = 'color: #22c55e;'; // Green-500

        const time = new Date(msg.timestamp).toLocaleTimeString();

        el.innerHTML = `
            <div style="font-size: 0.8em; color: #6b7280;">[${time}] <span style="${roleStyle}">${name}</span>:</div>
            <div style="color: #f3f4f6;">${this.parseBBCode(msg.text)}</div>
        `;

        this.messageList.appendChild(el);
        this.messageList.scrollTop = this.messageList.scrollHeight;
    }

    private renderDiceRoll(result: DiceResult) {
        const el = document.createElement('div');
        el.className = 'chat-message dice-roll';
        el.style.marginBottom = '8px';
        el.style.padding = '5px';
        el.style.backgroundColor = '#374151'; // Dark theme background
        el.style.color = '#f3f4f6';
        el.style.borderLeft = '4px solid #3b82f6';

        el.innerHTML = `
            <div><strong>Dice Roll:</strong> ${result.formula}</div>
            <div>Result: [${result.faces.join(', ')}] = <strong>${result.total}</strong></div>
        `;

        this.messageList.appendChild(el);
        this.messageList.scrollTop = this.messageList.scrollHeight;
    }
}

// Auto-initialize if we are the main entry point
if (typeof window !== 'undefined') {
    (window as any).ChatPlugin = ChatPlugin;
}
