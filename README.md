# 🧵 Rigid Heddle Weaving Pattern Visualizer

An interactive web application for designing, editing, and visualizing rigid heddle weaving patterns. Perfect for weavers who want to experiment with patterns before setting up their loom.

**🌐 [Try it live!](https://adrianhensler.github.io/weave-pattern-visualizer/)** | [About this project](https://adrianhensler.github.io/weave-pattern-visualizer/about.html)

![Status](https://img.shields.io/badge/status-alpha-orange)
![License](https://img.shields.io/badge/license-MIT-blue)

## Features

### 🎨 Interactive Pattern Editing
- **Visual Color Editor**: Pick warp and weft colors with live preview
- **Smart Calculations**: Automatic warp end calculations based on width and EPI
- **Real-time Validation**: Instant feedback on loom fit and pattern constraints
- **Auto-render**: Pattern preview updates automatically as you edit

### 📐 Loom Configuration
- Support for standard loom widths (10" to 40")
- All standard heddle dents (5, 7.5, 8, 10, 12, 12.5, 15)
- Fabric dimension planning with validation
- Finishing options (hemstitch, fringe, etc.)

### 🎯 Pattern Management
- **Save/Load**: Store patterns in browser localStorage
- **Export**: Download patterns as JSON for backup or sharing
- **Section Editor**: Edit weaving sections with length and technique
- **Warp Preview**: Visual preview of your color pattern

### ✅ Validation
- Ensures fabric fits your loom with proper margins
- Validates standard heddle dents and EPI
- Checks warp calculations (width × EPI = total ends)
- Verifies rigid heddle technique constraints

## Quick Start

1. **Open the application**: Simply open `index.html` in any modern web browser (Chrome, Firefox, Safari, Edge)
2. **Edit your pattern**: Use the 4 tabs to configure your loom, colors, and sections
3. **See live preview**: Canvas updates automatically as you make changes
4. **Save your work**: Click "Save" to store patterns in your browser
5. **Export**: Click "Export" to download pattern as JSON

No build process, no dependencies, no server required!

## Usage

### Overview Tab
- Edit pattern name
- View quick facts (dimensions, thread count)
- Check validation status
- See color legend

### Setup Tab
- Configure loom specs (width, heddle dent)
- Set project dimensions (fabric width & length)
- Choose finishing method and fringe length
- See calculated warp ends and EPI

### Colors Tab
- Choose warp pattern type (alternating or solid)
- Pick warp colors with visual preview
- Set weft color and yarn weight
- Adjust PPI (picks per inch)

### Edit Tab
- View and edit weaving sections
- Modify section names and lengths
- See calculated row counts
- Track total project length

## Pattern Data Format

Patterns are stored as structured JSON with the following sections:
- `metadata`: Pattern name, author, description
- `loom_specs`: Loom width, heddle dent, heddle count
- `project`: Finished dimensions, warp ends, EPI, PPI
- `warp`: Thread pattern with colors and repeat
- `weft`: Primary color, yarn weight, shots per inch
- `weaving_sections`: Array of sections with techniques and instructions
- `finishing`: Method and fringe length

See [technical_design.md](technical_design.md) for complete schema documentation.

## Technical Details

- **Single-file application**: All HTML, CSS, and JavaScript in one file
- **No dependencies**: Pure vanilla JavaScript with HTML5 Canvas
- **Browser storage**: Uses localStorage for pattern persistence
- **Responsive**: Works on desktop and tablet screens

### Architecture
- `RigidHeddleValidator`: Validates patterns against physical constraints
- `WeavingRenderer`: Canvas-based visualization with zoom and pan
- State management with auto-render debouncing (500ms)
- Reactive updates with real-time validation

## Development

See [CLAUDE.md](CLAUDE.md) for development guidelines and architecture details.

### Key Files
- `index.html` - Complete web application (self-contained)
- `technical_design.md` - Comprehensive technical specification
- `concept_chatgpt_export.md` - Original concept and use cases
- `CLAUDE.md` - Development guide for AI assistants

## Roadmap

### Current (MVP)
- ✅ Basic pattern editing
- ✅ Color selection and preview
- ✅ Real-time validation
- ✅ Auto-render with debouncing
- ✅ Save/load/export

### Planned (Phase 2)
- Add/delete/reorder sections
- Preset pattern templates
- Advanced pickup sequence editor
- PDF export with printable instructions
- Undo/redo functionality

### Future (Phase 3)
- Custom color palettes with names
- Yarn calculator / shopping list
- Pattern variations generator
- User accounts + cloud storage
- Community pattern library

## AI Integration

This tool is designed to work with AI-generated patterns. See [technical_design.md](technical_design.md) for details on:
- OpenAI/Claude API integration
- Local LLM support
- Pattern generation workflows
- Validation and adaptation strategies

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

Requires JavaScript enabled and localStorage support.

## License

MIT License - See LICENSE file for details

## Contributing

Contributions welcome! This is an early-stage project focused on making weaving more accessible through AI and interactive tools.

Areas for contribution:
- Additional weaving techniques
- Pattern templates
- UI/UX improvements
- Performance optimizations
- Documentation and tutorials

## Acknowledgments

- Built with guidance from experienced weavers
- Designed for both technical and non-technical users

## About This Project

This tool was built through pair programming with Claude Code (Anthropic's AI assistant). For more about the development process, philosophy, and technical details, see the [About page](https://adrianhensler.github.io/weave-pattern-visualizer/about.html).

## Contact

For questions, suggestions, or bug reports, please open an issue on GitHub.

---

**Happy Weaving!** 🧶✨
