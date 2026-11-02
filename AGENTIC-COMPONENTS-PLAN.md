# Kế hoạch mở rộng Agentic AI components — 2026-11-02

Trạng thái: **kế hoạch**, chưa thêm các component này vào catalog/runtime schema.
Phần UI được thực hiện riêng trong lượt này: dấu hỏi 16px trong vùng bấm 24px,
32px trên thiết bị dùng con trỏ cảm ứng; giữ tên truy cập, click/keyboard và Escape.

## 1. Mục tiêu và định nghĩa “đầy đủ config”

Hỗ trợ tạo architecture multi-agent có runtime, tools, identity, authorization,
content guardrails, memory, RAG, telemetry và evaluation bằng resource thật trong
mô hình của app. Một node có tên đúng nhưng không có schema/reference/validation
không được tính là hoàn thành.

Đầy đủ được đo theo **API surface/variant đã chọn và ghi phiên bản**, không phải
theo một số field tùy ý. Mỗi request property phải được ánh xạ vào form hoặc
được đánh dấu unsupported kèm lý do. Response-only fields như ARN/status/version
phải là read-only hoặc external reference, không giả vờ đã được AWS cấp.

Không cam kết mô phỏng toàn bộ AWS hay chạy agents trong trình duyệt. Các trường
model/Region/quota chưa có dữ kiện phải giữ Needs context. Tài liệu tham chiếu đã
được đọc để lập kế hoạch; nested types/enums/limits phải được chốt lại thành
evidence manifest trước khi thực thi từng đợt.

## 2. Những điểm phải đổi trong code hiện có

| Hiện tại | Cần thay đổi |
|---|---|
| Một `agentcore` profile gồm 11 field chính | Resource kinds riêng; giữ legacy node cũ để migrate có preview |
| `memoryPolicy` chỉ là ý định lưu memory | Memory resource + strategies + application access bindings |
| Bedrock chỉ có `guardrailConfiguration` JSON | Guardrail resource/version + explicit attachment và request/output enforcement point |
| `PolicyRecord` và editor phục vụ IAM JSON | Policy family riêng cho Cedar và AgentCore extensions; không đi qua IAM parser |
| `ConfigField` chưa có object/union có discriminator | Thêm schema cho object/union, conditional required, typed ref và read-only fields |
| Resource refs mới có node/role/external và VPC frame | Ref tới endpoint, Gateway target, policy engine/policy, memory strategy, credential provider |
| `c03CanvasCatalog` tính bằng cách bỏ hai legacy IDs | Explicit catalog scope: exam service, extension resource, logical application component |
| AI tool có ngân sách schema/property/enum/depth | Load schema theo component/section; không nhồi tất cả nested types vào một tool |
| Một generic edge không đủ mô tả semantic | Typed relationship/operation; label hiển thị không tự thay đổi integration semantics |

Các file chính liên quan: serviceCatalog/c03Catalog, configurationTypes/Registry,
configurationSecurityFields, architectureRegistry/Review/Workspace, serviceIcons,
ConfigurationField/Inspector, backend configuration-tools và completionAudit.

## 3. Resource model và cách hiển thị

### Node chính nên có

- AgentCore Runtime.
- AgentCore Gateway.
- AgentCore Identity (nhóm workload identity và credential providers).
- AgentCore Memory.
- AgentCore Policy Engine.
- Bedrock Guardrail.
- Bedrock Knowledge Base.
- Observability configuration (ghi rõ đây là binding/configuration view).
- Evaluation configuration.
- Logical Agent và Approval workflow (application components, không gắn nhãn AWS service).

### Subresource nên quản lý trong inspector, có thể bung ra canvas

Runtime endpoint/version; Gateway target/tool; policy document; memory strategy;
credential provider; knowledge-base data source; evaluator/dataset reference.
Không biến mỗi table row thành một node cố định làm diagram quá tải.

### Tùy chọn theo use case

AgentCore Browser, Code Interpreter, Harness, capacity provider; Verified Permissions
cho authorization của ứng dụng; external MCP/A2A endpoints. Không tự thêm mọi
component vào mỗi diagram chỉ để đạt “đầy đủ”. Harness và custom orchestration
Runtime là các lựa chọn cần giải thích, không mặc định tạo hai bộ agent loop trùng nhau.

## 4. Cấu hình theo nhóm

