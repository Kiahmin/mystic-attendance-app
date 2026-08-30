-- Completed-sheet packs only. Idempotent. Safe to run after the current-roster seed.
begin;

-- Students referenced by completed packs
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('841cef55-098c-59d2-9b25-240e27a8a468', 'Zayden', null, false, null, '59d4555d-42fa-5ba4-a78a-1720b695f25a')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('8fd7aced-0f86-503e-81fa-894e66149449', 'Ayana', null, false, 'To update them when recover', 'd3196d18-00d6-5931-bef8-96bbb54f9597')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('f63c1adf-2627-55e9-b93c-e95534e135ac', 'Angela', null, false, null, 'b2ca59d1-e370-57e7-af51-b129cc7983de')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('10dc5238-c6fb-5500-b95c-b76c884433bd', 'Sarah Han', null, false, 'FS package after this cycle', '80c1cec7-8d4d-56df-b6a8-148d841a16a8')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('a291d52f-ff12-5f2d-9def-344d153a5b3b', 'Jing Han', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('a35c2e9e-1ac0-5792-8ce0-ec16d0525f4d', 'Shi Rui', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('9f786380-be24-5f9e-bbec-c1859b19f45e', 'Jonathan', 'freestyle', false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('8a16bcbd-9ca8-5322-8de2-be5e68f07e26', 'Angelina', null, false, null, 'e72cd785-82cb-5e83-82b3-458f9c370e1a')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('0c96497c-a7f3-5942-8cc7-76265648b942', 'Ellie', null, false, null, '119db4c3-2ff6-5535-8baf-d3ef4b449f7e')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('4a809aca-6972-5f99-ab92-235c16d830f4', 'Jacqueline Koh', 'freestyle', false, null, '585299b8-57e9-5521-9f01-340c642b59b0')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('f8fb1ead-aa73-5647-ad90-7e81f4c228d3', 'Claudia', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('deeb6e79-a24d-5ac7-abcc-811731366f98', 'Qing Yi', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('db9a6afa-72f8-5d1a-b8a2-fb024ccd08d9', 'Leo', 'freestyle', false, null, 'a1441007-be33-50f3-8a81-e09f03fcc550')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('39315e6c-e81c-578e-bde7-17054f4567cc', 'Zephan', 'freestyle', false, null, '59d4555d-42fa-5ba4-a78a-1720b695f25a')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('131a438f-183b-5a1a-a9ad-9f35c17f18c2', 'Allynn', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('dec36253-6004-555b-bb94-777217372500', 'Remy', null, false, '', null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('9102cbfd-504c-51ed-8c9d-547448a57533', 'Renee Ong', null, false, null, 'cbd707cc-4cd6-500a-8f0f-6f0235f98f5e')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('08a5ac3c-8d19-532c-94e6-5cb9211709a2', 'Jing Zhe', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('78260d36-67c5-5a23-ba34-396aa6b241e3', 'Mom', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('2e0ff969-73df-56cb-a49b-044e114718a2', 'Chloe Ang', null, false, 'FS package after this cycle', '19c56bd3-a68d-5fd4-8127-668540959011')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('3043fe89-3060-586b-ac97-d3f59a53fa35', 'Esther (Jac Mum)', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('413d52e1-0d25-5c3f-8f75-9d0ddef9ded8', 'Mia', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('65b42b9b-212c-5503-86ab-8eeb5991eed6', 'Jing Yang', null, false, null, '762ac958-c503-5002-a816-85c0345f34ec')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('c0f7adf1-a130-56d6-8db3-b447dc30a243', 'Xander Ng', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('4267d084-6387-5abf-8a4d-8c71aa08e8d9', 'Shawn', null, false, null, 'c897a8ff-e717-5789-978d-c102fc2968c8')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('f758fbae-f7c5-52cb-a5e4-e10385db5869', 'Jaden', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('cb35de48-9276-5b00-b92a-ce2a399b812c', 'Desiree', null, false, null, 'b65789ad-2f5b-5e90-9d8c-290260e8a937')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('0ce72b10-67b0-5cba-832b-e5104038bf11', 'Wayne', 'freestyle', false, null, 'aa2d4d9d-d5ce-5edc-97dd-b8d82992023b')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('d21c2c5b-db38-5336-8c9b-2ffc60883d51', 'Ling Yi', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('5c9fd449-adbc-5238-af69-b7c7d7650bd1', 'Beunice', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('c09ad1ac-dfb1-5652-b5b3-ff3265b381d5', 'Raeanne', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('8971285b-6f3c-5a94-8fba-4c2d43e9997d', 'Ava (Fran)', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('467a37df-bcc3-5696-963e-343d3bd16da1', 'Zhi Ran', null, false, null, 'f19bff6f-96ad-541f-b206-930e87fefd58')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('07d610f2-6ecb-59a9-bcdd-703b91fb4b52', 'Kylie', null, false, null, '119db4c3-2ff6-5535-8baf-d3ef4b449f7e')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('6786963f-b646-59bd-b35b-631ce2cc92f0', 'Mikkel', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('8a424d3f-0cce-5a87-a8a5-87aa1e69b8d3', 'Alicia', null, false, 'FS package after this cycle', '62c822f5-f334-5525-b4f1-20c240b883cc')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('049748a2-6aa7-5de7-82ca-f6aa5b759350', 'Ekke', null, false, null, '5d64336c-8ba6-5918-b528-e558954b3392')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('f4e90f45-6677-58a7-af01-0f93046d1b5f', 'Qian Le', null, false, null, '159f91e3-7a50-5749-a088-0848ccecfaaa')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('ce96f634-cf9d-5bd6-9089-aa0a88dfa4a8', 'Thad', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('99d6a672-7e8e-5b0a-8ff2-82f4b8388f57', 'Ariana', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('f8fd1e4e-de4b-5dfa-9078-aa0e112afcf4', 'Aleesha', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('8d62ac5c-5c2f-57df-902d-af583adacca2', 'Isaac (Fran)', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('0743ba7a-fd8b-5299-a77d-ef9ce7c02ba1', 'Wren Ji', null, false, null, '11eb69ab-3ccd-5107-a613-1a510b1ffe38')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('2d4fcf64-fa0e-54c1-b989-9d48ad78be56', 'Le Han', 'freestyle', false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('6cb65c9a-ad30-512c-966a-38e357ac7263', 'Avery Shuen Shuen', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('d86c6e02-39ff-53f2-925a-d3c03dc3db94', 'Shen Tong', 'freestyle', false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('07f24621-6939-5c24-b259-04e257029a1c', 'Dan Dan', 'freestyle', false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('398211ff-7d00-58ab-a7f4-b41b1e8ce24c', 'Cheryl', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('8d1c0841-2d61-57ac-a370-323ce6d177a5', 'Ensley', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('714993dc-52d5-52f7-bdd0-e511292a1d2e', 'Mao Lin', null, false, null, 'f9228589-b8b1-5c9d-9f2c-303585946cda')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('8db53ed9-233e-5572-ae15-13773d015dab', 'Agnes', 'freestyle', false, null, 'c2722c4b-da02-5ea8-ae32-e9c0e9182df1')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('6ff4cc36-6472-5056-a11f-9930a5f991e7', 'Jayden', null, false, null, '116cc436-a495-5374-b29a-eebe23d6c64a')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('dd1cb11e-9995-5ec8-bfd8-4eab90fa61e7', 'Darius', 'freestyle', false, 'renew', '2935b707-26eb-55ff-93db-95f3ccf6f97b')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('7d979815-eb6a-50b7-81ad-9408a6cb97e1', 'Zhi Han', null, false, null, 'f0e1d9b7-5f68-5021-ba8c-1038cd670954')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('7b0081c9-f798-5a4c-a619-3ba10f402f90', 'Isha', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('ca01241f-d00f-5cd8-bb34-3ffcb4d69f75', 'Yi Lin', null, false, null, 'f9228589-b8b1-5c9d-9f2c-303585946cda')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('2b693e72-ee54-5204-9a13-48a407627485', 'Ryan', null, false, null, 'b799c176-0e88-51c4-829f-be480d29d7ca')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('a4533af5-ff21-5857-bd7d-3cf4a72c67e9', 'Seo Hyeon', 'freestyle', false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('a1249f47-6d61-5d37-b5d4-eb790ab43421', 'Gigi', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('25b7c6e0-2e65-599e-8dd9-bbf2bd207fb1', 'Koi Chi', null, false, null, '2f941841-340b-5626-b7e4-c7cd0d05e922')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('4af63a5d-9480-5070-b7ea-67069c2196ed', 'Ming Xuan', null, false, null, 'ec0a26b6-8328-5324-a0df-3639f5962a59')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('645284d6-bdd8-52e4-bceb-11ba5b4fe271', 'Cici', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('74e92e78-6b40-512b-93e9-14db99ccb24e', 'Ms Wu', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('cc1507a7-b4ca-5af4-9d74-988ed04ae216', 'Grace', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('bebee322-ab28-55ee-9ca5-2a2775788d17', 'Ruby', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('9b8c0f05-fdb9-5e60-a6d0-ae6035b65f22', 'Xavier', 'freestyle', false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('c0115c92-c272-5386-afe8-32636846d9ae', 'Hana', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('ba20e5a2-1434-565f-bdb1-f2794475af2f', 'Hugo', null, false, 'Mabel texted', null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('f8d7ab1e-bd2b-5d12-acb7-b5d802ac7edc', 'Julius', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('5197879b-9eb7-5c61-b251-63205c74c49e', 'Tian Yu', null, false, 'paid +12 on 11 Aug', null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('58935cd0-f087-560e-a5a8-b3c9b39ee4a9', 'Arjaav', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('34764c05-7573-5b6b-81cb-f0b02cbfd575', 'Blithe', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('5c1474e6-00b6-5498-b124-3f8d5b12f90e', 'Britney', null, false, null, 'f371a485-f80e-5627-84bb-3e89f0f77ecd')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('838c28cf-3b3e-524e-bedb-0e5b22c3fb3a', 'Fang Jie', null, false, null, '08ee858b-0efa-550d-9448-2adc1e1e75e8')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('85e66b8f-4513-557a-a4e8-58acd88edd18', 'Eileen', null, false, null, '2f941841-340b-5626-b7e4-c7cd0d05e922')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('6c622d2f-528a-5b8a-b088-eef78d8801c3', 'Seana', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('a5a4c55d-91ce-5710-87e6-aa1b92ef7c85', 'Shervelle', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('21c4d44b-dc09-5ba0-be87-21597d61a40d', 'Jun Kai', null, false, null, 'a2e3bab7-928e-54f3-9340-bd80423a3493')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('b8bd41d5-52e7-53df-9d58-d55f06b8b48e', 'Tiffanie', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('14035a7b-ecbc-5b82-a7db-39161cfaf96d', 'Isaac', 'freestyle', false, null, '222c3844-856b-555d-9ad3-da0e509b3ae7')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('c6523aa7-388b-5e84-abfb-008023c9a526', 'Esmond', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('30b506df-dd6a-5046-82e3-65c40778e88b', 'Yu Yuan', null, false, 'FS package after this cycle', null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('961bf86d-1cad-5b91-8347-e016cd3bc87e', 'Olivia', null, false, null, '0f0b4976-63db-5f81-bf29-d30b1e2f4a66')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('42103bec-1470-545e-a1eb-29097175a97e', 'Rui Yang (Teh Swee Young)', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('396f444c-578e-5291-b907-205c355b5d76', 'Tyrell', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('ce210fdd-8429-576e-93a4-0e6146ba52a9', 'Bernice', null, false, 'FS package after this cycle', '92bea8d0-53b5-52d5-8514-7fe18040bcaa')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('47da8d91-84c7-5ca1-ae70-1148dd55b9d6', 'Ciara', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('3bd56a70-acde-5a39-abd3-1a7cfbb4d69e', 'Evan', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('eac8bf3b-a04c-579d-9dc0-918375b0ce75', 'Eva Mum', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('f1d6314e-3be5-5019-b5fc-3fac450ede11', 'Kah Yu', null, false, 'paid +12 on 11 Aug', null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('b40d3da8-7828-59ab-86b7-78dee782361c', 'Austin', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('4543bbf1-7505-56c3-8016-070fb0754061', 'Gao Min', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('feb22150-e140-559d-8076-67f78ca92aa9', 'Aiden', null, false, null, 'b65789ad-2f5b-5e90-9d8c-290260e8a937')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('9f267c85-c404-59ec-aacc-dfa2d35fd752', 'Kyler', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('500f980c-0f06-5430-a8a8-811faffb4b87', 'Kayenn', null, false, '*Special', '0343f041-611c-504d-b8fc-bcf4d8cf0e51')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('4d3abb18-541b-54b1-8627-8a999338c6de', 'Shae', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('c2403d53-0e18-58fb-a1f5-1e1ebe90e3d7', 'Fynn', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('ba3683c0-7a78-55df-b40e-c602a061f8cb', 'Ming Ting', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('edab7c99-2efd-59df-8a64-fc8e7fe3e2c3', 'Raeden', null, false, null, '79ef79f8-4a2f-52bb-bf5d-82eb83209074')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('07e718de-73b2-5b91-ad3e-fd6f0824bf3b', 'Mark', null, false, null, '14d2439e-9d06-5b9d-a329-cd61fa17ccc3')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('27865e02-b37f-5de6-ba0c-d4f08c2822e2', 'Hannah', null, false, null, '3afe08cf-a330-5198-8fc4-ece947ef3225')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('6c48f544-b1a5-5b0d-86f9-998c0a82c295', 'Caleb', null, false, null, 'c897a8ff-e717-5789-978d-c102fc2968c8')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('e908349b-175b-5450-9704-a8ae6af848cc', 'Xiu Qi', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('e7017111-2be6-5776-a936-ab311d40efae', 'Wu You', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('939d554c-1b75-5eff-93e8-31651f136bf5', 'Eva', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('9f90ea5a-4386-52fe-8761-3439a9013d35', 'Alexis', 'freestyle', false, 'Paid since 17 apr for 8 lesson', 'ec37b2fa-2e53-5e1a-8d91-28df955a246c')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('14caf9c3-de66-5842-b116-62aa10cf7940', 'Caitlyn', null, false, 'FS package after this cycle', 'edbfbb98-70b2-5542-b700-8bb5fecf3af8')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('7c821475-e585-5b83-ab67-d68fd7c3145a', 'Ian', null, false, null, 'a6bd2c3f-7e51-54f0-bc27-956e450943cc')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('db8e3ba6-ad4d-54f8-a8d2-6b27dc34e81b', 'Harry', 'freestyle', false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('261cafd2-5a72-5678-a551-55c897f78988', 'Rui Yi', null, false, null, 'f0e1d9b7-5f68-5021-ba8c-1038cd670954')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('536283ea-0e83-5d63-beb9-c7254cdab496', 'Ning Han', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('d4f5ae9c-6f04-5c21-b78c-5cfa3f5f5222', 'Jade', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('0906176d-858a-5b51-b1c3-f7339bb3c433', 'Phoebe', 'freestyle', false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('0be0d355-17a7-5fbb-a294-dc249bd30d89', 'Enzo Ong', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('86c6c8d2-fded-55ee-ae84-722d5f2fe922', 'Hank', 'freestyle', false, null, 'aa2d4d9d-d5ce-5edc-97dd-b8d82992023b')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('ddb652aa-9813-5814-af9a-a46bf6125221', 'Yue Qing', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('f4eb1af3-5dfe-51d3-a6c5-bf36b1987c7b', 'Shi Han', null, false, null, 'c3da9cbc-e87b-5730-ba4f-346eaa655a3f')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('6d1f7c08-bc25-55d1-b6bd-13b0e2b02153', 'Alisa', null, false, null, 'b2ca59d1-e370-57e7-af51-b129cc7983de')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('d221b67d-ad56-5acc-9130-908d54015ee8', 'Loren', 'freestyle', false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('b1a6b41b-a55f-5f64-b47f-cd0a22391d8a', 'Raeniece', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('d11805d2-0174-55d8-8571-a05de059310b', 'Lil Caleb', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('78b2c11a-6dc4-52c4-a2ec-5e082059b477', 'Nicole', null, false, null, '35af9f6d-154a-5abc-ab63-63d236ca4239')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('ee27c92c-7ca0-5aab-971f-38a1f7fa19b4', 'Emily', null, false, null, '0f0b4976-63db-5f81-bf29-d30b1e2f4a66')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('9d2fc771-4f9a-5177-be64-c0d3892e01ea', 'Enzo', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('e3f802c4-e5ed-55da-b17b-f1281e7e0993', 'Kaia', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('f3e1a2f5-2811-5a4e-92b0-d0af4e6a6d04', 'Claire', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('86001e6a-51d9-58e0-8d26-74ddc0d9552d', 'Jaren Lin', null, false, null, 'e512f50a-de2d-5a4c-a637-7be77a06b417')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('1e714eb0-ddb2-53ee-b364-db1c01cba2f5', 'Ethan', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('611e6bd6-2c73-567c-a8c6-bcdc96b26ed8', 'Joi Lee', null, false, null, '2f941841-340b-5626-b7e4-c7cd0d05e922')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('c585c8cc-0cc2-57ed-8c4c-ed167c8d54a2', 'Alan', null, false, 'Renew 12 on 1 august', '20d56d0f-88bb-5087-a5bd-333d5f8af78d')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('e6db77d2-0e23-5740-b1c4-fe56c82c0ec1', 'Jun Rui (Rui Rui)', null, false, null, 'a2e3bab7-928e-54f3-9340-bd80423a3493')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('bc6a2063-aa26-535c-873d-843aeef21ae3', 'Tavia', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('bcb04641-9f76-5def-a479-3e5022014e05', 'Jenna', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('c8d94aa0-9573-5376-b9ec-dd53baa34f13', 'Leighton', 'freestyle', false, null, '0343f041-611c-504d-b8fc-bcf4d8cf0e51')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('2bbe1caf-50a3-5ce6-b890-60e74834d90a', 'Rucas', null, false, '', null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('c828b433-da87-5c94-909f-6080c6af2f30', 'Kazumi', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('42b6f9a7-3f23-5dd0-831b-cf3640784ca7', 'Matthias', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('7bf353e6-18ea-5526-8db7-bb3175f6db3f', 'Geo', 'freestyle', false, null, 'be74c50f-f927-56cb-b798-869db31f2e9e')
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('13e7bb73-667b-5503-a0e1-d919462be3d7', '1195', 'freestyle', false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('74601412-1ce3-57bc-bdc0-f5c98d76892a', 'Min Li', 'freestyle', false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('0d46ace0-d99e-5fc5-b7b4-37f388495a58', 'Akxel', null, false, 'Renew 12 on 31/3, FS pacakge aft cycle', null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);
insert into students (id, full_name, skill_level, is_trial, notes, payer_id)
values ('40091cba-a4e0-5f2f-be60-77ad19b1c127', 'Yaashvanth', null, false, null, null)
on conflict (id) do update set full_name = excluded.full_name, skill_level = coalesce(students.skill_level, excluded.skill_level), payer_id = coalesce(students.payer_id, excluded.payer_id);

-- Completed packages
-- Classes

-- Payers

-- Students

-- Enrolments

-- Packages
insert into packages (
  id, student_id, payer_id, package_product_id, total_credits, used_credits,
  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,
  informed_at, customisation_notes
)
select
  '6b64cf7c-17b1-5603-9fb3-1a2aa9ef3085',
  '07f24621-6939-5c24-b259-04e257029a1c',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(400::numeric, pp.amount_sgd),
  '2025-10-18',
  '2026-04-18',
  null,
  'Imported from Completed sheet'
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
  '3a267b99-9755-50e6-86ab-024c4422ed02',
  '86c6c8d2-fded-55ee-ae84-722d5f2fe922',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(400::numeric, pp.amount_sgd),
  '2025-10-04',
  '2026-04-04',
  null,
  'Imported from Completed sheet'
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
  'd3c3eda2-7db3-519c-94cf-af089f6a203e',
  '4a809aca-6972-5f99-ab92-235c16d830f4',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(400::numeric, pp.amount_sgd),
  '2025-10-11',
  '2026-04-11',
  null,
  'Imported from Completed sheet'
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
  'a0a3d436-2fe7-58f5-b1ed-1247601dfcda',
  '9102cbfd-504c-51ed-8c9d-547448a57533',
  null,
  pp.id,
  8,
  8,
  true,
  'paynow',
  coalesce(250::numeric, pp.amount_sgd),
  '2025-09-27',
  '2026-03-27',
  null,
  'Imported from Completed sheet'
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
  'aec6fdf1-7d42-5a43-a5f2-cffe09d1b59b',
  'ca01241f-d00f-5cd8-bb34-3ffcb4d69f75',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-08-17',
  '2026-02-17',
  null,
  'Imported from Completed sheet'
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
  '188eed1c-d2e3-592a-a10c-2a11a0a6ebea',
  'b40d3da8-7828-59ab-86b7-78dee782361c',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-05-31',
  '2025-11-30',
  null,
  'Imported from Completed sheet'
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
  'e4e4ce1b-b1da-552b-aa95-74acd9cb780f',
  '536283ea-0e83-5d63-beb9-c7254cdab496',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-07-20',
  '2026-01-20',
  null,
  'Imported from Completed sheet'
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
  'abf9292c-a4dc-549f-9b72-5199e4922e5d',
  '9f786380-be24-5f9e-bbec-c1859b19f45e',
  null,
  pp.id,
  10,
  10,
  true,
  'paynow',
  coalesce(400::numeric, pp.amount_sgd),
  '2025-10-26',
  '2026-04-26',
  null,
  'Imported from Completed sheet'
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
  '0062f0d0-d662-56ea-8489-8405e72df7e4',
  '9102cbfd-504c-51ed-8c9d-547448a57533',
  null,
  pp.id,
  8,
  8,
  true,
  'paynow',
  coalesce(250::numeric, pp.amount_sgd),
  '2025-09-27',
  '2026-03-27',
  null,
  'Imported from Completed sheet'
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
  'fe906212-b389-546d-ad76-50c19de44231',
  'dec36253-6004-555b-bb94-777217372500',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-09-14',
  '2026-03-14',
  null,
  'Imported from Completed sheet'
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
  '8e1ffe54-efaa-5020-a5f5-d8e5d66d7871',
  'ca01241f-d00f-5cd8-bb34-3ffcb4d69f75',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-08-17',
  '2026-02-17',
  null,
  'Imported from Completed sheet'
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
  '8d5a6571-9b54-5e27-a654-20abea29c2c0',
  '39315e6c-e81c-578e-bde7-17054f4567cc',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(400::numeric, pp.amount_sgd),
  '2025-08-24',
  '2026-02-24',
  null,
  'Imported from Completed sheet'
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
  '68bc25f9-e714-5920-8d82-29ea960be121',
  'ba3683c0-7a78-55df-b40e-c602a061f8cb',
  null,
  pp.id,
  4,
  4,
  true,
  'paynow',
  coalesce(130::numeric, pp.amount_sgd),
  '2025-10-25',
  '2026-04-25',
  null,
  'Imported from Completed sheet'
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
  'ce8527a2-b6d2-56af-b506-52daa9c0d440',
  '8a424d3f-0cce-5a87-a8a5-87aa1e69b8d3',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-09-28',
  '2026-03-28',
  null,
  'Imported from Completed sheet'
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
  '69474b96-4e9e-58c2-b7eb-ef5722152495',
  '58935cd0-f087-560e-a5a8-b3c9b39ee4a9',
  null,
  pp.id,
  4,
  4,
  true,
  'paynow',
  coalesce(130::numeric, pp.amount_sgd),
  '2025-10-11',
  '2026-04-11',
  null,
  'Imported from Completed sheet'
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
  '8e43ae12-2c41-5d44-a0d6-591d4163d133',
  '9f90ea5a-4386-52fe-8761-3439a9013d35',
  null,
  pp.id,
  4,
  4,
  true,
  'paynow',
  coalesce(150::numeric, pp.amount_sgd),
  '2025-10-26',
  '2026-04-26',
  null,
  'Imported from Completed sheet'
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
  'f18c1450-9dd3-5b0f-8170-c42aae9849ed',
  'bebee322-ab28-55ee-9ca5-2a2775788d17',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-08-24',
  '2026-02-24',
  null,
  'Imported from Completed sheet'
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
  '420c2207-7cb7-590a-8cb5-cad47cb656d6',
  '08a5ac3c-8d19-532c-94e6-5cb9211709a2',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-10-19',
  '2026-04-19',
  null,
  'Imported from Completed sheet'
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
  '4a6c476f-39bb-5ad9-978e-b2af9ace5e6a',
  '65b42b9b-212c-5503-86ab-8eeb5991eed6',
  null,
  pp.id,
  8,
  8,
  true,
  'paynow',
  coalesce(250::numeric, pp.amount_sgd),
  '2025-09-28',
  '2026-03-28',
  null,
  'Imported from Completed sheet'
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
  'e038a066-9d97-5003-a9fd-5d62cde42d7f',
  '6d1f7c08-bc25-55d1-b6bd-13b0e2b02153',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-10-21',
  '2026-04-21',
  null,
  'Imported from Completed sheet'
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
  '466dbb38-06f2-5c11-8e95-085fea398373',
  '86001e6a-51d9-58e0-8d26-74ddc0d9552d',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-08-30',
  '2026-02-28',
  null,
  'Imported from Completed sheet'
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
  '10f82f49-e480-5156-96f3-d7aff4832c36',
  '6786963f-b646-59bd-b35b-631ce2cc92f0',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-10-18',
  '2026-04-18',
  null,
  'Imported from Completed sheet'
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
  '28cdd2e4-1f76-5771-9e0f-8cdc324aa669',
  'edab7c99-2efd-59df-8a64-fc8e7fe3e2c3',
  null,
  pp.id,
  8,
  8,
  true,
  'paynow',
  coalesce(250::numeric, pp.amount_sgd),
  '2025-10-05',
  '2026-04-05',
  null,
  'Imported from Completed sheet'
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
  '93a150d3-5cd8-5698-aeca-cb5c9eb43f0f',
  '6d1f7c08-bc25-55d1-b6bd-13b0e2b02153',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-10-21',
  '2026-04-21',
  null,
  'Imported from Completed sheet'
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
  '8aaa3d66-fb97-5667-95be-5cd98fda7cb6',
  '2e0ff969-73df-56cb-a49b-044e114718a2',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-10-04',
  '2026-04-04',
  null,
  'Imported from Completed sheet'
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
  '709478f9-128e-57a6-9fff-d07325e6858e',
  'dd1cb11e-9995-5ec8-bfd8-4eab90fa61e7',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(400::numeric, pp.amount_sgd),
  '2025-09-06',
  '2026-03-06',
  null,
  'Imported from Completed sheet'
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
  '79e9560a-3e46-55c6-9f42-3c9ea76039fe',
  'ddb652aa-9813-5814-af9a-a46bf6125221',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2024-08-11',
  '2025-02-11',
  null,
  'Imported from Completed sheet'
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
  '9ca58bb2-15ca-543b-a121-4766120795eb',
  'bcb04641-9f76-5def-a479-3e5022014e05',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-08-23',
  '2026-02-23',
  null,
  'Imported from Completed sheet'
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
  '85bf622d-ad3b-5f09-a951-848fa0da55d1',
  'f8d7ab1e-bd2b-5d12-acb7-b5d802ac7edc',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-08-23',
  '2026-02-23',
  null,
  'Imported from Completed sheet'
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
  '4aba5cdf-2c51-5d69-8313-6cdbb059dbea',
  '961bf86d-1cad-5b91-8347-e016cd3bc87e',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-07-19',
  '2026-01-19',
  null,
  'Imported from Completed sheet'
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
  'aacb65f4-3b3a-5ce8-bdbb-6ad31992b3e5',
  '398211ff-7d00-58ab-a7f4-b41b1e8ce24c',
  null,
  pp.id,
  8,
  8,
  true,
  'paynow',
  coalesce(250::numeric, pp.amount_sgd),
  '2025-10-19',
  '2026-04-19',
  null,
  'Imported from Completed sheet'
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
  'a5df213b-b93c-5f11-9193-81766ac21c90',
  'ce96f634-cf9d-5bd6-9089-aa0a88dfa4a8',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-10-26',
  '2026-04-26',
  null,
  'Imported from Completed sheet'
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
  '373b8d55-586f-59e2-84fb-d28a2f9a2b07',
  '27865e02-b37f-5de6-ba0c-d4f08c2822e2',
  null,
  pp.id,
  4,
  4,
  true,
  'paynow',
  coalesce(130::numeric, pp.amount_sgd),
  '2025-11-09',
  '2026-05-09',
  null,
  'Imported from Completed sheet'
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
  'b507aac7-188e-5501-9dc8-9bed559268fc',
  '10dc5238-c6fb-5500-b95c-b76c884433bd',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-07-27',
  '2026-01-27',
  null,
  'Imported from Completed sheet'
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
  'c6e725e7-4d31-5494-99ec-9a6a7cf6ba6c',
  '500f980c-0f06-5430-a8a8-811faffb4b87',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-07-13',
  '2026-01-13',
  null,
  'Imported from Completed sheet'
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
  '26fe746c-4cda-59a0-a388-ed98832e71ab',
  'e7017111-2be6-5776-a936-ab311d40efae',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-08-03',
  '2026-02-03',
  null,
  'Imported from Completed sheet'
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
  'bb44600f-0369-570c-80e1-d8cdc42a263e',
  'c8d94aa0-9573-5376-b9ec-dd53baa34f13',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(400::numeric, pp.amount_sgd),
  '2025-06-21',
  '2025-12-21',
  null,
  'Imported from Completed sheet'
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
  '1a9a5332-4d3a-5ace-bb4e-f18cd140f8e5',
  '413d52e1-0d25-5c3f-8f75-9d0ddef9ded8',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-08-16',
  '2026-02-16',
  null,
  'Imported from Completed sheet'
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
  'c9a1b95d-9daa-5193-9e7e-bb5b5ea807e3',
  'ce210fdd-8429-576e-93a4-0e6146ba52a9',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-08-31',
  '2026-02-28',
  null,
  'Imported from Completed sheet'
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
  '5e62cee3-1720-5974-97b6-2dab976d72c8',
  'd21c2c5b-db38-5336-8c9b-2ffc60883d51',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-09-27',
  '2026-03-27',
  null,
  'Imported from Completed sheet'
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
  '2e85870b-0a7b-5e4a-af74-373b8b45beba',
  '4543bbf1-7505-56c3-8016-070fb0754061',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-11-01',
  '2026-05-01',
  null,
  'Imported from Completed sheet'
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
  '35a4ff66-3650-57e0-a295-07efb94605d8',
  '42103bec-1470-545e-a1eb-29097175a97e',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-09-20',
  '2026-03-20',
  null,
  'Imported from Completed sheet'
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
  '138635f2-7dab-5752-9d7e-07d0830d7e08',
  'deeb6e79-a24d-5ac7-abcc-811731366f98',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-08-17',
  '2026-02-17',
  null,
  'Imported from Completed sheet'
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
  '10fc7b5d-a4a2-5fa3-bf6d-e1d550c21f44',
  '2b693e72-ee54-5204-9a13-48a407627485',
  null,
  pp.id,
  4,
  4,
  true,
  'paynow',
  coalesce(130::numeric, pp.amount_sgd),
  '2025-11-09',
  '2026-05-09',
  null,
  'Imported from Completed sheet'
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
  '0f802d6c-5549-5a71-899a-948ce1a2489c',
  '8fd7aced-0f86-503e-81fa-894e66149449',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-09-27',
  '2026-03-27',
  null,
  'Imported from Completed sheet'
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
  '039cc7e8-9922-57ab-8cb9-c37874c577fd',
  'a1249f47-6d61-5d37-b5d4-eb790ab43421',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-03-29',
  '2025-09-29',
  null,
  'Imported from Completed sheet'
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
  'f13e531d-7439-5bb0-90cf-6a4fc9d40316',
  '5c1474e6-00b6-5498-b124-3f8d5b12f90e',
  null,
  pp.id,
  3,
  3,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-05-25',
  '2025-11-25',
  null,
  'Imported from Completed sheet'
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
  '1f9eb8a7-e82f-5870-a8d7-ec3e2a2f4185',
  '86c6c8d2-fded-55ee-ae84-722d5f2fe922',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(400::numeric, pp.amount_sgd),
  '2025-11-15',
  '2026-05-15',
  null,
  'Imported from Completed sheet'
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
  '226f396f-3528-55d0-b1bc-e85f3aab94da',
  '6cb65c9a-ad30-512c-966a-38e357ac7263',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-11-08',
  '2026-05-08',
  null,
  'Imported from Completed sheet'
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
  '2a5604bf-0f50-57a9-b179-3039c9db1c2e',
  'f4e90f45-6677-58a7-af01-0f93046d1b5f',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-11-09',
  '2026-05-09',
  null,
  'Imported from Completed sheet'
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
  '1325664a-77c2-5f94-9c2d-2b39e8a13c22',
  '78b2c11a-6dc4-52c4-a2ec-5e082059b477',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-09-20',
  '2026-03-20',
  null,
  'Imported from Completed sheet'
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
  '12d63133-e1dd-561c-99b5-03954b1abbce',
  '0906176d-858a-5b51-b1c3-f7339bb3c433',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(400::numeric, pp.amount_sgd),
  '2025-11-08',
  '2026-05-08',
  null,
  'Imported from Completed sheet'
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
  'e41e9f3e-73a1-5235-af51-99d5ea225f6f',
  '14caf9c3-de66-5842-b116-62aa10cf7940',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-10-11',
  '2026-04-11',
  null,
  'Imported from Completed sheet'
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
  'fd49b69e-5213-5ea4-9e0c-88a40242ed7c',
  '9f90ea5a-4386-52fe-8761-3439a9013d35',
  null,
  pp.id,
  4,
  4,
  true,
  'paynow',
  coalesce(150::numeric, pp.amount_sgd),
  '2025-12-06',
  '2026-06-06',
  null,
  'Imported from Completed sheet'
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
  '4fc386a2-4633-52c1-939a-cc5a40f18d28',
  '6786963f-b646-59bd-b35b-631ce2cc92f0',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-12-14',
  '2026-06-14',
  null,
  'Imported from Completed sheet'
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
  '7eb4a054-5df0-58fd-a006-5a32a76a9c07',
  'db9a6afa-72f8-5d1a-b8a2-fb024ccd08d9',
  null,
  pp.id,
  8,
  8,
  true,
  'paynow',
  coalesce(290::numeric, pp.amount_sgd),
  '2025-10-26',
  '2026-04-26',
  null,
  'Imported from Completed sheet'
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
  'fa186c10-4806-524d-a332-453b0f2fd353',
  '8a424d3f-0cce-5a87-a8a5-87aa1e69b8d3',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-11-29',
  '2026-05-29',
  null,
  'Imported from Completed sheet'
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
  'df7276ea-6822-598e-9ca8-b9b57986c37f',
  '4a809aca-6972-5f99-ab92-235c16d830f4',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(400::numeric, pp.amount_sgd),
  '2025-11-16',
  '2026-05-16',
  null,
  'Imported from Completed sheet'
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
  '2a7eb7da-ee68-5af8-90c3-0a5a6cbfb90a',
  '2e0ff969-73df-56cb-a49b-044e114718a2',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-12-20',
  '2026-06-20',
  null,
  'Imported from Completed sheet'
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
  'ab35a21c-1a07-5904-bc73-171a6c500f2a',
  '27865e02-b37f-5de6-ba0c-d4f08c2822e2',
  null,
  pp.id,
  4,
  4,
  true,
  'paynow',
  coalesce(130::numeric, pp.amount_sgd),
  '2025-12-28',
  '2026-06-28',
  null,
  'Imported from Completed sheet'
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
  '7cb7ed5c-579e-5775-aa85-8f61fd4e5f8d',
  '9d2fc771-4f9a-5177-be64-c0d3892e01ea',
  null,
  pp.id,
  8,
  8,
  true,
  'paynow',
  coalesce(250::numeric, pp.amount_sgd),
  '2025-10-05',
  '2026-04-05',
  null,
  'Imported from Completed sheet'
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
  '37bbc99e-0ca6-5cc6-9c58-cce3aae09537',
  '7bf353e6-18ea-5526-8db7-bb3175f6db3f',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(400::numeric, pp.amount_sgd),
  '2025-10-11',
  '2026-04-11',
  null,
  'Imported from Completed sheet'
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
  'a829504c-341d-5c22-8db8-e382825ed726',
  '9f267c85-c404-59ec-aacc-dfa2d35fd752',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-09-07',
  '2026-03-07',
  null,
  'Imported from Completed sheet'
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
  '8e2c9edb-cc99-576f-b13c-f8ea993c5b41',
  'f4eb1af3-5dfe-51d3-a6c5-bf36b1987c7b',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-09-28',
  '2026-03-28',
  null,
  'Imported from Completed sheet'
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
  'b3a2bb29-2498-5f59-b8a5-ac5034657cff',
  '39315e6c-e81c-578e-bde7-17054f4567cc',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(400::numeric, pp.amount_sgd),
  '2025-11-23',
  '2026-05-23',
  null,
  'Imported from Completed sheet'
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
  '3c826cfe-c8a0-5efe-8b2f-7223fd7cc096',
  '0c96497c-a7f3-5942-8cc7-76265648b942',
  null,
  pp.id,
  8,
  8,
  true,
  'paynow',
  coalesce(250::numeric, pp.amount_sgd),
  '2025-11-09',
  '2026-05-09',
  null,
  'Imported from Completed sheet'
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
  '29f4f737-5715-544e-9fea-2c5881787c8e',
  '0743ba7a-fd8b-5299-a77d-ef9ce7c02ba1',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-10-28',
  '2026-04-28',
  null,
  'Imported from Completed sheet'
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
  '05d55e04-52e8-5ba7-8367-9f29df1ca09c',
  '8a424d3f-0cce-5a87-a8a5-87aa1e69b8d3',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-11-29',
  '2026-05-29',
  null,
  'Imported from Completed sheet'
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
  '973fd686-e347-5733-8161-47f8e30c0dd6',
  '838c28cf-3b3e-524e-bedb-0e5b22c3fb3a',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-10-11',
  '2026-04-11',
  null,
  'Imported from Completed sheet'
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
  'df44ad79-5667-5862-8363-373c85793758',
  '9f90ea5a-4386-52fe-8761-3439a9013d35',
  null,
  pp.id,
  4,
  4,
  true,
  'paynow',
  coalesce(150::numeric, pp.amount_sgd),
  '2025-12-06',
  '2026-06-06',
  null,
  'Imported from Completed sheet'
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
  '8e4f3e8f-e6d6-5229-8c80-66096a5e2e1b',
  '2d4fcf64-fa0e-54c1-b989-9d48ad78be56',
  null,
  pp.id,
  8,
  8,
  true,
  'paynow',
  coalesce(290::numeric, pp.amount_sgd),
  '2025-11-09',
  '2026-05-09',
  null,
  'Imported from Completed sheet'
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
  '5ffb6b58-9f5e-5e3e-bdcd-f589e32bae26',
  '6d1f7c08-bc25-55d1-b6bd-13b0e2b02153',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-12-30',
  '2026-06-30',
  null,
  'Imported from Completed sheet'
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
  'a3955e19-fe8a-564e-ace0-68ded56e0280',
  'bebee322-ab28-55ee-9ca5-2a2775788d17',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-11-04',
  '2026-05-04',
  null,
  'Imported from Completed sheet'
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
  '0bc62d17-2e98-5609-84f6-1c58b357d20c',
  '4af63a5d-9480-5070-b7ea-67069c2196ed',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-10-21',
  '2026-04-21',
  null,
  'Imported from Completed sheet'
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
  '051d4f10-65a0-5f01-ac34-eb3b5acf507a',
  '9102cbfd-504c-51ed-8c9d-547448a57533',
  null,
  pp.id,
  8,
  8,
  true,
  'paynow',
  coalesce(250::numeric, pp.amount_sgd),
  '2025-11-22',
  '2026-05-22',
  null,
  'Imported from Completed sheet'
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
  'ac4f76e8-c28a-55bf-93fa-5750f62fe142',
  '42b6f9a7-3f23-5dd0-831b-cf3640784ca7',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-10-05',
  '2026-04-05',
  null,
  'Imported from Completed sheet'
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
  '29794b60-bd00-52db-b718-753c764867d6',
  '5c1474e6-00b6-5498-b124-3f8d5b12f90e',
  null,
  pp.id,
  4,
  4,
  true,
  'paynow',
  coalesce(130::numeric, pp.amount_sgd),
  '2026-01-18',
  '2026-07-18',
  null,
  'Imported from Completed sheet'
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
  '4370b248-d4c6-50ca-8d17-64ca9d82cecd',
  '6ff4cc36-6472-5056-a11f-9930a5f991e7',
  null,
  pp.id,
  8,
  8,
  true,
  'paynow',
  coalesce(250::numeric, pp.amount_sgd),
  '2025-10-19',
  '2026-04-19',
  null,
  'Imported from Completed sheet'
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
  'e114d85f-4214-5e50-b7ad-258c567bd7bf',
  '86001e6a-51d9-58e0-8d26-74ddc0d9552d',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-12-07',
  '2026-06-07',
  null,
  'Imported from Completed sheet'
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
  '5c85970f-8aeb-5d40-9868-54643664dbdb',
  'feb22150-e140-559d-8076-67f78ca92aa9',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-10-19',
  '2026-04-19',
  null,
  'Imported from Completed sheet'
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
  '5e1ce88b-d7bd-53f8-8114-90696b4a498c',
  '6c48f544-b1a5-5b0d-86f9-998c0a82c295',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-09-14',
  '2026-03-14',
  null,
  'Imported from Completed sheet'
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
  '3d445529-b3eb-5ac8-b9c7-bd9c1df453e2',
  '8d1c0841-2d61-57ac-a370-323ce6d177a5',
  null,
  pp.id,
  4,
  4,
  true,
  'paynow',
  coalesce(130::numeric, pp.amount_sgd),
  '2026-01-24',
  '2026-07-24',
  null,
  'Imported from Completed sheet'
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
  '258bbba5-085a-5cad-a5f9-fe4410353e05',
  '47da8d91-84c7-5ca1-ae70-1148dd55b9d6',
  null,
  pp.id,
  4,
  4,
  true,
  'paynow',
  coalesce(130::numeric, pp.amount_sgd),
  '2026-01-17',
  '2026-07-17',
  null,
  'Imported from Completed sheet'
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
  '208c3683-3ec3-505f-b9a2-2733e295fe01',
  '14035a7b-ecbc-5b82-a7db-39161cfaf96d',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-11-01',
  '2026-05-01',
  null,
  'Imported from Completed sheet'
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
  '6e8ccc01-8fd6-52e2-af9c-054e4f565e7a',
  'bc6a2063-aa26-535c-873d-843aeef21ae3',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-11-09',
  '2026-05-09',
  null,
  'Imported from Completed sheet'
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
  '125ae35f-2ae9-5191-b028-5d21567c87b0',
  'e6db77d2-0e23-5740-b1c4-fe56c82c0ec1',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-10-18',
  '2026-04-18',
  null,
  'Imported from Completed sheet'
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
  '0a18d508-efba-5bb5-9a64-a60913fcdfa4',
  '25b7c6e0-2e65-599e-8dd9-bbf2bd207fb1',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-09-21',
  '2026-03-21',
  null,
  'Imported from Completed sheet'
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
  'dd81cfbc-7310-5ef3-8fe0-6d178fbb7fc0',
  '4543bbf1-7505-56c3-8016-070fb0754061',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-01-11',
  '2026-07-11',
  null,
  'Imported from Completed sheet'
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
  '3695abe6-3f4e-54cb-81c4-55d41565b5ae',
  'dec36253-6004-555b-bb94-777217372500',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-11-16',
  '2026-05-16',
  null,
  'Imported from Completed sheet'
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
  '92d6f65c-0287-574d-a7e0-03a88af1d2f7',
  '07e718de-73b2-5b91-ad3e-fd6f0824bf3b',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-11-08',
  '2026-05-08',
  null,
  'Imported from Completed sheet'
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
  'df5ea99c-b2de-501a-b10a-19bdc0261056',
  'f8fd1e4e-de4b-5dfa-9078-aa0e112afcf4',
  null,
  pp.id,
  4,
  4,
  true,
  'paynow',
  coalesce(130::numeric, pp.amount_sgd),
  '2026-02-01',
  '2026-08-01',
  null,
  'Imported from Completed sheet'
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
  'd00e7e41-056d-516a-9566-bece4cb3cc46',
  '7b0081c9-f798-5a4c-a619-3ba10f402f90',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-10-19',
  '2026-04-19',
  null,
  'Imported from Completed sheet'
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
  '4107f2ba-a173-5baf-822d-360819678cf1',
  '74601412-1ce3-57bc-bdc0-f5c98d76892a',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-11-09',
  '2026-05-09',
  null,
  'Imported from Completed sheet'
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
  '1d0749e7-4233-5d7d-8432-ff30f940042b',
  '6c622d2f-528a-5b8a-b088-eef78d8801c3',
  null,
  pp.id,
  4,
  4,
  true,
  'paynow',
  coalesce(130::numeric, pp.amount_sgd),
  '2026-01-03',
  '2026-07-03',
  null,
  'Imported from Completed sheet'
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
  '5f7ec9ba-17bd-5a7f-b867-7d4a20b620ed',
  'c0f7adf1-a130-56d6-8db3-b447dc30a243',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-01-03',
  '2026-07-03',
  null,
  'Imported from Completed sheet'
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
  'fecfcb47-6600-51de-a44a-7b61ab69bdf7',
  '07f24621-6939-5c24-b259-04e257029a1c',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(400::numeric, pp.amount_sgd),
  '2026-01-10',
  '2026-07-10',
  null,
  'Imported from Completed sheet'
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
  '96f08f44-79d9-5c2f-ba46-6db6fa5b9e96',
  '14caf9c3-de66-5842-b116-62aa10cf7940',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-10-11',
  '2026-04-11',
  null,
  'Imported from Completed sheet'
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
  'defabf9d-1f05-588e-90f0-57f945adb5a2',
  '25b7c6e0-2e65-599e-8dd9-bbf2bd207fb1',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-09-21',
  '2026-03-21',
  null,
  'Imported from Completed sheet'
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
  '9f6c8bc1-7f12-5ec6-86f9-1c3049435352',
  '65b42b9b-212c-5503-86ab-8eeb5991eed6',
  null,
  pp.id,
  8,
  8,
  true,
  'paynow',
  coalesce(250::numeric, pp.amount_sgd),
  '2025-12-21',
  '2026-06-21',
  null,
  'Imported from Completed sheet'
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
  'f179bb76-8085-5738-90b3-fbb7f09e415f',
  '2b693e72-ee54-5204-9a13-48a407627485',
  null,
  pp.id,
  4,
  4,
  true,
  'paynow',
  coalesce(130::numeric, pp.amount_sgd),
  '2026-02-08',
  '2026-08-08',
  null,
  'Imported from Completed sheet'
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
  'b03b68b7-ad8d-5a4d-b15e-2e7fab14c8ca',
  '841cef55-098c-59d2-9b25-240e27a8a468',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-10-26',
  '2026-04-26',
  null,
  'Imported from Completed sheet'
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
  '9cf97d67-f678-54c8-88c5-842fcf099fee',
  '4a809aca-6972-5f99-ab92-235c16d830f4',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(400::numeric, pp.amount_sgd),
  '2026-01-30',
  '2026-07-30',
  null,
  'Imported from Completed sheet'
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
  '4c36991a-8b3d-5cdd-8b33-ef5063201352',
  '86c6c8d2-fded-55ee-ae84-722d5f2fe922',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(400::numeric, pp.amount_sgd),
  '2026-01-30',
  '2026-07-30',
  null,
  'Imported from Completed sheet'
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
  'e65d8b3c-beb2-59cf-ad8e-dab393c8a76c',
  '536283ea-0e83-5d63-beb9-c7254cdab496',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-11-23',
  '2026-05-23',
  null,
  'Imported from Completed sheet'
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
  '5dafae3b-9df1-5f3f-98ff-bae83ee48b8d',
  'f4e90f45-6677-58a7-af01-0f93046d1b5f',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-01-25',
  '2026-07-25',
  null,
  'Imported from Completed sheet'
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
  '84820633-407c-5cec-b4d9-e8292146f801',
  '5c1474e6-00b6-5498-b124-3f8d5b12f90e',
  null,
  pp.id,
  4,
  4,
  true,
  'paynow',
  coalesce(130::numeric, pp.amount_sgd),
  '2026-02-22',
  '2026-08-22',
  null,
  'Imported from Completed sheet'
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
  '66ab36f7-ca2b-5171-a5f4-516fd303c2cb',
  'c8d94aa0-9573-5376-b9ec-dd53baa34f13',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(400::numeric, pp.amount_sgd),
  '2026-01-03',
  '2026-07-03',
  null,
  'Imported from Completed sheet'
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
  '74a829dc-844a-54f2-8a75-64e24a4d1ac7',
  '9f90ea5a-4386-52fe-8761-3439a9013d35',
  null,
  pp.id,
  4,
  4,
  true,
  'paynow',
  coalesce(150::numeric, pp.amount_sgd),
  '2026-02-07',
  '2026-08-07',
  null,
  'Imported from Completed sheet'
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
  '41ca41c9-e2bf-50c7-b2a4-43be1d764fe3',
  '58935cd0-f087-560e-a5a8-b3c9b39ee4a9',
  null,
  pp.id,
  4,
  4,
  true,
  'paynow',
  coalesce(130::numeric, pp.amount_sgd),
  '2026-02-07',
  '2026-08-07',
  null,
  'Imported from Completed sheet'
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
  '9438759b-25cd-5e65-83b1-3353d784b722',
  'e3f802c4-e5ed-55da-b17b-f1281e7e0993',
  null,
  pp.id,
  4,
  4,
  true,
  'paynow',
  coalesce(130::numeric, pp.amount_sgd),
  '2026-01-18',
  '2026-07-18',
  null,
  'Imported from Completed sheet'
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
  '47baaa80-ea9a-50f5-8dd9-e9360d5481b1',
  'edab7c99-2efd-59df-8a64-fc8e7fe3e2c3',
  null,
  pp.id,
  8,
  8,
  true,
  'paynow',
  coalesce(250::numeric, pp.amount_sgd),
  '2026-01-04',
  '2026-07-04',
  null,
  'Imported from Completed sheet'
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
  '7d468e53-0668-5335-a2f2-fdce2125c542',
  'f8fd1e4e-de4b-5dfa-9078-aa0e112afcf4',
  null,
  pp.id,
  4,
  4,
  true,
  'paynow',
  coalesce(130::numeric, pp.amount_sgd),
  '2026-03-01',
  '2026-09-01',
  null,
  'Imported from Completed sheet'
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
  '62682453-811c-5ef4-91da-78d2e1b8d88e',
  '0be0d355-17a7-5fbb-a294-dc249bd30d89',
  null,
  pp.id,
  8,
  8,
  true,
  'paynow',
  coalesce(580::numeric, pp.amount_sgd),
  '2026-01-04',
  '2026-07-04',
  null,
  'Imported from Completed sheet'
from package_products pp
where pp.product_type = 'private'
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
  '2a76a029-c93a-5772-855f-254bed6202e2',
  'bebee322-ab28-55ee-9ca5-2a2775788d17',
  null,
  pp.id,
  4,
  4,
  true,
  'paynow',
  coalesce(130::numeric, pp.amount_sgd),
  '2026-02-24',
  '2026-08-24',
  null,
  'Imported from Completed sheet'
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
  '4c800493-d440-5d47-aa50-14e0af629b05',
  'c6523aa7-388b-5e84-abfb-008023c9a526',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-11-15',
  '2026-05-15',
  null,
  'Imported from Completed sheet'
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
  'f574f0a4-dd60-5af7-925a-aee515767e69',
  '30b506df-dd6a-5046-82e3-65c40778e88b',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-11-15',
  '2026-05-15',
  null,
  'Imported from Completed sheet'
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
  '59e376fc-a402-5494-8616-13dfeb703b24',
  '86001e6a-51d9-58e0-8d26-74ddc0d9552d',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-02-13',
  '2026-08-13',
  null,
  'Imported from Completed sheet'
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
  '8bd6edf6-3a03-5616-88c9-f1d88cd10186',
  '27865e02-b37f-5de6-ba0c-d4f08c2822e2',
  null,
  pp.id,
  4,
  4,
  true,
  'paynow',
  coalesce(130::numeric, pp.amount_sgd),
  '2026-02-15',
  '2026-08-15',
  null,
  'Imported from Completed sheet'
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
  'bacafcc5-c681-5a52-9c6e-a37a7e767fd6',
  'b8bd41d5-52e7-53df-9d58-d55f06b8b48e',
  null,
  pp.id,
  4,
  4,
  true,
  'paynow',
  coalesce(130::numeric, pp.amount_sgd),
  '2026-02-22',
  '2026-08-22',
  null,
  'Imported from Completed sheet'
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
  'c316efca-43d7-505d-a0f3-dcc7a654f00a',
  'dd1cb11e-9995-5ec8-bfd8-4eab90fa61e7',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(400::numeric, pp.amount_sgd),
  '2026-01-10',
  '2026-07-10',
  null,
  'Imported from Completed sheet'
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
  'd34934d0-6327-5062-9ee8-8469da71ef5e',
  '8a424d3f-0cce-5a87-a8a5-87aa1e69b8d3',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-02-07',
  '2026-08-07',
  null,
  'Imported from Completed sheet'
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
  'a81b58c3-1c91-5c9c-8dd6-bd12c15dd8f4',
  '86c6c8d2-fded-55ee-ae84-722d5f2fe922',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(400::numeric, pp.amount_sgd),
  '2026-03-13',
  '2026-09-13',
  null,
  'Imported from Completed sheet'
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
  '3681e37a-2e87-5d87-bab0-52add588a2ec',
  'ee27c92c-7ca0-5aab-971f-38a1f7fa19b4',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-09-27',
  '2026-03-27',
  null,
  'Imported from Completed sheet'
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
  '78736160-b31f-55e4-aa7c-9fcbcdacea8d',
  '0906176d-858a-5b51-b1c3-f7339bb3c433',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(400::numeric, pp.amount_sgd),
  '2026-02-07',
  '2026-08-07',
  null,
  'Imported from Completed sheet'
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
  '902dd5b7-8128-5b16-bef9-e2b85833ac85',
  'c2403d53-0e18-58fb-a1f5-1e1ebe90e3d7',
  null,
  pp.id,
  4,
  4,
  true,
  'paynow',
  coalesce(130::numeric, pp.amount_sgd),
  '2026-01-17',
  '2026-07-17',
  null,
  'Imported from Completed sheet'
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
  'f9d9011a-2d89-524e-ba9e-3bbdb7882956',
  'cc1507a7-b4ca-5af4-9d74-988ed04ae216',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-09-14',
  '2026-03-14',
  null,
  'Imported from Completed sheet'
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
  '39587596-fd0d-5742-ba54-d9b99b947c72',
  'ce96f634-cf9d-5bd6-9089-aa0a88dfa4a8',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-12-21',
  '2026-06-21',
  null,
  'Imported from Completed sheet'
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
  '1ac60097-2cb5-5c87-826f-f1875b3d233c',
  'bc6a2063-aa26-535c-873d-843aeef21ae3',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-03-01',
  '2026-09-01',
  null,
  'Imported from Completed sheet'
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
  '5763c1fb-6ae3-5c2c-8721-0b32f3d57d5c',
  '8db53ed9-233e-5572-ae15-13773d015dab',
  null,
  pp.id,
  8,
  8,
  true,
  'paynow',
  coalesce(290::numeric, pp.amount_sgd),
  '2025-10-04',
  '2026-04-04',
  null,
  'Imported from Completed sheet'
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
  '75f3cb8f-3c00-5546-8543-0844af4e31de',
  'db9a6afa-72f8-5d1a-b8a2-fb024ccd08d9',
  null,
  pp.id,
  8,
  8,
  true,
  'paynow',
  coalesce(290::numeric, pp.amount_sgd),
  '2026-02-15',
  '2026-08-15',
  null,
  'Imported from Completed sheet'
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
  'b6797f77-9b40-5799-9d31-63fa66ecebc8',
  '8a16bcbd-9ca8-5322-8de2-be5e68f07e26',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-10-18',
  '2026-04-18',
  null,
  'Imported from Completed sheet'
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
  '16bffa43-404c-5400-baa7-0aecda1bad43',
  '6d1f7c08-bc25-55d1-b6bd-13b0e2b02153',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-02-24',
  '2026-08-24',
  null,
  'Imported from Completed sheet'
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
  '101de061-30cf-54a1-afc8-cf89b0e09cdd',
  '42103bec-1470-545e-a1eb-29097175a97e',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-01-24',
  '2026-07-24',
  null,
  'Imported from Completed sheet'
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
  'ef70ace4-2ef6-5a13-b5bc-1f2ec09a3e4c',
  '58935cd0-f087-560e-a5a8-b3c9b39ee4a9',
  null,
  pp.id,
  4,
  4,
  true,
  'paynow',
  coalesce(130::numeric, pp.amount_sgd),
  '2026-03-28',
  '2026-09-28',
  null,
  'Imported from Completed sheet'
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
  '94571585-0218-5dfb-8d85-5fb58e2b964f',
  '500f980c-0f06-5430-a8a8-811faffb4b87',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-12-27',
  '2026-06-27',
  null,
  'Imported from Completed sheet'
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
  '7b7aa7f3-a5a7-59d0-9607-763bdcf1c1e9',
  '1e714eb0-ddb2-53ee-b364-db1c01cba2f5',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-01-17',
  '2026-07-17',
  null,
  'Imported from Completed sheet'
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
  '9c263516-dad1-5ba9-a748-8a0ea4a05e3c',
  '9102cbfd-504c-51ed-8c9d-547448a57533',
  null,
  pp.id,
  8,
  8,
  true,
  'paynow',
  coalesce(250::numeric, pp.amount_sgd),
  '2026-02-21',
  '2026-08-21',
  null,
  'Imported from Completed sheet'
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
  'beadd7a5-de0c-51ed-8ad9-83090657fc61',
  '4a809aca-6972-5f99-ab92-235c16d830f4',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(400::numeric, pp.amount_sgd),
  '2026-03-13',
  '2026-09-13',
  null,
  'Imported from Completed sheet'
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
  '207d4b4b-4104-554d-b625-79716f4e2780',
  'ce210fdd-8429-576e-93a4-0e6146ba52a9',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-01-18',
  '2026-07-18',
  null,
  'Imported from Completed sheet'
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
  'acd8339f-d46c-508f-b55a-32335492ee20',
  'f8fd1e4e-de4b-5dfa-9078-aa0e112afcf4',
  null,
  pp.id,
  8,
  8,
  true,
  'paynow',
  coalesce(250::numeric, pp.amount_sgd),
  '2026-03-01',
  '2026-09-01',
  null,
  'Imported from Completed sheet'
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
  '1de596cd-79f4-5575-bb4a-8ae488a4292b',
  'ca01241f-d00f-5cd8-bb34-3ffcb4d69f75',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-12-07',
  '2026-06-07',
  null,
  'Imported from Completed sheet'
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
  'f9b5a775-367c-5ec2-aee6-fb8ac85a253e',
  '9f786380-be24-5f9e-bbec-c1859b19f45e',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(400::numeric, pp.amount_sgd),
  '2026-01-10',
  '2026-07-10',
  null,
  'Imported from Completed sheet'
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
  '8a1b0dc8-0876-54d9-bd14-656a8f139c7b',
  '049748a2-6aa7-5de7-82ca-f6aa5b759350',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-08-16',
  '2026-02-16',
  null,
  'Imported from Completed sheet'
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
  '68577c96-1108-58ac-90fd-4875d550dc8c',
  '8fd7aced-0f86-503e-81fa-894e66149449',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-02-07',
  '2026-08-07',
  null,
  'Imported from Completed sheet'
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
  '5ba80de6-2af8-5521-9b50-4d1424ebb08b',
  '86c6c8d2-fded-55ee-ae84-722d5f2fe922',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(400::numeric, pp.amount_sgd),
  '2026-04-04',
  '2026-10-04',
  null,
  'Imported from Completed sheet'
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
  'b90732f3-93f8-5ac9-bf14-f2f30a3edc10',
  '0906176d-858a-5b51-b1c3-f7339bb3c433',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(400::numeric, pp.amount_sgd),
  '2026-04-05',
  '2026-10-05',
  null,
  'Imported from Completed sheet'
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
  '42682be4-181b-5fb7-9435-bf67876562ee',
  'f4e90f45-6677-58a7-af01-0f93046d1b5f',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-03-21',
  '2026-09-21',
  null,
  'Imported from Completed sheet'
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
  '3016c8b5-3039-5121-9ea0-cedfd0296434',
  '25b7c6e0-2e65-599e-8dd9-bbf2bd207fb1',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-03-01',
  '2026-09-01',
  null,
  'Imported from Completed sheet'
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
  '975b148f-60ca-5cc4-8434-6b92469b92cd',
  '47da8d91-84c7-5ca1-ae70-1148dd55b9d6',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-02-28',
  '2026-08-28',
  null,
  'Imported from Completed sheet'
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
  'e720abc6-9c7f-5a2d-b507-76e5a5981ec7',
  '0d46ace0-d99e-5fc5-b7b4-37f388495a58',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-01-10',
  '2026-07-10',
  null,
  'Imported from Completed sheet'
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
  '66d85e99-5699-5bf2-a680-e06fb8dc356c',
  '8971285b-6f3c-5a94-8fba-4c2d43e9997d',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-01-24',
  '2026-07-24',
  null,
  'Imported from Completed sheet'
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
  '09ac2648-7d33-5f4c-9547-6a1190e599c3',
  '8d62ac5c-5c2f-57df-902d-af583adacca2',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-01-24',
  '2026-07-24',
  null,
  'Imported from Completed sheet'
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
  'd129c3e4-7c36-5bd7-a8c9-10d7c7055cd8',
  '2e0ff969-73df-56cb-a49b-044e114718a2',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-02-08',
  '2026-08-08',
  null,
  'Imported from Completed sheet'
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
  '00acb120-370e-5695-adcf-ca2e85cebb27',
  '7c821475-e585-5b83-ab67-d68fd7c3145a',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(840::numeric, pp.amount_sgd),
  '2025-10-12',
  '2026-04-12',
  null,
  'Imported from Completed sheet'
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
  'aa032229-4b48-563d-9dc7-921eec5eac99',
  '39315e6c-e81c-578e-bde7-17054f4567cc',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(400::numeric, pp.amount_sgd),
  '2026-02-08',
  '2026-08-08',
  null,
  'Imported from Completed sheet'
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
  'b77b9fe8-cefe-5728-858a-dc327c475880',
  '07d610f2-6ecb-59a9-bcdd-703b91fb4b52',
  null,
  pp.id,
  8,
  8,
  true,
  'paynow',
  coalesce(250::numeric, pp.amount_sgd),
  '2025-11-09',
  '2026-05-09',
  null,
  'Imported from Completed sheet'
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
  'ec988c86-eb47-5fc1-8f8a-0353c9417a56',
  '9b8c0f05-fdb9-5e60-a6d0-ae6035b65f22',
  null,
  pp.id,
  4,
  4,
  true,
  'paynow',
  coalesce(150::numeric, pp.amount_sgd),
  '2026-04-11',
  '2026-10-11',
  null,
  'Imported from Completed sheet'
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
  'ac00eaab-fe4e-565c-af78-f93ac0f90663',
  '40091cba-a4e0-5f2f-be60-77ad19b1c127',
  null,
  pp.id,
  4,
  4,
  true,
  'paynow',
  coalesce(130::numeric, pp.amount_sgd),
  '2025-11-01',
  '2026-05-01',
  null,
  'Imported from Completed sheet'
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
  'ca14f300-c437-5445-862d-e253f085cd07',
  'db8e3ba6-ad4d-54f8-a8d2-6b27dc34e81b',
  null,
  pp.id,
  4,
  4,
  true,
  'paynow',
  coalesce(150::numeric, pp.amount_sgd),
  '2026-04-05',
  '2026-10-05',
  null,
  'Imported from Completed sheet'
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
  '5b3d3faa-d5d6-5b97-a03e-1f788419a859',
  '65b42b9b-212c-5503-86ab-8eeb5991eed6',
  null,
  pp.id,
  8,
  8,
  true,
  'paynow',
  coalesce(250::numeric, pp.amount_sgd),
  '2026-03-15',
  '2026-09-15',
  null,
  'Imported from Completed sheet'
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
  'd0f37931-61ee-505f-987f-e300e27d0018',
  'c0115c92-c272-5386-afe8-32636846d9ae',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-03-15',
  '2026-09-15',
  null,
  'Imported from Completed sheet'
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
  '44300d7f-71a8-517e-acfc-ae90d1d0075c',
  '10dc5238-c6fb-5500-b95c-b76c884433bd',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-12-28',
  '2026-06-28',
  null,
  'Imported from Completed sheet'
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
  '56e6b820-9c5f-5f17-addf-8ae1a646c80b',
  'dec36253-6004-555b-bb94-777217372500',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-03-01',
  '2026-09-01',
  null,
  'Imported from Completed sheet'
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
  '4a8829d0-71da-59b5-8025-53926ef48a63',
  'c585c8cc-0cc2-57ed-8c4c-ed167c8d54a2',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-11-15',
  '2026-05-15',
  null,
  'Imported from Completed sheet'
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
  '8e4ae86b-c9c1-5b83-9e83-f3ab630731e5',
  'feb22150-e140-559d-8076-67f78ca92aa9',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-03-01',
  '2026-09-01',
  null,
  'Imported from Completed sheet'
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
  '455ad871-33ce-5859-9e58-a746e814b420',
  '4a809aca-6972-5f99-ab92-235c16d830f4',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(400::numeric, pp.amount_sgd),
  '2026-04-19',
  '2026-10-19',
  null,
  'Imported from Completed sheet'
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
  'a7905bda-31d4-521f-a840-ca07441daa9c',
  '27865e02-b37f-5de6-ba0c-d4f08c2822e2',
  null,
  pp.id,
  4,
  4,
  true,
  'paynow',
  coalesce(130::numeric, pp.amount_sgd),
  '2026-04-05',
  '2026-10-05',
  null,
  'Imported from Completed sheet'
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
  'fe6b79f0-08c3-5e23-8b58-b276e3a4946b',
  '2b693e72-ee54-5204-9a13-48a407627485',
  null,
  pp.id,
  4,
  4,
  true,
  'paynow',
  coalesce(130::numeric, pp.amount_sgd),
  '2026-03-22',
  '2026-09-22',
  null,
  'Imported from Completed sheet'
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
  'de259597-36b7-5a8c-86b6-2b55f6aeb168',
  '0be0d355-17a7-5fbb-a294-dc249bd30d89',
  null,
  pp.id,
  4,
  4,
  true,
  'paynow',
  coalesce(130::numeric, pp.amount_sgd),
  '2026-04-19',
  '2026-10-19',
  null,
  'Imported from Completed sheet'
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
  'a8e61f9d-aa39-5883-b65b-90903b61c736',
  '86c6c8d2-fded-55ee-ae84-722d5f2fe922',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(400::numeric, pp.amount_sgd),
  '2026-04-25',
  '2026-10-25',
  null,
  'Imported from Completed sheet'
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
  '96e08489-b746-57ae-a8e2-623f01718f80',
  '8a424d3f-0cce-5a87-a8a5-87aa1e69b8d3',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-04-04',
  '2026-10-04',
  null,
  'Imported from Completed sheet'
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
  'fb3f1fc0-4631-5267-996f-4a3d99a95b89',
  '86001e6a-51d9-58e0-8d26-74ddc0d9552d',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-04-04',
  '2026-10-04',
  null,
  'Imported from Completed sheet'
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
  'd67e8ac1-11d6-587f-be47-895cfe658d17',
  '6c48f544-b1a5-5b0d-86f9-998c0a82c295',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-03-01',
  '2026-09-01',
  null,
  'Imported from Completed sheet'
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
  '80c0f52c-22cf-5110-94e2-46567e381d16',
  '0906176d-858a-5b51-b1c3-f7339bb3c433',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(400::numeric, pp.amount_sgd),
  '2026-04-26',
  '2026-10-26',
  null,
  'Imported from Completed sheet'
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
  '1959ea69-b3f4-52bc-8c61-69de4b01fe5b',
  'edab7c99-2efd-59df-8a64-fc8e7fe3e2c3',
  null,
  pp.id,
  8,
  8,
  true,
  'paynow',
  coalesce(250::numeric, pp.amount_sgd),
  '2026-03-29',
  '2026-09-29',
  null,
  'Imported from Completed sheet'
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
  'de5fef28-5ef8-5c51-ad90-13063c1844de',
  'f8fd1e4e-de4b-5dfa-9078-aa0e112afcf4',
  null,
  pp.id,
  5,
  5,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-04-26',
  '2026-10-26',
  null,
  'Imported from Completed sheet'
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
  'a7bb9c86-db65-5bcb-b655-6d1c04aaadd2',
  '4af63a5d-9480-5070-b7ea-67069c2196ed',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-02-24',
  '2026-08-24',
  null,
  'Imported from Completed sheet'
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
  'ff82204f-fe08-566c-bcfa-b627a40b6074',
  '7bf353e6-18ea-5526-8db7-bb3175f6db3f',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(400::numeric, pp.amount_sgd),
  '2026-02-01',
  '2026-08-01',
  null,
  'Imported from Completed sheet'
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
  '204a880d-c175-5e9c-bc95-d0f386cd35a1',
  'bcb04641-9f76-5def-a479-3e5022014e05',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-01-03',
  '2026-07-03',
  null,
  'Imported from Completed sheet'
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
  'fe4a9433-2ce5-5dcc-ab66-e5761b16e851',
  'f8d7ab1e-bd2b-5d12-acb7-b5d802ac7edc',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-01-03',
  '2026-07-03',
  null,
  'Imported from Completed sheet'
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
  '79c72f34-7fc5-5136-8e72-e7a72bb2e40b',
  'bebee322-ab28-55ee-9ca5-2a2775788d17',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-11-29',
  '2026-05-29',
  null,
  'Imported from Completed sheet'
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
  'bc8769e0-ab9f-5679-8a94-b36e4669c606',
  'e3f802c4-e5ed-55da-b17b-f1281e7e0993',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-03-22',
  '2026-09-22',
  null,
  'Imported from Completed sheet'
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
  'a4c4f9e6-76ab-573e-8acc-b31e846c1290',
  '5c9fd449-adbc-5238-af69-b7c7d7650bd1',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-02-08',
  '2026-08-08',
  null,
  'Imported from Completed sheet'
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
  '5d97c2c9-eacc-5601-ac4b-9d535b268163',
  '939d554c-1b75-5eff-93e8-31651f136bf5',
  null,
  pp.id,
  8,
  8,
  true,
  'paynow',
  coalesce(250::numeric, pp.amount_sgd),
  '2026-04-11',
  '2026-10-11',
  null,
  'Imported from Completed sheet'
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
  'cf168497-09df-5c80-a990-1fddd5f9aa12',
  '838c28cf-3b3e-524e-bedb-0e5b22c3fb3a',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-02-14',
  '2026-08-14',
  null,
  'Imported from Completed sheet'
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
  '796ca7a1-32b9-5791-84e0-7b8e93f94b81',
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
  null,
  'Imported from Completed sheet'
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
  'df380e9b-6cdc-5fce-910b-a271d9737bd8',
  'b8bd41d5-52e7-53df-9d58-d55f06b8b48e',
  null,
  pp.id,
  8,
  8,
  true,
  'paynow',
  coalesce(250::numeric, pp.amount_sgd),
  '2026-04-19',
  '2026-10-19',
  null,
  'Imported from Completed sheet'
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
  '86f5ba5e-1df2-510a-8e27-c57813c9119e',
  '2d4fcf64-fa0e-54c1-b989-9d48ad78be56',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(400::numeric, pp.amount_sgd),
  '2026-02-22',
  '2026-08-22',
  null,
  'Imported from Completed sheet'
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
  'd349f81e-406b-5fa8-83f7-18bc61fc9aea',
  '6d1f7c08-bc25-55d1-b6bd-13b0e2b02153',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-04-21',
  '2026-10-21',
  null,
  'Imported from Completed sheet'
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
  'c97b3db3-b17a-5ec1-a094-62d570fd84cd',
  'f4e90f45-6677-58a7-af01-0f93046d1b5f',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-05-02',
  '2026-11-02',
  null,
  'Imported from Completed sheet'
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
  'a2a02626-ca26-51be-b57c-a07c096ad734',
  '841cef55-098c-59d2-9b25-240e27a8a468',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-03-22',
  '2026-09-22',
  null,
  'Imported from Completed sheet'
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
  '35bede06-9a04-52eb-931e-8c5408a1a06c',
  '2b693e72-ee54-5204-9a13-48a407627485',
  null,
  pp.id,
  4,
  4,
  true,
  'paynow',
  coalesce(130::numeric, pp.amount_sgd),
  '2026-05-24',
  '2026-11-24',
  null,
  'Imported from Completed sheet'
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
  'aa4fdab7-fa80-51ad-8c73-c29a273d824f',
  'ca01241f-d00f-5cd8-bb34-3ffcb4d69f75',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-04-19',
  '2026-10-19',
  null,
  'Imported from Completed sheet'
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
  '1449d7c9-d362-5ed1-9c05-a97211f28ac7',
  '78b2c11a-6dc4-52c4-a2ec-5e082059b477',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-02-28',
  '2026-08-28',
  null,
  'Imported from Completed sheet'
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
  '1d6f9fb8-8e91-5123-901c-f2cdaa0b6040',
  'e6db77d2-0e23-5740-b1c4-fe56c82c0ec1',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-02-28',
  '2026-08-28',
  null,
  'Imported from Completed sheet'
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
  '692d52de-d08f-5ac8-8c65-e88bd167a90b',
  'bc6a2063-aa26-535c-873d-843aeef21ae3',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-04-18',
  '2026-10-18',
  null,
  'Imported from Completed sheet'
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
  'f479ddb6-6556-58c7-8dbc-1d7a0d31145b',
  '42103bec-1470-545e-a1eb-29097175a97e',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-04-18',
  '2026-10-18',
  null,
  'Imported from Completed sheet'
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
  '635b0195-75a5-5cd1-ad70-b7b8904d0045',
  '14caf9c3-de66-5842-b116-62aa10cf7940',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-03-07',
  '2026-09-07',
  null,
  'Imported from Completed sheet'
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
  '86a5c275-5c7e-5e13-a84d-71b5c48bfcb7',
  '536283ea-0e83-5d63-beb9-c7254cdab496',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-03-22',
  '2026-09-22',
  null,
  'Imported from Completed sheet'
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
  'ff93762a-77ec-5a32-8cf2-f076bbb1896f',
  '07e718de-73b2-5b91-ad3e-fd6f0824bf3b',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-03-08',
  '2026-09-08',
  null,
  'Imported from Completed sheet'
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
  '49afe47e-3faa-5419-97fd-34b9f5aa6e8b',
  'c8d94aa0-9573-5376-b9ec-dd53baa34f13',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(400::numeric, pp.amount_sgd),
  '2026-03-29',
  '2026-09-29',
  null,
  'Imported from Completed sheet'
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
  '47fc2489-ae90-59d8-87d5-30e4e625fff3',
  'c0f7adf1-a130-56d6-8db3-b447dc30a243',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-03-15',
  '2026-09-15',
  null,
  'Imported from Completed sheet'
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
  'cbd182fb-fc7b-5a3d-9859-fad6611c350b',
  'f1d6314e-3be5-5019-b5fc-3fac450ede11',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-05-12',
  '2026-11-12',
  null,
  'Imported from Completed sheet'
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
  '3fee5c77-ebc2-568b-8a68-5f76a262963d',
  '13e7bb73-667b-5503-a0e1-d919462be3d7',
  null,
  pp.id,
  8,
  8,
  true,
  'paynow',
  coalesce(290::numeric, pp.amount_sgd),
  '2026-03-22',
  '2026-09-22',
  null,
  'Imported from Completed sheet'
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
  'b27b3190-caa8-53ab-8f18-7faa9111ffdb',
  '86c6c8d2-fded-55ee-ae84-722d5f2fe922',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(400::numeric, pp.amount_sgd),
  '2026-05-24',
  '2026-11-24',
  null,
  'Imported from Completed sheet'
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
  '2f4187b5-a41f-5894-bf52-2ec3cee6133d',
  'ba20e5a2-1434-565f-bdb1-f2794475af2f',
  null,
  pp.id,
  8,
  8,
  true,
  'paynow',
  coalesce(250::numeric, pp.amount_sgd),
  '2026-04-25',
  '2026-10-25',
  null,
  'Imported from Completed sheet'
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
  '37ce2b11-0a51-5033-888f-87cb150c21eb',
  '3043fe89-3060-586b-ac97-d3f59a53fa35',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-10-25',
  '2026-04-25',
  null,
  'Imported from Completed sheet'
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
  '41ea000d-c21d-504c-96f3-8d128a886b70',
  '65b42b9b-212c-5503-86ab-8eeb5991eed6',
  null,
  pp.id,
  8,
  8,
  true,
  'paynow',
  coalesce(250::numeric, pp.amount_sgd),
  '2026-05-17',
  '2026-11-17',
  null,
  'Imported from Completed sheet'
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
  '24ec43c5-19cc-53c0-afa9-45f90dd88a80',
  'c0115c92-c272-5386-afe8-32636846d9ae',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-05-17',
  '2026-11-17',
  null,
  'Imported from Completed sheet'
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
  'c75fbc3a-0f5d-5315-9f16-eb11d0ade2ec',
  '131a438f-183b-5a1a-a9ad-9f35c17f18c2',
  null,
  pp.id,
  8,
  8,
  true,
  'paynow',
  coalesce(250::numeric, pp.amount_sgd),
  '2026-03-14',
  '2026-09-14',
  null,
  'Imported from Completed sheet'
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
  '0eb85a99-667a-583c-a657-9f1754903f07',
  'dec36253-6004-555b-bb94-777217372500',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-05-10',
  '2026-11-10',
  null,
  'Imported from Completed sheet'
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
  '2def9ac3-54a1-5606-a6ab-5acf75cea6e6',
  'f4eb1af3-5dfe-51d3-a6c5-bf36b1987c7b',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-02-22',
  '2026-08-22',
  null,
  'Imported from Completed sheet'
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
  '56c17108-ad0a-5ce3-8089-150dc7d96587',
  'f4e90f45-6677-58a7-af01-0f93046d1b5f',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-07-11',
  '2027-01-11',
  null,
  'Imported from Completed sheet'
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
  '8e350f4f-2f24-5ed3-8cd3-4dcb965be4cb',
  '500f980c-0f06-5430-a8a8-811faffb4b87',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-04-18',
  '2026-10-18',
  null,
  'Imported from Completed sheet'
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
  'b081fa03-2087-5200-9d12-480d955037d9',
  '5c1474e6-00b6-5498-b124-3f8d5b12f90e',
  null,
  pp.id,
  8,
  8,
  true,
  'paynow',
  coalesce(250::numeric, pp.amount_sgd),
  '2026-03-22',
  '2026-09-22',
  null,
  'Imported from Completed sheet'
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
  '0f177406-8dee-5a02-8bb2-40bdbb6ac049',
  '07f24621-6939-5c24-b259-04e257029a1c',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(400::numeric, pp.amount_sgd),
  '2026-03-22',
  '2026-09-22',
  null,
  'Imported from Completed sheet'
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
  'c9725f67-8161-56d6-a105-aad6d0cfed67',
  '07f24621-6939-5c24-b259-04e257029a1c',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(400::numeric, pp.amount_sgd),
  '2026-07-04',
  '2027-01-04',
  null,
  'Imported from Completed sheet'
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
  '3471359f-a011-5923-b2a4-ea19ceb30a94',
  '9102cbfd-504c-51ed-8c9d-547448a57533',
  null,
  pp.id,
  8,
  8,
  true,
  'paynow',
  coalesce(250::numeric, pp.amount_sgd),
  '2026-04-18',
  '2026-10-18',
  null,
  'Imported from Completed sheet'
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
  '827e9782-6d9e-5ccc-8f1d-57b7c9f10749',
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
  null,
  'Imported from Completed sheet'
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
  '78ac1ad1-23ff-50dd-a1ab-baee7277ceaa',
  'a35c2e9e-1ac0-5792-8ce0-ec16d0525f4d',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-04-26',
  '2026-10-26',
  null,
  'Imported from Completed sheet'
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
  '4c88f2d7-9751-55e0-a937-1660a94f10a4',
  '467a37df-bcc3-5696-963e-343d3bd16da1',
  null,
  pp.id,
  4,
  4,
  true,
  'paynow',
  coalesce(130::numeric, pp.amount_sgd),
  '2026-07-12',
  '2027-01-12',
  null,
  'Imported from Completed sheet'
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
  '30181ca9-3432-511b-bf59-c5836cbaeaf3',
  '99d6a672-7e8e-5b0a-8ff2-82f4b8388f57',
  null,
  pp.id,
  3,
  3,
  true,
  'paynow',
  coalesce(840::numeric, pp.amount_sgd),
  '2025-09-14',
  '2026-03-14',
  null,
  'Imported from Completed sheet'
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
  'b746f62f-bbe7-5b7e-bd34-7a39b8b733ca',
  'd4f5ae9c-6f04-5c21-b78c-5cfa3f5f5222',
  null,
  pp.id,
  6,
  6,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-12-21',
  '2026-06-21',
  null,
  'Imported from Completed sheet'
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
  '3c3bc6a4-5c28-5bba-ace1-d4015c915df2',
  'ba3683c0-7a78-55df-b40e-c602a061f8cb',
  null,
  pp.id,
  4,
  4,
  true,
  'paynow',
  coalesce(130::numeric, pp.amount_sgd),
  '2025-12-13',
  '2026-06-13',
  null,
  'Imported from Completed sheet'
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
  '8ecb11d5-b58c-5e75-b4c9-f9bd486711fd',
  '74e92e78-6b40-512b-93e9-14db99ccb24e',
  null,
  pp.id,
  2,
  2,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2025-09-07',
  '2026-03-07',
  null,
  'Imported from Completed sheet'
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
  'bbf9f083-a6a2-5fd1-bb1a-5152b83bdfab',
  'a4533af5-ff21-5857-bd7d-3cf4a72c67e9',
  null,
  pp.id,
  5,
  5,
  true,
  'paynow',
  coalesce(400::numeric, pp.amount_sgd),
  '2025-11-15',
  '2026-05-15',
  null,
  'Imported from Completed sheet'
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
  'bb0a9d43-3843-559e-a69d-255c8704e00d',
  '838c28cf-3b3e-524e-bedb-0e5b22c3fb3a',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-06-27',
  '2026-12-27',
  null,
  'Imported from Completed sheet'
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
  '083008f7-89bb-5541-b572-82d960a7545e',
  '86c6c8d2-fded-55ee-ae84-722d5f2fe922',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(400::numeric, pp.amount_sgd),
  '2026-07-17',
  '2027-01-17',
  null,
  'Imported from Completed sheet'
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
  '0f6e77af-9168-5907-b7ad-4f0f1817a4fb',
  '939d554c-1b75-5eff-93e8-31651f136bf5',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-06-20',
  '2026-12-20',
  null,
  'Imported from Completed sheet'
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
  'efc4ae3c-d8af-5620-aa6c-0f53a95163f5',
  'edab7c99-2efd-59df-8a64-fc8e7fe3e2c3',
  null,
  pp.id,
  8,
  8,
  true,
  'paynow',
  coalesce(250::numeric, pp.amount_sgd),
  '2026-06-21',
  '2026-12-21',
  null,
  'Imported from Completed sheet'
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
  'c6f5615c-6a3a-543d-b7fd-ef44a06bfb90',
  '4a809aca-6972-5f99-ab92-235c16d830f4',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(400::numeric, pp.amount_sgd),
  '2026-05-29',
  '2026-11-29',
  null,
  'Imported from Completed sheet'
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
  '71c51c4f-4abf-524d-bcfa-b395a4185d2d',
  'ca01241f-d00f-5cd8-bb34-3ffcb4d69f75',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-07-05',
  '2027-01-05',
  null,
  'Imported from Completed sheet'
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
  '5d60e2e9-0a4b-50cb-950a-ac107a2f1bd2',
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
  'Imported from Completed sheet'
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
  '9a5d4502-6962-5904-9903-43d71ce4c315',
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
  null,
  'Imported from Completed sheet'
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
  '249b21af-e865-5242-ab19-34c62d02f5f3',
  '86001e6a-51d9-58e0-8d26-74ddc0d9552d',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-05-29',
  '2026-11-29',
  null,
  'Imported from Completed sheet'
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
  '271900d1-20c7-541e-836b-944a140c1a00',
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
  'Imported from Completed sheet'
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
  '076dc6fd-8d12-53a7-a294-8eb6036080f5',
  '7d979815-eb6a-50b7-81ad-9408a6cb97e1',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(350::numeric, pp.amount_sgd),
  '2026-07-11',
  '2027-01-11',
  null,
  'Imported from Completed sheet'
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
  '879ff60e-8cb1-5e0a-9f2e-37fadaa6595f',
  '39315e6c-e81c-578e-bde7-17054f4567cc',
  null,
  pp.id,
  12,
  12,
  true,
  'paynow',
  coalesce(400::numeric, pp.amount_sgd),
  '2026-05-10',
  '2026-11-10',
  null,
  'Imported from Completed sheet'
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

-- Shared package members
insert into package_students (package_id, student_id)
values ('6b64cf7c-17b1-5603-9fb3-1a2aa9ef3085', '07f24621-6939-5c24-b259-04e257029a1c')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('3a267b99-9755-50e6-86ab-024c4422ed02', '86c6c8d2-fded-55ee-ae84-722d5f2fe922')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('3a267b99-9755-50e6-86ab-024c4422ed02', '0ce72b10-67b0-5cba-832b-e5104038bf11')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('d3c3eda2-7db3-519c-94cf-af089f6a203e', '4a809aca-6972-5f99-ab92-235c16d830f4')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('a0a3d436-2fe7-58f5-b1ed-1247601dfcda', '9102cbfd-504c-51ed-8c9d-547448a57533')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('aec6fdf1-7d42-5a43-a5f2-cffe09d1b59b', 'ca01241f-d00f-5cd8-bb34-3ffcb4d69f75')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('188eed1c-d2e3-592a-a10c-2a11a0a6ebea', 'b40d3da8-7828-59ab-86b7-78dee782361c')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('e4e4ce1b-b1da-552b-aa95-74acd9cb780f', '536283ea-0e83-5d63-beb9-c7254cdab496')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('abf9292c-a4dc-549f-9b72-5199e4922e5d', '9f786380-be24-5f9e-bbec-c1859b19f45e')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('0062f0d0-d662-56ea-8489-8405e72df7e4', '9102cbfd-504c-51ed-8c9d-547448a57533')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('fe906212-b389-546d-ad76-50c19de44231', 'dec36253-6004-555b-bb94-777217372500')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('fe906212-b389-546d-ad76-50c19de44231', '2bbe1caf-50a3-5ce6-b890-60e74834d90a')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('8e1ffe54-efaa-5020-a5f5-d8e5d66d7871', 'ca01241f-d00f-5cd8-bb34-3ffcb4d69f75')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('8d5a6571-9b54-5e27-a654-20abea29c2c0', '39315e6c-e81c-578e-bde7-17054f4567cc')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('68bc25f9-e714-5920-8d82-29ea960be121', 'ba3683c0-7a78-55df-b40e-c602a061f8cb')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('ce8527a2-b6d2-56af-b506-52daa9c0d440', '8a424d3f-0cce-5a87-a8a5-87aa1e69b8d3')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('69474b96-4e9e-58c2-b7eb-ef5722152495', '58935cd0-f087-560e-a5a8-b3c9b39ee4a9')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('8e43ae12-2c41-5d44-a0d6-591d4163d133', '9f90ea5a-4386-52fe-8761-3439a9013d35')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('f18c1450-9dd3-5b0f-8170-c42aae9849ed', 'bebee322-ab28-55ee-9ca5-2a2775788d17')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('420c2207-7cb7-590a-8cb5-cad47cb656d6', '08a5ac3c-8d19-532c-94e6-5cb9211709a2')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('420c2207-7cb7-590a-8cb5-cad47cb656d6', 'a291d52f-ff12-5f2d-9def-344d153a5b3b')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('4a6c476f-39bb-5ad9-978e-b2af9ace5e6a', '65b42b9b-212c-5503-86ab-8eeb5991eed6')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('e038a066-9d97-5003-a9fd-5d62cde42d7f', '6d1f7c08-bc25-55d1-b6bd-13b0e2b02153')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('e038a066-9d97-5003-a9fd-5d62cde42d7f', 'f63c1adf-2627-55e9-b93c-e95534e135ac')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('466dbb38-06f2-5c11-8e95-085fea398373', '86001e6a-51d9-58e0-8d26-74ddc0d9552d')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('10f82f49-e480-5156-96f3-d7aff4832c36', '6786963f-b646-59bd-b35b-631ce2cc92f0')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('10f82f49-e480-5156-96f3-d7aff4832c36', '396f444c-578e-5291-b907-205c355b5d76')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('28cdd2e4-1f76-5771-9e0f-8cdc324aa669', 'edab7c99-2efd-59df-8a64-fc8e7fe3e2c3')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('28cdd2e4-1f76-5771-9e0f-8cdc324aa669', 'b1a6b41b-a55f-5f64-b47f-cd0a22391d8a')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('28cdd2e4-1f76-5771-9e0f-8cdc324aa669', 'c09ad1ac-dfb1-5652-b5b3-ff3265b381d5')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('93a150d3-5cd8-5698-aeca-cb5c9eb43f0f', '6d1f7c08-bc25-55d1-b6bd-13b0e2b02153')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('93a150d3-5cd8-5698-aeca-cb5c9eb43f0f', 'f63c1adf-2627-55e9-b93c-e95534e135ac')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('8aaa3d66-fb97-5667-95be-5cd98fda7cb6', '2e0ff969-73df-56cb-a49b-044e114718a2')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('709478f9-128e-57a6-9fff-d07325e6858e', 'dd1cb11e-9995-5ec8-bfd8-4eab90fa61e7')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('79e9560a-3e46-55c6-9f42-3c9ea76039fe', 'ddb652aa-9813-5814-af9a-a46bf6125221')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('79e9560a-3e46-55c6-9f42-3c9ea76039fe', '34764c05-7573-5b6b-81cb-f0b02cbfd575')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('9ca58bb2-15ca-543b-a121-4766120795eb', 'bcb04641-9f76-5def-a479-3e5022014e05')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('85bf622d-ad3b-5f09-a951-848fa0da55d1', 'f8d7ab1e-bd2b-5d12-acb7-b5d802ac7edc')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('4aba5cdf-2c51-5d69-8313-6cdbb059dbea', '961bf86d-1cad-5b91-8347-e016cd3bc87e')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('4aba5cdf-2c51-5d69-8313-6cdbb059dbea', 'f8fb1ead-aa73-5647-ad90-7e81f4c228d3')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('aacb65f4-3b3a-5ce8-bdbb-6ad31992b3e5', '398211ff-7d00-58ab-a7f4-b41b1e8ce24c')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('aacb65f4-3b3a-5ce8-bdbb-6ad31992b3e5', 'd11805d2-0174-55d8-8571-a05de059310b')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('a5df213b-b93c-5f11-9193-81766ac21c90', 'ce96f634-cf9d-5bd6-9089-aa0a88dfa4a8')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('a5df213b-b93c-5f11-9193-81766ac21c90', 'a5a4c55d-91ce-5710-87e6-aa1b92ef7c85')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('373b8d55-586f-59e2-84fb-d28a2f9a2b07', '27865e02-b37f-5de6-ba0c-d4f08c2822e2')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('b507aac7-188e-5501-9dc8-9bed559268fc', '10dc5238-c6fb-5500-b95c-b76c884433bd')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('c6e725e7-4d31-5494-99ec-9a6a7cf6ba6c', '500f980c-0f06-5430-a8a8-811faffb4b87')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('26fe746c-4cda-59a0-a388-ed98832e71ab', 'e7017111-2be6-5776-a936-ab311d40efae')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('bb44600f-0369-570c-80e1-d8cdc42a263e', 'c8d94aa0-9573-5376-b9ec-dd53baa34f13')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('1a9a5332-4d3a-5ace-bb4e-f18cd140f8e5', '413d52e1-0d25-5c3f-8f75-9d0ddef9ded8')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('c9a1b95d-9daa-5193-9e7e-bb5b5ea807e3', 'ce210fdd-8429-576e-93a4-0e6146ba52a9')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('5e62cee3-1720-5974-97b6-2dab976d72c8', 'd21c2c5b-db38-5336-8c9b-2ffc60883d51')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('2e85870b-0a7b-5e4a-af74-373b8b45beba', '4543bbf1-7505-56c3-8016-070fb0754061')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('35a4ff66-3650-57e0-a295-07efb94605d8', '42103bec-1470-545e-a1eb-29097175a97e')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('138635f2-7dab-5752-9d7e-07d0830d7e08', 'deeb6e79-a24d-5ac7-abcc-811731366f98')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('10fc7b5d-a4a2-5fa3-bf6d-e1d550c21f44', '2b693e72-ee54-5204-9a13-48a407627485')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('0f802d6c-5549-5a71-899a-948ce1a2489c', '8fd7aced-0f86-503e-81fa-894e66149449')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('039cc7e8-9922-57ab-8cb9-c37874c577fd', 'a1249f47-6d61-5d37-b5d4-eb790ab43421')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('f13e531d-7439-5bb0-90cf-6a4fc9d40316', '5c1474e6-00b6-5498-b124-3f8d5b12f90e')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('1f9eb8a7-e82f-5870-a8d7-ec3e2a2f4185', '86c6c8d2-fded-55ee-ae84-722d5f2fe922')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('1f9eb8a7-e82f-5870-a8d7-ec3e2a2f4185', '0ce72b10-67b0-5cba-832b-e5104038bf11')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('226f396f-3528-55d0-b1bc-e85f3aab94da', '6cb65c9a-ad30-512c-966a-38e357ac7263')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('2a5604bf-0f50-57a9-b179-3039c9db1c2e', 'f4e90f45-6677-58a7-af01-0f93046d1b5f')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('1325664a-77c2-5f94-9c2d-2b39e8a13c22', '78b2c11a-6dc4-52c4-a2ec-5e082059b477')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('12d63133-e1dd-561c-99b5-03954b1abbce', '0906176d-858a-5b51-b1c3-f7339bb3c433')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('12d63133-e1dd-561c-99b5-03954b1abbce', 'd221b67d-ad56-5acc-9130-908d54015ee8')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('e41e9f3e-73a1-5235-af51-99d5ea225f6f', '14caf9c3-de66-5842-b116-62aa10cf7940')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('fd49b69e-5213-5ea4-9e0c-88a40242ed7c', '9f90ea5a-4386-52fe-8761-3439a9013d35')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('4fc386a2-4633-52c1-939a-cc5a40f18d28', '6786963f-b646-59bd-b35b-631ce2cc92f0')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('4fc386a2-4633-52c1-939a-cc5a40f18d28', '396f444c-578e-5291-b907-205c355b5d76')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('7eb4a054-5df0-58fd-a006-5a32a76a9c07', 'db9a6afa-72f8-5d1a-b8a2-fb024ccd08d9')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('fa186c10-4806-524d-a332-453b0f2fd353', '8a424d3f-0cce-5a87-a8a5-87aa1e69b8d3')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('df7276ea-6822-598e-9ca8-b9b57986c37f', '4a809aca-6972-5f99-ab92-235c16d830f4')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('2a7eb7da-ee68-5af8-90c3-0a5a6cbfb90a', '2e0ff969-73df-56cb-a49b-044e114718a2')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('2a7eb7da-ee68-5af8-90c3-0a5a6cbfb90a', '5c9fd449-adbc-5238-af69-b7c7d7650bd1')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('ab35a21c-1a07-5904-bc73-171a6c500f2a', '27865e02-b37f-5de6-ba0c-d4f08c2822e2')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('7cb7ed5c-579e-5775-aa85-8f61fd4e5f8d', '9d2fc771-4f9a-5177-be64-c0d3892e01ea')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('7cb7ed5c-579e-5775-aa85-8f61fd4e5f8d', '78260d36-67c5-5a23-ba34-396aa6b241e3')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('37bbc99e-0ca6-5cc6-9c58-cce3aae09537', '7bf353e6-18ea-5526-8db7-bb3175f6db3f')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('a829504c-341d-5c22-8db8-e382825ed726', '9f267c85-c404-59ec-aacc-dfa2d35fd752')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('a829504c-341d-5c22-8db8-e382825ed726', '07d610f2-6ecb-59a9-bcdd-703b91fb4b52')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('8e2c9edb-cc99-576f-b13c-f8ea993c5b41', 'f4eb1af3-5dfe-51d3-a6c5-bf36b1987c7b')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('b3a2bb29-2498-5f59-b8a5-ac5034657cff', '39315e6c-e81c-578e-bde7-17054f4567cc')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('3c826cfe-c8a0-5efe-8b2f-7223fd7cc096', '0c96497c-a7f3-5942-8cc7-76265648b942')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('29f4f737-5715-544e-9fea-2c5881787c8e', '0743ba7a-fd8b-5299-a77d-ef9ce7c02ba1')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('05d55e04-52e8-5ba7-8367-9f29df1ca09c', '8a424d3f-0cce-5a87-a8a5-87aa1e69b8d3')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('973fd686-e347-5733-8161-47f8e30c0dd6', '838c28cf-3b3e-524e-bedb-0e5b22c3fb3a')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('df44ad79-5667-5862-8363-373c85793758', '9f90ea5a-4386-52fe-8761-3439a9013d35')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('8e4f3e8f-e6d6-5229-8c80-66096a5e2e1b', '2d4fcf64-fa0e-54c1-b989-9d48ad78be56')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('5ffb6b58-9f5e-5e3e-bdcd-f589e32bae26', '6d1f7c08-bc25-55d1-b6bd-13b0e2b02153')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('5ffb6b58-9f5e-5e3e-bdcd-f589e32bae26', 'f63c1adf-2627-55e9-b93c-e95534e135ac')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('a3955e19-fe8a-564e-ace0-68ded56e0280', 'bebee322-ab28-55ee-9ca5-2a2775788d17')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('0bc62d17-2e98-5609-84f6-1c58b357d20c', '4af63a5d-9480-5070-b7ea-67069c2196ed')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('051d4f10-65a0-5f01-ac34-eb3b5acf507a', '9102cbfd-504c-51ed-8c9d-547448a57533')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('ac4f76e8-c28a-55bf-93fa-5750f62fe142', '42b6f9a7-3f23-5dd0-831b-cf3640784ca7')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('29794b60-bd00-52db-b718-753c764867d6', '5c1474e6-00b6-5498-b124-3f8d5b12f90e')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('4370b248-d4c6-50ca-8d17-64ca9d82cecd', '6ff4cc36-6472-5056-a11f-9930a5f991e7')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('e114d85f-4214-5e50-b7ad-258c567bd7bf', '86001e6a-51d9-58e0-8d26-74ddc0d9552d')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('5c85970f-8aeb-5d40-9868-54643664dbdb', 'feb22150-e140-559d-8076-67f78ca92aa9')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('5c85970f-8aeb-5d40-9868-54643664dbdb', 'cb35de48-9276-5b00-b92a-ce2a399b812c')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('5e1ce88b-d7bd-53f8-8114-90696b4a498c', '6c48f544-b1a5-5b0d-86f9-998c0a82c295')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('5e1ce88b-d7bd-53f8-8114-90696b4a498c', '4267d084-6387-5abf-8a4d-8c71aa08e8d9')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('3d445529-b3eb-5ac8-b9c7-bd9c1df453e2', '8d1c0841-2d61-57ac-a370-323ce6d177a5')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('258bbba5-085a-5cad-a5f9-fe4410353e05', '47da8d91-84c7-5ca1-ae70-1148dd55b9d6')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('208c3683-3ec3-505f-b9a2-2733e295fe01', '14035a7b-ecbc-5b82-a7db-39161cfaf96d')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('6e8ccc01-8fd6-52e2-af9c-054e4f565e7a', 'bc6a2063-aa26-535c-873d-843aeef21ae3')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('6e8ccc01-8fd6-52e2-af9c-054e4f565e7a', '261cafd2-5a72-5678-a551-55c897f78988')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('6e8ccc01-8fd6-52e2-af9c-054e4f565e7a', '7d979815-eb6a-50b7-81ad-9408a6cb97e1')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('125ae35f-2ae9-5191-b028-5d21567c87b0', 'e6db77d2-0e23-5740-b1c4-fe56c82c0ec1')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('125ae35f-2ae9-5191-b028-5d21567c87b0', '21c4d44b-dc09-5ba0-be87-21597d61a40d')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('0a18d508-efba-5bb5-9a64-a60913fcdfa4', '25b7c6e0-2e65-599e-8dd9-bbf2bd207fb1')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('dd81cfbc-7310-5ef3-8fe0-6d178fbb7fc0', '4543bbf1-7505-56c3-8016-070fb0754061')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('3695abe6-3f4e-54cb-81c4-55d41565b5ae', 'dec36253-6004-555b-bb94-777217372500')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('3695abe6-3f4e-54cb-81c4-55d41565b5ae', '2bbe1caf-50a3-5ce6-b890-60e74834d90a')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('92d6f65c-0287-574d-a7e0-03a88af1d2f7', '07e718de-73b2-5b91-ad3e-fd6f0824bf3b')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('df5ea99c-b2de-501a-b10a-19bdc0261056', 'f8fd1e4e-de4b-5dfa-9078-aa0e112afcf4')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('d00e7e41-056d-516a-9566-bece4cb3cc46', '7b0081c9-f798-5a4c-a619-3ba10f402f90')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('4107f2ba-a173-5baf-822d-360819678cf1', '74601412-1ce3-57bc-bdc0-f5c98d76892a')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('1d0749e7-4233-5d7d-8432-ff30f940042b', '6c622d2f-528a-5b8a-b088-eef78d8801c3')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('5f7ec9ba-17bd-5a7f-b867-7d4a20b620ed', 'c0f7adf1-a130-56d6-8db3-b447dc30a243')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('fecfcb47-6600-51de-a44a-7b61ab69bdf7', '07f24621-6939-5c24-b259-04e257029a1c')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('96f08f44-79d9-5c2f-ba46-6db6fa5b9e96', '14caf9c3-de66-5842-b116-62aa10cf7940')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('defabf9d-1f05-588e-90f0-57f945adb5a2', '25b7c6e0-2e65-599e-8dd9-bbf2bd207fb1')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('9f6c8bc1-7f12-5ec6-86f9-1c3049435352', '65b42b9b-212c-5503-86ab-8eeb5991eed6')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('f179bb76-8085-5738-90b3-fbb7f09e415f', '2b693e72-ee54-5204-9a13-48a407627485')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('b03b68b7-ad8d-5a4d-b15e-2e7fab14c8ca', '841cef55-098c-59d2-9b25-240e27a8a468')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('9cf97d67-f678-54c8-88c5-842fcf099fee', '4a809aca-6972-5f99-ab92-235c16d830f4')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('4c36991a-8b3d-5cdd-8b33-ef5063201352', '86c6c8d2-fded-55ee-ae84-722d5f2fe922')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('4c36991a-8b3d-5cdd-8b33-ef5063201352', '0ce72b10-67b0-5cba-832b-e5104038bf11')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('e65d8b3c-beb2-59cf-ad8e-dab393c8a76c', '536283ea-0e83-5d63-beb9-c7254cdab496')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('5dafae3b-9df1-5f3f-98ff-bae83ee48b8d', 'f4e90f45-6677-58a7-af01-0f93046d1b5f')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('84820633-407c-5cec-b4d9-e8292146f801', '5c1474e6-00b6-5498-b124-3f8d5b12f90e')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('66ab36f7-ca2b-5171-a5f4-516fd303c2cb', 'c8d94aa0-9573-5376-b9ec-dd53baa34f13')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('74a829dc-844a-54f2-8a75-64e24a4d1ac7', '9f90ea5a-4386-52fe-8761-3439a9013d35')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('41ca41c9-e2bf-50c7-b2a4-43be1d764fe3', '58935cd0-f087-560e-a5a8-b3c9b39ee4a9')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('9438759b-25cd-5e65-83b1-3353d784b722', 'e3f802c4-e5ed-55da-b17b-f1281e7e0993')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('9438759b-25cd-5e65-83b1-3353d784b722', '4d3abb18-541b-54b1-8627-8a999338c6de')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('47baaa80-ea9a-50f5-8dd9-e9360d5481b1', 'edab7c99-2efd-59df-8a64-fc8e7fe3e2c3')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('47baaa80-ea9a-50f5-8dd9-e9360d5481b1', 'b1a6b41b-a55f-5f64-b47f-cd0a22391d8a')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('47baaa80-ea9a-50f5-8dd9-e9360d5481b1', 'c09ad1ac-dfb1-5652-b5b3-ff3265b381d5')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('7d468e53-0668-5335-a2f2-fdce2125c542', 'f8fd1e4e-de4b-5dfa-9078-aa0e112afcf4')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('62682453-811c-5ef4-91da-78d2e1b8d88e', '0be0d355-17a7-5fbb-a294-dc249bd30d89')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('2a76a029-c93a-5772-855f-254bed6202e2', 'bebee322-ab28-55ee-9ca5-2a2775788d17')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('2a76a029-c93a-5772-855f-254bed6202e2', 'e908349b-175b-5450-9704-a8ae6af848cc')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('4c800493-d440-5d47-aa50-14e0af629b05', 'c6523aa7-388b-5e84-abfb-008023c9a526')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('f574f0a4-dd60-5af7-925a-aee515767e69', '30b506df-dd6a-5046-82e3-65c40778e88b')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('59e376fc-a402-5494-8616-13dfeb703b24', '86001e6a-51d9-58e0-8d26-74ddc0d9552d')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('8bd6edf6-3a03-5616-88c9-f1d88cd10186', '27865e02-b37f-5de6-ba0c-d4f08c2822e2')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('bacafcc5-c681-5a52-9c6e-a37a7e767fd6', 'b8bd41d5-52e7-53df-9d58-d55f06b8b48e')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('c316efca-43d7-505d-a0f3-dcc7a654f00a', 'dd1cb11e-9995-5ec8-bfd8-4eab90fa61e7')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('d34934d0-6327-5062-9ee8-8469da71ef5e', '8a424d3f-0cce-5a87-a8a5-87aa1e69b8d3')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('a81b58c3-1c91-5c9c-8dd6-bd12c15dd8f4', '86c6c8d2-fded-55ee-ae84-722d5f2fe922')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('a81b58c3-1c91-5c9c-8dd6-bd12c15dd8f4', '0ce72b10-67b0-5cba-832b-e5104038bf11')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('3681e37a-2e87-5d87-bab0-52add588a2ec', 'ee27c92c-7ca0-5aab-971f-38a1f7fa19b4')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('3681e37a-2e87-5d87-bab0-52add588a2ec', '961bf86d-1cad-5b91-8347-e016cd3bc87e')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('78736160-b31f-55e4-aa7c-9fcbcdacea8d', '0906176d-858a-5b51-b1c3-f7339bb3c433')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('78736160-b31f-55e4-aa7c-9fcbcdacea8d', 'd221b67d-ad56-5acc-9130-908d54015ee8')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('902dd5b7-8128-5b16-bef9-e2b85833ac85', 'c2403d53-0e18-58fb-a1f5-1e1ebe90e3d7')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('f9d9011a-2d89-524e-ba9e-3bbdb7882956', 'cc1507a7-b4ca-5af4-9d74-988ed04ae216')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('f9d9011a-2d89-524e-ba9e-3bbdb7882956', 'f3e1a2f5-2811-5a4e-92b0-d0af4e6a6d04')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('39587596-fd0d-5742-ba54-d9b99b947c72', 'ce96f634-cf9d-5bd6-9089-aa0a88dfa4a8')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('39587596-fd0d-5742-ba54-d9b99b947c72', 'a5a4c55d-91ce-5710-87e6-aa1b92ef7c85')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('1ac60097-2cb5-5c87-826f-f1875b3d233c', 'bc6a2063-aa26-535c-873d-843aeef21ae3')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('1ac60097-2cb5-5c87-826f-f1875b3d233c', '261cafd2-5a72-5678-a551-55c897f78988')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('1ac60097-2cb5-5c87-826f-f1875b3d233c', '7d979815-eb6a-50b7-81ad-9408a6cb97e1')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('5763c1fb-6ae3-5c2c-8721-0b32f3d57d5c', '8db53ed9-233e-5572-ae15-13773d015dab')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('75f3cb8f-3c00-5546-8543-0844af4e31de', 'db9a6afa-72f8-5d1a-b8a2-fb024ccd08d9')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('b6797f77-9b40-5799-9d31-63fa66ecebc8', '8a16bcbd-9ca8-5322-8de2-be5e68f07e26')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('16bffa43-404c-5400-baa7-0aecda1bad43', '6d1f7c08-bc25-55d1-b6bd-13b0e2b02153')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('16bffa43-404c-5400-baa7-0aecda1bad43', 'f63c1adf-2627-55e9-b93c-e95534e135ac')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('101de061-30cf-54a1-afc8-cf89b0e09cdd', '42103bec-1470-545e-a1eb-29097175a97e')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('ef70ace4-2ef6-5a13-b5bc-1f2ec09a3e4c', '58935cd0-f087-560e-a5a8-b3c9b39ee4a9')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('94571585-0218-5dfb-8d85-5fb58e2b964f', '500f980c-0f06-5430-a8a8-811faffb4b87')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('7b7aa7f3-a5a7-59d0-9607-763bdcf1c1e9', '1e714eb0-ddb2-53ee-b364-db1c01cba2f5')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('7b7aa7f3-a5a7-59d0-9607-763bdcf1c1e9', '3bd56a70-acde-5a39-abd3-1a7cfbb4d69e')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('9c263516-dad1-5ba9-a748-8a0ea4a05e3c', '9102cbfd-504c-51ed-8c9d-547448a57533')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('beadd7a5-de0c-51ed-8ad9-83090657fc61', '4a809aca-6972-5f99-ab92-235c16d830f4')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('207d4b4b-4104-554d-b625-79716f4e2780', 'ce210fdd-8429-576e-93a4-0e6146ba52a9')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('acd8339f-d46c-508f-b55a-32335492ee20', 'f8fd1e4e-de4b-5dfa-9078-aa0e112afcf4')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('1de596cd-79f4-5575-bb4a-8ae488a4292b', 'ca01241f-d00f-5cd8-bb34-3ffcb4d69f75')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('f9b5a775-367c-5ec2-aee6-fb8ac85a253e', '9f786380-be24-5f9e-bbec-c1859b19f45e')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('8a1b0dc8-0876-54d9-bd14-656a8f139c7b', '049748a2-6aa7-5de7-82ca-f6aa5b759350')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('68577c96-1108-58ac-90fd-4875d550dc8c', '8fd7aced-0f86-503e-81fa-894e66149449')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('5ba80de6-2af8-5521-9b50-4d1424ebb08b', '86c6c8d2-fded-55ee-ae84-722d5f2fe922')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('5ba80de6-2af8-5521-9b50-4d1424ebb08b', '0ce72b10-67b0-5cba-832b-e5104038bf11')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('b90732f3-93f8-5ac9-bf14-f2f30a3edc10', '0906176d-858a-5b51-b1c3-f7339bb3c433')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('b90732f3-93f8-5ac9-bf14-f2f30a3edc10', 'd221b67d-ad56-5acc-9130-908d54015ee8')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('42682be4-181b-5fb7-9435-bf67876562ee', 'f4e90f45-6677-58a7-af01-0f93046d1b5f')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('3016c8b5-3039-5121-9ea0-cedfd0296434', '25b7c6e0-2e65-599e-8dd9-bbf2bd207fb1')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('3016c8b5-3039-5121-9ea0-cedfd0296434', '611e6bd6-2c73-567c-a8c6-bcdc96b26ed8')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('3016c8b5-3039-5121-9ea0-cedfd0296434', '85e66b8f-4513-557a-a4e8-58acd88edd18')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('975b148f-60ca-5cc4-8434-6b92469b92cd', '47da8d91-84c7-5ca1-ae70-1148dd55b9d6')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('975b148f-60ca-5cc4-8434-6b92469b92cd', '8d1c0841-2d61-57ac-a370-323ce6d177a5')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('e720abc6-9c7f-5a2d-b507-76e5a5981ec7', '0d46ace0-d99e-5fc5-b7b4-37f388495a58')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('66d85e99-5699-5bf2-a680-e06fb8dc356c', '8971285b-6f3c-5a94-8fba-4c2d43e9997d')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('09ac2648-7d33-5f4c-9547-6a1190e599c3', '8d62ac5c-5c2f-57df-902d-af583adacca2')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('d129c3e4-7c36-5bd7-a8c9-10d7c7055cd8', '2e0ff969-73df-56cb-a49b-044e114718a2')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('00acb120-370e-5695-adcf-ca2e85cebb27', '7c821475-e585-5b83-ab67-d68fd7c3145a')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('aa032229-4b48-563d-9dc7-921eec5eac99', '39315e6c-e81c-578e-bde7-17054f4567cc')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('b77b9fe8-cefe-5728-858a-dc327c475880', '07d610f2-6ecb-59a9-bcdd-703b91fb4b52')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('ec988c86-eb47-5fc1-8f8a-0353c9417a56', '9b8c0f05-fdb9-5e60-a6d0-ae6035b65f22')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('ac00eaab-fe4e-565c-af78-f93ac0f90663', '40091cba-a4e0-5f2f-be60-77ad19b1c127')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('ca14f300-c437-5445-862d-e253f085cd07', 'db8e3ba6-ad4d-54f8-a8d2-6b27dc34e81b')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('5b3d3faa-d5d6-5b97-a03e-1f788419a859', '65b42b9b-212c-5503-86ab-8eeb5991eed6')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('d0f37931-61ee-505f-987f-e300e27d0018', 'c0115c92-c272-5386-afe8-32636846d9ae')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('d0f37931-61ee-505f-987f-e300e27d0018', 'c828b433-da87-5c94-909f-6080c6af2f30')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('44300d7f-71a8-517e-acfc-ae90d1d0075c', '10dc5238-c6fb-5500-b95c-b76c884433bd')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('56e6b820-9c5f-5f17-addf-8ae1a646c80b', 'dec36253-6004-555b-bb94-777217372500')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('56e6b820-9c5f-5f17-addf-8ae1a646c80b', '2bbe1caf-50a3-5ce6-b890-60e74834d90a')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('4a8829d0-71da-59b5-8025-53926ef48a63', 'c585c8cc-0cc2-57ed-8c4c-ed167c8d54a2')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('8e4ae86b-c9c1-5b83-9e83-f3ab630731e5', 'feb22150-e140-559d-8076-67f78ca92aa9')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('8e4ae86b-c9c1-5b83-9e83-f3ab630731e5', 'cb35de48-9276-5b00-b92a-ce2a399b812c')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('455ad871-33ce-5859-9e58-a746e814b420', '4a809aca-6972-5f99-ab92-235c16d830f4')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('a7905bda-31d4-521f-a840-ca07441daa9c', '27865e02-b37f-5de6-ba0c-d4f08c2822e2')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('fe6b79f0-08c3-5e23-8b58-b276e3a4946b', '2b693e72-ee54-5204-9a13-48a407627485')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('de259597-36b7-5a8c-86b6-2b55f6aeb168', '0be0d355-17a7-5fbb-a294-dc249bd30d89')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('a8e61f9d-aa39-5883-b65b-90903b61c736', '86c6c8d2-fded-55ee-ae84-722d5f2fe922')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('a8e61f9d-aa39-5883-b65b-90903b61c736', '0ce72b10-67b0-5cba-832b-e5104038bf11')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('96e08489-b746-57ae-a8e2-623f01718f80', '8a424d3f-0cce-5a87-a8a5-87aa1e69b8d3')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('fb3f1fc0-4631-5267-996f-4a3d99a95b89', '86001e6a-51d9-58e0-8d26-74ddc0d9552d')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('d67e8ac1-11d6-587f-be47-895cfe658d17', '6c48f544-b1a5-5b0d-86f9-998c0a82c295')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('d67e8ac1-11d6-587f-be47-895cfe658d17', '4267d084-6387-5abf-8a4d-8c71aa08e8d9')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('80c0f52c-22cf-5110-94e2-46567e381d16', '0906176d-858a-5b51-b1c3-f7339bb3c433')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('80c0f52c-22cf-5110-94e2-46567e381d16', 'd221b67d-ad56-5acc-9130-908d54015ee8')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('1959ea69-b3f4-52bc-8c61-69de4b01fe5b', 'edab7c99-2efd-59df-8a64-fc8e7fe3e2c3')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('de5fef28-5ef8-5c51-ad90-13063c1844de', 'f8fd1e4e-de4b-5dfa-9078-aa0e112afcf4')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('a7bb9c86-db65-5bcb-b655-6d1c04aaadd2', '4af63a5d-9480-5070-b7ea-67069c2196ed')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('ff82204f-fe08-566c-bcfa-b627a40b6074', '7bf353e6-18ea-5526-8db7-bb3175f6db3f')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('204a880d-c175-5e9c-bc95-d0f386cd35a1', 'bcb04641-9f76-5def-a479-3e5022014e05')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('fe4a9433-2ce5-5dcc-ab66-e5761b16e851', 'f8d7ab1e-bd2b-5d12-acb7-b5d802ac7edc')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('79c72f34-7fc5-5136-8e72-e7a72bb2e40b', 'bebee322-ab28-55ee-9ca5-2a2775788d17')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('bc8769e0-ab9f-5679-8a94-b36e4669c606', 'e3f802c4-e5ed-55da-b17b-f1281e7e0993')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('bc8769e0-ab9f-5679-8a94-b36e4669c606', '4d3abb18-541b-54b1-8627-8a999338c6de')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('a4c4f9e6-76ab-573e-8acc-b31e846c1290', '5c9fd449-adbc-5238-af69-b7c7d7650bd1')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('5d97c2c9-eacc-5601-ac4b-9d535b268163', '939d554c-1b75-5eff-93e8-31651f136bf5')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('cf168497-09df-5c80-a990-1fddd5f9aa12', '838c28cf-3b3e-524e-bedb-0e5b22c3fb3a')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('796ca7a1-32b9-5791-84e0-7b8e93f94b81', 'd86c6e02-39ff-53f2-925a-d3c03dc3db94')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('df380e9b-6cdc-5fce-910b-a271d9737bd8', 'b8bd41d5-52e7-53df-9d58-d55f06b8b48e')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('86f5ba5e-1df2-510a-8e27-c57813c9119e', '2d4fcf64-fa0e-54c1-b989-9d48ad78be56')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('d349f81e-406b-5fa8-83f7-18bc61fc9aea', '6d1f7c08-bc25-55d1-b6bd-13b0e2b02153')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('d349f81e-406b-5fa8-83f7-18bc61fc9aea', 'f63c1adf-2627-55e9-b93c-e95534e135ac')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('c97b3db3-b17a-5ec1-a094-62d570fd84cd', 'f4e90f45-6677-58a7-af01-0f93046d1b5f')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('a2a02626-ca26-51be-b57c-a07c096ad734', '841cef55-098c-59d2-9b25-240e27a8a468')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('35bede06-9a04-52eb-931e-8c5408a1a06c', '2b693e72-ee54-5204-9a13-48a407627485')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('aa4fdab7-fa80-51ad-8c73-c29a273d824f', 'ca01241f-d00f-5cd8-bb34-3ffcb4d69f75')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('aa4fdab7-fa80-51ad-8c73-c29a273d824f', '714993dc-52d5-52f7-bdd0-e511292a1d2e')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('1449d7c9-d362-5ed1-9c05-a97211f28ac7', '78b2c11a-6dc4-52c4-a2ec-5e082059b477')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('1d6f9fb8-8e91-5123-901c-f2cdaa0b6040', 'e6db77d2-0e23-5740-b1c4-fe56c82c0ec1')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('1d6f9fb8-8e91-5123-901c-f2cdaa0b6040', '21c4d44b-dc09-5ba0-be87-21597d61a40d')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('692d52de-d08f-5ac8-8c65-e88bd167a90b', 'bc6a2063-aa26-535c-873d-843aeef21ae3')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('692d52de-d08f-5ac8-8c65-e88bd167a90b', '261cafd2-5a72-5678-a551-55c897f78988')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('692d52de-d08f-5ac8-8c65-e88bd167a90b', '7d979815-eb6a-50b7-81ad-9408a6cb97e1')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('f479ddb6-6556-58c7-8dbc-1d7a0d31145b', '42103bec-1470-545e-a1eb-29097175a97e')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('635b0195-75a5-5cd1-ad70-b7b8904d0045', '14caf9c3-de66-5842-b116-62aa10cf7940')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('86a5c275-5c7e-5e13-a84d-71b5c48bfcb7', '536283ea-0e83-5d63-beb9-c7254cdab496')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('ff93762a-77ec-5a32-8cf2-f076bbb1896f', '07e718de-73b2-5b91-ad3e-fd6f0824bf3b')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('49afe47e-3faa-5419-97fd-34b9f5aa6e8b', 'c8d94aa0-9573-5376-b9ec-dd53baa34f13')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('47fc2489-ae90-59d8-87d5-30e4e625fff3', 'c0f7adf1-a130-56d6-8db3-b447dc30a243')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('cbd182fb-fc7b-5a3d-9859-fad6611c350b', 'f1d6314e-3be5-5019-b5fc-3fac450ede11')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('cbd182fb-fc7b-5a3d-9859-fad6611c350b', '5197879b-9eb7-5c61-b251-63205c74c49e')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('3fee5c77-ebc2-568b-8a68-5f76a262963d', '13e7bb73-667b-5503-a0e1-d919462be3d7')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('b27b3190-caa8-53ab-8f18-7faa9111ffdb', '86c6c8d2-fded-55ee-ae84-722d5f2fe922')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('b27b3190-caa8-53ab-8f18-7faa9111ffdb', '0ce72b10-67b0-5cba-832b-e5104038bf11')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('2f4187b5-a41f-5894-bf52-2ec3cee6133d', 'ba20e5a2-1434-565f-bdb1-f2794475af2f')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('37ce2b11-0a51-5033-888f-87cb150c21eb', '3043fe89-3060-586b-ac97-d3f59a53fa35')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('41ea000d-c21d-504c-96f3-8d128a886b70', '65b42b9b-212c-5503-86ab-8eeb5991eed6')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('24ec43c5-19cc-53c0-afa9-45f90dd88a80', 'c0115c92-c272-5386-afe8-32636846d9ae')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('24ec43c5-19cc-53c0-afa9-45f90dd88a80', 'c828b433-da87-5c94-909f-6080c6af2f30')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('c75fbc3a-0f5d-5315-9f16-eb11d0ade2ec', '131a438f-183b-5a1a-a9ad-9f35c17f18c2')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('0eb85a99-667a-583c-a657-9f1754903f07', 'dec36253-6004-555b-bb94-777217372500')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('0eb85a99-667a-583c-a657-9f1754903f07', '2bbe1caf-50a3-5ce6-b890-60e74834d90a')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('2def9ac3-54a1-5606-a6ab-5acf75cea6e6', 'f4eb1af3-5dfe-51d3-a6c5-bf36b1987c7b')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('56c17108-ad0a-5ce3-8089-150dc7d96587', 'f4e90f45-6677-58a7-af01-0f93046d1b5f')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('8e350f4f-2f24-5ed3-8cd3-4dcb965be4cb', '500f980c-0f06-5430-a8a8-811faffb4b87')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('b081fa03-2087-5200-9d12-480d955037d9', '5c1474e6-00b6-5498-b124-3f8d5b12f90e')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('0f177406-8dee-5a02-8bb2-40bdbb6ac049', '07f24621-6939-5c24-b259-04e257029a1c')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('c9725f67-8161-56d6-a105-aad6d0cfed67', '07f24621-6939-5c24-b259-04e257029a1c')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('3471359f-a011-5923-b2a4-ea19ceb30a94', '9102cbfd-504c-51ed-8c9d-547448a57533')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('827e9782-6d9e-5ccc-8f1d-57b7c9f10749', '1e714eb0-ddb2-53ee-b364-db1c01cba2f5')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('827e9782-6d9e-5ccc-8f1d-57b7c9f10749', '3bd56a70-acde-5a39-abd3-1a7cfbb4d69e')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('78ac1ad1-23ff-50dd-a1ab-baee7277ceaa', 'a35c2e9e-1ac0-5792-8ce0-ec16d0525f4d')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('4c88f2d7-9751-55e0-a937-1660a94f10a4', '467a37df-bcc3-5696-963e-343d3bd16da1')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('30181ca9-3432-511b-bf59-c5836cbaeaf3', '99d6a672-7e8e-5b0a-8ff2-82f4b8388f57')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('b746f62f-bbe7-5b7e-bd34-7a39b8b733ca', 'd4f5ae9c-6f04-5c21-b78c-5cfa3f5f5222')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('b746f62f-bbe7-5b7e-bd34-7a39b8b733ca', 'f758fbae-f7c5-52cb-a5e4-e10385db5869')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('3c3bc6a4-5c28-5bba-ace1-d4015c915df2', 'ba3683c0-7a78-55df-b40e-c602a061f8cb')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('8ecb11d5-b58c-5e75-b4c9-f9bd486711fd', '74e92e78-6b40-512b-93e9-14db99ccb24e')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('bbf9f083-a6a2-5fd1-bb1a-5152b83bdfab', 'a4533af5-ff21-5857-bd7d-3cf4a72c67e9')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('bb0a9d43-3843-559e-a69d-255c8704e00d', '838c28cf-3b3e-524e-bedb-0e5b22c3fb3a')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('083008f7-89bb-5541-b572-82d960a7545e', '86c6c8d2-fded-55ee-ae84-722d5f2fe922')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('083008f7-89bb-5541-b572-82d960a7545e', '0ce72b10-67b0-5cba-832b-e5104038bf11')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('0f6e77af-9168-5907-b7ad-4f0f1817a4fb', '939d554c-1b75-5eff-93e8-31651f136bf5')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('0f6e77af-9168-5907-b7ad-4f0f1817a4fb', 'eac8bf3b-a04c-579d-9dc0-918375b0ce75')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('efc4ae3c-d8af-5620-aa6c-0f53a95163f5', 'edab7c99-2efd-59df-8a64-fc8e7fe3e2c3')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('c6f5615c-6a3a-543d-b7fd-ef44a06bfb90', '4a809aca-6972-5f99-ab92-235c16d830f4')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('71c51c4f-4abf-524d-bcfa-b395a4185d2d', 'ca01241f-d00f-5cd8-bb34-3ffcb4d69f75')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('71c51c4f-4abf-524d-bcfa-b395a4185d2d', '714993dc-52d5-52f7-bdd0-e511292a1d2e')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('5d60e2e9-0a4b-50cb-950a-ac107a2f1bd2', '58935cd0-f087-560e-a5a8-b3c9b39ee4a9')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('9a5d4502-6962-5904-9903-43d71ce4c315', '30b506df-dd6a-5046-82e3-65c40778e88b')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('249b21af-e865-5242-ab19-34c62d02f5f3', '86001e6a-51d9-58e0-8d26-74ddc0d9552d')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('271900d1-20c7-541e-836b-944a140c1a00', '645284d6-bdd8-52e4-bceb-11ba5b4fe271')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('076dc6fd-8d12-53a7-a294-8eb6036080f5', '7d979815-eb6a-50b7-81ad-9408a6cb97e1')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('076dc6fd-8d12-53a7-a294-8eb6036080f5', '261cafd2-5a72-5678-a551-55c897f78988')
on conflict do nothing;
insert into package_students (package_id, student_id)
values ('879ff60e-8cb1-5e0a-9f2e-37fadaa6595f', '39315e6c-e81c-578e-bde7-17054f4567cc')
on conflict do nothing;

commit;
