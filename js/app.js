/**
 * Main Application Logic - Rigid Heddle Pattern Visualizer
 */

// Preset Pattern Templates
const presetTemplates = {
    "simple-scarf": {
        "metadata": {
            "name": "Simple Scarf",
            "author": "Template",
            "created": "2026-01-04",
            "description": "Basic plain weave scarf - perfect for beginners"
        },
        "loom_specs": {
            "type": "rigid_heddle",
            "width_inches": 20,
            "heddle_dent": 10,
            "heddle_count": 1
        },
        "project": {
            "finished_width": 8,
            "finished_length": 60,
            "warp_ends": 80,
            "epi": 10,
            "ppi": 10
        },
        "warp": {
            "pattern": [
                {"color": "#8b4513", "threads": 1}
            ],
            "pattern_repeat": 1,
            "total_ends": 80,
            "threading": "solid"
        },
        "weft": {
            "primary_color": "#8b4513",
            "yarn_weight": "worsted",
            "shots_per_inch": 10
        },
        "weaving_sections": [
            {
                "name": "Main Body",
                "length_inches": 60,
                "technique": "plain_weave",
                "instructions": [
                    {"row": 1, "heddle": "up", "weft": "#8b4513"},
                    {"row": 2, "heddle": "down", "weft": "#8b4513"}
                ],
                "repeat": true
            }
        ],
        "finishing": {
            "method": "twisted_fringe",
            "fringe_length": 6
        }
    },
    "striped-scarf": {
        "metadata": {
            "name": "Striped Scarf",
            "author": "Template",
            "created": "2026-01-04",
            "description": "Colorful striped scarf with alternating warp colors"
        },
        "loom_specs": {
            "type": "rigid_heddle",
            "width_inches": 20,
            "heddle_dent": 10,
            "heddle_count": 1
        },
        "project": {
            "finished_width": 8,
            "finished_length": 65,
            "warp_ends": 80,
            "epi": 10,
            "ppi": 10
        },
        "warp": {
            "pattern": [
                {"color": "#e74c3c", "threads": 4},
                {"color": "#3498db", "threads": 4},
                {"color": "#f39c12", "threads": 4}
            ],
            "pattern_repeat": 12,
            "total_ends": 80,
            "threading": "striped"
        },
        "weft": {
            "primary_color": "#ecf0f1",
            "yarn_weight": "worsted",
            "shots_per_inch": 10
        },
        "weaving_sections": [
            {
                "name": "Main Body",
                "length_inches": 65,
                "technique": "plain_weave",
                "instructions": [
                    {"row": 1, "heddle": "up", "weft": "#ecf0f1"},
                    {"row": 2, "heddle": "down", "weft": "#ecf0f1"}
                ],
                "repeat": true
            }
        ],
        "finishing": {
            "method": "twisted_fringe",
            "fringe_length": 6
        }
    },
    "kitchen-towel": {
        "metadata": {
            "name": "Kitchen Towel",
            "author": "Template",
            "created": "2026-01-04",
            "description": "Practical kitchen towel in cotton"
        },
        "loom_specs": {
            "type": "rigid_heddle",
            "width_inches": 24,
            "heddle_dent": 12,
            "heddle_count": 1
        },
        "project": {
            "finished_width": 16,
            "finished_length": 26,
            "warp_ends": 192,
            "epi": 12,
            "ppi": 12
        },
        "warp": {
            "pattern": [
                {"color": "#ffffff", "threads": 1},
                {"color": "#2c3e50", "threads": 1}
            ],
            "pattern_repeat": 2,
            "total_ends": 192,
            "threading": "alternating"
        },
        "weft": {
            "primary_color": "#ffffff",
            "yarn_weight": "sport",
            "shots_per_inch": 12
        },
        "weaving_sections": [
            {
                "name": "Towel Body",
                "length_inches": 26,
                "technique": "plain_weave",
                "instructions": [
                    {"row": 1, "heddle": "up", "weft": "#ffffff"},
                    {"row": 2, "heddle": "down", "weft": "#ffffff"}
                ],
                "repeat": true
            }
        ],
        "finishing": {
            "method": "sewn_hem",
            "fringe_length": 0
        }
    },
    "table-runner": {
        "metadata": {
            "name": "Table Runner",
            "author": "Template",
            "created": "2026-01-04",
            "description": "Elegant table runner with decorative borders"
        },
        "loom_specs": {
            "type": "rigid_heddle",
            "width_inches": 20,
            "heddle_dent": 10,
            "heddle_count": 1
        },
        "project": {
            "finished_width": 14,
            "finished_length": 50,
            "warp_ends": 140,
            "epi": 10,
            "ppi": 10
        },
        "warp": {
            "pattern": [
                {"color": "#2c3e50", "threads": 1},
                {"color": "#ecf0f1", "threads": 1}
            ],
            "pattern_repeat": 2,
            "total_ends": 140,
            "threading": "alternating"
        },
        "weft": {
            "primary_color": "#95a5a6",
            "yarn_weight": "dk",
            "shots_per_inch": 10
        },
        "weaving_sections": [
            {
                "name": "Border 1",
                "length_inches": 5,
                "technique": "plain_weave",
                "instructions": [
                    {"row": 1, "heddle": "up", "weft": "#2c3e50"},
                    {"row": 2, "heddle": "down", "weft": "#2c3e50"}
                ],
                "repeat": true
            },
            {
                "name": "Main Body",
                "length_inches": 40,
                "technique": "plain_weave",
                "instructions": [
                    {"row": 1, "heddle": "up", "weft": "#95a5a6"},
                    {"row": 2, "heddle": "down", "weft": "#95a5a6"}
                ],
                "repeat": true
            },
            {
                "name": "Border 2",
                "length_inches": 5,
                "technique": "plain_weave",
                "instructions": [
                    {"row": 1, "heddle": "up", "weft": "#2c3e50"},
                    {"row": 2, "heddle": "down", "weft": "#2c3e50"}
                ],
                "repeat": true
            }
        ],
        "finishing": {
            "method": "hemstitch",
            "fringe_length": 4
        }
    }
};

