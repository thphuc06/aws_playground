# Frames and shared network resources

2026-11-02. See NETWORK-RESOURCE-AUDIT.md for the official-source review and future scope.

Implemented:
- Nine frame kinds: AWS Cloud, account, Region, Availability Zone, VPC, subnet, on-premises, Internet and general group.
- Dropping a service into the smallest enclosing frame records membership. Dragging outside removes membership. A frame header moves its nested frames and member services together. Select to resize. Remove frame retains children and absolute positions. A Move-service selector provides a keyboard alternative.
- Fifteen shared resource kinds: SG, route table, NACL, IGW, NAT, interface/gateway endpoints, egress-only gateway, VPN connection, customer/virtual-private/transit gateways, prefix list, EIP and ENI. Forms include rules, route targets, associations and relevant variant choices. Assignments expose used-by counts; complete resource edits require Save or Cancel.
- Role/policy library is discoverable from Frames & resources. Direct role fields have assignment selectors and used-by lists. EC2 instance profiles retain the separate service inspector field.
- Topology persists as an optional network envelope in each existing workspace graph, preserving old graphs. Original and AI drafts keep separate copies; diffs report topology changes; snapshot fingerprints cover them.
- AI can read get_network_schema and atomically replace its draft topology using update_network_topology. Invalid document/membership batches preserve the last valid draft. Review mode cannot mutate it. New frontend requires backend capability networkTopology:1.

Boundaries:
- Visual membership is the user's grouping contract; it does not grant permissions or automatically establish network connectivity. Multi-subnet deployment references remain independent.
- Shared network resources appear in the resource panel; routing targets/peer references use logical IDs with a reference list. They are not extra service icons or independently wired canvas nodes.
- Resource properties are intended design. Checks cover schema, references, cycles, association cardinality and selected variant considerations. Full CIDR overlap, route resolution, DNS, SG/NACL packet evaluation, AWS account availability and full reachability are not simulated.
- The resource audit records richer AWS possibilities than this initial canvas increment, including multi-VPC SG associations and advanced VPN/TGW topology. Unmodeled features are not declared AWS-invalid.
- Diagram frames use native UI shapes and labels, with no newly claimed AWS product artwork.
- Existing browser-preview access was unavailable. Verification uses unit/JSDOM interactions, types/build and HTTP/SSE fixtures; no real browser rendering, live Sol or AWS execution is claimed.

Validation:
- Full suite560 tests, frontend/backend typechecks and builds, local HTTP/SSE provider fixture and indexed secret scan are required before publication.
- No environment changes. Render should auto-deploy after GitHub CI passes; status should report networkTopology:1.
