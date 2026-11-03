# Kế hoạch hoàn thiện AWS Developer Playground

Trạng thái: đã tích hợp bản hiện tại; chốt kiểm tra/phát hành theo yêu cầu tiết kiệm token ngày 2026-11-03. Phần chưa khép nằm trong REMAINING-GAPS.md.
Baseline: `e3516a412fa654a631fd6ac5a627595e41075bc0`; 691 tests / 55 files đạt.
Người dùng yêu cầu hoàn thành toàn bộ, kiểm tra, phát hành và chỉ sau đó tắt laptop.
Không tắt máy khi còn hạng mục chưa hoàn thành hoặc bản phát hành chưa được xác minh.

## Phạm vi và cách nghiệm thu

- 58 service hiện tại (56 C03, hai legacy): thư viện đọc độc lập, brief đầy đủ theo
  vai trò, cấu hình có hướng dẫn, ví dụ và bài tập phù hợp.
- 925 field chính / 1.405 path tính cả cột: kiểm kê ý nghĩa, nguồn, applicability,
  omission/default, context, ràng buộc, ví dụ và phần chưa hỗ trợ. Link nguồn không
  đồng nghĩa mọi claim đã được kiểm chứng. Không phát hành tỷ lệ AWS accurate.
- Giữ 20 bài C03 và toàn bộ entry point C02; làm sâu worked cases, prerequisites,
  so sánh, glossary và hướng dẫn tiếng Việt cùng thuật ngữ/API tiếng Anh.
- Ngân hàng thống nhất: mục tiêu 216 câu C03 được review, ba ngữ cảnh khác nhau cho
  mỗi 72 kỹ năng; không tính paraphrase, shuffle hoặc nhiều tag thành câu mới.
- Một bài tập có ý nghĩa cho mỗi service và 12 case study tích hợp, dùng fixture
  local. Không mở rộng traffic simulation toàn AWS hay tạo tài nguyên cloud.
- Luồng học, cấu hình, luyện, ôn, backup và phục hồi liên kết xuyên suốt; dữ liệu cũ
  có migration rõ ràng, không tự xóa hoặc biến kết quả lịch sử thành mastery mới.
- Reviewer độc lập và xác minh frontend/backend release trước handoff.

## Các quyết định chung

1. Storage mới dùng IndexedDB `aws-playground-data`, database version 1, store
   `records`, keyPath `key`; record `{key,value,revision,updatedAt}`. Có revision
   conflict, transaction, blocked/versionchange handling. Legacy localStorage
   giữ nguyên bytes; chỉ switch khi migration commit/readback thành công.
2. Archive có format/version riêng; facets workspace, learning và editor recovery.
   Reports tùy chọn. Buffer JSON lỗi là recovery text, không tự apply vào graph.
   Không export toàn localStorage hoặc private backend configuration.
3. Stable question IDs và frozen legacy alias map trước khi đổi thứ tự nội dung.
   C02/C03 skill keys phải chứa version. Old ever-correct chỉ là legacy evidence.
4. Diagnostic identity gồm rule/resource/path/context, không dựa vào message hoặc
   tổng số lỗi. UI, backend, import và proposal dùng chung mutation assessment.
5. Geometry/frame không là nguồn authoritative của semantic VPC/subnet ownership.
   Resource identity độc lập tên; duplicate tên không được tự merge.
6. Config omitted/null/clear có nghĩa riêng; unknown không phải AWS invalid.
   Mọi rule blocking mới cần official evidence và boundary/variant tests.
7. Chỉ root ghép release, sửa shared contract khi cần và publish; worker commit
   local trong worktree riêng. Tối đa root + 6 worker/reviewer hoạt động.

## Đợt 1: nền tảng và các khoảng trống quan sát được

| Lane | Worktree | Sở hữu | Trạng thái |
|---|---|---|---|
| Workspace | worktrees/workspace | archive/repository/recovery, ArchitectureStudio | Integrated |
| Configuration | worktrees/configuration | diagnostics/mutation parity, inspector/help/field UI, validators | Integrated |
| Curriculum | worktrees/curriculum | 11 brief mới, service metadata/comparisons/glossary | Integrated |
| Practice | worktrees/practice | stable adapters, scoring, attempts/session repository, practice components | Integrated |
| UX | worktrees/ux | main/routes, reader/library/service pages/search, responsive navigation | Integrated |
| Evidence | worktrees/evidence | 58-service surface manifest, inventory/audit tools, provenance docs | Integrated |