// Sample Pattern Data (Navy & White Scarf - Demo Pattern)
const samplePattern = {
    "metadata": {
        "name": "Navy & White Scarf",
        "author": "AI Generated",
        "created": "2026-01-04",
        "description": "Color-and-weave scarf with pick-up section"
    },
    "loom_specs": {
        "type": "rigid_heddle",
        "width_inches": 16,
        "heddle_dent": 8,
        "heddle_count": 1
    },
    "project": {
        "finished_width": 12,
        "finished_length": 70,
        "warp_ends": 96,
        "epi": 8,
        "ppi": 10
    },
    "warp": {
        "pattern": [
            {"color": "#001f3f", "threads": 1},
            {"color": "#f5f5f5", "threads": 1}
        ],
        "pattern_repeat": 2,
        "total_ends": 96,
        "threading": "alternating"
    },
    "weft": {
        "primary_color": "#7f8c8d",
        "yarn_weight": "worsted",
        "shots_per_inch": 10
    },
    "weaving_sections": [
        {
            "name": "header",
            "length_inches": 10,
            "technique": "plain_weave",
            "instructions": [
                {"row": 1, "heddle": "up", "weft": "#7f8c8d"},
                {"row": 2, "heddle": "down", "weft": "#7f8c8d"}
            ],
            "repeat": true
        },
        {
            "name": "decorative_pickup",
            "length_inches": 6,
            "technique": "pickup_pattern",
            "pickup_sequence": [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 45, 47],
            "pickup_notes": "every odd slot",
            "instructions": [
                {"row": 1, "heddle": "up", "pickup": null, "weft": "#7f8c8d"},
                {"row": 2, "heddle": "down", "pickup": "forward", "weft": "#7f8c8d"},
                {"row": 3, "heddle": "up", "pickup": null, "weft": "#7f8c8d"},
                {"row": 4, "heddle": "down", "pickup": "back", "weft": "#7f8c8d"},
                {"row": 5, "heddle": "up", "pickup": null, "weft": "#7f8c8d"},
                {"row": 6, "heddle": "down", "pickup": "forward", "weft": "#7f8c8d"},
                {"row": 7, "heddle": "up", "pickup": null, "weft": "#7f8c8d"},
                {"row": 8, "heddle": "down", "pickup": "back", "weft": "#7f8c8d"}
            ],
            "repeat": true
        },
        {
            "name": "footer",
            "length_inches": 54,
            "technique": "plain_weave",
            "instructions": [
                {"row": 1, "heddle": "up", "weft": "#7f8c8d"},
                {"row": 2, "heddle": "down", "weft": "#7f8c8d"}
            ],
            "repeat": true
        }
    ],
    "finishing": {
        "method": "hemstitch",
        "fringe_length": 4
    }
};

