# Project skills

Project-local Codex skills live in `.agents/skills/`. Start a new Codex session in
this repository if newly installed skills do not appear in the current session.

| Skill | Purpose | Source |
| --- | --- | --- |
| `humanizer` | Edit English prose | Uploaded `skills.rar` |
| `humanizer-zh-tw` | Edit Traditional Chinese prose | Uploaded `skills.rar` |
| `text-watermark-cleaner-zh-tw` | Inspect and clean text Unicode/provenance markers | Uploaded `skills.rar` |
| `impeccable` | Frontend design, review, and refinement | [pbakaus/impeccable](https://github.com/pbakaus/impeccable), skill 4.8.0 |

## Impeccable installation

The Codex distribution was copied from upstream commit
`8409a564d1baee90b2dde4f7a8f06288838e3921`, including references, launchers,
engine checksum manifest, and Apache-2.0 license. Its engine version is 0.1.18.
The launcher downloads and verifies the platform engine on first use; keep TLS
and checksum verification enabled. Engine binaries are cached outside this repo.

Use `$impeccable init` to capture product context in `PRODUCT.md`,
`$impeccable shape <surface>` to plan an interface, or
`$impeccable audit <target>` to review one. Product initialization is recorded in
`PRODUCT.md`, and the chosen build workflow is stored in `.impeccable/config.json`.
The application framework and visual design remain undecided.

From the repository root, the CLI is also available directly:

```sh
.agents/skills/impeccable/scripts/impeccable engine-probe
.agents/skills/impeccable/scripts/impeccable detect --list-rules
.agents/skills/impeccable/scripts/impeccable detect --json <target>
```

No automatic hooks are installed. Use explicit detector commands for UI checks.
To update later with the official installer while retaining manual checks:

```sh
npx impeccable update --scope=project --no-hooks
```

Review upstream changes before updating vendored skill files.