Các danh sách dưới là yêu cầu thiết kế cho form. Field “application” phải được
phân biệt trực quan với AWS API parameter. Mọi secret chỉ dùng reference; không
nhập OAuth client secret, API key hoặc credential thật vào canvas.

### 4.1 Runtime và endpoint

| Nhóm | Cấu hình dự kiến |
|---|---|
| Identity/deployment | name, description, Region/account context, tags, role reference |
| Artifact | union container/code; ECR image URI/digest hoặc code artifact/entrypoint/runtime theo nested API schema |
| Compute | default compute hoặc capacity-provider reference; thuộc tính phụ thuộc compute |
| Inbound | authorizer union, JWT issuer/discovery/audience/client constraints theo schema; phân biệt IAM authentication |
| Protocol | server protocol, request-header configuration theo contract |
| Network | network mode; VPC subnet/SG references; service-endpoint prerequisites |
| Lifecycle | idleRuntimeSessionTimeout, maxLifetime; explicit defaults và units |
| Environment/storage | nonsecret variables, filesystem configurations; secret references thuộc integration layer |
| Endpoint | parent runtime reference, endpoint name, runtime version, description/tags |
| Application binding | framework, logical agents hosted, model/tool/memory bindings; không trộn vào CreateAgentRuntime |

Artifact là union, không cho đồng thời code và container.
Lifecycle phải kiểm tra idle ≤ maxLifetime. Theo tài liệu hiện tại, upper bound
khác giữa microVM và Instances/capacity provider; không áp 8 giờ cho mọi compute.
Phải kiểm tra thêm giới hạn của capacity provider nếu đã khai báo.

Nguồn: [CreateAgentRuntime](https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateAgentRuntime.html),
[artifact union](https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_AgentRuntimeArtifact.html),
[lifecycle](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-lifecycle-settings.html),
[endpoint](https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateAgentRuntimeEndpoint.html).

### 4.2 Gateway và target/tool

| Nhóm | Cấu hình dự kiến |
|---|---|
| Gateway | name/description/tags, execution role, KMS reference, protocol configuration |
| Inbound auth | authorizer type + đúng union configuration; issuer/audience/client claims |
| Policy attachment | policy engine ref và mode; mode của Gateway khác mode của từng policy |
| Interceptors | interception point, interceptor resource, header/payload forwarding/filter config |
| Targets | name, parent gateway, target-type union, resource/endpoint, tool schemas |
| Outbound credentials | provider type/ref, OAuth scope/credential context theo target schema |
| Network/metadata | private endpoint variant, certificates, allowed request/response headers/query parameters |
| Application contract | action name, input/output, mutating/read-only classification, timeout/retry/idempotency requirements |

Phải validate tool identity/reference, target variant và credential compatibility.
JWT configuration chỉ có hiệu lực với authorizer tương ứng. Cần chỉ rõ tools
đi qua Gateway nào; đường gọi trực tiếp bỏ qua policy là một finding kiến trúc.
Không mô tả Policy Engine như proxy network độc lập trên mọi cạnh.

Nguồn: [Gateway](https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateGateway.html),
[Gateway target](https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateGatewayTarget.html).

### 4.3 Identity và credential providers

Workload identity: name, tags, allowed OAuth return URLs. Credential provider:
vendor/type discriminator, provider-specific endpoint/client configuration và
secret reference. Application binding: agent/workload nào dùng provider, delegated
user context hay workload credentials, expected scopes và consent flow nếu cần.

Không coi Cognito user identity, AgentCore workload identity, IAM execution role
và OAuth credential provider là cùng một object. Dữ liệu identity đáng tin cậy
đến từ authentication context, không từ text model tự điền vào tool arguments.
Validation local không xác nhận token, issuer ownership hoặc consent đã xảy ra.

Nguồn: [Workload identity](https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateWorkloadIdentity.html),
[OAuth provider](https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateOauth2CredentialProvider.html),
[Identity concepts](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity.html).

### 4.4 Memory và strategies

Memory resource: name/description/tags, raw-event expiry, execution role/KMS refs,
indexed keys, namespace keys/validation, stream delivery configuration. Strategies:
semantic, summary, user preference, episodic hoặc custom, mỗi row chọn đúng một
union branch và có namespace/config đúng schema.

Application access bindings riêng: trusted tenant/actor/session mapping, agent nào
đọc/ghi, namespace mapping, dữ liệu được phép ghi và deletion/consent requirements.
Đây là contract của ứng dụng và authorization, không tự tạo AWS tenant isolation
chỉ bằng một dropdown.