// State Management
let currentPattern = JSON.parse(JSON.stringify(samplePattern));
let hasUnsavedChanges = false;
let renderDebounceTimer = null;

// Global validator and renderer instances
let validator;
let renderer;

// Initialize on page load
window.addEventListener('load', () => {
    validator = new RigidHeddleValidator();
    renderer = new WeavingRenderer('weavingCanvas');
    populateAllFields();
});

// Tab Switching
function switchTab(event, tabName) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden'));
    document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));

    document.getElementById(`tab-${tabName}`).classList.remove('hidden');
    event.target.classList.add('active');
}

// Pattern Change Handler (with auto-render debounce)
function onPatternChange() {
    hasUnsavedChanges = true;

    // Update quick facts
    updateQuickFacts();

    // Validate
    const result = validator.validate(currentPattern);
    updateValidationDisplay(result);

    // Debounced auto-render (500ms)
    clearTimeout(renderDebounceTimer);
    renderDebounceTimer = setTimeout(() => {
        renderer.renderPattern(currentPattern);
    }, 500);
}

// Input Handlers
function updatePatternName(value) {
    currentPattern.metadata.name = value;
    hasUnsavedChanges = true;
}

function updateLoomWidth(value) {
    currentPattern.loom_specs.width_inches = parseInt(value);
    validateFabricWidth();
    onPatternChange();
}

function updateHeddleDent(value) {
    currentPattern.loom_specs.heddle_dent = parseFloat(value);
    currentPattern.project.epi = parseFloat(value);
    recalculateWarpEnds();
    onPatternChange();
}

function updateFabricWidth(value) {
    currentPattern.project.finished_width = parseFloat(value);
    recalculateWarpEnds();
    validateFabricWidth();
    onPatternChange();
}

function validateFabricWidth() {
    const feedback = document.getElementById('widthFeedback');
    const input = document.getElementById('fabricWidth');
    const width = currentPattern.project.finished_width;
    const loomWidth = currentPattern.loom_specs.width_inches;

    if (width >= loomWidth - 1) {
        feedback.className = 'error-message';
        feedback.textContent = `Too wide for your ${loomWidth}" loom! Maximum: ${loomWidth - 2}" (need margins)`;
        input.classList.add('input-error');
        input.classList.remove('input-valid');
    } else {
        feedback.className = 'success-message';
        feedback.textContent = `✓ Will fit on your ${loomWidth}" loom`;
        input.classList.add('input-valid');
        input.classList.remove('input-error');
    }
}

function updateFabricLength(value) {
    currentPattern.project.finished_length = parseFloat(value);
    onPatternChange();
}

function updateFinishingMethod(value) {
    currentPattern.finishing.method = value;
    onPatternChange();
}

function updateFringeLength(value) {
    currentPattern.finishing.fringe_length = parseFloat(value);
    onPatternChange();
}

function recalculateWarpEnds() {
    const width = currentPattern.project.finished_width;
    const epi = currentPattern.project.epi;
    const totalEnds = Math.round(width * epi);

    currentPattern.warp.total_ends = totalEnds;
    currentPattern.project.warp_ends = totalEnds;

    // Update displays
    document.getElementById('calcWarpEnds').textContent = totalEnds;
    document.getElementById('calcEPI').textContent = epi;

    // Update warp preview
    updateWarpPreview();
}

function updateWarpPatternType(type) {
    if (type === 'solid') {
        currentPattern.warp.pattern = [currentPattern.warp.pattern[0]];
        currentPattern.warp.pattern_repeat = 1;
        // Hide second color picker
        document.getElementById('warpColorControls').children[1].style.display = 'none';
    } else {
        // Alternating - ensure 2 colors
        if (currentPattern.warp.pattern.length < 2) {
            currentPattern.warp.pattern.push({"color": "#f5f5f5", "threads": 1});
        }
        currentPattern.warp.pattern_repeat = 2;
        document.getElementById('warpColorControls').children[1].style.display = 'flex';
    }
    updateWarpPreview();
    onPatternChange();
}

