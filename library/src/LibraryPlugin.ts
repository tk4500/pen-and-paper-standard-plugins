export class LibraryPlugin {
  private container: HTMLElement;
  private fileGrid: HTMLElement;
  
  // Reasonable defaults since specific ones weren't in TASKS.md
  private MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
  private ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

  constructor(container: HTMLElement) {
    this.container = container;
    this.fileGrid = document.createElement('div');
    this.render();
  }

  private render() {
    this.container.innerHTML = `
      <style>
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
        .library-plugin {
          display: flex;
          height: 100%;
          font-family: sans-serif;
          background: #1e1e24; /* matched presence */
          color: #e0e0e0;
          border-radius: 8px;
          overflow: hidden;
        }
        .sidebar {
          width: 200px;
          background: #1f2937;
          border-right: 1px solid #374151;
          padding: 15px;
        }
        .sidebar h3 {
          margin-top: 0;
          color: #9ca3af;
          font-size: 14px;
          text-transform: uppercase;
        }
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 15px;
          background: #111827;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .header h2 {
          margin: 0;
          font-size: 20px;
          color: #f3f4f6;
        }
        .upload-btn {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 8px 16px;
          cursor: pointer;
          border-radius: 6px;
          font-weight: bold;
        }
        .upload-btn:hover {
          background: #2563eb;
        }
        .file-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 15px;
          overflow-y: auto;
          flex-grow: 1;
        }
        .file-card {
          background: #1f2937;
          border: 1px solid #374151;
          border-radius: 8px;
          padding: 10px;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.2s;
        }
        .file-card:hover {
          border-color: #60a5fa;
        }
        .file-icon {
          font-size: 48px;
          margin-bottom: 10px;
        }
        .file-name {
          font-size: 12px;
          word-break: break-all;
          color: #d1d5db;
        }
      </style>
      <div class="library-plugin">
        <div class="sidebar">
          <h3>Folders</h3>
          <ul style="list-style:none; padding:0; line-height:2">
            <li>📁 Root</li>
            <li>&nbsp;&nbsp;📁 Images</li>
            <li>&nbsp;&nbsp;📁 Tokens</li>
            <li>&nbsp;&nbsp;📁 Maps</li>
          </ul>
        </div>
        <div class="main-content">
          <div class="header">
            <h2>Library</h2>
            <div>
              <input type="file" id="file-upload-input" style="display: none;" accept="image/png, image/jpeg, image/webp, image/gif" />
              <button class="upload-btn" id="upload-btn">Upload File</button>
            </div>
          </div>
          <div class="file-grid" id="file-grid">
            <!-- Files will be rendered here -->
          </div>
        </div>
      </div>
    `;

    this.fileGrid = this.container.querySelector('#file-grid') as HTMLElement;
    
    // Setup event listeners
    const uploadBtn = this.container.querySelector('#upload-btn') as HTMLButtonElement;
    const fileInput = this.container.querySelector('#file-upload-input') as HTMLInputElement;

    uploadBtn.addEventListener('click', () => {
      fileInput.click();
    });

    fileInput.addEventListener('change', async (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        await this.handleUpload(file);
      }
    });

    this.loadFiles();
  }

  private async handleUpload(file: File) {
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      alert(`Invalid file type. Allowed types: ${this.ALLOWED_TYPES.join(', ')}`);
      return;
    }

    if (file.size > this.MAX_FILE_SIZE) {
      alert(`File is too large. Max size is ${this.MAX_FILE_SIZE / (1024 * 1024)}MB`);
      return;
    }

    try {
      if (window.RPGCore && window.RPGCore.storage) {
        const result = await window.RPGCore.storage.uploadFile(file);
        console.log('Upload successful:', result.url);
        // Add to UI immediately for demo purposes
        this.addFileToUI({ id: Date.now().toString(), name: file.name, url: result.url, type: 'image' });
      } else {
        alert('RPGCore.storage is not available in this environment');
      }
    } catch (err) {
      console.error('Upload failed', err);
      alert('Upload failed: ' + String(err));
    }
  }

  private async loadFiles() {
    this.fileGrid.innerHTML = '';
    
    if (window.RPGCore && window.RPGCore.storage && window.RPGCore.storage.listFiles) {
      try {
        const files = await window.RPGCore.storage.listFiles();
        files.forEach(f => this.addFileToUI(f));
        return;
      } catch(e) {
        console.warn('Could not list files via RPGCore', e);
      }
    }

    // Mock files fallback
    const mockFiles = [
      { id: '1', name: 'goblin_token.png', type: 'image', url: '#' },
      { id: '2', name: 'dungeon_map.jpg', type: 'image', url: '#' },
      { id: '3', name: 'dragon.webp', type: 'image', url: '#' }
    ];

    mockFiles.forEach(f => this.addFileToUI(f));
  }

  private addFileToUI(file: { id: string, name: string, url: string, type: string }) {
    const card = document.createElement('div');
    card.className = 'file-card';
    card.innerHTML = `
      <div class="file-icon">📄</div>
      <div class="file-name">${file.name}</div>
    `;
    this.fileGrid.appendChild(card);
  }
}
