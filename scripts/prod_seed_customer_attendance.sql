-- Generated from Customer Attendance workbook. Idempotent via fixed UUIDs.
-- Does not delete existing rows. Does not import Completed history.
begin;

insert into package_products (product_type, label, total_credits, amount_sgd, sort_order, is_active)
values ('group', 'Group', 24, 650, 13, true)
on conflict (product_type, total_credits) do nothing;

-- Classes
insert into classes (id, name, day_of_week, start_time, end_time, is_active, venue_id)
select 'abafb60a-1e00-5379-b1d7-0e09a099b0f0', 'Stadium Saturday 10AM', 'saturday', '10:00'::time, '11:00'::time, true, v.id
from venues v where v.name = 'Stadium'
on conflict (id) do update set name = excluded.name, venue_id = excluded.venue_id;
insert into classes (id, name, day_of_week, start_time, end_time, is_active, venue_id)
select '155653ad-cb4c-5dbd-91c0-1c7a662e283e', 'Khatib Sunday 10AM', 'sunday', '10:00'::time, '11:00'::time, true, v.id
from venues v where v.name = 'Khatib'
on conflict (id) do update set name = excluded.name, venue_id = excluded.venue_id;
insert into classes (id, name, day_of_week, start_time, end_time, is_active, venue_id)
select 'edfbe769-aa2b-5b09-985c-4c074757c350', 'Bukit Batok Sunday 10AM', 'sunday', '10:00'::time, '11:00'::time, true, v.id
from venues v where v.name = 'Bukit Batok'
on conflict (id) do update set name = excluded.name, venue_id = excluded.venue_id;
insert into classes (id, name, day_of_week, start_time, end_time, is_active, venue_id)
select 'dcae8381-e105-5503-a1d8-3c6d2d70f157', 'Boon Keng Sunday 10AM', 'sunday', '10:00'::time, '11:00'::time, true, v.id
from venues v where v.name = 'Boon Keng'
on conflict (id) do update set name = excluded.name, venue_id = excluded.venue_id;

-- Payers
insert into payers (id, kind, display_name, phone)
values ('c2722c4b-da02-5ea8-ae32-e9c0e9182df1', 'person', 'Chia Ying Yui, Eunice', null)
on conflict (id) do update set kind = excluded.kind, display_name = excluded.display_name, phone = excluded.phone;
insert into payers (id, kind, display_name, phone)
values ('b65789ad-2f5b-5e90-9d8c-290260e8a937', 'person', 'Dennis Kwek Zhanhao', null)
on conflict (id) do update set kind = excluded.kind, display_name = excluded.display_name, phone = excluded.phone;
insert into payers (id, kind, display_name, phone)
values ('20d56d0f-88bb-5087-a5bd-333d5f8af78d', 'person', 'Alan Tan Choon', null)
on conflict (id) do update set kind = excluded.kind, display_name = excluded.display_name, phone = excluded.phone;
insert into payers (id, kind, display_name, phone)
values ('ec37b2fa-2e53-5e1a-8d91-28df955a246c', 'person', 'Karen Yeo Yen Ling', null)
on conflict (id) do update set kind = excluded.kind, display_name = excluded.display_name, phone = excluded.phone;
insert into payers (id, kind, display_name, phone)
values ('62c822f5-f334-5525-b4f1-20c240b883cc', 'person', 'Hu Jingwei', null)
on conflict (id) do update set kind = excluded.kind, display_name = excluded.display_name, phone = excluded.phone;
insert into payers (id, kind, display_name, phone)
values ('a33b2ba0-9a15-5d58-b7bf-d17d2c8f7917', 'person', 'Goh Chua Shi Hui', null)
on conflict (id) do update set kind = excluded.kind, display_name = excluded.display_name, phone = excluded.phone;
insert into payers (id, kind, display_name, phone)
values ('d3196d18-00d6-5931-bef8-96bbb54f9597', 'person', 'Nair Rajeshwar', null)
on conflict (id) do update set kind = excluded.kind, display_name = excluded.display_name, phone = excluded.phone;
insert into payers (id, kind, display_name, phone)
values ('92bea8d0-53b5-52d5-8514-7fe18040bcaa', 'person', 'Neo Wee Fong Salina', null)
on conflict (id) do update set kind = excluded.kind, display_name = excluded.display_name, phone = excluded.phone;
insert into payers (id, kind, display_name, phone)
values ('edbfbb98-70b2-5542-b700-8bb5fecf3af8', 'person', 'Chai Wai Teng', null)
on conflict (id) do update set kind = excluded.kind, display_name = excluded.display_name, phone = excluded.phone;
insert into payers (id, kind, display_name, phone)
values ('c897a8ff-e717-5789-978d-c102fc2968c8', 'person', 'Lin Zhuizhui', null)
on conflict (id) do update set kind = excluded.kind, display_name = excluded.display_name, phone = excluded.phone;
insert into payers (id, kind, display_name, phone)
values ('19c56bd3-a68d-5fd4-8127-668540959011', 'person', 'Goh Siem Chu', null)
on conflict (id) do update set kind = excluded.kind, display_name = excluded.display_name, phone = excluded.phone;
insert into payers (id, kind, display_name, phone)
values ('6753028b-0bf9-5a7a-a33a-5d2c9db065ac', 'person', 'Chua Yee Ching', null)
on conflict (id) do update set kind = excluded.kind, display_name = excluded.display_name, phone = excluded.phone;
insert into payers (id, kind, display_name, phone)
values ('8442d48e-c5c8-5c16-ba65-c195f33ed754', 'person', 'Png Chin Yuen Marianne', null)
on conflict (id) do update set kind = excluded.kind, display_name = excluded.display_name, phone = excluded.phone;
insert into payers (id, kind, display_name, phone)
values ('2935b707-26eb-55ff-93db-95f3ccf6f97b', 'person', 'Kho Renhan', null)
on conflict (id) do update set kind = excluded.kind, display_name = excluded.display_name, phone = excluded.phone;
insert into payers (id, kind, display_name, phone)
values ('0f0b4976-63db-5f81-bf29-d30b1e2f4a66', 'person', 'Cao Lijun', null)
on conflict (id) do update set kind = excluded.kind, display_name = excluded.display_name, phone = excluded.phone;
insert into payers (id, kind, display_name, phone)
values ('08ee858b-0efa-550d-9448-2adc1e1e75e8', 'person', 'Li Jingya', null)
on conflict (id) do update set kind = excluded.kind, display_name = excluded.display_name, phone = excluded.phone;
insert into payers (id, kind, display_name, phone)
values ('be74c50f-f927-56cb-b798-869db31f2e9e', 'person', 'Cao, Xue', null)
on conflict (id) do update set kind = excluded.kind, display_name = excluded.display_name, phone = excluded.phone;
insert into payers (id, kind, display_name, phone)
values ('aa2d4d9d-d5ce-5edc-97dd-b8d82992023b', 'company', 'Fufu Technologies PTE LTD', null)
on conflict (id) do update set kind = excluded.kind, display_name = excluded.display_name, phone = excluded.phone;
insert into payers (id, kind, display_name, phone)
values ('3afe08cf-a330-5198-8fc4-ece947ef3225', 'person', 'Wilson Chua Yoong Hai', null)
on conflict (id) do update set kind = excluded.kind, display_name = excluded.display_name, phone = excluded.phone;
insert into payers (id, kind, display_name, phone)
values ('a6bd2c3f-7e51-54f0-bc27-956e450943cc', 'person', 'Lu Lingjuan', null)
on conflict (id) do update set kind = excluded.kind, display_name = excluded.display_name, phone = excluded.phone;
insert into payers (id, kind, display_name, phone)
values ('222c3844-856b-555d-9ad3-da0e509b3ae7', 'person', 'Teng Seng Tat', null)
on conflict (id) do update set kind = excluded.kind, display_name = excluded.display_name, phone = excluded.phone;
insert into payers (id, kind, display_name, phone)
values ('585299b8-57e9-5521-9f01-340c642b59b0', 'person', 'Koh Soon Peng', null)
on conflict (id) do update set kind = excluded.kind, display_name = excluded.display_name, phone = excluded.phone;
insert into payers (id, kind, display_name, phone)
values ('e512f50a-de2d-5a4c-a637-7be77a06b417', 'person', 'Lin Quanhong', null)
on conflict (id) do update set kind = excluded.kind, display_name = excluded.display_name, phone = excluded.phone;
insert into payers (id, kind, display_name, phone)
values ('762ac958-c503-5002-a816-85c0345f34ec', 'person', 'Li XinXin', null)
on conflict (id) do update set kind = excluded.kind, display_name = excluded.display_name, phone = excluded.phone;
insert into payers (id, kind, display_name, phone)
values ('a2e3bab7-928e-54f3-9340-bd80423a3493', 'person', 'Yang Xin', null)
on conflict (id) do update set kind = excluded.kind, display_name = excluded.display_name, phone = excluded.phone;
insert into payers (id, kind, display_name, phone)
values ('2f941841-340b-5626-b7e4-c7cd0d05e922', 'person', 'Goh Yingling Eileen', null)
on conflict (id) do update set kind = excluded.kind, display_name = excluded.display_name, phone = excluded.phone;
insert into payers (id, kind, display_name, phone)
values ('a1441007-be33-50f3-8a81-e09f03fcc550', 'person', 'Xu Ling Yi', null)
on conflict (id) do update set kind = excluded.kind, display_name = excluded.display_name, phone = excluded.phone;
insert into payers (id, kind, display_name, phone)
values ('36957c03-bfb9-53f8-9fef-2e5391e789e6', 'person', 'Cai Jing', null)
on conflict (id) do update set kind = excluded.kind, display_name = excluded.display_name, phone = excluded.phone;
insert into payers (id, kind, display_name, phone)
values ('35af9f6d-154a-5abc-ab63-63d236ca4239', 'person', 'Tan Sicong', null)
on conflict (id) do update set kind = excluded.kind, display_name = excluded.display_name, phone = excluded.phone;
insert into payers (id, kind, display_name, phone)
values ('ad0a92bc-75d7-5e0b-ad25-3d8cf4a448a6', 'person', 'Orkid binte hilmi', null)
on conflict (id) do update set kind = excluded.kind, display_name = excluded.display_name, phone = excluded.phone;
insert into payers (id, kind, display_name, phone)
values ('65fbb730-0e3d-5c04-91dd-4fcf4f1108da', 'person', 'V Praveenkumar', null)
on conflict (id) do update set kind = excluded.kind, display_name = excluded.display_name, phone = excluded.phone;
insert into payers (id, kind, display_name, phone)
values ('159f91e3-7a50-5749-a088-0848ccecfaaa', 'person', 'Ho Huan Xin', null)
on conflict (id) do update set kind = excluded.kind, display_name = excluded.display_name, phone = excluded.phone;
insert into payers (id, kind, display_name, phone)
values ('cbd707cc-4cd6-500a-8f0f-6f0235f98f5e', 'person', 'Ong Beng Teck', null)
on conflict (id) do update set kind = excluded.kind, display_name = excluded.display_name, phone = excluded.phone;
insert into payers (id, kind, display_name, phone)
values ('80c1cec7-8d4d-56df-b6a8-148d841a16a8', 'person', 'Chan Jia Yi, K', null)
on conflict (id) do update set kind = excluded.kind, display_name = excluded.display_name, phone = excluded.phone;
insert into payers (id, kind, display_name, phone)
values ('7c2dbb4d-69c7-5f90-be20-e74ed8d81a44', 'person', 'Ng Wen Zheng Terence', null)
on conflict (id) do update set kind = excluded.kind, display_name = excluded.display_name, phone = excluded.phone;
insert into payers (id, kind, display_name, phone)
values ('9e6243d3-b001-51c7-a397-b61b4227b821', 'person', 'Wang Hui Yuan', null)
on conflict (id) do update set kind = excluded.kind, display_name = excluded.display_name, phone = excluded.phone;
insert into payers (id, kind, display_name, phone)
values ('f0e1d9b7-5f68-5021-ba8c-1038cd670954', 'person', 'Gwee Hong Hang', null)
on conflict (id) do update set kind = excluded.kind, display_name = excluded.display_name, phone = excluded.phone;
insert into payers (id, kind, display_name, phone)
values ('f19bff6f-96ad-541f-b206-930e87fefd58', 'person', 'Li MengLu', null)
on conflict (id) do update set kind = excluded.kind, display_name = excluded.display_name, phone = excluded.phone;
insert into payers (id, kind, display_name, phone)
values ('e72cd785-82cb-5e83-82b3-458f9c370e1a', 'person', 'Zhai Yufeng/Ng Kok Kiong', null)
on conflict (id) do update set kind = excluded.kind, display_name = excluded.display_name, phone = excluded.phone;
insert into payers (id, kind, display_name, phone)
values ('f371a485-f80e-5627-84bb-3e89f0f77ecd', 'person', 'Valarmathy D/O Thir', null)
on conflict (id) do update set kind = excluded.kind, display_name = excluded.display_name, phone = excluded.phone;
insert into payers (id, kind, display_name, phone)
values ('119db4c3-2ff6-5535-8baf-d3ef4b449f7e', 'person', null, '+65 9029 4474')
on conflict (id) do update set kind = excluded.kind, display_name = excluded.display_name, phone = excluded.phone;
insert into payers (id, kind, display_name, phone)
values ('116cc436-a495-5374-b29a-eebe23d6c64a', 'person', 'Low Yam Chua', null)
on conflict (id) do update set kind = excluded.kind, display_name = excluded.display_name, phone = excluded.phone;
insert into payers (id, kind, display_name, phone)
values ('0343f041-611c-504d-b8fc-bcf4d8cf0e51', 'person', 'Chun Pei Ying', null)
on conflict (id) do update set kind = excluded.kind, display_name = excluded.display_name, phone = excluded.phone;
insert into payers (id, kind, display_name, phone)
values ('14d2439e-9d06-5b9d-a329-cd61fa17ccc3', 'person', 'You YunYing', null)
on conflict (id) do update set kind = excluded.kind, display_name = excluded.display_name, phone = excluded.phone;
insert into payers (id, kind, display_name, phone)
values ('79ef79f8-4a2f-52bb-bf5d-82eb83209074', 'person', 'Angeline Lee S / Caleb Ong Woon Weal', null)
on conflict (id) do update set kind = excluded.kind, display_name = excluded.display_name, phone = excluded.phone;
insert into payers (id, kind, display_name, phone)
values ('b799c176-0e88-51c4-829f-be480d29d7ca', 'person', null, '+65 9338 8224')
on conflict (id) do update set kind = excluded.kind, display_name = excluded.display_name, phone = excluded.phone;
insert into payers (id, kind, display_name, phone)
values ('c3da9cbc-e87b-5730-ba4f-346eaa655a3f', 'person', 'Fang Ye', null)
on conflict (id) do update set kind = excluded.kind, display_name = excluded.display_name, phone = excluded.phone;
insert into payers (id, kind, display_name, phone)
values ('f9228589-b8b1-5c9d-9f2c-303585946cda', 'person', 'Lan Ting Ting', null)
on conflict (id) do update set kind = excluded.kind, display_name = excluded.display_name, phone = excluded.phone;
insert into payers (id, kind, display_name, phone)
values ('59d4555d-42fa-5ba4-a78a-1720b695f25a', 'person', 'Teo Lee Wei', null)
on conflict (id) do update set kind = excluded.kind, display_name = excluded.display_name, phone = excluded.phone;
insert into payers (id, kind, display_name, phone)
values ('b2ca59d1-e370-57e7-af51-b129cc7983de', 'person', 'Zhong YinFang', null)
on conflict (id) do update set kind = excluded.kind, display_name = excluded.display_name, phone = excluded.phone;
insert into payers (id, kind, display_name, phone)
values ('ec0a26b6-8328-5324-a0df-3639f5962a59', 'person', 'Yan RongFeng', null)
on conflict (id) do update set kind = excluded.kind, display_name = excluded.display_name, phone = excluded.phone;
insert into payers (id, kind, display_name, phone)
values ('11eb69ab-3ccd-5107-a613-1a510b1ffe38', 'person', 'Ji Heng', null)
on conflict (id) do update set kind = excluded.kind, display_name = excluded.display_name, phone = excluded.phone;
insert into payers (id, kind, display_name, phone)
values ('5d64336c-8ba6-5918-b528-e558954b3392', 'person', 'Wang Silong', null)
on conflict (id) do update set kind = excluded.kind, display_name = excluded.display_name, phone = excluded.phone;