function updateWarpColor(index, color) {
    currentPattern.warp.pattern[index].color = color;
    updateWarpPreview();
    onPatternChange();
}

function updateWarpColorName(index, name) {
    // Store in metadata for reference (not in schema but useful)
    hasUnsavedChanges = true;
}

function updateWarpThreads(index, threads) {
    currentPattern.warp.pattern[index].threads = parseInt(threads);
    currentPattern.warp.pattern_repeat = currentPattern.warp.pattern.reduce((sum, p) => sum + p.threads, 0);
    updateWarpPreview();
    onPatternChange();
}

function updateWeftColor(color) {
    currentPattern.weft.primary_color = color;
    // Update all section instructions with new weft color
    currentPattern.weaving_sections.forEach(section => {
        section.instructions.forEach(inst => {
            inst.weft = color;
        });
    });
    onPatternChange();
}

function updateWeftColorName(name) {
    hasUnsavedChanges = true;
}

function updateYarnWeight(weight) {
    currentPattern.weft.yarn_weight = weight;
    hasUnsavedChanges = true;
}

function updatePPI(value) {
    currentPattern.project.ppi = parseInt(value);
    currentPattern.weft.shots_per_inch = parseInt(value);
    onPatternChange();
}

function updateSectionName(index, name) {
    currentPattern.weaving_sections[index].name = name;
    hasUnsavedChanges = true;
}

function updateSectionLength(index, length) {
    currentPattern.weaving_sections[index].length_inches = parseFloat(length);
    updateTotalLength();
    onPatternChange();
}

function addSection() {
    // Create a new plain weave section
    const newSection = {
        "name": `Section ${currentPattern.weaving_sections.length + 1}`,
        "length_inches": 10,
        "technique": "plain_weave",
        "instructions": [
            {"row": 1, "heddle": "up", "weft": currentPattern.weft.primary_color},
            {"row": 2, "heddle": "down", "weft": currentPattern.weft.primary_color}
        ],
        "repeat": true
    };

    currentPattern.weaving_sections.push(newSection);
    populateSectionsList();
    updateTotalLength();
    onPatternChange();
}

function deleteSection(index) {
    // Prevent deleting if only one section remains
    if (currentPattern.weaving_sections.length <= 1) {
        alert('Cannot delete the last section. At least one section is required.');
        return;
    }

    const sectionName = currentPattern.weaving_sections[index].name;
    if (confirm(`Delete section "${sectionName}"?`)) {
        currentPattern.weaving_sections.splice(index, 1);
        populateSectionsList();
        updateTotalLength();
        onPatternChange();
    }
}

function moveSectionUp(index) {
    if (index === 0) return; // Already at top

    // Swap with previous section
    const temp = currentPattern.weaving_sections[index];
    currentPattern.weaving_sections[index] = currentPattern.weaving_sections[index - 1];
    currentPattern.weaving_sections[index - 1] = temp;

    populateSectionsList();
    onPatternChange();
}

function moveSectionDown(index) {
    if (index === currentPattern.weaving_sections.length - 1) return; // Already at bottom

    // Swap with next section
    const temp = currentPattern.weaving_sections[index];
    currentPattern.weaving_sections[index] = currentPattern.weaving_sections[index + 1];
    currentPattern.weaving_sections[index + 1] = temp;

    populateSectionsList();
    onPatternChange();
}

// Helper Functions
function updateQuickFacts() {
    const p = currentPattern;
    document.getElementById('infoSize').textContent = `${p.project.finished_width}" × ${p.project.finished_length}"`;
    document.getElementById('infoLoom').textContent = `${p.loom_specs.width_inches}" with ${p.loom_specs.heddle_dent}-dent heddle`;
    document.getElementById('infoEnds').textContent = `${p.warp.total_ends} @ ${p.project.epi} EPI`;

    const totalRows = p.weaving_sections.reduce((sum, s) => sum + Math.ceil(s.length_inches * p.project.ppi), 0);
    document.getElementById('infoRows').textContent = `~${totalRows} @ ${p.project.ppi} PPI`;
}

