import { PresencePlugin } from './PresencePlugin';

// Initialize the plugin when the script loads
const initPlugin = () => {
    const app = document.getElementById('app') || document.body;
    const plugin = new PresencePlugin();
    plugin.mount(app);
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPlugin);
} else {
    initPlugin();
}
