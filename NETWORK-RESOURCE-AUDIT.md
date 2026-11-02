# Network canvas resource audit

Checked against official AWS documentation on **2026-11-02**. This is a design and
source audit, not a statement that all proposed capabilities have been implemented.
The user's containment rule is the interaction contract: an item placed inside a
frame is a member of that frame, and moving the frame moves its members. AWS
semantic checks should explain mismatches without silently relocating items.

## Frames and membership

| Frame | Minimum fields | AWS meaning / UI consequence |
|---|---|---|
| AWS Cloud / account | Label; optional account alias/ID | Organizational diagram boundary. IAM is account-scoped; do not invent Region/subnet placement for a role. |
| Region | Region code, label | Region context inherited by regional resources. Unknown remains unknown. |
| Availability Zone | Zone name and optional Zone ID | Placement context; do not infer actual account availability from a label. A VPC can span AZs; AZ columns inside a VPC are a diagram projection, not a claim that the AZ belongs to that VPC. |
| VPC | Region, IPv4 CIDRs, optional IPv6 CIDRs, DNS support/hostnames, tenancy | Network scope. Nest subnet frames and VPC-level infrastructure. See [Create VPC](https://docs.aws.amazon.com/vpc/latest/userguide/create-vpc.html). |
| Subnet | VPC reference, AZ, IPv4/IPv6 CIDR, auto-assign address options, route-table and NACL references | A subnet occupies one AZ. Public/private/isolated is derived from routing, not its name. [Subnet basics](https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html). |
| On-premises | Label, declared network CIDRs, gateway/device references | External organizational/network boundary. It does not itself create VPN connectivity. |
| Internet / external users | Label; optional sample source IP/CIDR | Diagram boundary for external actors; not an AWS resource or route target ID. |

IPv4 subnet CIDRs are /16 through /28, within VPC address space and non-overlapping
with sibling subnets. Current AWS documentation permits IPv6 subnet masks /44
through /64 in steps of /4; do not hardcode /64 as the only valid value. Ordinary
subnets reserve the first four and last addresses; BYOIP has documented exceptions.
Use [Subnet sizing](https://docs.aws.amazon.com/vpc/latest/userguide/subnet-sizing.html).

Lambda's membership is visual/application grouping. Its VPC attachment can select
multiple subnets and security groups; the execution environment remains in a
Lambda-managed VPC. Preserve those selections separately from the one canvas
parent. [Lambda VPC configuration](https://docs.aws.amazon.com/lambda/latest/dg/configuration-vpc.html).
Use the same distinction for multi-subnet managed resources: a displayed member
does not collapse its deployment topology to a single subnet.

## Reusable and placed network resources

| Resource | Minimum configuration | Important checks |
|---|---|---|
| Route table | VPC; main/custom; routes with destination type/value and target reference; subnet associations | One effective table per subnet; a table can serve multiple subnets. Missing explicit association uses main only when that main table is actually modeled. Longest-prefix match; IPv4 and IPv6 separate; preserve local routes. [Route tables](https://docs.aws.amazon.com/vpc/latest/userguide/subnet-route-tables.html). |
| Security group | VPC, name/description; inbound/outbound protocol, ports or ICMP type/code, CIDR/SG/prefix-list peer; resource associations | Allow rules; stateful return traffic; multiple groups may attach to one supported resource. A peer SG reference is not automatically inherited access to everything using that SG. Current AWS has optional same-Region multi-VPC associations; an initial same-VPC model must label this as unsupported rather than impossible. [Security groups](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html). |
| Network ACL | VPC; inbound/outbound ordered rules: number, protocol, ports or ICMP type/code, CIDR, allow/deny; subnet associations | One NACL per subnet, reusable across subnets. First match by ascending rule number; terminal unmatched deny. Stateless return direction needs its own allowance. Evaluate at subnet boundaries, not within one subnet. [NACLs](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html). |
| Internet gateway | VPC attachment | VPC-level object. Route alone is insufficient: IPv4 workload needs public addressing and applicable security allowance. [Internet gateway](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html). |
| Egress-only internet gateway | VPC attachment | IPv6 outbound initiated traffic and return traffic; not IPv4 NAT and no SG attachment. [Egress-only gateway](https://docs.aws.amazon.com/vpc/latest/userguide/egress-only-internet-gateway.html). |
| NAT gateway | Availability mode; public/private connectivity; VPC; subnet for zonal mode; EIP references where applicable; route references | Zonal public NAT uses a public subnet and EIP; private NAT has no EIP and cannot provide internet access through IGW. [NAT gateways](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html). |
| Interface endpoint | Service name/Region; VPC; selected subnets; SGs; private DNS; IP address type; supported endpoint-policy JSON | Endpoint ENIs appear in selected subnets, at most one subnet per AZ. Private DNS requires VPC DNS attributes. Endpoint policy support varies by service. [Interface endpoints](https://docs.aws.amazon.com/vpc/latest/privatelink/create-interface-endpoint.html). |
| Gateway endpoint | S3/DynamoDB service; VPC; route-table associations; endpoint-policy JSON; supported address family | Uses service-prefix-list routes; no endpoint ENI or endpoint SG. It does not use PrivateLink. Service-managed routes follow associations; users should not edit those rows as ordinary routes. [Gateway endpoints](https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html). |
| Managed prefix list | Customer/AWS managed; Region; IPv4 or IPv6; max entries; CIDR/description entries | Reuse in SGs and route tables; one address family per list. AWS-managed lists are read-only. Capacity, not just current entries, affects consuming rule quotas. [Prefix lists](https://docs.aws.amazon.com/vpc/latest/userguide/managed-prefix-lists.html). |
| Elastic IP / ENI | Allocation/reference identity; address; applicable owner/association; subnet and SGs for ENI | Useful supporting resources for explicit topology. Can initially appear as resource references rather than mandatory canvas clutter. |
| Customer gateway, virtual private gateway, Site-to-Site VPN | CGW endpoint/BGP ASN; target VGW/TGW; routing mode; advertised/static networks; two tunnel records | CGW resource describes the customer's device; it is not that device. VGW attaches to one VPC. VPN has two tunnels; routing and return paths remain necessary. Never request/store real PSKs in the learning canvas. [VPN concepts](https://docs.aws.amazon.com/vpn/latest/s2svpn/VPC_VPN.html). |

**Current NAT exception:** AWS now documents regional NAT gateways. These are
VPC-level, require no hosting subnet, and can expand across AZs. Regional mode
does not support private NAT; zonal mode remains applicable there. Support this
variant or mark it explicitly unmodeled. A universal rule requiring every NAT
gateway to be inside a public subnet would be incorrect.
[Regional NAT gateways](https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateways-regional.html).

## Shared identity resources

Reuse the existing role/policy library. Show “Used by”, select existing role,
create new, edit shared, and duplicate-and-assign. EC2 uses an instance profile;
one role can serve multiple instances. Workloads with different responsibilities
can use separate roles to preserve least privilege. Check trust and permission
policy separately. [EC2 role use](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2.html).
Keep IAM associations independent of diagram containment; placing a role inside a
frame must not grant that role to every child automatically.

## Scope and validation policy

- Strong initial coverage: frames, CIDRs, subnet associations, route tables,
  SG/NACL editing, gateway/endpoint references and shared IAM usage. Internet
  access and private service access provide developer-relevant exercises.
- Supporting advanced items: VPC peering, Transit Gateway, Direct Connect,
  Resolver endpoints/rules, Network Firewall and Gateway Load Balancer endpoints.
  They may be drawn or referenced, but full BGP, transitive routing, firewall
  inspection and hybrid DNS evaluation need their own bounded models.
- Unknown configuration must not be silently filled with permissive defaults.
  Default SG/NACL semantics differ from newly created custom ones. Present
  explicit presets as presets and retain their source and assumptions.
- Distinguish malformed data/invalid associations from unmodeled AWS variants.
  Separate network reachability, DNS, TLS and IAM authorization. A route, an SG
  allow or successful drawing alone never proves application connectivity.
- Adjustable quotas must show scope and source rather than hard-rejecting at an
  account default. Examples: route counts, SG rules and NACL rules have distinct
  quotas. Any smaller editor row count is an app limit.
  [VPC quotas](https://docs.aws.amazon.com/vpc/latest/userguide/amazon-vpc-limits.html).
- DVA emphasis remains application development, security, deployment and
  troubleshooting. This resource inventory supports those exercises; it does not
  imply every advanced networking feature is an exam objective.
  [DVA-C03 guide](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-03/developer-associate-03.html).

## Acceptance scenarios recommended to the implementation owner

1. Drop into nested frame, drag parent, move out, resize, save/reload: membership
   and absolute visual location stay coherent; no cycles or dangling parents.
2. Reassign one subnet from shared table A to B: sibling subnets retain A.
3. Edit shared SG/role: affected resources are visible; duplicate affects only
   the selected assignment; delete cannot silently leave invisible grants.
4. CIDR overlap, subnet outside VPC, wrong route-target scope and NACL duplicate
   rule numbers produce actionable findings with unknown states preserved.
5. Zonal public NAT versus regional NAT show different placement requirements.
6. Interface endpoint spans selected AZs; gateway endpoint associates route tables.
7. SG allow plus NACL return deny stays blocked in the bounded network scenario.
8. Legacy graph and isolated AI draft retain data; protected members, references,
   group changes and library changes appear in the adoption diff.
