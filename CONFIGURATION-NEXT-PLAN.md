# Kế hoạch sau quan sát configuration — 2026-11-02

## Phạm vi lượt này

Người dùng yêu cầu commit và deploy đầy đủ sau mỗi lượt, đồng thời quan sát và
lập kế hoạch tiếp. Quy trình phát hành được ghi trong AGENTS.md. Lượt này phát
hành các sửa đổi audit đã hoàn tất, bổ sung nhận diện commit backend và sửa một
lỗi chặn quá trình sửa workspace cũ. Các hạng mục bên dưới là kế hoạch; chưa
tự triển khai toàn bộ.

## Những gì đã quan sát

| ID | Quan sát/bằng chứng | Mức độ | Hướng xử lý |
|---|---|---|---|
| O1 | EC2 Networking có cả Shared security groups và Security-group rules; source lưu chúng ở `network.resources[].assignedTo` và `architecture.nodes.*.values.securityRules` | Đã thấy trên UI và code | Một SG object canonical; inline rules phải chuyển thành group rõ ràng hoặc ghi chú không có hiệu lực |
| O2 | Thêm hàng SG rỗng tăng số field specified lên 1/26, kết quả 0 errors và Save enabled | Tái hiện bằng browser | Giữ khả năng lưu draft, nhưng tách incomplete khỏi valid; không tính hàng rỗng là cấu hình hoàn chỉnh |
| O3 | Đổi protocol sang ICMP, nhãn vẫn là From port/To port, đơn vị vẫn port | Tái hiện bằng browser | Form theo protocol: TCP/UDP port range; ICMP type/code; ALL không yêu cầu port |
| O4 | Inspector đưa lỗi của mọi node khác vào điều kiện disabled của Save; hai node cũ cùng lỗi có thể khóa đường sửa từng node | Xác nhận code + regression test | Đã sửa trước phát hành: chặn lỗi của node hiện tại và lỗi phụ thuộc mới phát sinh; lỗi độc lập có sẵn không khóa sửa node này |
| O5 | `ArchitectureStudio` nhắc export khi storage lỗi nhưng chưa có luồng export/import workspace tương ứng trong component | Xác nhận code và UI quan sát | Backup/restore, recovery từ storage lỗi, schema/version preview trước import |
| O6 | Panel 320px với tabs/footer cố định và hàng SG lồng sâu chỉ hiển thị ít nội dung; nhiều “Study notes…” lặp lại | Quan sát screenshot | Compact row editor, tóm tắt rule, expandable details, field search và jump-to-error |
| O7 | VPC service node và VPC frame vẫn độc lập; subnet table và frame có thể mô tả cùng subnet mà không có mapping canonical | Đã xử lý 2026-11-04 cho đường thêm mới: catalog "Amazon VPC" tạo frame (graph2: frame gắn resource canonical); node VPC cũ có "Convert to VPC frame" với preview, gộp vào frame có sẵn chỉ khi người dùng chọn và không có giá trị mâu thuẫn | Registry resource và migration có phát hiện conflict; không chọn một bên rồi âm thầm bỏ bên kia |
| O8 | Help mới có nguồn/scope audit, nhưng phần lớn field vẫn chỉ có reference-level metadata | Xác nhận inventory | Rule evidence registry, phân loại setting/intent/exercise và nguồn theo từng claim |
| O9 | `/health` chỉ trả ok; backend status chưa báo deployed SHA | Xác nhận endpoint code | Đã thêm `buildRevision` chỉ nhận SHA hợp lệ từ RENDER_GIT_COMMIT và `configurationAudit:1` |
| O10 | Main bundle hiện lớn; có React Flow warnings khi hot reload | Quan sát build/browser ở lượt audit | Đo baseline load/edit trước khi tối ưu; chưa kết luận app chậm chỉ từ warning |

Browser quan sát dùng sơ đồ synthetic local. Hàng SG thử nghiệm được Cancel;
không dùng sơ đồ cá nhân trên production và không gọi model trả phí.
Ảnh: `artifacts/configuration-observation/narrow-editor.jpg`.

## Lượt tiếp theo nên làm: backup, recovery và trạng thái cấu hình

Làm bước này trước migration resource để người dùng luôn có đường quay lại.

### Deliverables

1. **Export workspace JSON**: original, draft, shared resources, IAM library,
   purpose, schema version và metadata tối thiểu. Có lựa chọn kèm/không kèm report.
   Không xuất credentials; không gọi dữ liệu app giả lập là CloudFormation deployable.
2. **Import preview**: kiểm tra size/schema/type, tóm tắt số node/resource và
   migration/conflicts. Import vào workspace mới hoặc thay thế sau confirmation
   có backup; không tự merge ID bằng tên.
3. **Recovery**: khi localStorage hỏng/quota exceeded, cho tải raw backup và
   bản đang nằm trong memory; không reset dữ liệu để làm hết lỗi.
4. **Validation state**: `Invalid`, `Incomplete`, `Needs context`, `Checked within
   scope`. Cho lưu draft incomplete; chặn cấu hình đã khai báo nhưng sai trong
   phạm vi được kiểm tra. Empty row không đóng góp vào completeness.
5. **Problems panel**: nhóm theo resource/field, nút mở đúng tab và focus ô lỗi.
   Tách existing issues khỏi regression do bản nháp gây ra; không để lỗi độc lập
   ở một resource khóa toàn bộ quá trình sửa.

### Acceptance

- Export/import roundtrip không đổi topology, memberships, edge geometry hoặc
  policy documents; original/draft không bị trộn.
