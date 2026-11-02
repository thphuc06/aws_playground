# Audit sâu configuration — 2026-11-02

## Kết luận

App đã có catalog và schema khá rộng, nhưng độ rộng không tương đương độ chính xác của một AWS Console. Trước đợt này, nhiều ô có nguồn tham khảo và loại dữ liệu nhưng chưa có ràng buộc nghiệp vụ tương ứng. Một số resource được tạo trong thư viện mạng chưa chọn được từ form service. Các ghi chú kiến trúc, cấu hình AWS và đầu vào của bài học mô phỏng còn tồn tại song song.

Đợt này đã rà inventory của toàn bộ **58 service: 925 field chính, 1.405 field tính cả cột trong bảng**, sửa những nhóm có bằng chứng cụ thể và tạo bộ kiểm thử cho các ràng buộc mới. **Không xác nhận rằng toàn bộ 1.405 field đã được kiểm chứng đầy đủ về mọi hành vi AWS.**

Đọc cùng:

- [Ma trận 58 service](CONFIG-AUDIT-MATRIX.md): đánh giá riêng từng service và phần cần đi sâu tiếp.
- [Inventory từng field](CONFIG-FIELD-INVENTORY.json): key/path, kiểu dữ liệu, giới hạn, điều kiện, help, nguồn và scope audit mới.
- [Metadata có nguồn](src/configurationAuditMetadata.ts), [kiểm tra liên-field](src/configurationAuditRules.ts), [kiểm tra mạng](src/networkValidation.ts).
- [Regression tests](src/configurationAudit.test.ts), [UI interaction tests](src/ConfigurationAuditInteractions.test.tsx), [backend atomicity tests](backend/configuration-tools.test.ts).

## Những vấn đề đã xác nhận trong code trước khi sửa

| Vấn đề | Hậu quả | Thay đổi |
|---|---|---|
| `NetworkFrame.cidr` chỉ có kiểm tra kiểu/độ dài | `/8`, `/29`, IP sai, subnet ngoài VPC hoặc overlap vẫn lưu được | Validator CIDR và quan hệ mạng riêng, dùng ở Save và backend network tool |
| EC2 `subnetId` là text; VPC picker chỉ thấy service node | Frame subnet/VPC có trên canvas nhưng form không chọn trực tiếp được | Chọn subnet có sẵn, tham chiếu VPC frame, giữ khả năng ghi external reference |
| SG chỉ gán được từ shared resource | Khó biết/chọn SG ngay trong service configuration | Shared SG picker trong Networking; Save/Cancel cùng transaction với cấu hình |
| SG inline rules và shared rules dễ bị hiểu là cùng một nguồn | Người dùng có thể nghĩ sửa một bên sẽ đổi bên còn lại | Ghi rõ inline rules là ghi chú cấu hình riêng; group được chọn dùng shared resource làm nguồn |
| Port range text không có kiểm tra | Cho phép giá trị ngoài miền hoặc đảo start/end | Phân biệt TCP/UDP với ICMP type/code; kiểm tra CIDR peer và description |
| NACL rule number chỉ có min/max, duplicate chỉ là consideration | Số thập phân hoặc số trùng có thể qua Save | Integer 1–32766; unique theo inbound/outbound |
| Field số dùng `type=number` nhưng không luôn có bound/enum thực | HTML control không bảo đảm AWS chấp nhận | Metadata integer/allowedNumbers, runtime và tool schema dùng chung |
| Một maximum chung dễ được áp sai giữa variants | Chặn cấu hình hợp lệ hoặc chấp nhận cấu hình không được hỗ trợ | Kiểm tra conditional cho HTTP API, CodeBuild Lambda compute, Fargate, EFS, EBS, STS |
| CloudWatch threshold thừa `min=0` | Chặn metric threshold âm hợp lệ | Bỏ ràng buộc không có căn cứ; giữ finite number |
| Chỉ validate node mà AI vừa sửa | Sửa queue có thể làm mapping của Lambda khác trở nên sai mà không bị phát hiện | Revalidate các cấu hình node trong candidate graph trước commit |
| Source/limit nằm tách khỏi dấu hỏi | Khó tra nguồn ngay lúc chỉnh field | Dấu hỏi chứa help, miền giá trị, applicability/default, nguồn và scope audit |
| Help popup tràn ra ngoài panel hẹp | Phần đầu câu và link bị cắt | Neo popup theo chiều rộng field; đã kiểm tra bằng trình duyệt thực |
| Siết numeric bounds có thể khiến workspace cũ không mở được | Người dùng mất đường sửa dữ liệu từng lưu hợp lệ với phiên bản cũ | Storage đọc bằng chế độ editable có type/shape guard; mutation/API vẫn strict; dữ liệu không bị tự sửa/xóa |

