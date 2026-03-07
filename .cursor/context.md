# RotDash Project Context

Always follow these documents when generating code.

Primary documentation:

* docs/ARCHITECTURE.md
* docs/BRANDS.md
* docs/FEATURES.md
* docs/INSTRUCTIONS.md

These documents define:

* product scope
* system architecture
* naming conventions
* product terminology

If code generation conflicts with these documents, **the docs take precedence**.

Before generating new code:

1. Follow the architecture defined in `docs/ARCHITECTURE.md`
2. Implement features only described in `docs/FEATURES.md`
3. Respect naming and tone from `docs/BRANDS.md`
4. Follow any additional guidance in `docs/INSTRUCTIONS.md`

**Mandatory pre-check**: Before writing code or giving architecture/feature advice, load and apply the contents of all four primary docs above. Do not skip this step.

Never introduce features outside the defined scope.