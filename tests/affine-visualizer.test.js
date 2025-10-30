import { mat3, vec2 } from 'gl-matrix';
import { AffineVisualizer } from '../src/js/affine-visualizer.js';

// Mock DOM elements
function setupDOM() {
    document.body.innerHTML = `
        <svg id="original-grid"></svg>
        <svg id="transformed-grid"></svg>
        <input type="number" id="m00" value="1" />
        <input type="number" id="m01" value="0" />
        <input type="number" id="m02" value="0" />
        <input type="number" id="m10" value="0" />
        <input type="number" id="m11" value="1" />
        <input type="number" id="m12" value="0" />
    `;
}

describe('AffineVisualizer', () => {
    let visualizer;

    beforeEach(() => {
        setupDOM();
        visualizer = new AffineVisualizer();
    });

    describe('initialization', () => {
        test('should create an identity matrix by default', () => {
            const expected = mat3.create();
            expect(visualizer.matrix).toEqual(expected);
        });

        test('should set grid size to 5', () => {
            expect(visualizer.gridSize).toBe(5);
        });

        test('should find all DOM elements', () => {
            expect(visualizer.originalSvg).toBeTruthy();
            expect(visualizer.transformedSvg).toBeTruthy();
            expect(Object.keys(visualizer.matrixInputs).length).toBe(6);
        });
    });

    describe('matrix updates', () => {
        test('should update matrix when input values change', () => {
            visualizer.matrixInputs.m00.value = '2';
            visualizer.matrixInputs.m11.value = '3';
            visualizer.updateMatrix();

            // gl-matrix uses column-major format
            expect(visualizer.matrix[0]).toBe(2); // m00
            expect(visualizer.matrix[4]).toBe(3); // m11
        });

        test('should handle translation values', () => {
            visualizer.matrixInputs.m02.value = '5'; // tx
            visualizer.matrixInputs.m12.value = '10'; // ty
            visualizer.updateMatrix();

            expect(visualizer.matrix[2]).toBe(5); // tx
            expect(visualizer.matrix[5]).toBe(10); // ty
        });

        test('should handle rotation matrix (90 degrees)', () => {
            // 90 degree rotation: cos(90)=0, sin(90)=1
            // [0 -1 0]
            // [1  0 0]
            visualizer.matrixInputs.m00.value = '0';
            visualizer.matrixInputs.m01.value = '1';
            visualizer.matrixInputs.m10.value = '-1';
            visualizer.matrixInputs.m11.value = '0';
            visualizer.updateMatrix();

            expect(visualizer.matrix[0]).toBe(0);
            expect(visualizer.matrix[1]).toBe(1);
            expect(visualizer.matrix[3]).toBe(-1);
            expect(visualizer.matrix[4]).toBe(0);
        });
    });

    describe('point transformation', () => {
        test('should transform a point correctly with identity matrix', () => {
            const point = vec2.fromValues(1, 2);
            visualizer.transformPoint(point, visualizer.matrix);

            expect(point[0]).toBeCloseTo(1);
            expect(point[1]).toBeCloseTo(2);
        });

        test('should transform a point with scale matrix', () => {
            const scaleMatrix = mat3.fromValues(2, 0, 0, 0, 3, 0, 0, 0, 1);
            const point = vec2.fromValues(1, 1);
            visualizer.transformPoint(point, scaleMatrix);

            expect(point[0]).toBeCloseTo(2);
            expect(point[1]).toBeCloseTo(3);
        });

        test('should transform a point with translation matrix', () => {
            // gl-matrix uses column-major format
            // [1 0 0]   [m0 m3 m6]
            // [0 1 0] = [m1 m4 m7]
            // [5 10 1]  [m2 m5 m8]
            const translateMatrix = mat3.fromValues(1, 0, 0, 0, 1, 0, 5, 10, 1);
            const point = vec2.fromValues(0, 0);
            visualizer.transformPoint(point, translateMatrix);

            expect(point[0]).toBeCloseTo(5);
            expect(point[1]).toBeCloseTo(10);
        });
    });

    describe('grid rendering', () => {
        test('should render grid lines in SVG', () => {
            visualizer.renderOriginalGrid();

            const svg = visualizer.originalSvg;
            const lines = svg.querySelectorAll('line');

            // 5x5 grid has 6 vertical and 6 horizontal lines = 12 total
            // But 2 are axes, so 10 regular grid lines + 2 axes
            expect(lines.length).toBeGreaterThan(0);
        });

        test('should render unit square', () => {
            visualizer.renderOriginalGrid();

            const square = visualizer.originalSvg.querySelector('.unit-square');
            expect(square).toBeTruthy();
        });

        test('should render axes with correct class', () => {
            visualizer.renderOriginalGrid();

            const axes = visualizer.originalSvg.querySelectorAll('.axis');
            expect(axes.length).toBe(2); // X and Y axes
        });
    });

    describe('createSquare', () => {
        test('should create a unit square at origin', () => {
            const square = visualizer.createSquare(null);
            const points = square.getAttribute('points');

            expect(points).toContain('0,0');
            expect(points).toContain('1,0');
            expect(points).toContain('1,1');
            expect(points).toContain('0,1');
        });

        test('should transform square with scale matrix', () => {
            const scaleMatrix = mat3.fromValues(2, 0, 0, 0, 2, 0, 0, 0, 1);
            const square = visualizer.createSquare(scaleMatrix);
            const points = square.getAttribute('points');

            expect(points).toContain('0,0');
            expect(points).toContain('2,0');
            expect(points).toContain('2,2');
            expect(points).toContain('0,2');
        });
    });
});