Không đồng nhất raw-event retention với retention của mọi long-term record.
Không dùng Memory thay cho kho tài liệu RAG. Không tự gộp namespace giữa agents
chỉ vì chúng cùng runtime.

Nguồn: [CreateMemory](https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateMemory.html),
[strategy union](https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_MemoryStrategyInput.html),
[event expiry behavior](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory-create-a-memory-store.html).

### 4.5 Policy Engine, Cedar và policy documents

Engine: name/description/tags, KMS ref. Policy: engine ref, name/description,
definition union, validationMode, enforcementMode. Gateway attachment là reference
riêng. Một Gateway có tối đa một engine; engine có thể liên kết nhiều Gateway.

Thêm editor Cedar có syntax highlighting, lỗi line/column, preserve text, bounded
document size và schema references tới action/resource/claims. Nếu parser chính thức
chưa hỗ trợ dialect/extension của AgentCore, trả Not evaluated, không “valid” bằng
regex. Phân biệt parser syntax, Cedar schema validation và actual authorization.

Application policy cases: tenant isolation, agent role/action scope, approval context,
default-deny, explicit deny và tool argument constraints. Không tự tin giá trị
`approved=true` do model tạo. Generated policy phải được review/test trước khi mô tả
như đã enforce. Không chạy natural-language policy generation trả phí để test editor.

Nguồn: [engine](https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreatePolicyEngine.html),
[policy](https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreatePolicy.html),
[Cedar authoring](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy-create-policies.html).

### 4.6 Bedrock Guardrails và attachment

Guardrail resource: name/description, tier/variant nếu API hỗ trợ, content-filter
configuration, denied topics, word filters, sensitive-information/regex settings,
contextual grounding, automated reasoning refs, blocked input/output messages,
KMS/tags và version reference. Mỗi nested policy dùng schema riêng, không một ô
JSON tự do thay cho tất cả.

Attachment: guardrail/version ref; request/response/tool-content path; direct Bedrock
invocation/ApplyGuardrail hay AgentCore policy integration; action và fallback.
Đây là integration config, không phải tất cả đều thuộc CreateGuardrail.

Phân biệt content filtering với authorization. Với guardrails trong Policy, phải
kiểm tra Region, supported categories, data path, effect và permissions. Chặn output
sau tool execution không ngăn tác động tool đã gây ra. Không tuyên bố probabilistic
guardrails bảo đảm loại bỏ hoàn toàn prompt injection.

Nguồn: [CreateGuardrail](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_CreateGuardrail.html),
[guardrails in Policy](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy-guardrails-in-policies.html).

### 4.7 Knowledge Base, data source và retrieval

Knowledge Base: type discriminator, name/description/tags, service role, embedding
configuration, supported storage configuration, KMS và supplementary storage theo
variant. Managed KB không bị ép chọn vector store. Self-managed KB phải tham chiếu
backend tương thích; SQL/Kendra/Graph variants chỉ mở khi có schema và evidence.

Data source: parent KB, connector type/config, credentials ref, encryption/deletion
policy, ingestion/parser/chunking/transformation configuration. Tách ingestion
settings khỏi request-time retrieval: query/filter/topK/reranking/model/guardrail
bindings thuộc integration/application layer.

Document permissions và tenant filters phải có trusted origin. Schema hợp lệ không
chứng minh mọi tài liệu đã được ingested hoặc retrieval thực tế đúng quyền.

Nguồn: [CreateKnowledgeBase](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_agent_CreateKnowledgeBase.html),
[CreateDataSource](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_agent_CreateDataSource.html).

### 4.8 Observability và evaluations

Observability là config/binding view: runtime/Gateway/Memory refs, instrumentation,
CloudWatch log group/retention/KMS, metrics, trace correlation, sampling và payload
redaction. Không tạo một AWS resource giả chỉ để có icon “Observability”.

Evaluator: name/description/tags/KMS, level và evaluatorConfig union (model judge hoặc
code-based theo API). Online config: data source, evaluator refs, execution role,
sampling/filter rule, enable flag, output CloudWatch config và các advanced fields
đã được schema hỗ trợ. Offline dataset/test suite là artifact reference riêng.

Evaluation score không thay cho authorization. Việc bật evaluation trong diagram
không có nghĩa đã chạy model judge hoặc đã đo được chất lượng agents.

