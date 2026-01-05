# Technical Design: AI-Powered Rigid Heddle Pattern Generator

## 1. Pattern Data Model

### Core Pattern Schema

A rigid heddle pattern can be represented as structured data:

```json
{
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
      {"color": "navy", "threads": 1},
      {"color": "white", "threads": 1}
    ],
    "pattern_repeat": 48,
    "total_ends": 96,
    "threading": "alternating"
  },
  "weft": {
    "primary_color": "grey",
    "yarn_weight": "worsted",
    "shots_per_inch": 10
  },
  "weaving_sections": [
    {
      "name": "header",
      "length_inches": 10,
      "technique": "plain_weave",
      "instructions": [
        {"row": 1, "heddle": "up", "weft": "grey"},
        {"row": 2, "heddle": "down", "weft": "grey"}
      ],
      "repeat": true
    },
    {
      "name": "decorative_pickup",
      "length_inches": 6,
      "technique": "pickup_pattern",
      "pickup_sequence": [1, 3, 5, 7, 9, 11],
      "pickup_notes": "every odd slot",
      "instructions": [
        {"row": 1, "heddle": "up", "pickup": null, "weft": "grey"},
        {"row": 2, "heddle": "down", "pickup": "forward", "weft": "grey"},
        {"row": 3, "heddle": "up", "pickup": null, "weft": "grey"},
        {"row": 4, "heddle": "down", "pickup": "back", "weft": "grey"},
        {"row": 5, "heddle": "up", "pickup": null, "weft": "grey"},
        {"row": 6, "heddle": "down", "pickup": "forward", "weft": "grey"},
        {"row": 7, "heddle": "up", "pickup": null, "weft": "grey"},
        {"row": 8, "heddle": "down", "pickup": "back", "weft": "grey"}
      ],
      "repeat": true
    },
    {
      "name": "footer",
      "length_inches": 54,
      "technique": "plain_weave",
      "instructions": [
        {"row": 1, "heddle": "up", "weft": "grey"},
        {"row": 2, "heddle": "down", "weft": "grey"}
      ],
      "repeat": true
    }
  ],
  "finishing": {
    "method": "hemstitch",
    "fringe_length": 4
  }
}
```

### Why This Schema Works

**Modularity**: Sections can be added, removed, or reordered
**Repeatability**: Patterns define repeating units, not every single row
**Scalability**: Can represent simple to complex patterns
**Machine & Human Readable**: JSON for code, structured for AI understanding
**Adaptable**: Easy to adjust dimensions, colors, or techniques

---

## 2. AI Integration Architecture

### Option A: Direct LLM API Integration

**Using OpenAI API (GPT-4) or Claude API**

```python
# Pseudo-code for pattern generation
def generate_pattern(user_prompt, loom_specs):
    system_prompt = """
    You are a rigid heddle weaving pattern designer.
    Generate patterns as valid JSON matching this schema:
    [schema here]

    Constraints:
    - Respect loom width and heddle dent
    - Use only techniques possible on rigid heddle
    - Calculate warp ends correctly (width * epi)
    - Ensure structural integrity
    """

    response = openai.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"{user_prompt}\n\nLoom: {loom_specs}"}
        ],
        response_format={"type": "json_object"}  # Force JSON output
    )

    pattern = json.loads(response.choices[0].message.content)
    return validate_pattern(pattern)
```

**Pros:**
- Direct API access to latest models
- Structured output mode for reliable JSON
- Can iterate with conversation history
- Access to vision models for photo-to-pattern

**Cons:**
- API costs (though minimal for text)
- Requires internet connection
- Rate limits to manage

**Cost Estimate**: ~$0.01-0.05 per pattern generation

---

### Option B: Local LLM with Fine-Tuning

**Using llama.cpp, Ollama, or similar**

```python
# Local model approach
from llama_cpp import Llama

llm = Llama(
    model_path="./models/mistral-7b-weaving.gguf",
    n_ctx=4096
)

def generate_local_pattern(prompt, loom_specs):
    full_prompt = f"""<|system|>
You are a weaving pattern generator...
<|user|>
{prompt}
Loom: {json.dumps(loom_specs)}
<|assistant|>
"""

    response = llm(full_prompt, max_tokens=2000)
    return parse_and_validate(response['choices'][0]['text'])
```

