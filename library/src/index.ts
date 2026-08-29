import { LibraryPlugin } from './LibraryPlugin';
import './env.d';

export { LibraryPlugin };

const initPlugin = () => {
    const app = document.getElementById('app');
    if (app) {
        new LibraryPlugin(app);
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPlugin);
} else {
    initPlugin();
}