Nguồn: [Observability](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability.html),
[evaluator](https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateEvaluator.html),
[online config](https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateOnlineEvaluationConfig.html).

### 4.9 Browser, Code Interpreter và Harness (optional)

Browser: execution role, network/VPC, recording S3, signing, certificates,
filesystem/enterprise-policy configs. Code Interpreter: role, network/VPC,
certificates/filesystem configs. Domain allowlists, tool budgets và approval là
application controls trừ khi có API field được xác minh tương ứng.

Harness: authorizer, environment/artifact/variables, execution role, model, prompt,
tools/allowedTools, memory, hooks/skills, iterations/tokens/timeout/truncation.
Giữ tách biệt AWS Harness config và generic framework-specific options.

Nguồn: [Browser](https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateBrowser.html),
[Code Interpreter](https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateCodeInterpreter.html),
[Harness](https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateHarness.html).

### 4.10 Logical Agent, orchestration và human approval

Application components: name/purpose, role (coordinator/researcher/executor/reviewer
hoặc custom), runtime binding, model binding, allowed tool refs, memory/KB refs,
input/output schema, delegation contract, max turns/steps, deadlines, budget intent,
termination/escalation, retry/idempotency requirements.

Approval workflow: action/threshold/currency, approver role, approval record store,
transaction binding, expiry, audit trail và backend enforcement reference. Đây là
business requirement của ứng dụng; không gọi nó là native AgentCore Approval API.
Model/Reviewer không được tự cung cấp bằng chứng phê duyệt đáng tin cậy.

## 5. Những component liên quan cần tái sử dụng

IAM roles/trust/resource policies; KMS; Secrets Manager; Cognito/IdP; Lambda và
HTTP/MCP tool backends; ECR/S3 artifacts; VPC/subnets/SG/endpoints; CloudWatch/Logs;
DynamoDB transaction/idempotency/approval records; SQS/EventBridge/Step Functions
khi có async/orchestration requirement. Chỉ thêm vào diagram khi giải thích được
vai trò và cấu hình cần thiết. Không mặc định thêm Verified Permissions nếu chỉ
cần Policy của Gateway; nếu dùng cả hai, ghi rõ authorization boundary khác nhau.

## 6. Schema, validation và evidence contract

Mỗi field có: API operation + JSON path; type/union/requiredWhen; units/default
semantics; min/max/enum/length/pattern; quota kind; mutability/replacement behavior;
local/external ref target; help/example; source section/date; validation coverage.

Mỗi rule có ID, involved fields/resources, preconditions, severity, diagnostic path,
positive/negative/boundary fixtures, exceptions và source. Không hardcode quota
account thành universal maximum; không coi unknown là Allow.

Local checks chia bốn mức: shape/syntax, declared compatibility, policy evaluation
trong supported subset, runtime/cloud verification chưa thực hiện. Draft incomplete
được lưu có trạng thái riêng; cấu hình đã khai báo sai phải bị chặn khi finalize.

Manifest API coverage cần tính cả optional/nested fields của scope đã chốt. Nếu
field bị loại vì secret/live state/unsupported feature, phải có lý do; không ghi
“full config” khi chỉ có các field cơ bản.

## 7. AI tool và diagram contract

1. Discovery trả component kinds, catalog scope và schema version; existing C03
   coverage/count không tự tăng khi thêm extension resources.
2. AI đọc schema đúng component rồi tạo resources và typed references; schema
   loading theo section để giữ trong property/enum/depth budget hiện tại.
3. Separate tools hoặc batched operations cho resource/subresource updates; commit
   atomic, clearFields rõ ràng, không biến null thành một default giả.
4. Typed relationships: hosted-on, invokes, exposes-tool, authorized-by, uses-identity,
   reads/writes-memory, retrieves-from, guarded-by, emits-telemetry, evaluated-by,
   requires-approval. Đây là semantic associations, không phải tất cả là network hops.
5. Validation chạy trên candidate graph và dependency changes; giữ đường sửa lỗi
   cũ từng resource. Update/delete phải có dependency review và migration safety.
6. Completion report yêu cầu evidence cụ thể node/config/ref/rule; unsupported hoặc
   thiếu scope phải là partial/missing/needs-context.
7. Không thêm traffic simulation trong đợt này. Agent-to-agent logic có thể được mô
   tả/test contract, nhưng không giả vờ chạy một hệ thống multi-agent thật.

