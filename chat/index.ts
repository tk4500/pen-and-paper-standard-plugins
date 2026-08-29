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

        // Initialize UI
        this.messageList = document.createElement('div');
        this.messageList.className = 'chat-messages';
        this.messageList.style.height = '400px';
        this.messageList.style.overflowY = 'auto';
        this.messageList.style.border = '1px solid #ccc';
        this.messageList.style.padding = '10px';
        this.messageList.style.marginBottom = '10px';

        const controls = document.createElement('div');
        controls.className = 'chat-controls';
        controls.style.display = 'flex';
        controls.style.gap = '10px';

        this.input = document.createElement('input');
        this.input.type = 'text';
        this.input.className = 'chat-input';
        this.input.style.flex = '1';
        this.input.placeholder = 'Type a message...';

        this.submitBtn = document.createElement('button');
        this.submitBtn.textContent = 'Send';

        this.uploadBtn = document.createElement('button');
        this.uploadBtn.textContent = 'Upload';

        controls.appendChild(this.input);
        controls.appendChild(this.submitBtn);
        controls.appendChild(this.uploadBtn);

        this.container.appendChild(this.messageList);
        this.container.appendChild(controls);

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
        let roleStyle = 'color: #333';
        if (role === 'System') roleStyle = 'color: red; font-weight: bold;';
        if (role === 'Narrator') roleStyle = 'color: purple; font-style: italic;';
        if (role === 'NPC') roleStyle = 'color: green;';

        const time = new Date(msg.timestamp).toLocaleTimeString();

        el.innerHTML = `
            <div style="font-size: 0.8em; color: #888;">[${time}] <span style="${roleStyle}">${name}</span>:</div>
            <div>${this.parseBBCode(msg.text)}</div>
        `;

        this.messageList.appendChild(el);
        this.messageList.scrollTop = this.messageList.scrollHeight;
    }

    private renderDiceRoll(result: DiceResult) {
        const el = document.createElement('div');
        el.className = 'chat-message dice-roll';
        el.style.marginBottom = '8px';
        el.style.padding = '5px';
        el.style.backgroundColor = '#f0f0f0';
        el.style.borderLeft = '4px solid #005cc5';

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
