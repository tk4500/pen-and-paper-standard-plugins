//#region \0rolldown/runtime.js
var e = (e, t, n) => () => {
	if (n) throw n[0];
	try {
		return e && (t = e(e = 0)), t;
	} catch (e) {
		throw n = [e], e;
	}
}, t = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports), n, r = e((() => {
	n = class {
		container;
		constructor() {
			this.container = document.createElement("div"), this.container.className = "presence-plugin", this.setupStyles(), window.RPGCore || (window.RPGCore = { presence: {
				bindJSONPath: (e, t) => {
					e.endsWith(".stats.hp") && setInterval(() => {
						t(Math.floor(Math.random() * 100));
					}, 3e3);
				},
				getConnectedUsers: () => [
					{
						id: "1",
						name: "Dungeon Master",
						role: "Master",
						avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=dm"
					},
					{
						id: "2",
						name: "Aragorn",
						role: "Player",
						avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=aragorn"
					},
					{
						id: "3",
						name: "Legolas",
						role: "Player",
						avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=legolas"
					}
				]
			} });
		}
		setupStyles() {
			let e = document.createElement("style");
			e.textContent = "\n      body {\n        background-color: #111827;\n        color: #f3f4f6;\n        margin: 0;\n        padding: 1rem;\n        font-family: sans-serif;\n        height: 100vh;\n        box-sizing: border-box;\n        display: flex;\n        flex-direction: column;\n        overflow: hidden;\n      }\n\n      .presence-plugin {\n        display: flex;\n        flex-direction: column;\n        width: 100%;\n        height: 100%;\n        background: #1e1e24;\n        color: #e0e0e0;\n        border-radius: 8px;\n        padding: 15px;\n        box-sizing: border-box;\n        overflow-y: auto;\n      }\n\n      .presence-section {\n        margin-bottom: 20px;\n      }\n\n      .presence-section-title {\n        font-size: 12px;\n        text-transform: uppercase;\n        color: #888;\n        margin-bottom: 10px;\n        border-bottom: 1px solid #333;\n        padding-bottom: 5px;\n      }\n\n      .presence-user {\n        display: flex;\n        align-items: center;\n        gap: 10px;\n        margin-bottom: 10px;\n        padding: 8px;\n        border-radius: 6px;\n        background: #2a2a35;\n      }\n\n      .presence-avatar {\n        width: 40px;\n        height: 40px;\n        border-radius: 50%;\n        background: #444;\n        flex-shrink: 0;\n      }\n\n      .presence-info {\n        flex: 1;\n        display: flex;\n        flex-direction: column;\n        gap: 4px;\n      }\n\n      .presence-name {\n        font-size: 14px;\n        font-weight: bold;\n      }\n\n      .presence-bars {\n        display: flex;\n        flex-direction: column;\n        gap: 4px;\n      }\n\n      .presence-bar-container {\n        height: 12px;\n        background: #4b5563; /* Grey background wrapper */\n        border-radius: 6px;\n        overflow: hidden;\n        border: 1px solid #374151;\n      }\n\n      .presence-bar-fill {\n        height: 100%;\n        transition: width 0.3s ease;\n      }\n\n      .presence-hp-fill {\n        background: linear-gradient(90deg, #dc2626, #ef4444); /* Red inner bar */\n      }\n\n      .presence-mana-fill {\n        background: linear-gradient(90deg, #2563eb, #3b82f6); /* Blue inner bar */\n      }\n    ", document.head.appendChild(e);
		}
		createUserElement(e) {
			let t = document.createElement("div");
			t.className = "presence-user";
			let n = document.createElement("img");
			n.className = "presence-avatar", n.src = e.avatar || "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><circle cx=\"50\" cy=\"50\" r=\"50\" fill=\"%23444\"/></svg>";
			let r = document.createElement("div");
			r.className = "presence-info";
			let i = document.createElement("div");
			i.className = "presence-name", i.textContent = e.name;
			let a = document.createElement("div");
			if (a.className = "presence-bars", e.role === "Player") {
				let t = document.createElement("div");
				t.className = "presence-bar-container";
				let n = document.createElement("div");
				n.className = "presence-bar-fill presence-hp-fill", n.style.width = "100%", t.appendChild(n), a.appendChild(t), window.RPGCore.presence.bindJSONPath(`users.${e.id}.stats.hp`, (e) => {
					n.style.width = `${Math.max(0, Math.min(100, e))}%`;
				}), window.RPGCore.presence.bindJSONPath(`users.${e.id}.stats.hp`, (e) => {
					n.style.width = `${Math.max(0, Math.min(100, e))}%`;
				});
			}
			return r.appendChild(i), r.appendChild(a), t.appendChild(n), t.appendChild(r), t;
		}
		render() {
			this.container.innerHTML = "";
			let e = window.RPGCore.presence.getConnectedUsers(), t = e.filter((e) => e.role === "Master"), n = e.filter((e) => e.role === "Player");
			if (t.length > 0) {
				let e = document.createElement("div");
				e.className = "presence-section";
				let n = document.createElement("div");
				n.className = "presence-section-title", n.textContent = "Master(s)", e.appendChild(n), t.forEach((t) => {
					e.appendChild(this.createUserElement(t));
				}), this.container.appendChild(e);
			}
			if (n.length > 0) {
				let e = document.createElement("div");
				e.className = "presence-section";
				let t = document.createElement("div");
				t.className = "presence-section-title", t.textContent = "Players", e.appendChild(t), n.forEach((t) => {
					e.appendChild(this.createUserElement(t));
				}), this.container.appendChild(e);
			}
		}
		mount(e) {
			this.render(), e.appendChild(this.container);
		}
	};
})), i = /* @__PURE__ */ t((() => {
	r(), new n().mount(document.body);
}));
//#endregion
export default i();