## 8. Migration và compatibility

- Backup/import preview trước thay đổi schema; không xóa dữ liệu cũ.
- Legacy `agentcore` giữ nguyên cho đến khi người dùng chuyển có preview. Không
  suy ra Memory resource từ chữ “approved-persistent-memory” hay tự gán Policy từ
  câu mô tả allowedActions.
- Guardrail JSON cũ được giữ ở legacy notes hoặc mapped chỉ khi parse được thành
  variant đã kiểm tra; conflict phải hiện cho người dùng.
- Giữ stable IDs, original/draft isolation, adoption/Undo, edge geometry.
- Backend capability/schema version phải khớp frontend trước khi AI được phép
  phát sinh component mới. Rollback phải đọc được backup hoặc báo recovery rõ ràng.
- Artwork dùng official assets khi có; fallback được ghi rõ, không tự gắn mác official.

## 9. Các lượt triển khai được đề xuất

| Lượt | Deliverable | Gate hoàn thành |
|---|---|---|
| A | Backup/recovery, schema union/refs và catalog extension scope | Roundtrip/migration không mất dữ liệu; AI discovery nhận diện scope |
| B | Runtime/Endpoint, Logical Agent, Gateway/Target, Identity | Tạo/đổi/xóa/relink đúng; hai agent dùng chung hoặc tách runtime có evidence |
| C | Memory/strategies, Policy Engine/Cedar, Guardrail/version/attachment | Tenant/access bindings; policy/content controls tách biệt; unsupported dialect/Region được báo |
| D | KB/data sources/retrieval, observability và evaluations | Ingestion vs retrieval vs memory tách biệt; evaluation không bị coi là quyền |
| E | Browser/Code Interpreter/Harness/capacity provider theo nhu cầu | Variant-specific schemas và explicit application control boundaries |
| F | Multi-agent reference scenario + acceptance matrix + UI polish | AI tạo được đầy đủ supported components, config/ref/labels; không che giấu thiếu sót |

Sau mỗi lượt hoàn tất: test/typecheck/build → commit/push → CI → Render đúng SHA
→ Sites version/deployment succeeded → production smoke. Không gom nhiều thay
đổi chưa kiểm chứng vào một lần phát hành cuối cùng.

## 10. Acceptance suite tối thiểu

- Runtime artifact chọn hai union branches bị từ chối; lifecycle bound theo compute;
  idle lớn hơn lifetime bị từ chối.
- JWT variant thiếu authorizer config là incomplete/error đúng ngữ cảnh; không
  nhầm inbound identity với outbound credentials.
- Gateway policy engine ref tồn tại/đúng type; target credential variant tương thích.
- Cedar parse/schema lỗi có vị trí; dialect không hỗ trợ là Not evaluated, không Allow.
- LOG_ONLY không được báo là enforcement; guardrail output suppression không được
  báo là tool chưa chạy.
- Memory namespace/actor binding cross-tenant thiếu kiểm soát được phát hiện; raw
  event expiry không áp tự động cho mọi long-term record.
- Managed KB không bị bắt chọn vector store; self-managed thiếu storage là incomplete.
- Credential literal không được lưu vào canvas/export/AI payload; placeholder refs
  có kiểu và trạng thái unresolved.
- Agent role researcher không có write tool; executor vượt threshold thiếu trusted
  approval bị nêu rõ trong policy/design checks.
- Retry không có idempotency cho mutating tool được cảnh báo; dependency cycle có
  termination requirement, không cấm mọi cycle như kiến trúc AWS bất hợp lệ.
- Rename/delete/remap/export/import/adopt/Undo không làm mất subresource references.
- AI không có schema không được bịa service ID; báo partial/missing bằng evidence.
- Keyboard, narrow panel, mobile, reduced motion, popup placement và source links
  được kiểm tra ở UI thực; theme được xử lý trong hạng mục riêng đã đề xuất.

## 11. UI dấu hỏi trong lượt hiện tại

Sử dụng icon vector cùng hệ Lucide hiện có, 16px; bỏ vòng tròn nền/viền 28px.
Vùng tương tác 24px desktop, 32px cho coarse pointer. Có khoảng cách với chữ,
hover/open state nhẹ, focus ring và aria-label. Popup giữ nội dung và nguồn hiện
có. Chỉ đây là phần implementation được thực hiện cùng bản kế hoạch này.