Acceptance: export/import v3 roundtrip; corruption recovery; URL/chapter đúng;
Runtime dependency jump; fill-missing defaults; empty rows không tăng completion;
UI/backend repair parity; 58 briefs; independent read-only service pages; stable
question IDs, exact-set multi-answer scoring, persistent practice sessions.

Root tích hợp PracticePage vào main sau khi UX giao ownership. Worker không sửa
package/lockfile qua junction node_modules; root cài test dependency khi cần.

## Đợt 2: canonical resources và compatibility

- Resource registry cho VPC/subnet/SG và các shared resource kinds hiện có;
  ownership/account/Region/AZ tách visual grouping. IAM library vẫn authoritative.
- Typed local/external refs, usage index, create/edit/delete/unlink/remap preview.
- Pure migration giữ source path và conflict, không merge bằng tên/CIDR.
- Đổi visual position/arrange/frame không âm thầm đổi attachment.
- Original/draft/checkpoint là snapshot riêng; old report fingerprint không được
  sửa để làm bằng chứng cũ có vẻ mới. Resume cần schema/capability/context phù hợp.
- Backend dual-read và capability negotiation trước khi frontend ghi schema mới.
- Acceptance: rename/delete/remap, multiple subnets, migrate conflicting SG/VPC,
  AI proposal/adopt/Undo và frontend/backend skew không mất dữ liệu.

## Đợt 3: field documentation và validation theo service surface

Mỗi service có manifest xác định variant/operation/API path: editable, observed
output, secret-reference, application intent, exercise hoặc outside declared scope.
Phần đã cam kết không được đóng bằng generic help hoặc unsupported tùy tiện.

| Nhóm | Service IDs |
|---|---|
| Event/application | lambda, api, sqs, sns, eventbridge, step-functions, kinesis |
| Data/storage | dynamodb, s3, glacier, aurora, rds, elasticache, ebs, efs, athena, opensearch, firehose |
| Compute/network/edge | ec2, elastic-beanstalk, ecr, ecs, eks, elb, cloudfront, route53, vpc, privatelink, acm |
| Delivery/tools | amplify, cloudshell, codeartifact, codebuild, codedeploy, codepipeline, appconfig, cdk, cloudformation, cli, sam |
| Identity/protection | iam, sts, cognito, kms, secrets-manager, private-ca, waf, systems-manager |
| Observability | xray, cloudtrail, cloudwatch, cloudwatch-logs |
| AI/tools | bedrock, agentcore, quick, kiro |
| Legacy | appsync, q-developer |

Mỗi scoped field cần purpose, omission/default context, applicability, examples,
practical effects, dependencies và dated claim-specific evidence. Rule fixtures:
positive/negative/boundary/omitted/nonapplicable/unknown/exception khi áp dụng.
Artifact validators giữ syntax không hỗ trợ và giới hạn kiểm tra rõ ràng.

## Đợt 4: nội dung học và điều hướng

- Nâng cả 58 briefs theo cùng mẫu: use/non-use, model, variant, config walkthrough,
  permission boundary, failure evidence, repair, example, comparison, exercise.
- Làm sâu 20 bài C03 quanh các entry point có sẵn; giữ old section/PDF anchors,
  protected question arrays và source-literacy provenance.
- Worked cases có assumptions/input/expected observation/failure/repair/evidence,
  phân biệt illustrative/local-tested/cloud-verified.
- Learning outcomes versioned; prerequisite graph không cycle; previous/next,
  bookmarks, continue by stable section; source prose nằm ở supplementary panel.
- VI glossary và nội dung giải thích có EN technical identifiers không đổi;
  locale revisions và fallback rõ ràng, không tự dịch runtime bằng paid calls.
- Comparison theo yêu cầu: API variants, messaging, stores, IAM boundaries,
  identity, storage, IaC, deployment, observability và AI product roles.

## Đợt 5: practice, ôn tập và case studies

- Bank 216 reviewed C03 primary-skill questions; mỗi option có explanation.
- Single/multiple response; explicit Submit; option IDs ổn định; pinned revision.
- Learn/mixed/mistakes/due-review; phục hồi interrupted session; biết assisted vs
  unassisted. Không đổi practice score thành AWS scaled score hoặc pass likelihood.
