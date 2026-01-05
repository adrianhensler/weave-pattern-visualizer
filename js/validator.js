/**
 * RigidHeddleValidator - Validates weaving patterns against rigid heddle constraints
 */
class RigidHeddleValidator {
    constructor() {
        this.constraints = {
            min_warp_ends: 10,
            max_warp_ends_per_inch: 15,
            min_warp_ends_per_inch: 2.5,
            standard_heddle_dents: [5, 7.5, 8, 10, 12, 12.5, 15],
            max_loom_width: 48,
            min_project_length: 6
        };
    }

    validate(pattern) {
        const errors = [];

        // Validate warp calculations
        const calculatedEnds = pattern.project.finished_width * pattern.project.epi;
        if (Math.abs(calculatedEnds - pattern.warp.total_ends) > 0.1) {
            errors.push(
                `Warp end mismatch: ${calculatedEnds} calculated vs ${pattern.warp.total_ends} specified`
            );
        }

        // Validate EPI
        if (!this.constraints.standard_heddle_dents.includes(pattern.project.epi)) {
            errors.push(
                `EPI ${pattern.project.epi} doesn't match standard heddle dents. Use: ${this.constraints.standard_heddle_dents.join(', ')}`
            );
        }

        // Validate width
        if (pattern.project.finished_width >= pattern.loom_specs.width_inches - 1) {
            errors.push(
                `Fabric width ${pattern.project.finished_width}" too wide for ${pattern.loom_specs.width_inches}" loom (need 1" margins)`
            );
        }

        // Validate sections
        pattern.weaving_sections.forEach(section => {
            const sectionErrors = this.validateSection(section, pattern);
            errors.push(...sectionErrors);
        });

        // Validate pickup sequences
        errors.push(...this.validatePickupSequences(pattern));

        return {
            valid: errors.length === 0,
            errors: errors
        };
    }

    validateSection(section, pattern) {
        const errors = [];

        section.instructions.forEach((instruction, index) => {
            if (!['up', 'down', 'neutral'].includes(instruction.heddle)) {
                errors.push(
                    `Section "${section.name}", row ${index + 1}: Invalid heddle position "${instruction.heddle}"`
                );
            }

            if (instruction.pickup && !['forward', 'back', 'on_edge', null].includes(instruction.pickup)) {
                errors.push(
                    `Section "${section.name}", row ${index + 1}: Invalid pickup position "${instruction.pickup}"`
                );
            }
        });

        return errors;
    }

    validatePickupSequences(pattern) {
        const errors = [];
        const maxEnd = pattern.warp.total_ends;

        pattern.weaving_sections.forEach(section => {
            if (section.pickup_sequence) {
                const invalidPicks = section.pickup_sequence.filter(pick => pick >= maxEnd);
                if (invalidPicks.length > 0) {
                    errors.push(
                        `Section "${section.name}": Pick-up sequence references threads beyond total warp ends (${maxEnd}): ${invalidPicks.join(', ')}`
                    );
                }
            }
        });

        return errors;
    }
}
