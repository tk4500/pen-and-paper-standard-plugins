//#region src/LibraryPlugin.ts
var e = class {
	container;
	fileGrid;
	MAX_FILE_SIZE = 5242880;
	ALLOWED_TYPES = [
		"image/png",
		"image/jpeg",
		"image/webp",
		"image/gif"
	];
	constructor(e) {
		this.container = e, this.fileGrid = document.createElement("div"), this.render();
	}
	render() {
		this.container.innerHTML = "\n      <style>\n        .library-plugin {\n          display: flex;\n          height: 100%;\n          font-family: sans-serif;\n          background: #1e1e1e;\n          color: #fff;\n        }\n        .sidebar {\n          width: 200px;\n          border-right: 1px solid #333;\n          padding: 10px;\n        }\n        .main-content {\n          flex: 1;\n          display: flex;\n          flex-direction: column;\n          padding: 10px;\n        }\n        .header {\n          display: flex;\n          justify-content: space-between;\n          align-items: center;\n          margin-bottom: 20px;\n        }\n        .upload-btn {\n          background: #4caf50;\n          color: white;\n          border: none;\n          padding: 8px 16px;\n          cursor: pointer;\n          border-radius: 4px;\n        }\n        .upload-btn:hover {\n          background: #45a049;\n        }\n        .file-grid {\n          display: grid;\n          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));\n          gap: 15px;\n          overflow-y: auto;\n        }\n        .file-card {\n          background: #2a2a2a;\n          border: 1px solid #444;\n          border-radius: 8px;\n          padding: 10px;\n          text-align: center;\n          cursor: pointer;\n        }\n        .file-card:hover {\n          border-color: #4caf50;\n        }\n        .file-icon {\n          font-size: 48px;\n          margin-bottom: 10px;\n        }\n        .file-name {\n          font-size: 12px;\n          word-break: break-all;\n        }\n      </style>\n      <div class=\"library-plugin\">\n        <div class=\"sidebar\">\n          <h3>Folders</h3>\n          <ul style=\"list-style:none; padding:0; line-height:2\">\n            <li>📁 Root</li>\n            <li>&nbsp;&nbsp;📁 Images</li>\n            <li>&nbsp;&nbsp;📁 Tokens</li>\n            <li>&nbsp;&nbsp;📁 Maps</li>\n          </ul>\n        </div>\n        <div class=\"main-content\">\n          <div class=\"header\">\n            <h2>Library</h2>\n            <div>\n              <input type=\"file\" id=\"file-upload-input\" style=\"display: none;\" accept=\"image/png, image/jpeg, image/webp, image/gif\" />\n              <button class=\"upload-btn\" id=\"upload-btn\">Upload File</button>\n            </div>\n          </div>\n          <div class=\"file-grid\" id=\"file-grid\">\n            <!-- Files will be rendered here -->\n          </div>\n        </div>\n      </div>\n    ", this.fileGrid = this.container.querySelector("#file-grid");
		let e = this.container.querySelector("#upload-btn"), t = this.container.querySelector("#file-upload-input");
		e.addEventListener("click", () => {
			t.click();
		}), t.addEventListener("change", async (e) => {
			let t = e.target;
			if (t.files && t.files.length > 0) {
				let e = t.files[0];
				await this.handleUpload(e);
			}
		}), this.loadFiles();
	}
	async handleUpload(e) {
		if (!this.ALLOWED_TYPES.includes(e.type)) {
			alert(`Invalid file type. Allowed types: ${this.ALLOWED_TYPES.join(", ")}`);
			return;
		}
		if (e.size > this.MAX_FILE_SIZE) {
			alert(`File is too large. Max size is ${this.MAX_FILE_SIZE / 1048576}MB`);
			return;
		}
		try {
			if (window.RPGCore && window.RPGCore.storage) {
				let t = await window.RPGCore.storage.uploadFile(e);
				console.log("Upload successful:", t.url), this.addFileToUI({
					id: Date.now().toString(),
					name: e.name,
					url: t.url,
					type: "image"
				});
			} else alert("RPGCore.storage is not available in this environment");
		} catch (e) {
			console.error("Upload failed", e), alert("Upload failed: " + String(e));
		}
	}
	async loadFiles() {
		if (this.fileGrid.innerHTML = "", window.RPGCore && window.RPGCore.storage && window.RPGCore.storage.listFiles) try {
			(await window.RPGCore.storage.listFiles()).forEach((e) => this.addFileToUI(e));
			return;
		} catch (e) {
			console.warn("Could not list files via RPGCore", e);
		}
		[
			{
				id: "1",
				name: "goblin_token.png",
				type: "image",
				url: "#"
			},
			{
				id: "2",
				name: "dungeon_map.jpg",
				type: "image",
				url: "#"
			},
			{
				id: "3",
				name: "dragon.webp",
				type: "image",
				url: "#"
			}
		].forEach((e) => this.addFileToUI(e));
	}
	addFileToUI(e) {
		let t = document.createElement("div");
		t.className = "file-card", t.innerHTML = `
      <div class="file-icon">📄</div>
      <div class="file-name">${e.name}</div>
    `, this.fileGrid.appendChild(t);
	}
};
//#endregion
export { e as LibraryPlugin };