## Ràng buộc AWS mới đã đối chiếu

### Networking và resource relationships

- IPv4 VPC và subnet: prefix `/16` đến `/28`. Range dùng trong firewall/routing có ngữ nghĩa khác; peer IPv4 vẫn có thể là `/0` hoặc `/32`.
- Kiểm tra cú pháp IPv4/IPv6, so sánh network range đã canonicalize; host bits không bị kết luận là một range khác. Không tự đổi text người dùng.
- IPv4 VPC không chấp nhận các range AWS loại trừ đã được mô hình hóa. Không cấm toàn bộ CIDR ngoài RFC 1918: AWS có hỗ trợ VPC dùng range public.
- IPv6: kiểm tra kích thước trong phạm vi tài liệu hiện tại, VPC `/44–/60`, subnet `/44–/64`, bước 4. Allocation source/IPAM và cấu hình dual-stack đầy đủ vẫn chưa được mô hình hóa bằng field CIDR đơn này.
- Subnet phải nằm trong CIDR VPC cùng family khi cả hai được khai báo, không overlap subnet cùng VPC, kể cả đi qua frame Availability Zone. Hai VPC độc lập được phép có cùng range trong sơ đồ.
- TCP/UDP port 0–65535; start không lớn hơn end. ICMP type/code dùng miền riêng và `-1`; không áp một port-range validator cho mọi protocol.
- NACL: số nguyên 1–32766; trùng số trong cùng direction là lỗi, dùng lại số ở direction khác được phép.
- Interface endpoint: DNS prerequisites khi VPC đã khai báo rõ; tối đa một subnet cho mỗi AZ đã khai báo.
- Route table/NACL/endpoint association được kiểm tra VPC khi biết ownership. Destination route có cú pháp CIDR/prefix-list; chưa có route evaluator đầy đủ.
- Private NAT không gắn Elastic IP; regional NAT không có private connectivity trong mô hình được đối chiếu.
- SG khác VPC không bị mô tả là luôn bất khả thi trên AWS: AWS có Security Group VPC Associations. Picker hiện không tạo association đó; thông báo phạm vi rõ ràng.