**Pros:**
- No API costs or rate limits
- Works offline
- Complete privacy
- Can fine-tune on weaving-specific data

**Cons:**
- Requires model training/fine-tuning
- Need compute resources (GPU helpful)
- May not match GPT-4 quality initially

**Fine-Tuning Dataset Needs:**
- Existing weaving patterns (Ravelry, Handweaving.net)
- Pattern drafts from books (public domain)
- Synthetic examples generated from GPT-4
- ~1000-5000 pattern examples for good results

---

### Option C: Hybrid Approach (Recommended)

**Combine LLM with Rule-Based Validation**

```python
class PatternGenerator:
    def __init__(self, use_api=True):
        self.use_api = use_api
        if use_api:
            self.client = openai.Client()
        else:
            self.llm = Llama(model_path="./models/local.gguf")

        self.validator = RigidHeddleValidator()
        self.adaptor = PatternAdaptor()

    def generate(self, prompt, loom_specs, max_attempts=3):
        for attempt in range(max_attempts):
            # Generate pattern via AI
            pattern = self._call_llm(prompt, loom_specs)

            # Validate structural integrity
            is_valid, errors = self.validator.validate(pattern)

            if is_valid:
                return pattern
            else:
                # Feed errors back to AI for correction
                prompt = f"{prompt}\n\nPrevious attempt had errors: {errors}"

        raise PatternGenerationError("Could not generate valid pattern")

    def adapt_to_loom(self, pattern, new_loom_specs):
        """Scale/adjust pattern for different loom"""
        return self.adaptor.adapt(pattern, new_loom_specs)
```

---

## 3. Graphical Pattern Visualization

### Rendering Approaches

#### A. Canvas-Based Web Rendering (Recommended for Web)

**HTML5 Canvas for interactive, fast rendering**

```javascript
class RigidHeddleRenderer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.scale = 10; // pixels per thread
    this.colorMap = {};
  }

  renderPattern(pattern) {
    // Render warp threads
    this.renderWarp(pattern.warp);

    // Render each weaving section
    pattern.weaving_sections.forEach(section => {
      this.renderSection(section, pattern.warp);
    });

    // Add interactive elements
    this.addInteractivity();
  }

  renderWarp(warp) {
    const threads = this.expandWarpPattern(warp);
    threads.forEach((thread, index) => {
      const x = index * this.scale;
      this.ctx.fillStyle = this.colorMap[thread.color] || thread.color;
      this.ctx.fillRect(x, 0, this.scale, this.canvas.height);

      // Draw vertical line for thread separation
      this.ctx.strokeStyle = '#00000020';
      this.ctx.strokeRect(x, 0, this.scale, this.canvas.height);
    });
  }

  renderSection(section, warp) {
    const startY = this.calculateYPosition(section);

    section.instructions.forEach((row, rowIndex) => {
      const y = startY + (rowIndex * this.scale);

      // Determine which threads are up/down
      const shed = this.calculateShed(row, warp, section.pickup_sequence);

      this.renderRow(y, shed, row.weft);
    });
  }

  calculateShed(row, warp, pickupSeq) {
    // Logic for determining which threads show based on:
    // - heddle position (up/down)
    // - pickup stick position
    // - rigid heddle threading pattern

    const threads = [];
    const totalEnds = warp.total_ends;

    for (let i = 0; i < totalEnds; i++) {
      const inHole = i % 2 === 0; // simplified - actual logic more complex
      const pickedUp = pickupSeq && pickupSeq.includes(i);

      let visible = false;

      if (row.heddle === 'up') {
        visible = inHole;
      } else if (row.heddle === 'down') {
        visible = !inHole;
      }

      if (row.pickup === 'forward' && pickedUp) {
        visible = true;
      }

      threads.push({
        index: i,
        visible: visible,
        color: warp.pattern[i % warp.pattern.length].color
      });
    }

    return threads;
  }

  renderRow(y, shed, weftColor) {
    shed.forEach(thread => {
      const x = thread.index * this.scale;

      if (thread.visible) {
        // Warp thread shows on top
        this.ctx.fillStyle = this.colorMap[thread.color] || thread.color;
      } else {
        // Weft shows
        this.ctx.fillStyle = this.colorMap[weftColor] || weftColor;
      }

      this.ctx.fillRect(x, y, this.scale, this.scale);
    });
  }

  addInteractivity() {
    // Zoom controls
    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.scale *= e.deltaY < 0 ? 1.1 : 0.9;
      this.render(); // re-render at new scale
    });

    // Hover to show row/thread details
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const threadNum = Math.floor(x / this.scale);
      const rowNum = Math.floor(y / this.scale);

      this.showTooltip(threadNum, rowNum);
    });
  }
}
```

