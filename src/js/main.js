// Import build information
import { BUILD_INFO } from '../build-info.js';
import { AffineVisualizer } from './affine-visualizer.js';

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    // Update footer with build information
    const commitHashElement = document.getElementById('commit-hash');
    if (commitHashElement) {
        commitHashElement.textContent = BUILD_INFO.commit;
    }

    // Initialize affine transformation visualizer
    new AffineVisualizer();
});