function updateWarpPreview() {
    const preview = document.getElementById('warpPreview');
    const pattern = currentPattern.warp.pattern;
    const totalEnds = currentPattern.warp.total_ends;

    preview.innerHTML = '';

    // Generate preview (show first 96 threads max)
    const showThreads = Math.min(totalEnds, 96);
    for (let i = 0; i < showThreads; i++) {
        const patternIndex = i % pattern.length;
        const thread = pattern[patternIndex];

        const div = document.createElement('div');
        div.className = 'warp-preview-thread';
        div.style.backgroundColor = thread.color;
        preview.appendChild(div);
    }

    document.getElementById('warpPreviewText').textContent = `${totalEnds} threads total`;
}

function updateTotalLength() {
    const total = currentPattern.weaving_sections.reduce((sum, s) => sum + s.length_inches, 0);
    currentPattern.project.finished_length = total;
    document.getElementById('totalLength').textContent = total;
    document.getElementById('fabricLength').value = total;
}

function populateSectionsList() {
    const container = document.getElementById('sectionsList');
    container.innerHTML = '';

    currentPattern.weaving_sections.forEach((section, index) => {
        const rows = Math.ceil(section.length_inches * currentPattern.project.ppi);
        const isFirst = index === 0;
        const isLast = index === currentPattern.weaving_sections.length - 1;

        const card = document.createElement('div');
        card.className = 'section-card';
        card.innerHTML = `
            <div class="section-card-header">
                <div class="section-reorder-controls">
                    <button class="reorder-btn" onclick="moveSectionUp(${index})"
                            ${isFirst ? 'disabled' : ''} title="Move up">↑</button>
                    <button class="reorder-btn" onclick="moveSectionDown(${index})"
                            ${isLast ? 'disabled' : ''} title="Move down">↓</button>
                </div>
                <input type="text" class="section-name" value="${section.name}"
                       onchange="updateSectionName(${index}, this.value)">
                <div class="section-header-right">
                    <span class="section-technique">${formatTechnique(section.technique)}</span>
                    <button class="delete-btn" onclick="deleteSection(${index})" title="Delete section">×</button>
                </div>
            </div>
            <div class="section-card-body">
                <div class="form-group">
                    <label class="form-label">Length (inches)</label>
                    <input type="number" class="form-input" value="${section.length_inches}"
                           min="1" step="0.5" onchange="updateSectionLength(${index}, this.value)">
                </div>
                <div class="helper-text">Approximately ${rows} rows @ ${currentPattern.project.ppi} PPI</div>
            </div>
        `;
        container.appendChild(card);
    });
}

function formatTechnique(tech) {
    const names = {
        'plain_weave': 'Plain Weave',
        'pickup_pattern': 'Pickup Pattern',
        'color_and_weave': 'Color & Weave',
        'leno_lace': 'Leno Lace'
    };
    return names[tech] || tech;
}

function updateValidationDisplay(result) {
    const container = document.getElementById('validationResults');

    if (result.valid) {
        container.className = 'validation-results valid';
        container.innerHTML = '<h4>✓ Pattern Ready to Weave</h4><p>All constraints satisfied.</p>';
    } else {
        container.className = 'validation-results invalid';
        let html = '<h4>✗ Issues Found</h4><ul>';
        result.errors.forEach(error => {
            html += `<li>${error}</li>`;
        });
        html += '</ul>';
        container.innerHTML = html;
    }
}

// Save/Load/Export
function savePattern() {
    const name = currentPattern.metadata.name;
    const key = `weave_pattern_${Date.now()}`;

    localStorage.setItem(key, JSON.stringify(currentPattern));

    // Save to recent patterns list
    let recent = JSON.parse(localStorage.getItem('recent_patterns') || '[]');
    recent.unshift({ key, name, date: new Date().toISOString() });
    recent = recent.slice(0, 5); // Keep only 5 most recent
    localStorage.setItem('recent_patterns', JSON.stringify(recent));

    hasUnsavedChanges = false;
    alert(`Pattern "${name}" saved!`);
}