**Rendering Modes:**

1. **Draft View**: Traditional weaving draft (threading, tie-up, treadling, drawdown)
2. **Realistic View**: Show actual fabric appearance with texture
3. **Schematic View**: Simplified color blocks for quick overview
4. **3D View**: Simulate actual thread interlacement depth (advanced)

---

#### B. SVG Rendering (Scalable, Print-Friendly)

```javascript
class SVGPatternRenderer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.svg = null;
  }

  renderPattern(pattern) {
    const width = pattern.warp.total_ends * 10;
    const height = this.calculateTotalRows(pattern) * 10;

    this.svg = `
      <svg xmlns="http://www.w3.org/2000/svg"
           width="${width}"
           height="${height}"
           viewBox="0 0 ${width} ${height}">
        <defs>
          ${this.createPatternDefs(pattern)}
        </defs>
        ${this.renderWarpThreads(pattern.warp)}
        ${this.renderWeftPasses(pattern)}
      </svg>
    `;

    this.container.innerHTML = this.svg;
  }

  // SVG is resolution-independent, perfect for printing
  exportForPrint() {
    const svgBlob = new Blob([this.svg], {type: 'image/svg+xml'});
    return URL.createObjectURL(svgBlob);
  }
}
```

---

#### C. WebGL for Large/Complex Patterns

For patterns with thousands of threads or real-time editing:

```javascript
// Using Three.js or raw WebGL
class WebGLPatternRenderer {
  // Vertex shader for each thread intersection
  // Fragment shader for color/texture
  // Instance rendering for performance

  // Can handle 10,000+ thread intersections at 60fps
}
```

---

### Visualization Features

**Essential:**
- Color-accurate rendering
- Zoom and pan
- Export to PNG/PDF for printing
- Show warp pattern clearly
- Indicate pick-up stick positions

**Nice to Have:**
- Animated weaving sequence (step-through)
- Side-by-side comparison of variations
- Yarn texture simulation
- Lighting effects for realistic appearance
- Thread count overlay
- Measurement rulers

---

## 4. Pattern Adaptation & Customization

### Loom Size Adaptation

**Key Variables for Rigid Heddle:**

1. **Loom Width**: 10", 15", 20", 24", 32", 40"
2. **Heddle Dent**: 5, 7.5, 8, 10, 12, 12.5, 15 dpi (dents per inch)
3. **Heddle Count**: 1 (standard), 2 (double heddle - more complex)

**What Changes When Adapting:**

