# Quality system and traceability

**Status: CONCEPT.** The M1 pilot must be traceable without pretending it has a certified quality-management system.

## Unit record

Each assembled cube gets a record containing:

```text
Unit serial → core revision + firmware → carrier revision
           → cassette locations + material lots → fixture records
           → calibration revisions → visual inspection → rework history
           → final disposition
```

The [build traveler](../manufacturing/assembly/SC-M1-TRAVELER.md) provides the initial collection points. A digital passport must describe the shipped/as-tested configuration, not an idealized configuration.

## Nonconformance loop

1. Stop the affected build step and preserve the as-found evidence.
2. Classify: cosmetic, fit, optical, electrical, thermal, software or traceability.
3. Decide repair, deviation review, material hold or scrap. Do not quietly substitute a different coating/cassette.
4. Record root-cause hypothesis, containment and whether other units/lot are affected.
5. Close only with a retest or an explicitly approved deviation.

## Pilot metrics

Track first-pass fixture yield, scale/carrier fit yield, visual inspection yield, rework class/time, test escapes, source lot variability and closure/reopen success. These are learning metrics, not production performance claims.
