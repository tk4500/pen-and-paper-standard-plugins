//#region index.ts
var e = class {
	container;
	messageList;
	input;
	uploadBtn;
	submitBtn;
	profiles = /* @__PURE__ */ new Map();
	constructor(e) {
		let t = document.getElementById(e);
		if (!t) throw Error(`Container #${e} not found`);
		this.container = t;
		let n = document.createElement("style");
		n.textContent = "\n            body {\n                background-color: #111827;\n                color: #f3f4f6;\n                margin: 0;\n                padding: 1rem;\n                font-family: sans-serif;\n                height: 100vh;\n                box-sizing: border-box;\n                display: flex;\n                flex-direction: column;\n                overflow: hidden;\n            }\n            .chat-plugin-container {\n                display: flex;\n                flex-direction: column;\n                height: 100%;\n                width: 100%;\n            }\n            .chat-messages {\n                flex-grow: 1;\n                overflow-y: auto;\n                border: 1px solid #374151;\n                padding: 10px;\n                margin-bottom: 10px;\n                border-radius: 6px;\n                background-color: #1f2937;\n            }\n            .chat-controls {\n                display: flex;\n                gap: 10px;\n            }\n            .chat-input {\n                flex: 1;\n                padding: 8px 12px;\n                border-radius: 6px;\n                border: 1px solid #374151;\n                background-color: #374151;\n                color: #f3f4f6;\n                outline: none;\n            }\n            .chat-input:focus {\n                border-color: #60a5fa;\n            }\n            button {\n                padding: 8px 16px;\n                border: none;\n                border-radius: 6px;\n                background-color: #3b82f6;\n                color: white;\n                cursor: pointer;\n            }\n            button:hover {\n                background-color: #2563eb;\n            }\n        ", document.head.appendChild(n);
		let r = document.createElement("div");
		r.className = "chat-plugin-container", this.messageList = document.createElement("div"), this.messageList.className = "chat-messages";
		let i = document.createElement("div");
		i.className = "chat-controls", this.input = document.createElement("input"), this.input.type = "text", this.input.className = "chat-input", this.input.placeholder = "Type a message...", this.submitBtn = document.createElement("button"), this.submitBtn.textContent = "Send", this.uploadBtn = document.createElement("button"), this.uploadBtn.textContent = "Upload", i.appendChild(this.input), i.appendChild(this.submitBtn), i.appendChild(this.uploadBtn), r.appendChild(this.messageList), r.appendChild(i), this.container.appendChild(r), this.bindEvents();
	}
	async init() {
		if (!window.RPGCore) {
			console.error("RPGCore SDK is not available.");
			return;
		}
		(await window.RPGCore.user.getProfiles()).forEach((e) => this.profiles.set(e.id, e)), window.RPGCore.chat.onMessage((e) => {
			this.renderMessage(e);
		}), window.RPGCore.chat.onDiceRoll((e) => {
			this.renderDiceRoll(e);
		});
	}
	bindEvents() {
		this.submitBtn.addEventListener("click", () => this.sendMessage()), this.input.addEventListener("keypress", (e) => {
			e.key === "Enter" && this.sendMessage();
		}), this.uploadBtn.addEventListener("click", () => this.triggerUpload());
	}
	async sendMessage() {
		let e = this.input.value.trim();
		if (e) {
			if (window.RPGCore) {
				let t = window.RPGCore.user.getActiveProfile();
				try {
					await window.RPGCore.chat.sendMessage({
						text: e,
						profileId: t.id
					}), this.input.value = "";
				} catch (e) {
					console.error("Failed to send message", e);
				}
			} else this.renderMessage({
				id: Math.random().toString(),
				text: e,
				profileId: "local",
				timestamp: Date.now()
			}), this.input.value = "";
		}
	}
	triggerUpload() {
		let e = document.createElement("input");
		e.type = "file", e.accept = "image/*, .pdf", e.onchange = async (e) => {
			let t = e.target;
			if (t.files && t.files.length > 0 && window.RPGCore) {
				let e = t.files[0];
				try {
					let t = await window.RPGCore.storage.uploadFile(e), n = window.RPGCore.user.getActiveProfile();
					await window.RPGCore.chat.sendMessage({
						text: `Uploaded file: ${t.url}`,
						profileId: n.id
					});
				} catch (e) {
					console.error("Upload failed", e);
				}
			}
		}, e.click();
	}
	parseBBCode(e) {
		return e.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\[b\](.*?)\[\/b\]/gi, "<strong>$1</strong>").replace(/\[i\](.*?)\[\/i\]/gi, "<em>$1</em>").replace(/\[color=(.*?)\](.*?)\[\/color\]/gi, "<span style='color:$1'>$2</span>").replace(/\[img\](.*?)\[\/img\]/gi, "<img src='$1' style='max-width:100%' />");
	}
	renderMessage(e) {
		let t = document.createElement("div");
		t.className = "chat-message", t.style.marginBottom = "8px";
		let n = this.profiles.get(e.profileId), r = n ? n.name : e.profileId === "local" ? "You" : "Unknown", i = n ? n.role : "User", a = "color: #9ca3af";
		i === "System" && (a = "color: #ef4444; font-weight: bold;"), i === "Narrator" && (a = "color: #a855f7; font-style: italic;"), i === "NPC" && (a = "color: #22c55e;"), t.innerHTML = `
            <div style="font-size: 0.8em; color: #6b7280;">[${new Date(e.timestamp).toLocaleTimeString()}] <span style="${a}">${r}</span>:</div>
            <div style="color: #f3f4f6;">${this.parseBBCode(e.text)}</div>
        `, this.messageList.appendChild(t), this.messageList.scrollTop = this.messageList.scrollHeight;
	}
	renderDiceRoll(e) {
		let t = document.createElement("div");
		t.className = "chat-message dice-roll", t.style.marginBottom = "8px", t.style.padding = "5px", t.style.backgroundColor = "#374151", t.style.color = "#f3f4f6", t.style.borderLeft = "4px solid #3b82f6", t.innerHTML = `
            <div><strong>Dice Roll:</strong> ${e.formula}</div>
            <div>Result: [${e.faces.join(", ")}] = <strong>${e.total}</strong></div>
        `, this.messageList.appendChild(t), this.messageList.scrollTop = this.messageList.scrollHeight;
	}
};
if (typeof window < "u") {
	window.ChatPlugin = e;
	let t = () => {
		document.getElementById("app") && new e("app").init();
	};
	document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", t) : t();
}
//#endregion
export { e as ChatPlugin };
