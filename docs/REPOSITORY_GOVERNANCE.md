# Repository governance

LATTICE is a public experimental engineering project. The repository should remain reviewable, reversible and honest about what has been simulated, engineered, prototyped or validated.

## Main branch policy

`main` is the protected public history. Changes reach it through a pull request so the intent, evidence, files and checks can be reviewed before merge. Force-pushes and branch deletion are disabled. Automatic source-branch deletion after merge is also disabled, preserving review history and an easy rollback reference.

The initial rule intentionally does not require an external approving reviewer because the repository may be maintained by a single owner. When another trusted maintainer is available, raise the required approval count to one and add any appropriate code-owner rules.

## Pull request expectations

Every PR should use the repository template and state:

1. the concrete behavior or document change;
2. why the change is needed;
3. the checks run and their outcomes;
4. risks, follow-ups and supplier/manufacturer dependencies;
5. any change to a hardware maturity claim.

Large changes should be split by coherent concern. Do not mix a rendering tweak, an unreviewed electrical claim and a deployment setting in one PR without explaining the relationship.

## Engineering evidence rule

Source code tests, diagrams and simulations can validate software behavior or a model. They do not validate physical hardware. A physical component advances only when it has the review, revision control and measured evidence defined in the [physical realization plan](REALIZATION_PLAN.md) and [status register](STATUS.md).

## Emergency changes

For a public-site outage or security issue, create the smallest focused PR, document the incident and verification, and merge only after reviewing the diff. Protection is not a reason to bypass the evidence trail.
