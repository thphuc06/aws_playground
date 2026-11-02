import {developmentWorkedCases} from './workedCasesDevelopment';
import {securityWorkedCases} from './workedCasesSecurity';
import {deliveryWorkedCases} from './workedCasesDelivery';
import {bi as t,evidence as s,illustrative,type ChapterWorkedCase} from './workedCaseTypes';
export type {BilingualText,ChapterWorkedCase,WorkedCaseSource} from './workedCaseTypes';

const sourceJudgment:ChapterWorkedCase={
 id:'case-source-scope',chapterId:'study-source-judgment',serviceIds:['api'],examVersions:['DVA-C02','DVA-C03'],executionStatus:'illustrative',title:t('A remembered limit has lost its product scope','Một giới hạn được nhớ nhưng mất phạm vi sản phẩm'),
 assumptions:[t('A study note gives one integration-timeout number for all API Gateway products.','Ghi chú học tập đưa ra một số integration timeout cho mọi sản phẩm API Gateway.'),t('No account-specific quota or actual integration configuration was queried.','Chưa truy vấn quota riêng của account hoặc cấu hình integration thực tế.')],
 input:{language:'json',code:JSON.stringify({note:'Every API Gateway integration has the same fixed maximum timeout.',missing:['API product','endpoint type','adjustability','source date'],reviewTargets:['HTTP API quota table','REST API quota table']},null,2),description:t('The statement is deliberately incomplete; do not turn it into a validator rule.','Phát biểu được cố ý làm thiếu; không biến nó thành quy tắc validator.')},
 expectedObservations:[t('HTTP API and REST API quota documentation have separate applicability.','Tài liệu quota HTTP API và REST API có phạm vi áp dụng riêng.'),t('A dated link still needs the correct operation, variant and qualification.','Link có ngày vẫn cần đúng thao tác, biến thể và điều kiện đi kèm.')],
 failure:t('The editor applies a remembered default as a universal hard maximum.','Editor áp default nhớ được thành trần cứng cho mọi trường hợp.'),
 diagnosis:[t('Read the exact quota row and its footnotes, not only the service overview.','Đọc đúng dòng quota và chú thích, không chỉ trang tổng quan dịch vụ.'),t('Record what is fixed, adjustable or dependent on a declared context.','Ghi lại phần cố định, điều chỉnh được hoặc phụ thuộc ngữ cảnh đã khai báo.')],
 repair:[t('Split the note by API product and endpoint context with its current primary source.','Tách ghi chú theo sản phẩm API và ngữ cảnh endpoint cùng nguồn chính thức hiện tại.'),t('Keep account-dependent cases as needs-context until the required evidence exists.','Giữ trường hợp phụ thuộc account ở trạng thái needs-context cho tới khi có bằng chứng cần thiết.')],
 verification:[t('Test the selected variant’s documented boundary and a different variant separately.','Kiểm tra biên theo tài liệu của biến thể đã chọn và biến thể khác một cách riêng biệt.'),t('Check that an unknown variant is not silently treated as the most restrictive one.','Kiểm tra biến thể chưa biết không bị âm thầm coi là biến thể hạn chế nhất.')],
 transferQuestion:{question:t('Does adding a source URL to a field prove every option in that field was reviewed?','Thêm URL nguồn vào field có chứng minh mọi option trong field đã được rà soát không?'),answer:t('No. Evidence must name the claim and scope it actually supports.','Không. Bằng chứng phải chỉ rõ nhận định và phạm vi nó thực sự hỗ trợ.')},
 sources:[s('HTTP API quotas','https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-quotas.html','HTTP API integration-timeout scope'),s('REST API quotas','https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-execution-service-limits-table.html','REST API endpoint/adjustability context')],limitations:[illustrative],
};

/** Supplements are separate from legacy arrays so bookmarks, hashes and question positions retain meaning. */
export const workedCases:ChapterWorkedCase[]=[...developmentWorkedCases,...securityWorkedCases,...deliveryWorkedCases,sourceJudgment];
export const getWorkedCaseForChapter=(chapterId:string)=>workedCases.find(c=>c.chapterId===chapterId);