Nguồn: [VPC CIDR](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-cidr-blocks.html), [subnet CIDR](https://docs.aws.amazon.com/vpc/latest/userguide/subnet-sizing.html), [SG rules](https://docs.aws.amazon.com/vpc/latest/userguide/security-group-rules.html), [NACL API](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_CreateNetworkAclEntry.html), [interface endpoints](https://docs.aws.amazon.com/vpc/latest/privatelink/create-interface-endpoint.html), [NAT](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html), [regional NAT](https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateways-regional.html), [SG VPC associations](https://docs.aws.amazon.com/vpc/latest/userguide/security-group-assoc.html).

### Compute, integration và workflow

| Service | Kiểm tra mới | Nguồn |
|---|---|---|
| EC2 | IMDS hop limit integer 1–64; minimum ≤ desired ≤ maximum | [EC2 API](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_ModifyInstanceMetadataOptions.html), [Auto Scaling](https://docs.aws.amazon.com/autoscaling/ec2/userguide/asg-capacity-limits.html) |
| ECS | Cặp CPU/RAM Fargate, Windows size subset; Linux platform prerequisite được nêu rõ | [CPU/memory matrix](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-cpu-memory-error.html) |
| ECS | Container health interval 5–300 giây | [HealthCheck](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_HealthCheck.html) |
| Lambda/SQS | Batch integer, source-specific FIFO/standard bounds; window 0–300 giây; queue thay đổi được kiểm tra ngược mapping | [Mapping parameters](https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-parameters.html), [mapping API](https://docs.aws.amazon.com/lambda/latest/api/API_CreateEventSourceMapping.html) |
| API Gateway | HTTP integration timeout không vượt 30.000 ms; không dùng trần này cho mọi REST API | [HTTP quotas](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-quotas.html) |
| EventBridge | Target retries 0–185; event age 60–86.400 giây | [RetryPolicy](https://docs.aws.amazon.com/eventbridge/latest/APIReference/API_RetryPolicy.html) |
| Step Functions | Express 300 giây; Standard theo duration limit; heartbeat nhỏ hơn task timeout; Express không dùng .sync/callback patterns | [Quotas](https://docs.aws.amazon.com/step-functions/latest/dg/service-quotas.html), [Task](https://docs.aws.amazon.com/step-functions/latest/dg/state-task.html), [patterns](https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html) |

### Storage, database và content delivery

| Service | Kiểm tra mới | Nguồn |
|---|---|---|
| EBS | Volume size theo loại; provisioned IOPS bounds và IOPS/GiB; gp3 throughput/IOPS relationship | [Volume types](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volume-types.html), [gp3](https://docs.aws.amazon.com/ebs/latest/userguide/general-purpose.html), [io1/io2](https://docs.aws.amazon.com/ebs/latest/userguide/provisioned-iops.html) |
| EFS | Max I/O không kết hợp One Zone/Elastic; lifecycle day enum; transition-on-access không dùng số ngày | [Performance](https://docs.aws.amazon.com/efs/latest/ug/performance.html), [LifecyclePolicy](https://docs.aws.amazon.com/efs/latest/APIReference/API_LifecyclePolicy.html) |
| RDS | Backup 0–35 ngày với giới hạn contextual của replica/Multi-AZ cluster | [ModifyDBInstance](https://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_ModifyDBInstance.html) |
| Aurora | Backup 1–35 ngày | [Aurora backup](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Backups.html) |
| CloudFront | Origin connection timeout 1–10 giây, origin ID unique, S3 website origin protocol | [Origin API](https://docs.aws.amazon.com/cloudfront/latest/APIReference/API_Origin.html), [origin types](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/DownloadDistS3AndCustomOrigins.html) |
| Route 53 | Weight integer 0–255; failure threshold 1–10 | [RecordSet](https://docs.aws.amazon.com/Route53/latest/APIReference/API_ResourceRecordSet.html), [HealthCheckConfig](https://docs.aws.amazon.com/Route53/latest/APIReference/API_HealthCheckConfig.html) |
| Kinesis | Retention 24–8.760 giờ | [Minimum](https://docs.aws.amazon.com/kinesis/latest/APIReference/API_DecreaseStreamRetentionPeriod.html), [maximum](https://docs.aws.amazon.com/kinesis/latest/APIReference/API_IncreaseStreamRetentionPeriod.html) |

Các bound EBS mới dùng tài liệu regional hiện tại; Outposts và khả năng instance là context bổ sung, không phải kết luận performance thực tế.

### Security, monitoring và delivery

| Service | Kiểm tra mới | Nguồn |
|---|---|---|
| IAM | Maximum role session duration 3.600–43.200 giây | [UpdateRole](https://docs.aws.amazon.com/IAM/latest/APIReference/API_UpdateRole.html) |
| STS | Duration theo operation, giới hạn role được liên kết; giữ rule chaining hiện có | [AssumeRole](https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRole.html), [GetSessionToken](https://docs.aws.amazon.com/STS/latest/APIReference/API_GetSessionToken.html), [GetFederationToken](https://docs.aws.amazon.com/STS/latest/APIReference/API_GetFederationToken.html) |
| KMS | Deletion wait 7–30 ngày; rotation period 90–2.560 ngày | [Deletion](https://docs.aws.amazon.com/kms/latest/APIReference/API_ScheduleKeyDeletion.html), [rotation](https://docs.aws.amazon.com/kms/latest/APIReference/API_EnableKeyRotation.html) |
| WAF | Rate threshold 10–2.000.000.000 | [RateBasedStatement](https://docs.aws.amazon.com/waf/latest/APIReference/API_RateBasedStatement.html) |
| CloudWatch | Cho threshold âm/thập phân; period enum/multiple, M/N integer, duration window | [PutMetricAlarm](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_PutMetricAlarm.html) |
| CloudWatch Logs | Retention dropdown theo tập giá trị API; xóa field chỉ có nghĩa chưa khai báo, không tự thực hiện DeleteRetentionPolicy | [PutRetentionPolicy](https://docs.aws.amazon.com/AmazonCloudWatchLogs/latest/APIReference/API_PutRetentionPolicy.html) |
| X-Ray | Fixed rate 0–1, priority 1–9.999, reservoir integer | [SamplingRule](https://docs.aws.amazon.com/xray/latest/api/API_SamplingRule.html) |
| AppConfig | Growth 1–100%, giữ hỗ trợ số lẻ; rollout/bake 0–1.440 phút | [CreateDeploymentStrategy](https://docs.aws.amazon.com/appconfig/2019-10-09/APIReference/API_CreateDeploymentStrategy.html) |
| CodeBuild | Timeout 5–2.160 phút cho context phù hợp; Lambda compute không dùng custom timeout/cache/privileged mode | [CreateProject](https://docs.aws.amazon.com/codebuild/latest/APIReference/API_CreateProject.html), [Lambda compute](https://docs.aws.amazon.com/codebuild/latest/userguide/lambda.html) |

## Trải nghiệm chỉnh cấu hình

1. Dấu hỏi của `ConfigurationField` hiển thị help, units/range, applicability, documented default, quota context, nguồn và scope audit. Cùng renderer phục vụ mọi field chính và các cột trong bảng khi được thêm.
2. Field chưa có audit mới hiển thị đúng trạng thái reference-backed study guidance, không tự nhận đã kiểm chứng toàn diện.
3. Numeric enums dùng dropdown. Field số khác có `step` phù hợp, giữ input sai để sửa, hiển thị lỗi và chặn Save; không âm thầm clamp giá trị.
4. Frame có Save/Cancel riêng, tránh validate từng ký tự rồi khiến người dùng không thể gõ CIDR hoàn chỉnh.
5. EC2 Networking chọn subnet đã tạo; subnet local đồng bộ membership và VPC frame trong draft. SG dùng `assignedTo` của shared resource, không sao chép rule.
6. Các form hỗ trợ SG khác cũng có shared-group selection theo khả năng mô hình. Đây là assignment cấp kiến trúc, chưa phải toàn bộ ENI/pod/task attachment semantics.
7. Các control trong IAM policy editor có dấu hỏi. JSON của policy không bị chạy; unsupported syntax không bị chuyển đổi mất nội dung.
8. Link nguồn được hiển thị cạnh các finding mới. Nguồn trong metadata có thể là feature-level reference; đó không phải chứng cứ rằng mọi lựa chọn trong field đã được audit.

## Ưu tiên tiếp theo được đề xuất

### P1 — Hợp nhất resource model

Hiện tồn tại VPC service node và VPC frame; subnet table và subnet frame; SG inline rules và shared SG. Cần một resource registry với ID/owner/Region/AZ, typed references và một nguồn cấu hình canonical. Giữ compatibility/migration rõ ràng. Việc chỉ đồng bộ giao diện không giải quyết triệt để sự trùng mô hình này.

Acceptance nên gồm: tạo một resource và chọn được ở mọi field phù hợp; đổi thuộc tính phản ánh ở tất cả nơi dùng; xóa resource báo dependent references; clone original/draft không trộn ID; graph export/import không mất associations; external refs luôn có trạng thái chưa xác minh.

### P1 — Tách ba loại field

- **AWS setting:** có tên parameter tương ứng, type, domain, applicability, hard limit hoặc quota context và source cụ thể.
- **Application intent:** timeout/pool/rollout/privacy requirement do ứng dụng quyết định; không được gắn nhãn như AWS đã cấu hình.
- **Learning input:** mock duration, sample event, permission assertion cho bài tập; không nên bị hiểu là cấu hình kiến trúc chính.

Đây là ưu tiên cao hơn việc thêm nhiều field mới. Ví dụ `reviewGeneratedDiff` ở Kiro là yêu cầu quy trình, không phải trạng thái đã review; `stampedeProtection` ở ElastiCache mô tả logic ứng dụng, không tự bật cơ chế trong service.

### P1 — Hợp đồng field và rule có thể kiểm chứng

Mỗi rule nên lưu `rule ID → field paths → condition → error/warning → source section → checked date → boundary tests → known exceptions`. Metadata hiện đã mở đầu bằng `audit.scope`, nhưng vẫn cần đổi một số rule cũ viết tay sang hồ sơ có cùng mức truy xuất.

Tiêu chí bắt buộc: không biến recommendation thành hard error; không dùng default adjustable quota làm trần tuyệt đối; không loại bỏ valid values do bỏ sót variant; không dùng một source overview cho mọi claim của cả service.

### P2 — Validation theo ngữ cảnh

Account/Region/partition, deployment type, engine/runtime version, source/destination integration, caller identity và AWS quota hiện không phải lúc nào cũng có trong schema. Những trường hợp đó cần trạng thái **chưa đủ dữ kiện** thay vì đoán hợp lệ. Các ví dụ chi tiết theo từng service nằm trong ma trận.

### P2 — Trải nghiệm lỗi và coverage

Nên có một panel tổng hợp vấn đề theo node/field với nút đi thẳng tới ô lỗi, trạng thái `checked / needs context / unsupported`, khả năng lọc và explain bằng nguồn. Không nên dùng phần trăm chung “AWS accurate” từ số field có link.

### P3 — Kiểm chứng artifacts thay cho checkbox

CloudFormation/SAM/CDK/Kubernetes/buildspec cần schema/toolchain validation của artifact phù hợp. Cấu hình IAM đầy đủ cần service authorization metadata và request context. Test runtime/deployment thực cần một task riêng có môi trường xác định; đợt audit này không deploy AWS hay gọi AI trả phí.

## Giới hạn và điểm chưa khép kín

- Kiểm kê tất cả service đã hoàn tất; kiểm chứng mọi claim của mọi field chưa hoàn tất. Không gắn nhãn đạt 100%.
- Không truy vấn account AWS, Service Quotas, AMI/instance availability, DNS ownership, actual IAM access hoặc network reachability.
- Frame một CIDR chưa mô tả đầy đủ secondary CIDR/dual-stack/IPAM/BYOIP; không nên suy ra mọi private-IP assignment đã được kiểm tra.
- Cross-VPC SG associations chưa có object riêng; code phân biệt giới hạn editor với khả năng AWS.
- Runtime legacy lessons vẫn tách khỏi architecture configuration. Các giới hạn mô phỏng cũ không trở thành bằng chứng của audit mới.
- Các đề xuất trong ma trận chưa được triển khai toàn bộ; đây là backlog có phạm vi cụ thể, không phải danh sách tính năng đã hoàn tất.
- Tại thời điểm handoff audit ban đầu bản sửa còn local. Người dùng sau đó yêu cầu commit/deploy đầy đủ; quy trình được ghi trong AGENTS.md và kế hoạch tiếp theo ở CONFIGURATION-NEXT-PLAN.md. Kết quả production phải được xác nhận ở handoff phát hành.

## Verification

Kết quả kiểm tra cuối cùng được ghi trong CONFIGURATION-VERIFICATION.md, mục audit 2026-11-02. Ảnh browser kiểm tra help panel ở artifacts/configuration-audit/field-help.jpg. Inventory và ma trận có thể tái tạo bằng `node scripts/audit-configuration.mjs`.
