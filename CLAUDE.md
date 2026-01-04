# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an AI-powered rigid heddle weaving pattern generator and visualizer. The project enables:
- Generation of weaving patterns via AI (LLM APIs)
- Validation of patterns against rigid heddle loom constraints
- Visual rendering of warp/weft interlacement
- Pattern adaptation for different loom specifications

## Running the Application

**Web Application (Proof of Concept):**
```bash
# Open in browser - self-contained, no build step required
open index.html
# or
xdg-open index.html
```

The `index.html` file is completely self-contained with inline CSS and JavaScript. No dependencies, build tools, or web server required.

## Core Architecture

### Pattern Data Schema

All weaving patterns follow a JSON schema with these key sections:

- `metadata`: Pattern name, author, description
- `loom_specs`: Loom width, heddle dent (5/7.5/8/10/12/12.5/15), heddle count
- `project`: Finished dimensions, warp ends, EPI (ends per inch), PPI (picks per inch)
- `warp`: Thread pattern (color sequence), total ends, threading type
- `weft`: Primary color, yarn weight, shots per inch
- `weaving_sections`: Array of sections with techniques and row-by-row instructions
- `finishing`: Hemstitch, fringe, etc.

Each `weaving_section` contains:
- `technique`: "plain_weave", "pickup_pattern", "color_and_weave", "leno_lace", etc.
- `instructions`: Array of row objects with `heddle` position ("up"/"down"), optional `pickup` position ("forward"/"back"), and `weft` color
- `pickup_sequence`: Array of thread indices for pick-up stick patterns
- `length_inches`: Section length

### Key Classes

**`RigidHeddleValidator`** (index.html:400)
- Validates pattern structural integrity
- Enforces rigid heddle physical constraints
- Checks: warp calculations (width × EPI = total ends), standard heddle dents, loom width limits, valid heddle positions, valid pickup sequences
- Returns `{valid: boolean, errors: string[]}`

**`WeavingRenderer`** (index.html:492)
- Canvas-based pattern visualization
- Calculates thread visibility based on heddle position and rigid heddle mechanics
- Key methods:
  - `renderPattern(pattern)`: Main rendering entry point
  - `calculateVisibility(threadIndex, instruction, pickupSeq)`: Determines if warp or weft shows (rigid heddle logic: odd threads in holes, even in slots)
  - `expandWarpPattern(warp)`: Expands pattern repeats into full thread array
  - `zoom(factor)`: Scale rendering
- Interactive features: hover tooltips, zoom controls, color legend

### Rigid Heddle Weaving Mechanics

The renderer implements actual rigid heddle physics:
- Threads alternate between holes (odd indices) and slots (even indices)
- `heddle: "up"` → hole threads (odd) are raised (warp visible)
- `heddle: "down"` → slot threads (even) are raised (warp visible)
- `pickup: "forward"` → picked threads override and show warp
- When warp is down, weft shows through

## Pattern Validation Rules

Must satisfy these constraints:
- Warp ends calculation: `finished_width × epi = total_ends` (must match exactly)
- EPI must be a standard heddle dent: 5, 7.5, 8, 10, 12, 12.5, or 15
- Finished width must be at least 1" less than loom width (margin)
- Heddle positions must be "up", "down", or "neutral"
- Pick-up positions must be "forward", "back", "on_edge", or null
- Pick-up sequences must reference thread indices within `total_ends`

## Pattern Adaptation

When adapting patterns to different loom sizes:
- **Width scaling**: Maintain complete pattern repeats
- **EPI adjustment**: Recalculate warp ends, adjust finished width to maintain full repeats
- **Yarn weight recommendation**: Scale based on heddle dent
  - 5 dent → bulky/super bulky
  - 8 dent → worsted/DK
  - 10 dent → DK/sport
  - 12 dent → sport/fingering
  - 15 dent → fingering/lace

## AI Integration Strategy

The technical design (technical_design.md) outlines three approaches:

1. **API-based**: OpenAI/Claude APIs with structured JSON output (~$0.01-0.05/pattern)
2. **Local LLMs**: Offline with llama.cpp/Ollama (requires fine-tuning on weaving patterns)
3. **Hybrid** (recommended): AI generation + rule-based validation with feedback loop

AI generation requires:
- System prompt with JSON schema and rigid heddle constraints
- User prompt with loom specs and desired pattern
- Validation loop: generate → validate → fix errors → regenerate if needed

## Editing the Pattern

The pattern object (`samplePattern`) is reactive:
- Edit the JSON directly in JavaScript
- Call `validatePattern()` to check validity
- Call `renderPattern()` to re-render visualization
- Call `updatePatternInfo(pattern)` to update sidebar

To add pattern editing UI:
- Add form inputs/color pickers that modify `samplePattern`
- Wire onChange handlers to call validation and rendering functions
- Pattern object is already separated from validator/renderer logic

## File Structure

- `index.html`: Complete web application (HTML + CSS + JavaScript)
- `technical_design.md`: Comprehensive technical specification
- `concept_chatgpt_export.md`: Original concept discussion and use cases

## Key Technical Details

**Standard Heddle Dents**: [5, 7.5, 8, 10, 12, 12.5, 15] (dents per inch)

**Loom Widths**: 10", 15", 16", 20", 24", 32", 40", 48"

**Supported Techniques**:
- `plain_weave`: Basic over-under (complexity: 1)
- `pickup_floats`: Warp floats with pick-up stick (complexity: 2)
- `color_and_weave`: Pattern from color interaction (complexity: 2)
- `leno_lace`: Twisted warp structure (complexity: 3)
- `double_heddle_techniques`: Advanced two-heddle patterns (complexity: 4, not yet implemented)

**Canvas Rendering**: Uses HTML5 Canvas API with grid-based rendering where each `scale × scale` pixel square represents one thread intersection. Default scale is 8px per thread.

## Future Expansion

See technical_design.md for roadmap:
- Phase 1: Core pattern generator with AI integration
- Phase 2: Full customization UI with color pickers and dimension controls
- Phase 3: Enhanced visualization (realistic textures, animations, multiple view modes)
- Phase 4: Community features (pattern library, sharing, user accounts)