```python
class PatternAdaptor:
    def adapt(self, pattern, target_loom):
        adapted = pattern.copy()

        # 1. Width Scaling
        if target_loom.width != pattern.loom_specs.width:
            adapted = self.scale_width(pattern, target_loom)

        # 2. EPI Adjustment (heddle dent change)
        if target_loom.heddle_dent != pattern.loom_specs.heddle_dent:
            adapted = self.adjust_epi(adapted, target_loom)

        # 3. Yarn Weight Recommendation
        adapted = self.suggest_yarn_weight(adapted, target_loom)

        return adapted

    def scale_width(self, pattern, target_loom):
        """Scale pattern to fit new loom width"""
        original_width = pattern.project.finished_width
        max_width = target_loom.width - 2  # 1" margin each side

        if original_width > max_width:
            # Scale down proportionally
            scale_factor = max_width / original_width
            return self.apply_scale(pattern, scale_factor)
        else:
            # Can fit as-is or center with margins
            return pattern

    def adjust_epi(self, pattern, target_loom):
        """Recalculate for different heddle dent"""
        new_epi = target_loom.heddle_dent
        old_epi = pattern.project.epi

        # Total warp ends change
        new_ends = int(pattern.project.finished_width * new_epi)

        # Pattern repeat may need adjustment
        if new_ends % pattern.warp.pattern_repeat != 0:
            # Adjust finished width to maintain complete pattern repeats
            complete_repeats = new_ends // pattern.warp.pattern_repeat
            new_ends = complete_repeats * pattern.warp.pattern_repeat
            new_width = new_ends / new_epi

            return self.update_pattern_specs(
                pattern,
                new_ends=new_ends,
                new_width=new_width,
                new_epi=new_epi
            )

        return pattern

    def suggest_yarn_weight(self, pattern, target_loom):
        """Recommend yarn weight based on heddle dent"""
        yarn_suggestions = {
            5: "bulky or super bulky",
            7.5: "worsted or aran",
            8: "worsted or DK",
            10: "DK or sport",
            12: "sport or fingering",
            15: "fingering or lace"
        }

        pattern.yarn_recommendation = yarn_suggestions.get(
            target_loom.heddle_dent,
            "medium weight"
        )

        return pattern
```

### Intelligent Adaptation Strategies

**Maintain Pattern Integrity:**

1. **Repeat-Aware Scaling**: Keep complete pattern repeats
2. **Proportional Color Balance**: Maintain color ratios
3. **Structure Preservation**: Don't break weaving techniques
4. **Visual Similarity**: Target similar finished appearance

**Example Adaptation:**

```
Original Pattern:
- 16" loom, 8 dent heddle
- 12" wide fabric, 96 ends
- Alternating navy/white (2-thread repeat)

Adapted to 10" loom, 10 dent heddle:
- Maximum 8" wide fabric
- 80 ends at 10 epi
- Still alternating navy/white (40 repeats)
- Recommend sport weight yarn (vs original worsted)
```

---

### Pattern Variations

**Automated Variations to Offer:**

```python
class PatternVariator:
    def create_variations(self, base_pattern):
        variations = []

        # Color variations
        variations.extend(self.color_variations(base_pattern))

        # Width variations (narrower/wider)
        variations.extend(self.width_variations(base_pattern))

        # Technique swaps (plain weave <-> pick-up patterns)
        variations.extend(self.technique_variations(base_pattern))

        return variations

    def color_variations(self, pattern):
        # Swap colors while maintaining structure
        # Suggest complementary/analogous color schemes
        pass

    def width_variations(self, pattern):
        # 50%, 75%, 125%, 150% width
        # Adjust repeats accordingly
        pass

    def technique_variations(self, pattern):
        # Convert plain weave section to simple pick-up
        # Or vice versa for simpler version
        pass
```

---

## 5. Rigid Heddle Constraints & Validation

### Physical Constraints to Enforce

