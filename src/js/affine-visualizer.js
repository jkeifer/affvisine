import { mat3, vec2 } from 'gl-matrix';

/**
 * AffineVisualizer - Interactive 2D affine transformation visualizer
 */
export class AffineVisualizer {
    constructor() {
        this.matrix = mat3.create(); // Identity matrix by default
        this.gridSize = 5; // 5x5 grid
        this.gridSpacing = 1;

        // DOM elements
        this.originalSvg = document.getElementById('original-grid');
        this.transformedSvg = document.getElementById('transformed-grid');
        this.matrixInputs = {
            m00: document.getElementById('m00'),
            m01: document.getElementById('m01'),
            m02: document.getElementById('m02'),
            m10: document.getElementById('m10'),
            m11: document.getElementById('m11'),
            m12: document.getElementById('m12'),
        };

        this.init();
    }

    /**
     * Initialize the visualizer
     */
    init() {
        this.setupEventListeners();
        this.renderOriginalGrid();
        this.updateMatrix();
    }

    /**
     * Setup event listeners for matrix inputs
     */
    setupEventListeners() {
        Object.values(this.matrixInputs).forEach(input => {
            input.addEventListener('input', () => this.updateMatrix());
        });
    }

    /**
     * Update the transformation matrix from input values
     */
    updateMatrix() {
        // Read values from inputs
        const m00 = parseFloat(this.matrixInputs.m00.value) || 0;
        const m01 = parseFloat(this.matrixInputs.m01.value) || 0;
        const m02 = parseFloat(this.matrixInputs.m02.value) || 0;
        const m10 = parseFloat(this.matrixInputs.m10.value) || 0;
        const m11 = parseFloat(this.matrixInputs.m11.value) || 0;
        const m12 = parseFloat(this.matrixInputs.m12.value) || 0;

        // gl-matrix uses column-major format
        // [m00 m10 0]
        // [m01 m11 0]
        // [m02 m12 1]
        mat3.set(this.matrix, m00, m01, m02, m10, m11, m12, 0, 0, 1);

        this.renderTransformedGrid();
    }

    /**
     * Render the original grid
     */
    renderOriginalGrid() {
        this.renderGrid(this.originalSvg, null);
    }

    /**
     * Render the transformed grid
     */
    renderTransformedGrid() {
        this.renderGrid(this.transformedSvg, this.matrix);
    }

    /**
     * Render a grid with optional transformation
     * @param {SVGElement} svg - The SVG element to render into
     * @param {mat3|null} transformMatrix - Optional transformation matrix
     */
    renderGrid(svg, transformMatrix) {
        // Clear existing content
        svg.innerHTML = '';

        const halfSize = Math.floor(this.gridSize / 2);
        const lines = [];
        const axes = [];

        // Generate grid lines
        for (let i = -halfSize; i <= halfSize; i++) {
            // Vertical lines
            const vStart = vec2.fromValues(i * this.gridSpacing, -halfSize * this.gridSpacing);
            const vEnd = vec2.fromValues(i * this.gridSpacing, halfSize * this.gridSpacing);

            if (transformMatrix) {
                this.transformPoint(vStart, transformMatrix);
                this.transformPoint(vEnd, transformMatrix);
            }

            if (i === 0) {
                // Y-axis
                axes.push(this.createLine(vStart[0], vStart[1], vEnd[0], vEnd[1], 'axis'));
            } else {
                lines.push(this.createLine(vStart[0], vStart[1], vEnd[0], vEnd[1], 'grid-line'));
            }

            // Horizontal lines
            const hStart = vec2.fromValues(-halfSize * this.gridSpacing, i * this.gridSpacing);
            const hEnd = vec2.fromValues(halfSize * this.gridSpacing, i * this.gridSpacing);

            if (transformMatrix) {
                this.transformPoint(hStart, transformMatrix);
                this.transformPoint(hEnd, transformMatrix);
            }

            if (i === 0) {
                // X-axis
                axes.push(this.createLine(hStart[0], hStart[1], hEnd[0], hEnd[1], 'axis'));
            } else {
                lines.push(this.createLine(hStart[0], hStart[1], hEnd[0], hEnd[1], 'grid-line'));
            }
        }

        // Add a unit square for reference
        const square = this.createSquare(transformMatrix);

        // Add styles
        const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
        style.textContent = `
            .grid-line { stroke: rgba(26, 26, 46, 0.2); stroke-width: 0.02; }
            .axis { stroke: rgba(74, 111, 216, 0.6); stroke-width: 0.04; }
            .unit-square { fill: rgba(26, 26, 46, 0.15); stroke: rgba(26, 26, 46, 0.6); stroke-width: 0.05; }
        `;
        svg.appendChild(style);

        // Append all elements (grid lines first, then axes, then square on top)
        lines.forEach(line => svg.appendChild(line));
        axes.forEach(axis => svg.appendChild(axis));
        svg.appendChild(square);
    }

    /**
     * Transform a point using the given matrix
     * @param {vec2} point - Point to transform (modified in place)
     * @param {mat3} matrix - Transformation matrix
     */
    transformPoint(point, matrix) {
        const result = vec2.create();
        vec2.transformMat3(result, point, matrix);
        point[0] = result[0];
        point[1] = result[1];
    }

    /**
     * Create an SVG line element
     * @param {number} x1 - Start x coordinate
     * @param {number} y1 - Start y coordinate
     * @param {number} x2 - End x coordinate
     * @param {number} y2 - End y coordinate
     * @param {string} className - CSS class name
     * @returns {SVGLineElement}
     */
    createLine(x1, y1, x2, y2, className) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('class', className);
        return line;
    }

    /**
     * Create a unit square for visual reference
     * @param {mat3|null} transformMatrix - Optional transformation matrix
     * @returns {SVGPolygonElement}
     */
    createSquare(transformMatrix) {
        // Unit square corners
        const corners = [
            vec2.fromValues(0, 0),
            vec2.fromValues(1, 0),
            vec2.fromValues(1, 1),
            vec2.fromValues(0, 1),
        ];

        if (transformMatrix) {
            corners.forEach(corner => this.transformPoint(corner, transformMatrix));
        }

        const points = corners.map(c => `${c[0]},${c[1]}`).join(' ');

        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        polygon.setAttribute('points', points);
        polygon.setAttribute('class', 'unit-square');
        return polygon;
    }
}