-- Students
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('8db53ed9-233e-5572-ae15-13773d015dab', 'Agnes', 'freestyle', false, null, 'c2722c4b-da02-5ea8-ae32-e9c0e9182df1')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('feb22150-e140-559d-8076-67f78ca92aa9', 'Aiden', null, false, null, 'b65789ad-2f5b-5e90-9d8c-290260e8a937')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('cb35de48-9276-5b00-b92a-ce2a399b812c', 'Desiree', null, false, null, 'b65789ad-2f5b-5e90-9d8c-290260e8a937')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('0d46ace0-d99e-5fc5-b7b4-37f388495a58', 'Akxel', null, false, 'Renew 12 on 31/3, FS pacakge aft cycle', null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('c585c8cc-0cc2-57ed-8c4c-ed167c8d54a2', 'Alan', null, false, 'Renew 12 on 1 august', '20d56d0f-88bb-5087-a5bd-333d5f8af78d')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('9f90ea5a-4386-52fe-8761-3439a9013d35', 'Alexis', 'freestyle', false, 'Paid since 17 apr for 8 lesson', 'ec37b2fa-2e53-5e1a-8d91-28df955a246c')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('8a424d3f-0cce-5a87-a8a5-87aa1e69b8d3', 'Alicia', null, false, 'FS package after this cycle', '62c822f5-f334-5525-b4f1-20c240b883cc')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('131a438f-183b-5a1a-a9ad-9f35c17f18c2', 'Allynn', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('7e9425a0-4eb5-5341-ada0-e836747c3da5', 'Amelia', null, false, null, 'a33b2ba0-9a15-5d58-b7bf-d17d2c8f7917')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('4b3eda94-137d-5807-a382-80a80b6149ae', 'Audrey', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('58935cd0-f087-560e-a5a8-b3c9b39ee4a9', 'Arjaav', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('8fd7aced-0f86-503e-81fa-894e66149449', 'Ayana', null, false, 'To update them when recover', 'd3196d18-00d6-5931-bef8-96bbb54f9597')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('ce210fdd-8429-576e-93a4-0e6146ba52a9', 'Bernice', null, false, 'FS package after this cycle', '92bea8d0-53b5-52d5-8514-7fe18040bcaa')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('5c9fd449-adbc-5238-af69-b7c7d7650bd1', 'Beunice', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('14caf9c3-de66-5842-b116-62aa10cf7940', 'Caitlyn', null, false, 'FS package after this cycle', 'edbfbb98-70b2-5542-b700-8bb5fecf3af8')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('6c48f544-b1a5-5b0d-86f9-998c0a82c295', 'Caleb', null, false, null, 'c897a8ff-e717-5789-978d-c102fc2968c8')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('4267d084-6387-5abf-8a4d-8c71aa08e8d9', 'Shawn', null, false, null, 'c897a8ff-e717-5789-978d-c102fc2968c8')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('2e0ff969-73df-56cb-a49b-044e114718a2', 'Chloe Ang', null, false, 'FS package after this cycle', '19c56bd3-a68d-5fd4-8127-668540959011')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('5476f870-9d85-5a9f-82d7-58ae1b88b045', 'Chua Jenna', null, false, 'FS package after this cycle', '6753028b-0bf9-5a7a-a33a-5d2c9db065ac')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('7b2dc609-9457-538f-a40d-e269a057aa8f', 'Chua Julius', null, false, 'FS package after this cycle', '6753028b-0bf9-5a7a-a33a-5d2c9db065ac')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('47da8d91-84c7-5ca1-ae70-1148dd55b9d6', 'Ciara', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('8d1c0841-2d61-57ac-a370-323ce6d177a5', 'Ensley', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('645284d6-bdd8-52e4-bceb-11ba5b4fe271', 'Cici', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('c9f99835-6646-5528-a136-8acf16a4ad31', 'Crystal', null, false, 'To transfer over to marianne', '8442d48e-c5c8-5c16-ba65-c195f33ed754')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('07f24621-6939-5c24-b259-04e257029a1c', 'Dan Dan', 'freestyle', false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('dd1cb11e-9995-5ec8-bfd8-4eab90fa61e7', 'Darius', 'freestyle', false, 'renew', '2935b707-26eb-55ff-93db-95f3ccf6f97b')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('ee27c92c-7ca0-5aab-971f-38a1f7fa19b4', 'Emily', null, false, null, '0f0b4976-63db-5f81-bf29-d30b1e2f4a66')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('961bf86d-1cad-5b91-8347-e016cd3bc87e', 'Olivia', null, false, null, '0f0b4976-63db-5f81-bf29-d30b1e2f4a66')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('5e6938a3-b7d4-570a-95cd-c93130a0bc38', 'Emma (Mabel''s)', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('1d512a0d-7698-5acf-9115-b1ec98b8c617', 'Essence Low', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('1e714eb0-ddb2-53ee-b364-db1c01cba2f5', 'Ethan', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('3bd56a70-acde-5a39-abd3-1a7cfbb4d69e', 'Evan', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('939d554c-1b75-5eff-93e8-31651f136bf5', 'Eva', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('eac8bf3b-a04c-579d-9dc0-918375b0ce75', 'Eva Mum', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('838c28cf-3b3e-524e-bedb-0e5b22c3fb3a', 'Fang Jie', null, false, null, '08ee858b-0efa-550d-9448-2adc1e1e75e8')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('ec9e4da4-5e62-518c-bad6-3ea71d960f21', 'Fran (Ava)', null, false, 'FS package after this cycle', null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('0fe03275-8cd2-5e44-a77a-973b102adb3f', 'Fran (Isaac)', null, false, 'FS package after this cycle', null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('7bf353e6-18ea-5526-8db7-bb3175f6db3f', 'Geo', 'freestyle', false, null, 'be74c50f-f927-56cb-b798-869db31f2e9e')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('c0115c92-c272-5386-afe8-32636846d9ae', 'Hana', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('c828b433-da87-5c94-909f-6080c6af2f30', 'Kazumi', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('86c6c8d2-fded-55ee-ae84-722d5f2fe922', 'Hank', 'freestyle', false, null, 'aa2d4d9d-d5ce-5edc-97dd-b8d82992023b')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('0ce72b10-67b0-5cba-832b-e5104038bf11', 'Wayne', 'freestyle', false, null, 'aa2d4d9d-d5ce-5edc-97dd-b8d82992023b')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('27865e02-b37f-5de6-ba0c-d4f08c2822e2', 'Hannah', null, false, null, '3afe08cf-a330-5198-8fc4-ece947ef3225')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('db8e3ba6-ad4d-54f8-a8d2-6b27dc34e81b', 'Harry', 'freestyle', false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('ba20e5a2-1434-565f-bdb1-f2794475af2f', 'Hugo', null, false, 'Mabel texted', null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('7c821475-e585-5b83-ab67-d68fd7c3145a', 'Ian', null, false, null, 'a6bd2c3f-7e51-54f0-bc27-956e450943cc')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('fde6d33f-94ab-54d8-b6b0-1470c8038b2f', 'Ila (Alexis Friend)', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('14035a7b-ecbc-5b82-a7db-39161cfaf96d', 'Isaac', 'freestyle', false, null, '222c3844-856b-555d-9ad3-da0e509b3ae7')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('b45a6902-80de-52b6-bb4e-49abe692430f', 'Jacq Dad', null, false, '6 lessons transfer to Esther', '585299b8-57e9-5521-9f01-340c642b59b0')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('fad9fe2e-aef7-5156-a614-b3a1834c5b3b', 'Mom (Esther)', null, false, '6 lessons transfer to Esther', '585299b8-57e9-5521-9f01-340c642b59b0')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('4a809aca-6972-5f99-ab92-235c16d830f4', 'Jacqueline Koh', 'freestyle', false, null, '585299b8-57e9-5521-9f01-340c642b59b0')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('86001e6a-51d9-58e0-8d26-74ddc0d9552d', 'Jaren Lin', null, false, null, 'e512f50a-de2d-5a4c-a637-7be77a06b417')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('65b42b9b-212c-5503-86ab-8eeb5991eed6', 'Jing Yang', null, false, null, '762ac958-c503-5002-a816-85c0345f34ec')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('e6db77d2-0e23-5740-b1c4-fe56c82c0ec1', 'Jun Rui (Rui Rui)', null, false, null, 'a2e3bab7-928e-54f3-9340-bd80423a3493')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('21c4d44b-dc09-5ba0-be87-21597d61a40d', 'Jun Kai', null, false, null, 'a2e3bab7-928e-54f3-9340-bd80423a3493')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('e3f802c4-e5ed-55da-b17b-f1281e7e0993', 'Kaia', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('4d3abb18-541b-54b1-8627-8a999338c6de', 'Shae', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('25b7c6e0-2e65-599e-8dd9-bbf2bd207fb1', 'Koi Chi', null, false, null, '2f941841-340b-5626-b7e4-c7cd0d05e922')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('611e6bd6-2c73-567c-a8c6-bcdc96b26ed8', 'Joi Lee', null, false, null, '2f941841-340b-5626-b7e4-c7cd0d05e922')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('85e66b8f-4513-557a-a4e8-58acd88edd18', 'Eileen', null, false, null, '2f941841-340b-5626-b7e4-c7cd0d05e922')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('db9a6afa-72f8-5d1a-b8a2-fb024ccd08d9', 'Leo', 'freestyle', false, null, 'a1441007-be33-50f3-8a81-e09f03fcc550')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('0975fbb3-ae06-5637-adfd-69c1a7fe9cea', 'Marianne', null, false, '* Spec', '8442d48e-c5c8-5c16-ba65-c195f33ed754')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('7427993a-af18-53f7-9ef8-fff0a159c368', 'Matthew', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('83ce8bbc-ebe7-5f4f-9954-da3a34d2dd25', 'Emilia', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('7711eb7d-8750-5e61-8529-7808e90432f2', 'Melody Zhuang', null, false, null, '36957c03-bfb9-53f8-9fef-2e5391e789e6')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('78b2c11a-6dc4-52c4-a2ec-5e082059b477', 'Nicole', null, false, null, '35af9f6d-154a-5abc-ab63-63d236ca4239')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('568655ae-161d-5af0-a901-974f19f5d0ac', 'Nicole Mum', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('536283ea-0e83-5d63-beb9-c7254cdab496', 'Ning Han', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('0ad14bca-0f65-5438-afc9-cb38c79867bc', 'Orkid', 'freestyle', false, null, 'ad0a92bc-75d7-5e0b-ad25-3d8cf4a448a6')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('8d14a793-9c17-5a89-b197-8451ddf6cc3f', 'Praveenkumar', null, false, '* Spec', '65fbb730-0e3d-5c04-91dd-4fcf4f1108da')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('f4e90f45-6677-58a7-af01-0f93046d1b5f', 'Qian Le', null, false, null, '159f91e3-7a50-5749-a088-0848ccecfaaa')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('e5661fb9-8fb3-5ab9-9c46-136950a1f140', 'Qian Le Dad', null, false, null, '159f91e3-7a50-5749-a088-0848ccecfaaa')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('dec36253-6004-555b-bb94-777217372500', 'Remy', null, false, '', null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('2bbe1caf-50a3-5ce6-b890-60e74834d90a', 'Rucas', null, false, '', null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('9102cbfd-504c-51ed-8c9d-547448a57533', 'Renee Ong', null, false, null, 'cbd707cc-4cd6-500a-8f0f-6f0235f98f5e')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('42103bec-1470-545e-a1eb-29097175a97e', 'Rui Yang (Teh Swee Young)', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('a9fedbd4-a543-5cf3-9909-2a875dbb228f', 'Sarah (Basic)', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('10dc5238-c6fb-5500-b95c-b76c884433bd', 'Sarah Han', null, false, 'FS package after this cycle', '80c1cec7-8d4d-56df-b6a8-148d841a16a8')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('d86c6e02-39ff-53f2-925a-d3c03dc3db94', 'Shen Tong', 'freestyle', false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('a35c2e9e-1ac0-5792-8ce0-ec16d0525f4d', 'Shi Rui', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('daa84caa-4e80-5941-8140-ba646a4ffea5', 'Terrence', null, false, null, '7c2dbb4d-69c7-5f90-be20-e74ed8d81a44')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('a56ddd65-cc2d-562e-a520-2b60cc554dc1', 'Owen', null, false, null, '7c2dbb4d-69c7-5f90-be20-e74ed8d81a44')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('b8bd41d5-52e7-53df-9d58-d55f06b8b48e', 'Tiffanie', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('186f2972-5ba7-5845-8132-4bf21eba5e4f', 'Wu Jia Ying (Xiao Tuan Zi)', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('9b8c0f05-fdb9-5e60-a6d0-ae6035b65f22', 'Xavier', 'freestyle', false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('e52cceb5-89c0-5b2a-a09e-1bb214e5f75d', 'Xin Yu (Gao Min Sis)', null, false, null, '9e6243d3-b001-51c7-a397-b61b4227b821')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('0a332a52-cbbd-537c-999c-f361ca042779', 'Yinuo', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('30b506df-dd6a-5046-82e3-65c40778e88b', 'Yu Yuan', null, false, 'FS package after this cycle', null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('7d979815-eb6a-50b7-81ad-9408a6cb97e1', 'Zhi Han', null, false, null, 'f0e1d9b7-5f68-5021-ba8c-1038cd670954')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('261cafd2-5a72-5678-a551-55c897f78988', 'Rui Yi', null, false, null, 'f0e1d9b7-5f68-5021-ba8c-1038cd670954')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('467a37df-bcc3-5696-963e-343d3bd16da1', 'Zhi Ran', null, false, null, 'f19bff6f-96ad-541f-b206-930e87fefd58')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('8a16bcbd-9ca8-5322-8de2-be5e68f07e26', 'Angelina', null, false, null, 'e72cd785-82cb-5e83-82b3-458f9c370e1a')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('5c1474e6-00b6-5498-b124-3f8d5b12f90e', 'Britney', null, false, null, 'f371a485-f80e-5627-84bb-3e89f0f77ecd')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('0c96497c-a7f3-5942-8cc7-76265648b942', 'Ellie', null, false, null, '119db4c3-2ff6-5535-8baf-d3ef4b449f7e')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('07d610f2-6ecb-59a9-bcdd-703b91fb4b52', 'Kylie', null, false, null, '119db4c3-2ff6-5535-8baf-d3ef4b449f7e')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('6ff4cc36-6472-5056-a11f-9930a5f991e7', 'Jayden', null, false, null, '116cc436-a495-5374-b29a-eebe23d6c64a')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('500f980c-0f06-5430-a8a8-811faffb4b87', 'Kayenn', null, false, '*Special', '0343f041-611c-504d-b8fc-bcf4d8cf0e51')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('2d4fcf64-fa0e-54c1-b989-9d48ad78be56', 'Le Han', 'freestyle', false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('7f559067-1f18-5a31-8fb2-b66536fc028d', 'Le Le', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('c8d94aa0-9573-5376-b9ec-dd53baa34f13', 'Leighton', 'freestyle', false, null, '0343f041-611c-504d-b8fc-bcf4d8cf0e51')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('07e718de-73b2-5b91-ad3e-fd6f0824bf3b', 'Mark', null, false, null, '14d2439e-9d06-5b9d-a329-cd61fa17ccc3')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('74601412-1ce3-57bc-bdc0-f5c98d76892a', 'Min Li', 'freestyle', false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('edab7c99-2efd-59df-8a64-fc8e7fe3e2c3', 'Raeden', null, false, null, '79ef79f8-4a2f-52bb-bf5d-82eb83209074')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('2b693e72-ee54-5204-9a13-48a407627485', 'Ryan', null, false, null, 'b799c176-0e88-51c4-829f-be480d29d7ca')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('f4eb1af3-5dfe-51d3-a6c5-bf36b1987c7b', 'Shi Han', null, false, null, 'c3da9cbc-e87b-5730-ba4f-346eaa655a3f')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('ca01241f-d00f-5cd8-bb34-3ffcb4d69f75', 'Yi Lin', null, false, null, 'f9228589-b8b1-5c9d-9f2c-303585946cda')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('714993dc-52d5-52f7-bdd0-e511292a1d2e', 'Mao Lin', null, false, null, 'f9228589-b8b1-5c9d-9f2c-303585946cda')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('841cef55-098c-59d2-9b25-240e27a8a468', 'Zayden', null, false, null, '59d4555d-42fa-5ba4-a78a-1720b695f25a')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('39315e6c-e81c-578e-bde7-17054f4567cc', 'Zephan', 'freestyle', false, null, '59d4555d-42fa-5ba4-a78a-1720b695f25a')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('6d1f7c08-bc25-55d1-b6bd-13b0e2b02153', 'Alisa', null, false, null, 'b2ca59d1-e370-57e7-af51-b129cc7983de')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('f63c1adf-2627-55e9-b93c-e95534e135ac', 'Angela', null, false, null, 'b2ca59d1-e370-57e7-af51-b129cc7983de')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('5f4ed54d-6d9c-574d-8a3e-a0bc75ce8ad2', 'Arden', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('4af63a5d-9480-5070-b7ea-67069c2196ed', 'Ming Xuan', null, false, null, 'ec0a26b6-8328-5324-a0df-3639f5962a59')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('0743ba7a-fd8b-5299-a77d-ef9ce7c02ba1', 'Wren Ji', null, false, null, '11eb69ab-3ccd-5107-a613-1a510b1ffe38')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('f1d6314e-3be5-5019-b5fc-3fac450ede11', 'Kah Yu', null, false, 'paid +12 on 11 Aug', null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('5197879b-9eb7-5c61-b251-63205c74c49e', 'Tian Yu', null, false, 'paid +12 on 11 Aug', null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('b0635e01-0737-5db5-ba7e-affa57ab723c', 'Joshua', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('049748a2-6aa7-5de7-82ca-f6aa5b759350', 'Ekke', null, false, null, '5d64336c-8ba6-5918-b528-e558954b3392')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('40091cba-a4e0-5f2f-be60-77ad19b1c127', 'Yaashvanth', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(excluded.skill_level, students.skill_level), is_trial = students.is_trial or excluded.is_trial, notes = coalesce(excluded.notes, students.notes), payer_id = coalesce(excluded.payer_id, students.payer_id);

-- Enrolments
insert into enrolments (student_id, class_id)
values ('049748a2-6aa7-5de7-82ca-f6aa5b759350', 'edfbe769-aa2b-5b09-985c-4c074757c350')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('0743ba7a-fd8b-5299-a77d-ef9ce7c02ba1', 'dcae8381-e105-5503-a1d8-3c6d2d70f157')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('07d610f2-6ecb-59a9-bcdd-703b91fb4b52', '155653ad-cb4c-5dbd-91c0-1c7a662e283e')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('07e718de-73b2-5b91-ad3e-fd6f0824bf3b', '155653ad-cb4c-5dbd-91c0-1c7a662e283e')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('07f24621-6939-5c24-b259-04e257029a1c', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('0975fbb3-ae06-5637-adfd-69c1a7fe9cea', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('0a332a52-cbbd-537c-999c-f361ca042779', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('0ad14bca-0f65-5438-afc9-cb38c79867bc', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('0c96497c-a7f3-5942-8cc7-76265648b942', '155653ad-cb4c-5dbd-91c0-1c7a662e283e')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('0ce72b10-67b0-5cba-832b-e5104038bf11', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('0d46ace0-d99e-5fc5-b7b4-37f388495a58', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('0fe03275-8cd2-5e44-a77a-973b102adb3f', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('10dc5238-c6fb-5500-b95c-b76c884433bd', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('131a438f-183b-5a1a-a9ad-9f35c17f18c2', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('14035a7b-ecbc-5b82-a7db-39161cfaf96d', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('14caf9c3-de66-5842-b116-62aa10cf7940', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('186f2972-5ba7-5845-8132-4bf21eba5e4f', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('1d512a0d-7698-5acf-9115-b1ec98b8c617', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('1e714eb0-ddb2-53ee-b364-db1c01cba2f5', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('21c4d44b-dc09-5ba0-be87-21597d61a40d', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('25b7c6e0-2e65-599e-8dd9-bbf2bd207fb1', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('261cafd2-5a72-5678-a551-55c897f78988', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('27865e02-b37f-5de6-ba0c-d4f08c2822e2', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('2b693e72-ee54-5204-9a13-48a407627485', '155653ad-cb4c-5dbd-91c0-1c7a662e283e')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('2bbe1caf-50a3-5ce6-b890-60e74834d90a', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('2d4fcf64-fa0e-54c1-b989-9d48ad78be56', '155653ad-cb4c-5dbd-91c0-1c7a662e283e')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('2e0ff969-73df-56cb-a49b-044e114718a2', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('30b506df-dd6a-5046-82e3-65c40778e88b', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('39315e6c-e81c-578e-bde7-17054f4567cc', '155653ad-cb4c-5dbd-91c0-1c7a662e283e')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('3bd56a70-acde-5a39-abd3-1a7cfbb4d69e', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('40091cba-a4e0-5f2f-be60-77ad19b1c127', 'edfbe769-aa2b-5b09-985c-4c074757c350')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('42103bec-1470-545e-a1eb-29097175a97e', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('4267d084-6387-5abf-8a4d-8c71aa08e8d9', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('467a37df-bcc3-5696-963e-343d3bd16da1', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('47da8d91-84c7-5ca1-ae70-1148dd55b9d6', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('4a809aca-6972-5f99-ab92-235c16d830f4', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('4af63a5d-9480-5070-b7ea-67069c2196ed', 'dcae8381-e105-5503-a1d8-3c6d2d70f157')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('4b3eda94-137d-5807-a382-80a80b6149ae', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('4d3abb18-541b-54b1-8627-8a999338c6de', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('500f980c-0f06-5430-a8a8-811faffb4b87', '155653ad-cb4c-5dbd-91c0-1c7a662e283e')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('5197879b-9eb7-5c61-b251-63205c74c49e', 'dcae8381-e105-5503-a1d8-3c6d2d70f157')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('536283ea-0e83-5d63-beb9-c7254cdab496', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('5476f870-9d85-5a9f-82d7-58ae1b88b045', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('568655ae-161d-5af0-a901-974f19f5d0ac', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('58935cd0-f087-560e-a5a8-b3c9b39ee4a9', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('5c1474e6-00b6-5498-b124-3f8d5b12f90e', '155653ad-cb4c-5dbd-91c0-1c7a662e283e')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('5c9fd449-adbc-5238-af69-b7c7d7650bd1', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('5e6938a3-b7d4-570a-95cd-c93130a0bc38', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('5f4ed54d-6d9c-574d-8a3e-a0bc75ce8ad2', 'dcae8381-e105-5503-a1d8-3c6d2d70f157')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('611e6bd6-2c73-567c-a8c6-bcdc96b26ed8', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('645284d6-bdd8-52e4-bceb-11ba5b4fe271', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('65b42b9b-212c-5503-86ab-8eeb5991eed6', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('6c48f544-b1a5-5b0d-86f9-998c0a82c295', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('6d1f7c08-bc25-55d1-b6bd-13b0e2b02153', 'dcae8381-e105-5503-a1d8-3c6d2d70f157')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('6ff4cc36-6472-5056-a11f-9930a5f991e7', '155653ad-cb4c-5dbd-91c0-1c7a662e283e')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('714993dc-52d5-52f7-bdd0-e511292a1d2e', '155653ad-cb4c-5dbd-91c0-1c7a662e283e')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('7427993a-af18-53f7-9ef8-fff0a159c368', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('74601412-1ce3-57bc-bdc0-f5c98d76892a', '155653ad-cb4c-5dbd-91c0-1c7a662e283e')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('7711eb7d-8750-5e61-8529-7808e90432f2', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('78b2c11a-6dc4-52c4-a2ec-5e082059b477', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('7b2dc609-9457-538f-a40d-e269a057aa8f', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('7bf353e6-18ea-5526-8db7-bb3175f6db3f', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('7c821475-e585-5b83-ab67-d68fd7c3145a', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('7d979815-eb6a-50b7-81ad-9408a6cb97e1', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('7e9425a0-4eb5-5341-ada0-e836747c3da5', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('7f559067-1f18-5a31-8fb2-b66536fc028d', '155653ad-cb4c-5dbd-91c0-1c7a662e283e')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('838c28cf-3b3e-524e-bedb-0e5b22c3fb3a', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('83ce8bbc-ebe7-5f4f-9954-da3a34d2dd25', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('841cef55-098c-59d2-9b25-240e27a8a468', '155653ad-cb4c-5dbd-91c0-1c7a662e283e')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('85e66b8f-4513-557a-a4e8-58acd88edd18', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('86001e6a-51d9-58e0-8d26-74ddc0d9552d', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('86c6c8d2-fded-55ee-ae84-722d5f2fe922', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('8a16bcbd-9ca8-5322-8de2-be5e68f07e26', '155653ad-cb4c-5dbd-91c0-1c7a662e283e')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('8a424d3f-0cce-5a87-a8a5-87aa1e69b8d3', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('8d14a793-9c17-5a89-b197-8451ddf6cc3f', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('8d1c0841-2d61-57ac-a370-323ce6d177a5', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('8db53ed9-233e-5572-ae15-13773d015dab', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('8fd7aced-0f86-503e-81fa-894e66149449', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('9102cbfd-504c-51ed-8c9d-547448a57533', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('939d554c-1b75-5eff-93e8-31651f136bf5', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('961bf86d-1cad-5b91-8347-e016cd3bc87e', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('9b8c0f05-fdb9-5e60-a6d0-ae6035b65f22', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('9f90ea5a-4386-52fe-8761-3439a9013d35', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('a35c2e9e-1ac0-5792-8ce0-ec16d0525f4d', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('a56ddd65-cc2d-562e-a520-2b60cc554dc1', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('a9fedbd4-a543-5cf3-9909-2a875dbb228f', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('b0635e01-0737-5db5-ba7e-affa57ab723c', 'dcae8381-e105-5503-a1d8-3c6d2d70f157')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('b45a6902-80de-52b6-bb4e-49abe692430f', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('b8bd41d5-52e7-53df-9d58-d55f06b8b48e', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('ba20e5a2-1434-565f-bdb1-f2794475af2f', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('c0115c92-c272-5386-afe8-32636846d9ae', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('c585c8cc-0cc2-57ed-8c4c-ed167c8d54a2', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('c828b433-da87-5c94-909f-6080c6af2f30', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('c8d94aa0-9573-5376-b9ec-dd53baa34f13', '155653ad-cb4c-5dbd-91c0-1c7a662e283e')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('c9f99835-6646-5528-a136-8acf16a4ad31', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('ca01241f-d00f-5cd8-bb34-3ffcb4d69f75', '155653ad-cb4c-5dbd-91c0-1c7a662e283e')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('cb35de48-9276-5b00-b92a-ce2a399b812c', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('ce210fdd-8429-576e-93a4-0e6146ba52a9', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('d86c6e02-39ff-53f2-925a-d3c03dc3db94', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('daa84caa-4e80-5941-8140-ba646a4ffea5', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('db8e3ba6-ad4d-54f8-a8d2-6b27dc34e81b', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('db9a6afa-72f8-5d1a-b8a2-fb024ccd08d9', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('dd1cb11e-9995-5ec8-bfd8-4eab90fa61e7', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('dec36253-6004-555b-bb94-777217372500', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('e3f802c4-e5ed-55da-b17b-f1281e7e0993', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('e52cceb5-89c0-5b2a-a09e-1bb214e5f75d', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('e5661fb9-8fb3-5ab9-9c46-136950a1f140', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('e6db77d2-0e23-5740-b1c4-fe56c82c0ec1', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('eac8bf3b-a04c-579d-9dc0-918375b0ce75', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('ec9e4da4-5e62-518c-bad6-3ea71d960f21', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('edab7c99-2efd-59df-8a64-fc8e7fe3e2c3', '155653ad-cb4c-5dbd-91c0-1c7a662e283e')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('ee27c92c-7ca0-5aab-971f-38a1f7fa19b4', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('f1d6314e-3be5-5019-b5fc-3fac450ede11', 'dcae8381-e105-5503-a1d8-3c6d2d70f157')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('f4e90f45-6677-58a7-af01-0f93046d1b5f', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('f4eb1af3-5dfe-51d3-a6c5-bf36b1987c7b', '155653ad-cb4c-5dbd-91c0-1c7a662e283e')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('f63c1adf-2627-55e9-b93c-e95534e135ac', 'dcae8381-e105-5503-a1d8-3c6d2d70f157')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('fad9fe2e-aef7-5156-a614-b3a1834c5b3b', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('fde6d33f-94ab-54d8-b6b0-1470c8038b2f', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;
insert into enrolments (student_id, class_id)
values ('feb22150-e140-559d-8076-67f78ca92aa9', 'abafb60a-1e00-5379-b1d7-0e09a099b0f0')
on conflict (student_id, class_id) do nothing;

-- Packages
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  'a5379678-036d-548f-823e-e11ba725c34d',
  '8db53ed9-233e-5572-ae15-13773d015dab',
  'c2722c4b-da02-5ea8-ae32-e9c0e9182df1',
  pp.id,
  12,
  7,
  true,
  'paynow',
  coalesce(400::numeric, pp.amount_sgd),
  '2026-03-21',
  '2026-09-21',
  null,
  null
from package_products pp
where pp.product_type = 'freestyle'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '8a0a9d0c-d4ab-5043-8684-563ba9d716ce',
  'feb22150-e140-559d-8076-67f78ca92aa9',
  'b65789ad-2f5b-5e90-9d8c-290260e8a937',
  pp.id,
  12,
  11,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-05-16',
  '2026-11-16',
  null,
  null
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '6c495686-5d69-5040-b9d4-78deb2dda324',
  '0d46ace0-d99e-5fc5-b7b4-37f388495a58',
  null,
  pp.id,
  8,
  3,
  true,
  'paynow',
  coalesce(250::numeric, pp.amount_sgd),
  '2026-05-09',
  '2026-11-09',
  null,
  'Renew 12 on 31/3, FS pacakge aft cycle'
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 8
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  'd95efb2f-76d4-5969-9706-0920cba8dad0',
  'c585c8cc-0cc2-57ed-8c4c-ed167c8d54a2',
  '20d56d0f-88bb-5087-a5bd-333d5f8af78d',
  pp.id,
  12,
  2,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-05-24',
  '2026-11-24',
  null,
  'Renew 12 on 1 august'
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '2c011797-2b1f-53a3-8fe9-2863d81b6f8b',
  '9f90ea5a-4386-52fe-8761-3439a9013d35',
  'ec37b2fa-2e53-5e1a-8d91-28df955a246c',
  pp.id,
  8,
  7,
  true,
  'paynow',
  coalesce(290::numeric, pp.amount_sgd),
  '2026-03-22',
  '2026-09-22',
  null,
  'Paid since 17 apr for 8 lesson'
from package_products pp
where pp.product_type = 'freestyle'
  and pp.total_credits = 8
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  'dff7b72d-6644-50e1-8649-46d5d8aeef18',
  '8a424d3f-0cce-5a87-a8a5-87aa1e69b8d3',
  '62c822f5-f334-5525-b4f1-20c240b883cc',
  pp.id,
  12,
  9,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-05-24',
  '2026-11-24',
  null,
  'FS package after this cycle'
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '55f1b41a-d815-5a36-a740-0f9db0e17956',
  '131a438f-183b-5a1a-a9ad-9f35c17f18c2',
  null,
  pp.id,
  8,
  5,
  true,
  'paynow',
  coalesce(250::numeric, pp.amount_sgd),
  '2026-05-24',
  '2026-11-24',
  null,
  null
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 8
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '0e65893e-8bd1-5053-9337-f409f4e37b6c',
  '7e9425a0-4eb5-5341-ada0-e836747c3da5',
  'a33b2ba0-9a15-5d58-b7bf-d17d2c8f7917',
  pp.id,
  8,
  1,
  true,
  'paynow',
  coalesce(250::numeric, pp.amount_sgd),
  '2026-08-02',
  '2027-02-02',
  null,
  null
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 8
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  'bd485405-b933-530d-af4e-63bbec7120ca',
  '4b3eda94-137d-5807-a382-80a80b6149ae',
  null,
  pp.id,
  8,
  5,
  true,
  'paynow',
  coalesce(250::numeric, pp.amount_sgd),
  '2026-08-08',
  '2027-02-08',
  null,
  null
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 8
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '99044102-01da-565e-bb87-007dba942612',
  '58935cd0-f087-560e-a5a8-b3c9b39ee4a9',
  null,
  pp.id,
  4,
  4,
  true,
  'paynow',
  coalesce(130::numeric, pp.amount_sgd),
  '2026-04-25',
  '2026-10-25',
  null,
  null
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 4
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '4b7c9e41-b37e-5157-9882-22ac16c47a2c',
  '8fd7aced-0f86-503e-81fa-894e66149449',
  'd3196d18-00d6-5931-bef8-96bbb54f9597',
  pp.id,
  12,
  1,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-06-20',
  '2026-12-20',
  now(),
  'To update them when recover'
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '6ac52e9a-ccd7-5367-b160-b51fda3d2461',
  'ce210fdd-8429-576e-93a4-0e6146ba52a9',
  '92bea8d0-53b5-52d5-8514-7fe18040bcaa',
  pp.id,
  12,
  11,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-04-19',
  '2026-10-19',
  null,
  'FS package after this cycle'
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '00666b2f-b675-571b-827f-54312f930997',
  '5c9fd449-adbc-5238-af69-b7c7d7650bd1',
  null,
  pp.id,
  12,
  6,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-06-21',
  '2026-12-21',
  null,
  null
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '57573d1c-4ae3-5251-a70f-e99730bd7b74',
  '14caf9c3-de66-5842-b116-62aa10cf7940',
  'edbfbb98-70b2-5542-b700-8bb5fecf3af8',
  pp.id,
  12,
  5,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-07-18',
  '2027-01-18',
  null,
  'FS package after this cycle'
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '3a1265a8-394c-5135-b08b-cdc575de38e3',
  '6c48f544-b1a5-5b0d-86f9-998c0a82c295',
  'c897a8ff-e717-5789-978d-c102fc2968c8',
  pp.id,
  12,
  9,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-05-31',
  '2026-11-30',
  null,
  null
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '6a4632b6-c6a5-57de-9eb5-1fc8ed80f4de',
  '2e0ff969-73df-56cb-a49b-044e114718a2',
  '19c56bd3-a68d-5fd4-8127-668540959011',
  pp.id,
  12,
  10,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-05-10',
  '2026-11-10',
  null,
  'FS package after this cycle'
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  'b96c1450-e6fe-5a7a-bfb3-44aaf57247ff',
  '5476f870-9d85-5a9f-82d7-58ae1b88b045',
  '6753028b-0bf9-5a7a-a33a-5d2c9db065ac',
  pp.id,
  12,
  5,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-07-04',
  '2027-01-04',
  null,
  'FS package after this cycle'
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '9d705adb-ef01-51a6-8fae-efe9b0615843',
  '7b2dc609-9457-538f-a40d-e269a057aa8f',
  '6753028b-0bf9-5a7a-a33a-5d2c9db065ac',
  pp.id,
  12,
  5,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-07-04',
  '2027-01-04',
  null,
  'FS package after this cycle'
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '014db5d1-275f-5108-80d8-408c1609fa82',
  '47da8d91-84c7-5ca1-ae70-1148dd55b9d6',
  null,
  pp.id,
  12,
  6,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-05-09',
  '2026-11-09',
  null,
  null
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '30aecf72-2ed7-5288-8d15-5bdd16849fb5',
  '645284d6-bdd8-52e4-bceb-11ba5b4fe271',
  null,
  pp.id,
  4,
  4,
  true,
  'paynow',
  coalesce(130::numeric, pp.amount_sgd),
  '2026-07-25',
  '2027-01-25',
  null,
  'Spreadsheet marked Paid (likely next pack)'
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 4
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '7316d367-0f59-5ab2-92d4-75657b62ad53',
  'c9f99835-6646-5528-a136-8acf16a4ad31',
  '8442d48e-c5c8-5c16-ba65-c195f33ed754',
  pp.id,
  24,
  12,
  true,
  'paynow',
  coalesce(560::numeric, pp.amount_sgd),
  '2024-09-07',
  '2025-03-07',
  null,
  'To transfer over to marianne; Imported custom 560/24 pack'
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 24
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '3840dba7-f527-5b82-967f-54b7c5c67520',
  'c9f99835-6646-5528-a136-8acf16a4ad31',
  '8442d48e-c5c8-5c16-ba65-c195f33ed754',
  pp.id,
  24,
  6,
  true,
  'paynow',
  coalesce(560::numeric, pp.amount_sgd),
  '2025-05-31',
  '2025-11-30',
  null,
  'Imported custom 560/24 pack'
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 24
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  'cd12928b-d09f-5ab1-923b-ae6bae0b6636',
  '07f24621-6939-5c24-b259-04e257029a1c',
  null,
  pp.id,
  12,
  7,
  true,
  'paynow',
  coalesce(400::numeric, pp.amount_sgd),
  '2026-08-01',
  '2027-02-01',
  null,
  null
from package_products pp
where pp.product_type = 'freestyle'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '2882aa57-dac9-5836-b264-43dda44e1f30',
  'dd1cb11e-9995-5ec8-bfd8-4eab90fa61e7',
  '2935b707-26eb-55ff-93db-95f3ccf6f97b',
  pp.id,
  12,
  5,
  true,
  'paynow',
  coalesce(400::numeric, pp.amount_sgd),
  '2026-04-18',
  '2026-10-18',
  null,
  'renew'
from package_products pp
where pp.product_type = 'freestyle'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '49e4922c-2f0d-5703-82a6-9e4f869e730b',
  'ee27c92c-7ca0-5aab-971f-38a1f7fa19b4',
  '0f0b4976-63db-5f81-bf29-d30b1e2f4a66',
  pp.id,
  12,
  7,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-04-11',
  '2026-10-11',
  null,
  null
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  'acef5640-e2ff-5fa9-9b6a-b1596454826d',
  '5e6938a3-b7d4-570a-95cd-c93130a0bc38',
  null,
  pp.id,
  8,
  4,
  true,
  'paynow',
  coalesce(250::numeric, pp.amount_sgd),
  '2026-01-25',
  '2026-07-25',
  null,
  null
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 8
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '15d02467-b528-5237-959d-9087c07f0a48',
  '1d512a0d-7698-5acf-9115-b1ec98b8c617',
  null,
  pp.id,
  12,
  9,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-10-25',
  '2026-04-25',
  null,
  null
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '77233ef8-b6a7-5a4e-aeb1-a7e95fe1489b',
  '1e714eb0-ddb2-53ee-b364-db1c01cba2f5',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-04-25',
  '2026-10-25',
  now(),
  null
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  'a3cafc29-0951-5fcc-b5cc-5f98157919e4',
  '939d554c-1b75-5eff-93e8-31651f136bf5',
  null,
  pp.id,
  12,
  2,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-08-15',
  '2027-02-15',
  null,
  null
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '0f701b70-ee06-5693-8a92-470162868452',
  '838c28cf-3b3e-524e-bedb-0e5b22c3fb3a',
  '08ee858b-0efa-550d-9448-2adc1e1e75e8',
  pp.id,
  12,
  1,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-08-08',
  '2027-02-08',
  null,
  'Spreadsheet marked Paid (likely next pack)'
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '5e27dbaa-6949-5fe2-a9e2-2e583188ff02',
  'ec9e4da4-5e62-518c-bad6-3ea71d960f21',
  null,
  pp.id,
  12,
  10,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-05-09',
  '2026-11-09',
  null,
  'FS package after this cycle'
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  'dc9b1be0-1ed8-58c7-b8ab-0f559612160c',
  '0fe03275-8cd2-5e44-a77a-973b102adb3f',
  null,
  pp.id,
  12,
  10,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-05-09',
  '2026-11-09',
  null,
  'FS package after this cycle'
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '500e8a5a-f681-532f-b49f-d0719e218a44',
  '7bf353e6-18ea-5526-8db7-bb3175f6db3f',
  'be74c50f-f927-56cb-b798-869db31f2e9e',
  pp.id,
  12,
  3,
  true,
  'paynow',
  coalesce(400::numeric, pp.amount_sgd),
  '2026-06-27',
  '2026-12-27',
  null,
  null
from package_products pp
where pp.product_type = 'freestyle'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '8c8d6ab6-9ff6-5f23-990b-7376a99b31d0',
  'c0115c92-c272-5386-afe8-32636846d9ae',
  null,
  pp.id,
  12,
  6,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-07-26',
  '2027-01-26',
  null,
  null
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '91f737f9-03cd-59de-a94d-6cf529d5974d',
  '86c6c8d2-fded-55ee-ae84-722d5f2fe922',
  'aa2d4d9d-d5ce-5edc-97dd-b8d82992023b',
  pp.id,
  12,
  6,
  true,
  'paynow',
  coalesce(400::numeric, pp.amount_sgd),
  '2026-08-07',
  '2027-02-07',
  null,
  null
from package_products pp
where pp.product_type = 'freestyle'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '92fa653b-aaed-5d5b-a6d3-6bc6fb85ba2e',
  '27865e02-b37f-5de6-ba0c-d4f08c2822e2',
  '3afe08cf-a330-5198-8fc4-ece947ef3225',
  pp.id,
  8,
  6,
  true,
  'paynow',
  coalesce(250::numeric, pp.amount_sgd),
  '2026-05-24',
  '2026-11-24',
  null,
  null
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 8
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '22764475-73f5-50ba-b26a-db30239ac95f',
  'db8e3ba6-ad4d-54f8-a8d2-6b27dc34e81b',
  null,
  pp.id,
  4,
  4,
  true,
  'paynow',
  coalesce(150::numeric, pp.amount_sgd),
  '2026-05-17',
  '2026-11-17',
  null,
  'pending them to return'
from package_products pp
where pp.product_type = 'freestyle'
  and pp.total_credits = 4
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  'd00b9ff2-7bcf-5231-a0f9-940309832108',
  'ba20e5a2-1434-565f-bdb1-f2794475af2f',
  null,
  pp.id,
  8,
  4,
  true,
  'paynow',
  coalesce(250::numeric, pp.amount_sgd),
  '2026-07-25',
  '2027-01-25',
  null,
  'Mabel texted'
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 8
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '5a1913de-7d3c-5626-89ac-6852fb0dd2f3',
  '7c821475-e585-5b83-ab67-d68fd7c3145a',
  'a6bd2c3f-7e51-54f0-bc27-956e450943cc',
  pp.id,
  12,
  4,
  true,
  'paynow',
  coalesce(840::numeric, pp.amount_sgd),
  '2026-05-17',
  '2026-11-17',
  null,
  null
from package_products pp
where pp.product_type = 'private'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '1dd44363-7377-5aa6-b0b1-48fc2ceb5e0c',
  'fde6d33f-94ab-54d8-b6b0-1470c8038b2f',
  null,
  pp.id,
  2,
  2,
  true,
  'paynow',
  coalesce(null::numeric, pp.amount_sgd),
  '2026-04-26',
  '2026-10-26',
  null,
  'Imported with unknown package type'
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  'b1554022-a062-514a-8e9a-28e135c80b7d',
  '14035a7b-ecbc-5b82-a7db-39161cfaf96d',
  '222c3844-856b-555d-9ad3-da0e509b3ae7',
  pp.id,
  12,
  7,
  true,
  'paynow',
  coalesce(400::numeric, pp.amount_sgd),
  '2026-03-14',
  '2026-09-14',
  null,
  null
from package_products pp
where pp.product_type = 'freestyle'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  'b3314b7d-7ce0-57e3-8afc-9ac972141c60',
  'b45a6902-80de-52b6-bb4e-49abe692430f',
  '585299b8-57e9-5521-9f01-340c642b59b0',
  pp.id,
  12,
  8,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-10-25',
  '2026-04-25',
  null,
  '6 lessons transfer to Esther'
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '21a936b8-f8a1-5aa7-af02-cff071a8864c',
  '4a809aca-6972-5f99-ab92-235c16d830f4',
  '585299b8-57e9-5521-9f01-340c642b59b0',
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(400::numeric, pp.amount_sgd),
  '2026-05-29',
  '2026-11-29',
  null,
  'Spreadsheet marked Paid (likely next pack)'
from package_products pp
where pp.product_type = 'freestyle'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  'c948b495-862c-59f9-bf4c-0449dfeae51b',
  '86001e6a-51d9-58e0-8d26-74ddc0d9552d',
  'e512f50a-de2d-5a4c-a637-7be77a06b417',
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-05-29',
  '2026-11-29',
  now(),
  null
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  'efac6285-42a7-5ea3-9b4b-363f9165438a',
  '65b42b9b-212c-5503-86ab-8eeb5991eed6',
  '762ac958-c503-5002-a816-85c0345f34ec',
  pp.id,
  8,
  4,
  true,
  'paynow',
  coalesce(250::numeric, pp.amount_sgd),
  '2026-07-26',
  '2027-01-26',
  null,
  null
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 8
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '192844ed-dc5e-5e22-a494-a1fbf15eb6bf',
  'e6db77d2-0e23-5740-b1c4-fe56c82c0ec1',
  'a2e3bab7-928e-54f3-9340-bd80423a3493',
  pp.id,
  12,
  2,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-08-15',
  '2027-02-15',
  null,
  null
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '88798f3a-1889-5ffc-86f7-cf16caed17ce',
  'e3f802c4-e5ed-55da-b17b-f1281e7e0993',
  null,
  pp.id,
  12,
  3,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-06-20',
  '2026-12-20',
  null,
  null
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  'a67e57ad-1742-5ac7-ba78-cf813d4fbcb7',
  '25b7c6e0-2e65-599e-8dd9-bbf2bd207fb1',
  '2f941841-340b-5626-b7e4-c7cd0d05e922',
  pp.id,
  12,
  7,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-05-03',
  '2026-11-03',
  null,
  null
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  'dca4b4de-e2fc-5e51-88de-1c60bfbcc138',
  'db9a6afa-72f8-5d1a-b8a2-fb024ccd08d9',
  'a1441007-be33-50f3-8a81-e09f03fcc550',
  pp.id,
  12,
  10,
  true,
  'paynow',
  coalesce(400::numeric, pp.amount_sgd),
  '2026-04-19',
  '2026-10-19',
  null,
  null
from package_products pp
where pp.product_type = 'freestyle'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  'ddfecd32-8c2f-5004-a099-04b75c23a53f',
  '0975fbb3-ae06-5637-adfd-69c1a7fe9cea',
  '8442d48e-c5c8-5c16-ba65-c195f33ed754',
  pp.id,
  24,
  12,
  true,
  'paynow',
  coalesce(650::numeric, pp.amount_sgd),
  '2025-08-30',
  '2026-02-28',
  null,
  '* Spec; Imported custom 650/24 pack'
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 24
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  'a4a99305-4bdc-5e07-a1ab-f6b0a431102a',
  '0975fbb3-ae06-5637-adfd-69c1a7fe9cea',
  '8442d48e-c5c8-5c16-ba65-c195f33ed754',
  pp.id,
  24,
  1,
  true,
  'paynow',
  coalesce(650::numeric, pp.amount_sgd),
  '2026-05-24',
  '2026-11-24',
  null,
  'Imported custom 650/24 pack'
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 24
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '5831822b-c11a-5415-90a5-ea6d8addb6bb',
  '7427993a-af18-53f7-9ef8-fff0a159c368',
  null,
  pp.id,
  12,
  2,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-05-31',
  '2026-11-30',
  null,
  null
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '23759170-836d-5ce8-8753-c5ac2f58d1a2',
  '7711eb7d-8750-5e61-8529-7808e90432f2',
  '36957c03-bfb9-53f8-9fef-2e5391e789e6',
  pp.id,
  12,
  5,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-05-18',
  '2025-11-18',
  null,
  null
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '798880ef-341b-54a4-8953-d19794dca145',
  '78b2c11a-6dc4-52c4-a2ec-5e082059b477',
  '35af9f6d-154a-5abc-ab63-63d236ca4239',
  pp.id,
  12,
  6,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-07-04',
  '2027-01-04',
  null,
  null
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '7660e901-637f-5827-88e7-6665c67d9d1d',
  '568655ae-161d-5af0-a901-974f19f5d0ac',
  null,
  pp.id,
  12,
  3,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-07-11',
  '2027-01-11',
  null,
  null
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '7a2f5245-709d-5f99-8d89-22629fd3e02c',
  '536283ea-0e83-5d63-beb9-c7254cdab496',
  null,
  pp.id,
  12,
  5,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-07-19',
  '2027-01-19',
  null,
  null
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  'd0280677-e623-56ea-a111-7c07b84ec6b4',
  '0ad14bca-0f65-5438-afc9-cb38c79867bc',
  'ad0a92bc-75d7-5e0b-ad25-3d8cf4a448a6',
  pp.id,
  4,
  1,
  true,
  'paynow',
  coalesce(150::numeric, pp.amount_sgd),
  '2026-07-26',
  '2027-01-26',
  null,
  null
from package_products pp
where pp.product_type = 'freestyle'
  and pp.total_credits = 4
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  'e3e73ab5-c750-5493-a7a7-ced489ef2179',
  '8d14a793-9c17-5a89-b197-8451ddf6cc3f',
  '65fbb730-0e3d-5c04-91dd-4fcf4f1108da',
  pp.id,
  24,
  12,
  true,
  'paynow',
  coalesce(650::numeric, pp.amount_sgd),
  '2025-04-12',
  '2025-10-12',
  null,
  '* Spec; Imported custom 650/24 pack'
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 24
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '2b25946d-ef5d-5390-9b90-9ab0676e5c5c',
  '8d14a793-9c17-5a89-b197-8451ddf6cc3f',
  '65fbb730-0e3d-5c04-91dd-4fcf4f1108da',
  pp.id,
  24,
  5,
  true,
  'paynow',
  coalesce(650::numeric, pp.amount_sgd),
  '2026-04-25',
  '2026-10-25',
  null,
  'Imported custom 650/24 pack'
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 24
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  'b844a721-882a-5737-bd01-2df3621fb3a3',
  'f4e90f45-6677-58a7-af01-0f93046d1b5f',
  '159f91e3-7a50-5749-a088-0848ccecfaaa',
  pp.id,
  12,
  11,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-08-01',
  '2027-02-01',
  null,
  null
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  'c1b1d91e-246f-5ae7-95fc-6adc4bb8bfb7',
  'e5661fb9-8fb3-5ab9-9c46-136950a1f140',
  '159f91e3-7a50-5749-a088-0848ccecfaaa',
  pp.id,
  12,
  8,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-03-21',
  '2026-09-21',
  null,
  null
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '80235ba3-b285-5352-9779-b973efab123c',
  'dec36253-6004-555b-bb94-777217372500',
  null,
  pp.id,
  12,
  5,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-07-19',
  '2027-01-19',
  null,
  null
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  'd9ee097f-1666-5328-878c-ca82a204ec3c',
  '9102cbfd-504c-51ed-8c9d-547448a57533',
  'cbd707cc-4cd6-500a-8f0f-6f0235f98f5e',
  pp.id,
  8,
  1,
  true,
  'paynow',
  coalesce(250::numeric, pp.amount_sgd),
  '2026-08-15',
  '2027-02-15',
  null,
  null
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 8
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '81500454-d8c0-5e00-853e-c8b9576a5e94',
  '42103bec-1470-545e-a1eb-29097175a97e',
  null,
  pp.id,
  12,
  11,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-07-18',
  '2027-01-18',
  null,
  null
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  'ebdb25c0-ec11-52a0-9e39-bbc955f092bb',
  'a9fedbd4-a543-5cf3-9909-2a875dbb228f',
  null,
  pp.id,
  12,
  11,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-04-05',
  '2026-10-05',
  null,
  null
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  'fd1eb8bd-e892-5f69-8748-80254ce7e602',
  '10dc5238-c6fb-5500-b95c-b76c884433bd',
  '80c1cec7-8d4d-56df-b6a8-148d841a16a8',
  pp.id,
  12,
  9,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-05-17',
  '2026-11-17',
  null,
  'FS package after this cycle'
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '98d083c0-17fc-5e90-9d64-37b5990715a6',
  'd86c6e02-39ff-53f2-925a-d3c03dc3db94',
  null,
  pp.id,
  8,
  8,
  true,
  'paynow',
  coalesce(290::numeric, pp.amount_sgd),
  '2026-03-22',
  '2026-09-22',
  now(),
  null
from package_products pp
where pp.product_type = 'freestyle'
  and pp.total_credits = 8
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  'bf308ae3-d327-54b3-b1ac-242396023b64',
  'a35c2e9e-1ac0-5792-8ce0-ec16d0525f4d',
  null,
  pp.id,
  12,
  1,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-08-16',
  '2027-02-16',
  null,
  null
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '15627527-3da2-5545-9b79-634d97e02e62',
  'daa84caa-4e80-5941-8140-ba646a4ffea5',
  '7c2dbb4d-69c7-5f90-be20-e74ed8d81a44',
  pp.id,
  12,
  10,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-05-10',
  '2026-11-10',
  null,
  null
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  'daa46693-95d0-57c6-b95d-4009d0be94b1',
  'b8bd41d5-52e7-53df-9d58-d55f06b8b48e',
  null,
  pp.id,
  8,
  5,
  true,
  'paynow',
  coalesce(250::numeric, pp.amount_sgd),
  '2026-07-12',
  '2027-01-12',
  null,
  null
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 8
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  'ebc90936-e75e-50a9-a493-f477daf84b74',
  '186f2972-5ba7-5845-8132-4bf21eba5e4f',
  null,
  pp.id,
  8,
  5,
  true,
  'paynow',
  coalesce(250::numeric, pp.amount_sgd),
  '2026-07-25',
  '2027-01-25',
  null,
  null
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 8
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '9cd13a64-95d3-5f62-b989-282efc9bf324',
  '9b8c0f05-fdb9-5e60-a6d0-ae6035b65f22',
  null,
  pp.id,
  12,
  11,
  true,
  'paynow',
  coalesce(400::numeric, pp.amount_sgd),
  '2026-05-16',
  '2026-11-16',
  null,
  null
from package_products pp
where pp.product_type = 'freestyle'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '0a743d54-2750-5c93-9fac-29f602ba3b5d',
  'e52cceb5-89c0-5b2a-a09e-1bb214e5f75d',
  '9e6243d3-b001-51c7-a397-b61b4227b821',
  pp.id,
  12,
  6,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-01-25',
  '2026-07-25',
  null,
  null
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  'd9a52d31-be4f-5dcd-a7b4-a92e471c0033',
  '0a332a52-cbbd-537c-999c-f361ca042779',
  null,
  pp.id,
  8,
  4,
  true,
  'paynow',
  coalesce(250::numeric, pp.amount_sgd),
  '2026-07-05',
  '2027-01-05',
  null,
  null
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 8
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  'd4402456-9663-5e3a-b5af-8cb2125e0116',
  '30b506df-dd6a-5046-82e3-65c40778e88b',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-04-04',
  '2026-10-04',
  now(),
  'FS package after this cycle'
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '8226c6e2-748c-519c-8b3e-65e9c4f8e65d',
  '7d979815-eb6a-50b7-81ad-9408a6cb97e1',
  'f0e1d9b7-5f68-5021-ba8c-1038cd670954',
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-07-11',
  '2027-01-11',
  now(),
  null
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  'b2fe87f3-bd17-54cb-b36b-00583e728e39',
  '467a37df-bcc3-5696-963e-343d3bd16da1',
  'f19bff6f-96ad-541f-b206-930e87fefd58',
  pp.id,
  8,
  1,
  true,
  'paynow',
  coalesce(250::numeric, pp.amount_sgd),
  '2026-08-16',
  '2027-02-16',
  null,
  null
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 8
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  'e2ecb5be-d356-57ac-a6c4-b17dda085953',
  '8a16bcbd-9ca8-5322-8de2-be5e68f07e26',
  'e72cd785-82cb-5e83-82b3-458f9c370e1a',
  pp.id,
  4,
  4,
  true,
  'paynow',
  coalesce(130::numeric, pp.amount_sgd),
  '2026-04-12',
  '2026-10-12',
  null,
  null
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 4
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '68110c68-55b0-58db-adcb-6641bdd543ec',
  '5c1474e6-00b6-5498-b124-3f8d5b12f90e',
  'f371a485-f80e-5627-84bb-3e89f0f77ecd',
  pp.id,
  12,
  3,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-08-02',
  '2027-02-02',
  null,
  null
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '0c06014c-d0ef-5d2f-beda-26804b1cf4e2',
  '0c96497c-a7f3-5942-8cc7-76265648b942',
  '119db4c3-2ff6-5535-8baf-d3ef4b449f7e',
  pp.id,
  8,
  7,
  true,
  'paynow',
  coalesce(250::numeric, pp.amount_sgd),
  '2026-03-01',
  '2026-09-01',
  null,
  null
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 8
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  'c89f0d65-5945-5db9-87e6-f70681b270ac',
  '6ff4cc36-6472-5056-a11f-9930a5f991e7',
  '116cc436-a495-5374-b29a-eebe23d6c64a',
  pp.id,
  12,
  11,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-02-15',
  '2026-08-15',
  null,
  'Spreadsheet marked Paid (likely next pack)'
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '2de8fb21-fb3a-5c7d-981a-3cec25972d42',
  '500f980c-0f06-5430-a8a8-811faffb4b87',
  '0343f041-611c-504d-b8fc-bcf4d8cf0e51',
  pp.id,
  4,
  4,
  true,
  'paynow',
  coalesce(130::numeric, pp.amount_sgd),
  '2026-08-02',
  '2027-02-02',
  null,
  '*Special; Session size was 1; credits set from attendance dates'
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 4
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '18643790-1636-50c5-a586-4948a42ff9db',
  '2d4fcf64-fa0e-54c1-b989-9d48ad78be56',
  null,
  pp.id,
  12,
  5,
  true,
  'paynow',
  coalesce(400::numeric, pp.amount_sgd),
  '2026-06-28',
  '2026-12-28',
  null,
  null
from package_products pp
where pp.product_type = 'freestyle'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  'dee169ae-d4d8-545f-89db-0f83c2ab86c5',
  '7f559067-1f18-5a31-8fb2-b66536fc028d',
  null,
  pp.id,
  8,
  3,
  true,
  'paynow',
  coalesce(250::numeric, pp.amount_sgd),
  '2026-01-18',
  '2026-07-18',
  null,
  null
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 8
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '3e07e4da-eda2-5e46-858f-f4ba0cafda28',
  'c8d94aa0-9573-5376-b9ec-dd53baa34f13',
  '0343f041-611c-504d-b8fc-bcf4d8cf0e51',
  pp.id,
  12,
  4,
  true,
  'paynow',
  coalesce(400::numeric, pp.amount_sgd),
  '2026-07-19',
  '2027-01-19',
  null,
  null
from package_products pp
where pp.product_type = 'freestyle'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  'fc157c13-6fa8-5b2c-8c45-6690e7c35ef8',
  '07e718de-73b2-5b91-ad3e-fd6f0824bf3b',
  '14d2439e-9d06-5b9d-a329-cd61fa17ccc3',
  pp.id,
  12,
  3,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-07-19',
  '2027-01-19',
  null,
  null
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  'adb22e1d-57cd-58cf-aac1-fd3f53a13553',
  '74601412-1ce3-57bc-bdc0-f5c98d76892a',
  null,
  pp.id,
  12,
  10,
  true,
  'paynow',
  coalesce(400::numeric, pp.amount_sgd),
  '2026-03-08',
  '2026-09-08',
  null,
  null
from package_products pp
where pp.product_type = 'freestyle'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  'da447e67-0f3a-5172-a1ae-87d6e49527c7',
  'edab7c99-2efd-59df-8a64-fc8e7fe3e2c3',
  '79ef79f8-4a2f-52bb-bf5d-82eb83209074',
  pp.id,
  8,
  1,
  true,
  'paynow',
  coalesce(250::numeric, pp.amount_sgd),
  '2026-08-16',
  '2027-02-16',
  now(),
  null
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 8
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '4e511fb9-a578-5bc1-a214-235836c43fe9',
  '2b693e72-ee54-5204-9a13-48a407627485',
  'b799c176-0e88-51c4-829f-be480d29d7ca',
  pp.id,
  4,
  4,
  true,
  'paynow',
  coalesce(130::numeric, pp.amount_sgd),
  '2026-07-05',
  '2027-01-05',
  null,
  'paid since 15 aug; Spreadsheet marked Paid (likely next pack)'
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 4
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '9feae523-abf4-53a4-b9be-03dd8860d16f',
  'f4eb1af3-5dfe-51d3-a6c5-bf36b1987c7b',
  'c3da9cbc-e87b-5730-ba4f-346eaa655a3f',
  pp.id,
  12,
  1,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-07-26',
  '2027-01-26',
  null,
  null
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  'de30613d-472e-574e-be17-aaea77e2fb6e',
  'ca01241f-d00f-5cd8-bb34-3ffcb4d69f75',
  'f9228589-b8b1-5c9d-9f2c-303585946cda',
  pp.id,
  12,
  3,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-08-09',
  '2027-02-09',
  null,
  null
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '6405ae05-7ee9-5dc8-a264-00e7caeea9e4',
  '841cef55-098c-59d2-9b25-240e27a8a468',
  '59d4555d-42fa-5ba4-a78a-1720b695f25a',
  pp.id,
  12,
  7,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-07-05',
  '2027-01-05',
  null,
  null
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  'ea0de137-bc09-5adb-9b87-79829c9b5ebb',
  '39315e6c-e81c-578e-bde7-17054f4567cc',
  '59d4555d-42fa-5ba4-a78a-1720b695f25a',
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(400::numeric, pp.amount_sgd),
  '2026-05-10',
  '2026-11-10',
  null,
  null
from package_products pp
where pp.product_type = 'freestyle'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '7441d85e-ad7a-52e0-9eea-56c1bcf2f87c',
  '6d1f7c08-bc25-55d1-b6bd-13b0e2b02153',
  'b2ca59d1-e370-57e7-af51-b129cc7983de',
  pp.id,
  12,
  8,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-07-04',
  '2027-01-04',
  null,
  null
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '90293cce-44ac-50b2-af8a-0fa73fe8036e',
  '5f4ed54d-6d9c-574d-8a3e-a0bc75ce8ad2',
  null,
  pp.id,
  12,
  8,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-11-25',
  '2026-05-25',
  null,
  null
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '3bfcfa72-5b7d-5d0c-8873-359d77555161',
  '4af63a5d-9480-5070-b7ea-67069c2196ed',
  'ec0a26b6-8328-5324-a0df-3639f5962a59',
  pp.id,
  12,
  5,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-07-07',
  '2027-01-07',
  null,
  null
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  'b9935052-46a9-5cf6-95e2-e8ec17dd01ae',
  '0743ba7a-fd8b-5299-a77d-ef9ce7c02ba1',
  '11eb69ab-3ccd-5107-a613-1a510b1ffe38',
  pp.id,
  12,
  11,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-02-10',
  '2026-08-10',
  null,
  null
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '2ffc40a9-22bd-5940-91be-824b0bdff34a',
  'f1d6314e-3be5-5019-b5fc-3fac450ede11',
  null,
  pp.id,
  12,
  10,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-07-21',
  '2027-01-21',
  null,
  'paid +12 on 11 Aug'
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '8afde22e-fa18-5076-bb1b-21be194a01ab',
  'b0635e01-0737-5db5-ba7e-affa57ab723c',
  null,
  pp.id,
  12,
  11,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-11-18',
  '2026-05-18',
  null,
  null
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  'd9ee3dac-f385-57ef-a394-38c36e65099a',
  '049748a2-6aa7-5de7-82ca-f6aa5b759350',
  '5d64336c-8ba6-5918-b528-e558954b3392',
  pp.id,
  12,
  7,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-04-25',
  '2026-10-25',
  null,
  null
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 12
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '96ca42eb-c168-5c7b-8929-10f2b3fbb12c',
  '40091cba-a4e0-5f2f-be60-77ad19b1c127',
  null,
  pp.id,
  4,
  2,
  true,
  'paynow',
  coalesce(130::numeric, pp.amount_sgd),
  '2026-06-20',
  '2026-12-20',
  null,
  null
from package_products pp
where pp.product_type = 'group'
  and pp.total_credits = 4
order by pp.sort_order
limit 1
on conflict (id) do update set
  used_credits = excluded.used_credits,
  total_credits = excluded.total_credits,
  first_lesson_date = excluded.first_lesson_date,
  expires_at = excluded.expires_at,
  informed_at = coalesce(packages.informed_at, excluded.informed_at),
  customisation_notes = excluded.customisation_notes,
  payer_id = coalesce(excluded.payer_id, packages.payer_id);

-- Shared package members
insert into package_students (package_id, student_id)
values ('a5379678-036d-548f-823e-e11ba725c34d', '8db53ed9-233e-5572-ae15-13773d015dab')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('8a0a9d0c-d4ab-5043-8684-563ba9d716ce', 'feb22150-e140-559d-8076-67f78ca92aa9')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('8a0a9d0c-d4ab-5043-8684-563ba9d716ce', 'cb35de48-9276-5b00-b92a-ce2a399b812c')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('6c495686-5d69-5040-b9d4-78deb2dda324', '0d46ace0-d99e-5fc5-b7b4-37f388495a58')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('d95efb2f-76d4-5969-9706-0920cba8dad0', 'c585c8cc-0cc2-57ed-8c4c-ed167c8d54a2')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('2c011797-2b1f-53a3-8fe9-2863d81b6f8b', '9f90ea5a-4386-52fe-8761-3439a9013d35')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('dff7b72d-6644-50e1-8649-46d5d8aeef18', '8a424d3f-0cce-5a87-a8a5-87aa1e69b8d3')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('55f1b41a-d815-5a36-a740-0f9db0e17956', '131a438f-183b-5a1a-a9ad-9f35c17f18c2')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('0e65893e-8bd1-5053-9337-f409f4e37b6c', '7e9425a0-4eb5-5341-ada0-e836747c3da5')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('bd485405-b933-530d-af4e-63bbec7120ca', '4b3eda94-137d-5807-a382-80a80b6149ae')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('99044102-01da-565e-bb87-007dba942612', '58935cd0-f087-560e-a5a8-b3c9b39ee4a9')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('4b7c9e41-b37e-5157-9882-22ac16c47a2c', '8fd7aced-0f86-503e-81fa-894e66149449')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('6ac52e9a-ccd7-5367-b160-b51fda3d2461', 'ce210fdd-8429-576e-93a4-0e6146ba52a9')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('00666b2f-b675-571b-827f-54312f930997', '5c9fd449-adbc-5238-af69-b7c7d7650bd1')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('57573d1c-4ae3-5251-a70f-e99730bd7b74', '14caf9c3-de66-5842-b116-62aa10cf7940')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('3a1265a8-394c-5135-b08b-cdc575de38e3', '6c48f544-b1a5-5b0d-86f9-998c0a82c295')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('3a1265a8-394c-5135-b08b-cdc575de38e3', '4267d084-6387-5abf-8a4d-8c71aa08e8d9')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('6a4632b6-c6a5-57de-9eb5-1fc8ed80f4de', '2e0ff969-73df-56cb-a49b-044e114718a2')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('b96c1450-e6fe-5a7a-bfb3-44aaf57247ff', '5476f870-9d85-5a9f-82d7-58ae1b88b045')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('9d705adb-ef01-51a6-8fae-efe9b0615843', '7b2dc609-9457-538f-a40d-e269a057aa8f')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('014db5d1-275f-5108-80d8-408c1609fa82', '47da8d91-84c7-5ca1-ae70-1148dd55b9d6')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('014db5d1-275f-5108-80d8-408c1609fa82', '8d1c0841-2d61-57ac-a370-323ce6d177a5')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('30aecf72-2ed7-5288-8d15-5bdd16849fb5', '645284d6-bdd8-52e4-bceb-11ba5b4fe271')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('7316d367-0f59-5ab2-92d4-75657b62ad53', 'c9f99835-6646-5528-a136-8acf16a4ad31')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('3840dba7-f527-5b82-967f-54b7c5c67520', 'c9f99835-6646-5528-a136-8acf16a4ad31')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('cd12928b-d09f-5ab1-923b-ae6bae0b6636', '07f24621-6939-5c24-b259-04e257029a1c')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('2882aa57-dac9-5836-b264-43dda44e1f30', 'dd1cb11e-9995-5ec8-bfd8-4eab90fa61e7')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('49e4922c-2f0d-5703-82a6-9e4f869e730b', 'ee27c92c-7ca0-5aab-971f-38a1f7fa19b4')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('49e4922c-2f0d-5703-82a6-9e4f869e730b', '961bf86d-1cad-5b91-8347-e016cd3bc87e')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('acef5640-e2ff-5fa9-9b6a-b1596454826d', '5e6938a3-b7d4-570a-95cd-c93130a0bc38')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('15d02467-b528-5237-959d-9087c07f0a48', '1d512a0d-7698-5acf-9115-b1ec98b8c617')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('77233ef8-b6a7-5a4e-aeb1-a7e95fe1489b', '1e714eb0-ddb2-53ee-b364-db1c01cba2f5')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('77233ef8-b6a7-5a4e-aeb1-a7e95fe1489b', '3bd56a70-acde-5a39-abd3-1a7cfbb4d69e')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('a3cafc29-0951-5fcc-b5cc-5f98157919e4', '939d554c-1b75-5eff-93e8-31651f136bf5')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('a3cafc29-0951-5fcc-b5cc-5f98157919e4', 'eac8bf3b-a04c-579d-9dc0-918375b0ce75')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('0f701b70-ee06-5693-8a92-470162868452', '838c28cf-3b3e-524e-bedb-0e5b22c3fb3a')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('5e27dbaa-6949-5fe2-a9e2-2e583188ff02', 'ec9e4da4-5e62-518c-bad6-3ea71d960f21')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('dc9b1be0-1ed8-58c7-b8ab-0f559612160c', '0fe03275-8cd2-5e44-a77a-973b102adb3f')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('500e8a5a-f681-532f-b49f-d0719e218a44', '7bf353e6-18ea-5526-8db7-bb3175f6db3f')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('8c8d6ab6-9ff6-5f23-990b-7376a99b31d0', 'c0115c92-c272-5386-afe8-32636846d9ae')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('8c8d6ab6-9ff6-5f23-990b-7376a99b31d0', 'c828b433-da87-5c94-909f-6080c6af2f30')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('91f737f9-03cd-59de-a94d-6cf529d5974d', '86c6c8d2-fded-55ee-ae84-722d5f2fe922')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('91f737f9-03cd-59de-a94d-6cf529d5974d', '0ce72b10-67b0-5cba-832b-e5104038bf11')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('92fa653b-aaed-5d5b-a6d3-6bc6fb85ba2e', '27865e02-b37f-5de6-ba0c-d4f08c2822e2')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('22764475-73f5-50ba-b26a-db30239ac95f', 'db8e3ba6-ad4d-54f8-a8d2-6b27dc34e81b')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('d00b9ff2-7bcf-5231-a0f9-940309832108', 'ba20e5a2-1434-565f-bdb1-f2794475af2f')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('5a1913de-7d3c-5626-89ac-6852fb0dd2f3', '7c821475-e585-5b83-ab67-d68fd7c3145a')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('1dd44363-7377-5aa6-b0b1-48fc2ceb5e0c', 'fde6d33f-94ab-54d8-b6b0-1470c8038b2f')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('b1554022-a062-514a-8e9a-28e135c80b7d', '14035a7b-ecbc-5b82-a7db-39161cfaf96d')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('b3314b7d-7ce0-57e3-8afc-9ac972141c60', 'b45a6902-80de-52b6-bb4e-49abe692430f')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('b3314b7d-7ce0-57e3-8afc-9ac972141c60', 'fad9fe2e-aef7-5156-a614-b3a1834c5b3b')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('21a936b8-f8a1-5aa7-af02-cff071a8864c', '4a809aca-6972-5f99-ab92-235c16d830f4')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('c948b495-862c-59f9-bf4c-0449dfeae51b', '86001e6a-51d9-58e0-8d26-74ddc0d9552d')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('efac6285-42a7-5ea3-9b4b-363f9165438a', '65b42b9b-212c-5503-86ab-8eeb5991eed6')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('192844ed-dc5e-5e22-a494-a1fbf15eb6bf', 'e6db77d2-0e23-5740-b1c4-fe56c82c0ec1')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('192844ed-dc5e-5e22-a494-a1fbf15eb6bf', '21c4d44b-dc09-5ba0-be87-21597d61a40d')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('88798f3a-1889-5ffc-86f7-cf16caed17ce', 'e3f802c4-e5ed-55da-b17b-f1281e7e0993')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('88798f3a-1889-5ffc-86f7-cf16caed17ce', '4d3abb18-541b-54b1-8627-8a999338c6de')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('a67e57ad-1742-5ac7-ba78-cf813d4fbcb7', '25b7c6e0-2e65-599e-8dd9-bbf2bd207fb1')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('a67e57ad-1742-5ac7-ba78-cf813d4fbcb7', '611e6bd6-2c73-567c-a8c6-bcdc96b26ed8')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('a67e57ad-1742-5ac7-ba78-cf813d4fbcb7', '85e66b8f-4513-557a-a4e8-58acd88edd18')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('dca4b4de-e2fc-5e51-88de-1c60bfbcc138', 'db9a6afa-72f8-5d1a-b8a2-fb024ccd08d9')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('ddfecd32-8c2f-5004-a099-04b75c23a53f', '0975fbb3-ae06-5637-adfd-69c1a7fe9cea')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('a4a99305-4bdc-5e07-a1ab-f6b0a431102a', '0975fbb3-ae06-5637-adfd-69c1a7fe9cea')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('5831822b-c11a-5415-90a5-ea6d8addb6bb', '7427993a-af18-53f7-9ef8-fff0a159c368')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('5831822b-c11a-5415-90a5-ea6d8addb6bb', '83ce8bbc-ebe7-5f4f-9954-da3a34d2dd25')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('23759170-836d-5ce8-8753-c5ac2f58d1a2', '7711eb7d-8750-5e61-8529-7808e90432f2')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('798880ef-341b-54a4-8953-d19794dca145', '78b2c11a-6dc4-52c4-a2ec-5e082059b477')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('7660e901-637f-5827-88e7-6665c67d9d1d', '568655ae-161d-5af0-a901-974f19f5d0ac')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('7a2f5245-709d-5f99-8d89-22629fd3e02c', '536283ea-0e83-5d63-beb9-c7254cdab496')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('d0280677-e623-56ea-a111-7c07b84ec6b4', '0ad14bca-0f65-5438-afc9-cb38c79867bc')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('e3e73ab5-c750-5493-a7a7-ced489ef2179', '8d14a793-9c17-5a89-b197-8451ddf6cc3f')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('2b25946d-ef5d-5390-9b90-9ab0676e5c5c', '8d14a793-9c17-5a89-b197-8451ddf6cc3f')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('b844a721-882a-5737-bd01-2df3621fb3a3', 'f4e90f45-6677-58a7-af01-0f93046d1b5f')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('c1b1d91e-246f-5ae7-95fc-6adc4bb8bfb7', 'e5661fb9-8fb3-5ab9-9c46-136950a1f140')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('80235ba3-b285-5352-9779-b973efab123c', 'dec36253-6004-555b-bb94-777217372500')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('80235ba3-b285-5352-9779-b973efab123c', '2bbe1caf-50a3-5ce6-b890-60e74834d90a')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('d9ee097f-1666-5328-878c-ca82a204ec3c', '9102cbfd-504c-51ed-8c9d-547448a57533')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('81500454-d8c0-5e00-853e-c8b9576a5e94', '42103bec-1470-545e-a1eb-29097175a97e')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('ebdb25c0-ec11-52a0-9e39-bbc955f092bb', 'a9fedbd4-a543-5cf3-9909-2a875dbb228f')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('fd1eb8bd-e892-5f69-8748-80254ce7e602', '10dc5238-c6fb-5500-b95c-b76c884433bd')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('98d083c0-17fc-5e90-9d64-37b5990715a6', 'd86c6e02-39ff-53f2-925a-d3c03dc3db94')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('bf308ae3-d327-54b3-b1ac-242396023b64', 'a35c2e9e-1ac0-5792-8ce0-ec16d0525f4d')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('15627527-3da2-5545-9b79-634d97e02e62', 'daa84caa-4e80-5941-8140-ba646a4ffea5')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('15627527-3da2-5545-9b79-634d97e02e62', 'a56ddd65-cc2d-562e-a520-2b60cc554dc1')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('daa46693-95d0-57c6-b95d-4009d0be94b1', 'b8bd41d5-52e7-53df-9d58-d55f06b8b48e')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('ebc90936-e75e-50a9-a493-f477daf84b74', '186f2972-5ba7-5845-8132-4bf21eba5e4f')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('9cd13a64-95d3-5f62-b989-282efc9bf324', '9b8c0f05-fdb9-5e60-a6d0-ae6035b65f22')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('0a743d54-2750-5c93-9fac-29f602ba3b5d', 'e52cceb5-89c0-5b2a-a09e-1bb214e5f75d')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('d9a52d31-be4f-5dcd-a7b4-a92e471c0033', '0a332a52-cbbd-537c-999c-f361ca042779')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('d4402456-9663-5e3a-b5af-8cb2125e0116', '30b506df-dd6a-5046-82e3-65c40778e88b')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('8226c6e2-748c-519c-8b3e-65e9c4f8e65d', '7d979815-eb6a-50b7-81ad-9408a6cb97e1')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('8226c6e2-748c-519c-8b3e-65e9c4f8e65d', '261cafd2-5a72-5678-a551-55c897f78988')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('b2fe87f3-bd17-54cb-b36b-00583e728e39', '467a37df-bcc3-5696-963e-343d3bd16da1')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('e2ecb5be-d356-57ac-a6c4-b17dda085953', '8a16bcbd-9ca8-5322-8de2-be5e68f07e26')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('68110c68-55b0-58db-adcb-6641bdd543ec', '5c1474e6-00b6-5498-b124-3f8d5b12f90e')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('0c06014c-d0ef-5d2f-beda-26804b1cf4e2', '0c96497c-a7f3-5942-8cc7-76265648b942')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('0c06014c-d0ef-5d2f-beda-26804b1cf4e2', '07d610f2-6ecb-59a9-bcdd-703b91fb4b52')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('c89f0d65-5945-5db9-87e6-f70681b270ac', '6ff4cc36-6472-5056-a11f-9930a5f991e7')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('2de8fb21-fb3a-5c7d-981a-3cec25972d42', '500f980c-0f06-5430-a8a8-811faffb4b87')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('18643790-1636-50c5-a586-4948a42ff9db', '2d4fcf64-fa0e-54c1-b989-9d48ad78be56')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('dee169ae-d4d8-545f-89db-0f83c2ab86c5', '7f559067-1f18-5a31-8fb2-b66536fc028d')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('3e07e4da-eda2-5e46-858f-f4ba0cafda28', 'c8d94aa0-9573-5376-b9ec-dd53baa34f13')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('fc157c13-6fa8-5b2c-8c45-6690e7c35ef8', '07e718de-73b2-5b91-ad3e-fd6f0824bf3b')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('adb22e1d-57cd-58cf-aac1-fd3f53a13553', '74601412-1ce3-57bc-bdc0-f5c98d76892a')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('da447e67-0f3a-5172-a1ae-87d6e49527c7', 'edab7c99-2efd-59df-8a64-fc8e7fe3e2c3')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('4e511fb9-a578-5bc1-a214-235836c43fe9', '2b693e72-ee54-5204-9a13-48a407627485')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('9feae523-abf4-53a4-b9be-03dd8860d16f', 'f4eb1af3-5dfe-51d3-a6c5-bf36b1987c7b')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('de30613d-472e-574e-be17-aaea77e2fb6e', 'ca01241f-d00f-5cd8-bb34-3ffcb4d69f75')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('de30613d-472e-574e-be17-aaea77e2fb6e', '714993dc-52d5-52f7-bdd0-e511292a1d2e')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('6405ae05-7ee9-5dc8-a264-00e7caeea9e4', '841cef55-098c-59d2-9b25-240e27a8a468')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('ea0de137-bc09-5adb-9b87-79829c9b5ebb', '39315e6c-e81c-578e-bde7-17054f4567cc')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('7441d85e-ad7a-52e0-9eea-56c1bcf2f87c', '6d1f7c08-bc25-55d1-b6bd-13b0e2b02153')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('7441d85e-ad7a-52e0-9eea-56c1bcf2f87c', 'f63c1adf-2627-55e9-b93c-e95534e135ac')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('90293cce-44ac-50b2-af8a-0fa73fe8036e', '5f4ed54d-6d9c-574d-8a3e-a0bc75ce8ad2')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('3bfcfa72-5b7d-5d0c-8873-359d77555161', '4af63a5d-9480-5070-b7ea-67069c2196ed')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('b9935052-46a9-5cf6-95e2-e8ec17dd01ae', '0743ba7a-fd8b-5299-a77d-ef9ce7c02ba1')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('2ffc40a9-22bd-5940-91be-824b0bdff34a', 'f1d6314e-3be5-5019-b5fc-3fac450ede11')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('2ffc40a9-22bd-5940-91be-824b0bdff34a', '5197879b-9eb7-5c61-b251-63205c74c49e')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('8afde22e-fa18-5076-bb1b-21be194a01ab', 'b0635e01-0737-5db5-ba7e-affa57ab723c')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('d9ee3dac-f385-57ef-a394-38c36e65099a', '049748a2-6aa7-5de7-82ca-f6aa5b759350')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('96ca42eb-c168-5c7b-8929-10f2b3fbb12c', '40091cba-a4e0-5f2f-be60-77ad19b1c127')
on conflict do nothing;

commit;
