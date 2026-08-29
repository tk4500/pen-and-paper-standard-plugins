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
		this.container = t, this.messageList = document.createElement("div"), this.messageList.className = "chat-messages", this.messageList.style.height = "400px", this.messageList.style.overflowY = "auto", this.messageList.style.border = "1px solid #ccc", this.messageList.style.padding = "10px", this.messageList.style.marginBottom = "10px";
		let n = document.createElement("div");
		n.className = "chat-controls", n.style.display = "flex", n.style.gap = "10px", this.input = document.createElement("input"), this.input.type = "text", this.input.className = "chat-input", this.input.style.flex = "1", this.input.placeholder = "Type a message...", this.submitBtn = document.createElement("button"), this.submitBtn.textContent = "Send", this.uploadBtn = document.createElement("button"), this.uploadBtn.textContent = "Upload", n.appendChild(this.input), n.appendChild(this.submitBtn), n.appendChild(this.uploadBtn), this.container.appendChild(this.messageList), this.container.appendChild(n), this.bindEvents();
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
		let n = this.profiles.get(e.profileId), r = n ? n.name : e.profileId === "local" ? "You" : "Unknown", i = n ? n.role : "User", a = "color: #333";
		i === "System" && (a = "color: red; font-weight: bold;"), i === "Narrator" && (a = "color: purple; font-style: italic;"), i === "NPC" && (a = "color: green;"), t.innerHTML = `
            <div style="font-size: 0.8em; color: #888;">[${new Date(e.timestamp).toLocaleTimeString()}] <span style="${a}">${r}</span>:</div>
            <div>${this.parseBBCode(e.text)}</div>
        `, this.messageList.appendChild(t), this.messageList.scrollTop = this.messageList.scrollHeight;
	}
	renderDiceRoll(e) {
		let t = document.createElement("div");
		t.className = "chat-message dice-roll", t.style.marginBottom = "8px", t.style.padding = "5px", t.style.backgroundColor = "#f0f0f0", t.style.borderLeft = "4px solid #005cc5", t.innerHTML = `
            <div><strong>Dice Roll:</strong> ${e.formula}</div>
            <div>Result: [${e.faces.join(", ")}] = <strong>${e.total}</strong></div>
        `, this.messageList.appendChild(t), this.messageList.scrollTop = this.messageList.scrollHeight;
	}
};
typeof window < "u" && (window.ChatPlugin = e);
//#endregion
export { e as ChatPlugin };
