/**
 * WeavingRenderer - Canvas-based visualization of weaving patterns
 */
class WeavingRenderer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.scale = 8;
        this.offsetX = 0;
        this.offsetY = 0;
        this.pattern = null;
        this.tooltip = document.getElementById('tooltip');

        this.setupInteractivity();
    }

    renderPattern(pattern) {
        this.pattern = pattern;

        const warpThreads = this.expandWarpPattern(pattern.warp);
        const totalRows = this.calculateTotalRows(pattern);

        // Calculate canvas size
        const width = warpThreads.length * this.scale;
        const height = totalRows * this.scale;
        const pixelRatio = window.devicePixelRatio || 1;

        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;
        this.canvas.width = Math.floor(width * pixelRatio);
        this.canvas.height = Math.floor(height * pixelRatio);
        this.ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

        this.clear();

        // Render sections
        let currentY = 0;
        pattern.weaving_sections.forEach(section => {
            const sectionRows = Math.ceil(section.length_inches * pattern.project.ppi);
            this.renderSection(section, warpThreads, currentY, sectionRows);
            currentY += sectionRows;
        });

        // Update color legend
        this.updateColorLegend(pattern);
    }

    expandWarpPattern(warp) {
        const threads = [];
        const pattern = warp.pattern;

        for (let i = 0; i < warp.total_ends; i++) {
            const patternIndex = i % pattern.length;
            threads.push(pattern[patternIndex].color);
        }

        return threads;
    }

    calculateTotalRows(pattern) {
        return pattern.weaving_sections.reduce((total, section) => {
            return total + Math.ceil(section.length_inches * pattern.project.ppi);
        }, 0);
    }

    renderSection(section, warpThreads, startY, totalRows) {
        const instructions = section.instructions;
        const pickupSeq = section.pickup_sequence || [];

        for (let row = 0; row < totalRows; row++) {
            const instruction = instructions[row % instructions.length];
            const y = startY + row;

            this.renderRow(y, instruction, warpThreads, pickupSeq);
        }
    }

    renderRow(y, instruction, warpThreads, pickupSeq) {
        const weftColor = instruction.weft;

        warpThreads.forEach((warpColor, threadIndex) => {
            const x = threadIndex * this.scale;
            const screenY = y * this.scale + this.offsetY;
            const screenX = x + this.offsetX;

            // Determine which thread shows
            const isWarpVisible = this.calculateVisibility(
                threadIndex,
                instruction,
                pickupSeq
            );

            // Draw the square
            this.ctx.fillStyle = isWarpVisible ? warpColor : weftColor;
            this.ctx.fillRect(screenX, screenY, this.scale, this.scale);

            // Draw subtle grid
            this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
            this.ctx.lineWidth = 0.5;
            this.ctx.strokeRect(screenX, screenY, this.scale, this.scale);
        });
    }

    calculateVisibility(threadIndex, instruction, pickupSeq) {
        // In rigid heddle: odd threads in holes, even in slots
        const inHole = threadIndex % 2 === 1;
        const isPickedUp = pickupSeq.includes(threadIndex);

        if (instruction.heddle === 'up') {
            return inHole;
        } else if (instruction.heddle === 'down') {
            if (instruction.pickup === 'forward' && isPickedUp) {
                return true;
            }
            return !inHole;
        }

        return false;
    }

    clear() {
        const pixelRatio = window.devicePixelRatio || 1;
        const width = this.canvas.width / pixelRatio;
        const height = this.canvas.height / pixelRatio;
        this.ctx.clearRect(0, 0, width, height);
        this.ctx.fillStyle = '#f8f9fa';
        this.ctx.fillRect(0, 0, width, height);
    }

    zoom(factor) {
        this.scale *= factor;
        if (this.pattern) {
            this.renderPattern(this.pattern);
        }
    }

    reset() {
        this.scale = 8;
        this.offsetX = 0;
        this.offsetY = 0;
        if (this.pattern) {
            this.renderPattern(this.pattern);
        }
    }

    fitToView() {
        if (!this.pattern) return;

        const warpThreads = this.expandWarpPattern(this.pattern.warp);
        const totalRows = this.calculateTotalRows(this.pattern);

        // Pattern dimensions at scale 1
        const patternWidth = warpThreads.length;
        const patternHeight = totalRows;

        // Canvas dimensions
        const canvasWidth = this.canvas.clientWidth || this.canvas.width;
        const canvasHeight = this.canvas.clientHeight || this.canvas.height;

        // Calculate scale to fit with 10% margin
        const scaleX = (canvasWidth * 0.9) / patternWidth;
        const scaleY = (canvasHeight * 0.9) / patternHeight;
        this.scale = Math.min(scaleX, scaleY);

        // Center the pattern
        const scaledWidth = patternWidth * this.scale;
        const scaledHeight = patternHeight * this.scale;
        this.offsetX = (canvasWidth - scaledWidth) / 2;
        this.offsetY = (canvasHeight - scaledHeight) / 2;

        this.renderPattern(this.pattern);
    }

    setupInteractivity() {
        // Pan/drag state
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.dragOffsetX = 0;
        this.dragOffsetY = 0;

        // Mouse down - start dragging
        this.canvas.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.dragStartX = e.clientX;
            this.dragStartY = e.clientY;
            this.dragOffsetX = this.offsetX;
            this.dragOffsetY = this.offsetY;
            this.canvas.style.cursor = 'grabbing';
        });

        // Mouse move - drag or show tooltip
        this.canvas.addEventListener('mousemove', (e) => {
            if (!this.pattern) return;

            if (this.isDragging) {
                // Pan the view
                const dx = e.clientX - this.dragStartX;
                const dy = e.clientY - this.dragStartY;
                this.offsetX = this.dragOffsetX + dx;
                this.offsetY = this.dragOffsetY + dy;
                this.renderPattern(this.pattern);
                this.tooltip.style.display = 'none';
            } else {
                // Show tooltip
                const rect = this.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const threadNum = Math.floor((x - this.offsetX) / this.scale);
                const rowNum = Math.floor((y - this.offsetY) / this.scale);

                if (threadNum >= 0 && threadNum < this.pattern.warp.total_ends) {
                    this.tooltip.style.display = 'block';
                    this.tooltip.style.left = e.clientX + 15 + 'px';
                    this.tooltip.style.top = e.clientY + 15 + 'px';
                    this.tooltip.textContent = `Thread: ${threadNum + 1}, Row: ${rowNum + 1}`;
                } else {
                    this.tooltip.style.display = 'none';
                }

                // Update cursor
                this.canvas.style.cursor = 'grab';
            }
        });

        // Mouse up - stop dragging
        const stopDragging = () => {
            this.isDragging = false;
            this.canvas.style.cursor = 'grab';
        };

        this.canvas.addEventListener('mouseup', stopDragging);
        this.canvas.addEventListener('mouseleave', () => {
            stopDragging();
            this.tooltip.style.display = 'none';
        });

        // Mouse wheel - pan or zoom at cursor position with modifier
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();

            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            if (e.ctrlKey || e.metaKey) {
                // Calculate point in pattern coordinates before zoom
                const patternX = (mouseX - this.offsetX) / this.scale;
                const patternY = (mouseY - this.offsetY) / this.scale;

                // Zoom
                const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
                this.scale *= zoomFactor;
                this.scale = Math.max(2, Math.min(this.scale, 50)); // Limit zoom range

                // Adjust offset to keep point under cursor
                this.offsetX = mouseX - patternX * this.scale;
                this.offsetY = mouseY - patternY * this.scale;

                if (this.pattern) {
                    this.renderPattern(this.pattern);
                }

                // Update zoom level display
                const zoomPercent = Math.round(this.scale / 8 * 100);
                document.getElementById('zoomLevel').textContent = zoomPercent + '%';
            } else {
                this.offsetX -= e.deltaX;
                this.offsetY -= e.deltaY;

                if (this.pattern) {
                    this.renderPattern(this.pattern);
                }
            }
        }, { passive: false });
    }

    updateColorLegend(pattern) {
        const legend = document.getElementById('colorLegend');
        legend.innerHTML = '';

        // Collect unique colors
        const colors = new Set();
        pattern.warp.pattern.forEach(p => colors.add(p.color));
        colors.add(pattern.weft.primary_color);

        const colorNames = {
            '#001f3f': 'Navy',
            '#f5f5f5': 'White',
            '#7f8c8d': 'Grey'
        };

        colors.forEach(color => {
            const item = document.createElement('div');
            item.className = 'legend-item';

            const colorBox = document.createElement('div');
            colorBox.className = 'legend-color';
            colorBox.style.backgroundColor = color;

            const label = document.createElement('span');
            label.textContent = colorNames[color] || color;

            item.appendChild(colorBox);
            item.appendChild(label);
            legend.appendChild(item);
        });
    }
}