function loadPattern() {
    const recent = JSON.parse(localStorage.getItem('recent_patterns') || '[]');

    if (recent.length === 0) {
        alert('No saved patterns found. Save a pattern first!');
        return;
    }

    // Show selection dialog
    const selection = prompt(
        'Select pattern:\n' +
        recent.map((p, i) => `${i + 1}. ${p.name} (${new Date(p.date).toLocaleDateString()})`).join('\n')
    );

    if (selection) {
        const index = parseInt(selection) - 1;
        if (index >= 0 && index < recent.length) {
            const key = recent[index].key;
            const saved = localStorage.getItem(key);
            if (saved) {
                currentPattern = JSON.parse(saved);
                populateAllFields();
                hasUnsavedChanges = false;
                alert('Pattern loaded!');
            }
        }
    }
}

function loadTemplate() {
    const templates = [
        { key: 'simple-scarf', name: 'Simple Scarf', desc: 'Basic plain weave (beginner)' },
        { key: 'striped-scarf', name: 'Striped Scarf', desc: 'Colorful stripes' },
        { key: 'kitchen-towel', name: 'Kitchen Towel', desc: 'Practical towel' },
        { key: 'table-runner', name: 'Table Runner', desc: 'Elegant runner with borders' }
    ];

    const selection = prompt(
        'Select a template to start from:\n' +
        templates.map((t, i) => `${i + 1}. ${t.name} - ${t.desc}`).join('\n')
    );

    if (selection) {
        const index = parseInt(selection) - 1;
        if (index >= 0 && index < templates.length) {
            const templateKey = templates[index].key;
            currentPattern = JSON.parse(JSON.stringify(presetTemplates[templateKey]));
            populateAllFields();
            hasUnsavedChanges = true;
            alert(`Template "${templates[index].name}" loaded! Customize it and save your own version.`);
        }
    }
}

function exportJSON() {
    const json = JSON.stringify(currentPattern, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentPattern.metadata.name.replace(/\s/g, '_')}.json`;
    a.click();

    URL.revokeObjectURL(url);
    alert('Pattern exported!');
}

function populateAllFields() {
    // Populate all form fields from currentPattern
    document.getElementById('patternName').value = currentPattern.metadata.name;
    document.getElementById('loomWidth').value = currentPattern.loom_specs.width_inches;
    document.getElementById('heddleDent').value = currentPattern.loom_specs.heddle_dent;
    document.getElementById('fabricWidth').value = currentPattern.project.finished_width;
    document.getElementById('fabricLength').value = currentPattern.project.finished_length;
    document.getElementById('finishingMethod').value = currentPattern.finishing.method;
    document.getElementById('fringeLength').value = currentPattern.finishing.fringe_length;

    // Colors
    document.getElementById('warpColor0').value = currentPattern.warp.pattern[0].color;
    if (currentPattern.warp.pattern.length > 1) {
        document.getElementById('warpColor1').value = currentPattern.warp.pattern[1].color;
    }
    document.getElementById('weftColor').value = currentPattern.weft.primary_color;
    document.getElementById('yarnWeight').value = currentPattern.weft.yarn_weight;
    document.getElementById('ppi').value = currentPattern.project.ppi;

    // Update all displays
    updateQuickFacts();
    updateWarpPreview();
    populateSectionsList();
    updateTotalLength();
    validateFabricWidth();

    const result = validator.validate(currentPattern);
    updateValidationDisplay(result);
    renderer.renderPattern(currentPattern);

    // Auto-fit the pattern to view
    setTimeout(() => {
        renderer.fitToView();
        const zoomPercent = Math.round(renderer.scale / 8 * 100);
        document.getElementById('zoomLevel').textContent = zoomPercent + '%';
    }, 100);
}

// Manual validation (for validate button if needed)
function validatePattern() {
    const result = validator.validate(currentPattern);
    updateValidationDisplay(result);
}

// Manual render (for render button)
function renderPattern() {
    renderer.renderPattern(currentPattern);
}

// Zoom and view controls
function zoom(factor) {
    renderer.zoom(factor);
    const zoomPercent = Math.round(renderer.scale / 8 * 100);
    document.getElementById('zoomLevel').textContent = zoomPercent + '%';
}

function fitToView() {
    renderer.fitToView();
    const zoomPercent = Math.round(renderer.scale / 8 * 100);
    document.getElementById('zoomLevel').textContent = zoomPercent + '%';
}

function resetView() {
    renderer.reset();
    document.getElementById('zoomLevel').textContent = '100%';
}