```python
class RigidHeddleValidator:
    def __init__(self):
        self.constraints = {
            'min_warp_ends': 10,
            'max_warp_ends_per_inch': 15,
            'min_warp_ends_per_inch': 2.5,
            'standard_heddle_dents': [5, 7.5, 8, 10, 12, 12.5, 15],
            'max_loom_width': 48,  # inches
            'min_project_length': 6,  # practical minimum
        }

    def validate(self, pattern):
        errors = []

        # 1. Warp calculations must be correct
        calculated_ends = pattern.project.finished_width * pattern.project.epi
        if calculated_ends != pattern.warp.total_ends:
            errors.append(
                f"Warp end mismatch: {calculated_ends} calculated vs "
                f"{pattern.warp.total_ends} specified"
            )

        # 2. EPI must match available heddle
        if pattern.project.epi not in self.constraints['standard_heddle_dents']:
            errors.append(
                f"EPI {pattern.project.epi} doesn't match standard heddle. "
                f"Use: {self.constraints['standard_heddle_dents']}"
            )

        # 3. Width must fit loom
        if pattern.project.finished_width >= pattern.loom_specs.width_inches:
            errors.append(
                f"Fabric width {pattern.project.finished_width}\" too wide "
                f"for {pattern.loom_specs.width_inches}\" loom (need margins)"
            )

        # 4. Validate each weaving section
        for section in pattern.weaving_sections:
            section_errors = self.validate_section(section, pattern)
            errors.extend(section_errors)

        # 5. Pick-up sequences must be valid
        errors.extend(self.validate_pickup_sequences(pattern))

        return len(errors) == 0, errors

    def validate_section(self, section, pattern):
        errors = []

        for instruction in section.instructions:
            # Heddle position must be 'up' or 'down'
            if instruction['heddle'] not in ['up', 'down', 'neutral']:
                errors.append(
                    f"Invalid heddle position: {instruction['heddle']}"
                )

            # Pick-up stick positions must be valid
            if 'pickup' in instruction:
                if instruction['pickup'] not in [None, 'forward', 'back', 'on_edge']:
                    errors.append(
                        f"Invalid pickup position: {instruction['pickup']}"
                    )

        return errors

    def validate_pickup_sequences(self, pattern):
        errors = []

        for section in pattern.weaving_sections:
            if 'pickup_sequence' in section:
                seq = section['pickup_sequence']
                max_end = pattern.warp.total_ends

                # All picks must be within warp range
                if any(pick >= max_end for pick in seq):
                    errors.append(
                        f"Pick-up sequence {seq} references threads beyond "
                        f"total warp ends ({max_end})"
                    )

                # Check for physically impossible picks
                # (depends on rigid heddle threading)

        return errors
```

### Rigid Heddle Technique Library

```python
RIGID_HEDDLE_TECHNIQUES = {
    'plain_weave': {
        'complexity': 1,
        'description': 'Basic over-under weaving',
        'requirements': [],
        'pattern': [
            {'heddle': 'up', 'pickup': None},
            {'heddle': 'down', 'pickup': None}
        ]
    },
    'pickup_floats': {
        'complexity': 2,
        'description': 'Decorative warp floats using pickup stick',
        'requirements': ['pickup_stick'],
        'variations': ['even_picks', 'odd_picks', 'custom_sequence']
    },
    'color_and_weave': {
        'complexity': 2,
        'description': 'Patterns created by color interaction',
        'requirements': ['multi_color_warp'],
        'notes': 'Plain weave structure with colored threads'
    },
    'leno_lace': {
        'complexity': 3,
        'description': 'Open lace structure by twisting warps',
        'requirements': ['pickup_stick', 'threading_hook'],
        'caution': 'Requires skill and practice'
    },
    'double_heddle_techniques': {
        'complexity': 4,
        'description': 'Advanced patterns with two heddles',
        'requirements': ['second_heddle', 'heddle_blocks'],
        'enabled': False  # Start with single heddle
    }
}
```

---

## 6. User Interface Flow

### Pattern Generation Workflow

```
1. User Input
   ├─ Natural language prompt
   │  "Make me a warm scarf with autumn colors"
   ├─ Loom specifications
   │  - Width: 16"
   │  - Heddle: 8 dent
   │  - Available width: 12"
   └─ Optional constraints
      - Project type: scarf, shawl, towel, etc.
      - Skill level: beginner, intermediate, advanced
      - Time budget: quick project vs. heirloom

2. AI Generation
   ├─ Parse intent
   ├─ Generate pattern JSON
   ├─ Validate structure
   └─ Iterate if needed

3. Visualization
   ├─ Render pattern preview
   ├─ Show color palette
   ├─ Display key measurements
   └─ Indicate complexity level

4. Customization
   ├─ Adjust colors (color picker)
   ├─ Modify dimensions
   ├─ Change sections
   └─ Preview updates in real-time

5. Export
   ├─ Print-friendly PDF
   ├─ JSON for reimport
   ├─ Shopping list (yarn requirements)
   └─ Step-by-step instructions
```

---

## 7. Technology Stack Recommendation

### Frontend (Web Application)

