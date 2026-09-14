# Compliance and product-safety planning

**Status: CONCEPT.** This folder prevents unsupported safety or environmental claims from entering the product story.

## M1 boundary

M1 is a controlled, low-voltage engineering pilot. It is not approved for mains connection, battery transport, public installation, outdoor deployment, consumer sale, radio operation, medical use or an IP rating. Every demonstration uses the approved supply/fixture boundary from [hardware](../hardware/README.md).

## Future review map

| Domain | Trigger | Required work before claim |
| --- | --- | --- |
| Electrical safety | customer power, higher voltage/current or accessible power connectors | jurisdiction/product review, protection evidence and labeled limits |
| EMC | switching power, wired interfaces, radios or product shipment | emissions/immunity plan, pre-scan and formal test route |
| Wireless | any radio-enabled core/bridge | region-specific radio design, antenna clearance and certification path |
| Materials | customer-facing coatings, adhesives, restricted substances | supplier declarations and material compliance review |
| Battery/transport | internal or shipped lithium pack | cell/protection/mechanical/transport program |
| Environmental claims | dust/water/UV/drop rating | test standard, samples, accredited evidence where required |

The [test plan](../docs/TEST_PLAN.md) contains exploratory conditions only. Exploratory screening is not a certification substitute.