- Migration v1 idempotent, raw recovery; imported attempts dedupe theo ID nhưng
  payload conflict phải hiển thị. Giữ tombstone/historical revisions.
- Review intervals là local study heuristic có clock/timezone tests, không tạo
  automation hay thông báo định kỳ không được yêu cầu.
- 12 labs: API authorization; SQS duplicate/batch; event routing; DynamoDB writes;
  S3/KMS; Cognito/STS; private connectivity; container identity/artifact; pipeline;
  rollout; telemetry; AI tool access/output handling.
- Lab workspace riêng, nhận các repair hợp lệ khác nhau qua invariants; copy về
  workspace cá nhân có preview/adoption, không tự thay original/draft.

## Đợt 6: UI, performance, review và release toàn bộ

- Global search section/service/field; Basic/Advanced/changed/problems filters;
  dependency jump và exact nested-field focus; accessible tabs/radios/checkboxes.
- Browser matrix 390/716/1024/1440, 200% text, Light/Dark/System, keyboard,
  reduced motion, CodeMirror thật, mobile drawers, unsaved navigation.
- Canvas regression: node/frame drag, reconnect, label edit, arrange, fit,
  fullscreen, clone/delete và keyboard không tác động sai text editor.
- Profile cùng fixtures small/100node200edge/resource-heavy/100row/large document,
  search catalog và long attempt history. Chỉ tối ưu từ measured bottleneck.
- Fresh reviewers trên merged SHA: data/migration; config/contracts;
  AWS/content; practice/pedagogy; UX/a11y; release/performance.
- Reviewer báo severity, repro, file/contract, expected behavior; tác giả sửa,
  reviewer kiểm lại. Chưa khép lỗi data-loss/atomicity/false-permission/schema-skew
  hoặc primary workflow thì chưa release hoàn tất.

## Release gate mỗi batch hoàn chỉnh

Targeted tests trong lane; integrated candidate chạy toàn bộ tests, frontend/backend
types/builds, fixture HTTP/SSE và secret scan sau staging. Push origin main; CI
Required checks đạt; Render buildRevision khớp; Sites separate checkout giữ hosting
identity/audience, save/deploy terminal succeeded; production read-only smoke.
Không test bằng paid AI request hay tạo AWS resources. Rollback phải đọc được dữ liệu
mới hoặc cung cấp recovery; không xóa storage để downgrade.

## Ngoài định nghĩa hoàn tất của đợt cải tiến này

Triển khai toàn bộ AWS Console, chạy code người dùng trên AWS, live quota/IAM/network
verification, cloud sync/collaboration và runtime multi-agent execution chưa được
cam kết. AGENTIC-COMPONENTS-PLAN.md vẫn là thiết kế mở rộng riêng; không đổi các node
intent thành resource runtime giả để tăng coverage.

## Nhật ký triển khai

- 2026-11-02: 6 planning audits hoàn tất; toàn bộ baseline 691 tests đạt.
- User duyệt triển khai toàn bộ; tạo sáu worktree độc lập. Sites source đã mở bằng
  workflow chính thức; project/audience public hiện tại được giữ nguyên.
- Đợt 1 đang thực hiện. Không có release mới hoặc shutdown ở thời điểm ghi dòng này.

## Kết quả tích hợp đến 2026-11-03

- Đợt đầu đã phát hành: GitHub/Render `bfa4810712c298c9f1f5a2d52d2be272afb9583f`, Sites version44, backend SHA và CI đã khớp.
- Đợt chốt có toàn bộ1.405 decision guides,297 question records/216C03 primary scenarios,58standalone exercises,12isolated labs,20worked cases EN/VI, canonical resources và raw editor recovery.
- Đã xử lý các finding độc lập về migration/ref/clone, repair/adoption, source conflict, grading/context, stale editor merge, DOM IDs và question entailment.
- Yêu cầu nối dây mới: thân dây chỉ chọn; từng đoạn thẳng có nút trung điểm tròn; drag nút tạo/cập nhật các đoạn; Escape khôi phục route. Native QA xác nhận1→5→7segment handles, không kéo thân dây.
- Người dùng yêu cầu khép bản đang làm và báo khoảng trống; không mở thêm phạm vi. Không tắt máy khi điều kiện hoàn tất toàn bộ phạm vi lớn ban đầu chưa đạt.