```yaml
Core:
  - Framework: React or Vue.js
  - Language: TypeScript
  - Build: Vite or Next.js

Visualization:
  - Canvas: Konva.js or Fabric.js
  - SVG: D3.js (optional)
  - 3D: Three.js (for advanced view)

UI Components:
  - shadcn/ui or Material-UI
  - Color picker: react-colorful
  - Forms: React Hook Form

State Management:
  - Zustand or Redux Toolkit
  - Pattern state
  - User preferences
```

### Backend (API)

```yaml
Option A - Lightweight:
  - Runtime: Node.js/Bun
  - Framework: Fastify or Hono
  - AI: Direct API calls to OpenAI/Anthropic

Option B - Python:
  - Framework: FastAPI
  - AI: LangChain for complex workflows
  - Local LLM: llama-cpp-python

Database:
  - PostgreSQL (user patterns, library)
  - Redis (caching, sessions)
  - S3 (pattern images, PDFs)
```

### Desktop Application (Optional)

```yaml
Framework: Electron or Tauri
Benefits:
  - Offline AI via local models
  - Better file system access
  - Native performance
  - No internet required after setup
```

---

## 8. MVP Feature Set

### Phase 1: Core Pattern Generator

- [ ] Natural language pattern generation
- [ ] Basic rigid heddle validation
- [ ] JSON pattern schema
- [ ] Simple canvas visualization
- [ ] Export to PDF/JSON
- [ ] Single loom size support (16", 8-dent)

### Phase 2: Customization

- [ ] Color picker and palette editor
- [ ] Dimension adjustment
- [ ] Multiple loom size support
- [ ] Pattern adaptation algorithm
- [ ] Yarn calculator
- [ ] Save/load patterns locally

### Phase 3: Enhanced Visualization

- [ ] Realistic rendering with texture
- [ ] Zoom/pan/interactive canvas
- [ ] Step-by-step animation
- [ ] Multiple view modes
- [ ] Print optimization

### Phase 4: Community & Library

- [ ] Pattern library/gallery
- [ ] Share patterns
- [ ] User accounts
- [ ] Pattern ratings/comments
- [ ] Yarn database integration

---

## 9. Open Questions & Future Research

1. **Color Accuracy**: How to ensure displayed colors match physical yarn?
   - Use standardized color spaces (Lab/LCH)
   - Allow camera-based yarn scanning
   - Integration with yarn manufacturer color codes

2. **Pattern Originality**: How to credit/handle AI-generated patterns?
   - All AI patterns are derivative
   - Mark as "AI-assisted"
   - Allow human designer credit

3. **Learning Curve**: How to help beginners vs. serve experts?
   - Skill level filtering
   - Complexity indicators
   - Built-in tutorials

4. **Physical Testing**: How to validate AI patterns actually work?
   - Community testing program
   - Feedback loop for improvements
   - Expert weaver review

5. **Pattern Library Format**: Should we create a new standard?
   - Extend existing formats (.wif, .dtx)
   - Or create rigid-heddle-specific format
   - Interoperability with existing software

6. **Multi-Shaft Loom Support**: Can this be extended beyond rigid heddle?
   - Current design is optimized for 2-shaft (rigid heddle) physics
   - Complex geometric patterns require 4-shaft, 8-shaft, or more
   - Would need significant architecture changes:
     - Threading drafts (shaft assignment per warp thread)
     - Treadling patterns (which shafts lift for each row)
     - Different interlacement calculation engine
     - Validation logic for each loom type
   - **Limitation**: Author is not a weaver—implementing this correctly would require collaboration with experienced multi-shaft weavers to understand:
     - Threading conventions and notation
     - Tie-up patterns
     - Treadling sequences
     - How different shaft combinations create different weave structures
   - This represents a potential Phase 4+ expansion if there's demand from the weaving community

---

## Next Steps for Implementation

1. **Prototype the data schema** - Create sample patterns in JSON
2. **Build basic validator** - Ensure patterns are structurally sound
3. **Implement simple renderer** - Canvas-based visualization
4. **Test with real weavers** - Get feedback on usability
5. **Integrate AI generation** - Start with OpenAI API
6. **Iterate based on feedback** - Refine schema and rendering

---

This provides the foundation for a robust, practical tool that bridges AI capabilities with traditional craft constraints.
