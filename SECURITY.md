# Security and control

MIRRORFIELD 0.5 is a virtual model, not a hardware authorization service. Passports imported into its 16-slot demonstrator must be `SIMULATED` / `virtual`; unknown fields, duplicate UUIDs, impossible optical fractions and invalid configurations are rejected before replacing state. A valid but electrically incompatible motor passport is blocked by negotiation. The JSON Schema describes the passport envelope; runtime checks also enforce supported slots and identity uniqueness.

Replay is read-only inspection and cannot send physical commands. Exports contain configuration and retained simulation evidence; they are not signed attestations. LatticeLight CRC detects modeled corruption, not malicious modification or sender identity. Bridge accepts bounded diagnostics only. No physical transport or external API is installed.

Observatory runs locally without authentication, telemetry, external services, or hardware permissions. Serve only on loopback with the documented command. The development file server is not a production deployment and should not be exposed publicly; it serves files beneath the working directory.

Imported patches are data, never executable code. The graph validator bounds project size and numeric values and rejects unsupported wiring. Displayed imported strings are escaped. Patches should not contain secrets: browser storage and exported JSON are unencrypted.

Local storage failure is reported in the footer. Export provides a backup when browser persistence is unavailable. Loading examples and importing patches replace the current project; export before replacing work you want to retain.

There is no hardware control path, permission broker, or physical safety guarantee in version 0.1. Future adapters must independently validate electrical limits and fail-safe behavior. Never treat the simulator as a protective device or a battery charge controller.