- Workspace cũ có nhiều lỗi vẫn sửa từng resource được; sửa queue làm mapping
  Lambda trở nên sai vẫn bị chặn.
- File lỗi không ghi đè workspace; reload sau import giữ đúng dữ liệu.
- Unknown/incomplete không bị báo là AWS invalid và không được tô như ready-to-deploy.
- Browser test desktop, panel hẹp, keyboard; fixture cho storage quota/corruption.

## Lượt 2: một nguồn resource canonical

### Thiết kế

- Resource identity riêng với name; metadata owner/account/Region/AZ rõ ràng.
- VPC/subnet/security group/route table/ENI tồn tại trong registry, frame chỉ tham
  chiếu để hiển thị. Graph layout không tự thay đổi cấu hình network ownership.
- Typed refs phân biệt local resource và external ref. Picker lọc tương thích,
  giải thích vì sao option không chọn được; không tự coi external ID là đã tồn tại.
- SG được chọn từ EC2/Lambda/ECS/... là cùng object có “Used by”. Sửa rule ở một
  nơi phản ánh mọi consumer. Rule peer SG khác với SG attachment.
- Delete có dependency preview. Cho unlink/remap/cancel có chủ đích; không để
  stale references ẩn sau một dropdown trống.

### Migration

Giữ nguyên backup schema cũ. VPC node/frame trùng tên không đủ điều kiện để gộp.
Khi hai nguồn mâu thuẫn CIDR hoặc SG rules, ghi conflict cho người dùng xử lý;
không tự chọn “nguồn mới hơn”. IDs phải ổn định qua export/import và AI draft.

### Acceptance

Tạo VPC → subnet → SG → EC2; đổi tên/CIDR; đổi subnet; sửa SG; xóa/remap; duplicate
diagram; AI proposal adoption/Undo. Mọi đường cùng dùng registry và validator.
Mô hình nhiều subnet/ENI của service không bị ép thành một visual parent duy nhất.

## Lượt 3: form theo ngữ cảnh và khả năng đọc

- AWS setting, application intent, legacy exercise có nhãn riêng.
- Section Basic/Advanced và search theo tên/key; giữ thông tin đầy đủ nhưng giảm
  lượng nội dung lặp lại khi người dùng chỉ muốn cấu hình.
- SG/NACL row có summary `Ingress TCP 443 ← app-sg`; mở chi tiết khi chỉnh.
- ICMP đổi label/type/code; ALL ẩn/khóa port và giải thích dữ liệu cũ được giữ ở đâu.
- Existing-resource picker có name/type/owner, “Create resource…” hoặc đường dẫn
  tới thư viện; external ref có trạng thái riêng.
- Help có ví dụ hợp lệ/không hợp lệ, default behavior, điều kiện áp dụng,
  hard limit vs adjustable quota, official source section và ngày kiểm chứng.
- Mobile và keyboard được kiểm tra riêng; popup không tràn hoặc che nút sửa lỗi.

## Lượt 4: mở rộng độ chính xác theo luồng xuyên service

Thay vì thêm field rời rạc, hoàn thiện từng workflow có acceptance cases:

| Thứ tự | Workflow | Cần kiểm chứng |
|---|---|---|
| 1 | EC2/ALB/ENI/SG/subnet/EBS | Placement/owner/AZ, protocol/target, instance-profile role, volume compatibility; account/AMI availability giữ unknown |
| 2 | API Gateway/Lambda/SQS/EventBridge | Variant-specific integration, route/backend reference, mapping batch/window/retry, permission role vs resource policy |
| 3 | RDS/Aurora/ElastiCache | Engine/deployment/version matrix, subnet group/AZ, auth/TLS, backup/storage and client connection assumptions |
| 4 | S3/CloudFront/Route53/ACM | Bucket variants, origin/behavior references, DNS alias records, cert scope/Region, cache/error settings |
| 5 | IAM/STS/KMS/Cognito/WAF | Principal/context, operation constraints, token units/OAuth, key lifecycle, WAF resource variants/scope |
| 6 | ECS/EKS/ECR/CodeBuild/CodeDeploy/Pipeline | Runtime/compute/platform, workload-vs-execution roles, artifact contracts, deployment strategy and schema validation |
| 7 | Logs/CloudWatch/X-Ray/CloudTrail/AppConfig | Class-specific features, metric dimensions/period, selectors, sampling, configuration rollout/rollback prerequisites |

Đây là phạm vi nghiên cứu và implementation tiếp theo, không phải các quy tắc
đã được xác minh trong lượt này. Chi tiết của đủ 58 service vẫn ở CONFIG-AUDIT-MATRIX.md.

## Lượt 5: evidence registry và release regression suite

- Mỗi rule có ID, field paths, condition, severity, source/section, checked date,
  assumptions, exceptions, positive/negative/boundary tests.
- Các trường hợp phụ thuộc account/Region phải có `Needs context`, không đặt một
  default quota thành hard cap chung.
- Review frontend/backend parity bằng cùng fixture; thêm browser workflows cho
  create/edit/relink/delete/export/import/adopt/undo.
- Đo performance trên sơ đồ nhỏ/lớn, policy documents và bảng nhiều hàng trước
  khi chọn memoization/code splitting.
- Mỗi release: commit/push → CI → Render SHA khớp → Sites version/deployment
  succeeded → production smoke không trả phí → báo cáo commit và URL.

## Không đưa vào các lượt trên

Traffic simulation toàn catalog vẫn tạm gác theo yêu cầu. Không tạo AWS resources,
không đổi audience/site permissions, không nâng quota/billing, không dùng AI để
thay thế những rule có thể kiểm chứng một cách xác định.
