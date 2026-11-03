# Khoảng trống còn lại sau bản nâng cấp ngày 2026-11-03

Người dùng yêu cầu khép bản đang làm để tiết kiệm token và ghi rõ phần chưa giải
quyết. Danh sách này tách các tính năng đã có khỏi độ sâu AWS chưa được xác nhận;
không sử dụng số field, câu hỏi hay test làm phần trăm chính xác hoặc readiness.

## P1 — Độ chính xác cấu hình và bằng chứng

- **Chưa có bản đồ API đầy đủ:** 58 service / 1.405 path đã có hướng dẫn, nhưng
  inventory vẫn chưa ánh xạ từng field tới operation/request property/version của
  AWS. Một số field là application intent, exercise input hoặc observed context.
  Các biến thể ngoài form hiện tại được nêu trong note, không được tự coi là AWS
  không hỗ trợ. Ví dụ ECR KMS_DSSE, Beanstalk Cluster và ma trận runtime/model/Region
  đầy đủ vẫn cần một đợt schema chuyên sâu.
- **Registry claim/rule mới chưa được điền đầy đủ:** có stable diagnostic IDs và
  112 scope audit cũ, nhưng registry claim độc lập vẫn bắt đầu trống. Các review
  độc lập của đợt này được ghi trong lịch sử triển khai/test; chưa chuyển toàn bộ
  thành `rule → claim → source section → exception → boundary fixtures`.
- **Validator có phạm vi:** IAM/ASL/CloudFormation/SAM/YAML và các ràng buộc liên
  service chỉ kiểm tra phần đã mô hình hóa. Không có full IAM authorization,
  CloudFormation/CDK toolchain validation hay network reachability solver.
- **Không đọc account AWS thật:** quotas, Region availability, deployed versions,
  resource existence, DNS ownership, IAM/KMS quyền thực tế và runtime behavior
  chưa được kiểm chứng. Không tạo AWS resources hoặc gọi AI trả phí để test.
- **Nguồn có thể mâu thuẫn:** Delivery log retention đang được API và guide mô tả
  khác nhau. App hiển thị context/source conflict, không đoán một duration chắc chắn
  hoặc mở retention override không được hỗ trợ.

## P2 — Nội dung học và đo tiến bộ

- 20 bài C03 và 58 brief tạo nền tảng có ví dụ, không thay thế toàn bộ hands-on AWS
  hoặc mọi tình huống thi. Các worked case là illustrative; các lab dùng fixture
  và evaluator cục bộ với giới hạn hiển thị rõ.
- Ngân hàng có 297 records, trong đó 216 primary-skill scenarios cho 72 C03 skills.
  Đây là ba ngữ cảnh/kỹ năng, không phải bằng chứng đã bao phủ hết kỹ năng. Các
  record cũ và đáp án đã lưu giữ ý nghĩa/revision; không suy ra mastery từ đã đọc.
- C02 được giữ lại nhưng chưa xây lại ma trận câu hỏi trực tiếp cho toàn bộ 101
  kỹ năng C02. Câu legacy không có exam/time metadata vẫn là legacy evidence.
- Chưa dịch toàn bộ giao diện và toàn bộ prose sang tiếng Việt. Đã có 20 worked
  cases EN/VI và glossary song ngữ; phần lớn hướng dẫn cấu hình/câu hỏi vẫn tiếng Anh.
- Các preview bài tập từng service/inspector có state riêng và không tự tính thành
  lần làm độc lập. Muốn lịch sử lưu, dùng Practice có session; lab có kho session
  riêng. Chưa hợp nhất mọi thao tác preview thành một hồ sơ năng lực chung.
- Review intervals là quy tắc học cục bộ, không phải mô hình đo trí nhớ đã được
  hiệu chỉnh hay dự báo xác suất đỗ. Không có full mock exam chuẩn hóa thang điểm AWS.

## P2 — Dữ liệu và kiểm tra giao diện

- Dữ liệu vẫn theo browser/origin; chưa có account sync, cộng tác nhiều người hay
  cloud history. Backup workspace và learning có lựa chọn facet; lab có export
  riêng. Reading position, theme và các preference nhỏ chưa được gói thành một
  backup toàn ứng dụng duy nhất.
- Canonical migration giữ bản cũ và conflict ledger; các external/ambiguous refs
  cần người dùng xử lý có chủ đích. Không tự hợp nhất tài nguyên chỉ vì trùng tên.
- Browser QA mới là các hành trình đại diện, không chứng nhận WCAG hoặc kiểm thử
  exhaustive Chrome/Firefox/Safari, touch devices, screen readers và mọi tổ hợp
  policy/table. Hiệu năng Home được đo qua build; profiling đầy đủ mọi thao tác
  trên graph tối đa và tài liệu cực lớn vẫn là phần cần mở rộng.
- Main bundle đã được tách theo route. Các chunk cấu hình/editor vẫn lớn và chỉ
  tải khi cần; không được diễn giải giảm initial Home JS thành giảm toàn bộ dữ liệu.

## P3 — Các đợt mở rộng riêng

- Kiểm tra nguồn hiện là snapshot có ngày, chưa có cơ chế tự phát hiện/rà soát
  thay đổi tài liệu AWS định kỳ.
- AgentCore Runtime/Gateway/Identity/Memory, Cedar, Guardrail và Knowledge Base
  dưới dạng các component đầy đủ vẫn theo AGENTIC-COMPONENTS-PLAN.md. Các field
  intent hiện tại không có nghĩa những agent/tool đó đang chạy.
- Mô phỏng traffic/runtime cho toàn bộ catalog, xuất IaC deployable, thực thi
  code/cloud labs và provision tài nguyên tự động chưa được triển khai.

## Hướng tiếp tục

Ưu tiên một workflow AWS và variant cụ thể, ghi API surface/evidence manifest,
thêm test có ý nghĩa rồi mới mở rộng. Trước migration hoặc thay đổi schema tiếp,
giữ backup và kiểm tra lại nguyên bản/draft/checkpoint, client/backend compatibility
và release provenance như AGENTS.md. Không đóng các mục này chỉ bằng thêm field/link.
