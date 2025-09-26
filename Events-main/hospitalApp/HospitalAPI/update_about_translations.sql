-- Update the About record with English and Russian translations
UPDATE About 
SET 
    titleEn = 'Azerbaijan Hepato-Pancreato-Biliary Surgeons Public Association',
    descriptionEn = 'The Azerbaijan Hepato-Pancreato-Biliary Surgeons Public Association is a scientific-public organization that brings together specialists working in the field of diagnosis and surgery of liver, biliary tract and pancreatic diseases.

The main goal of the Association is to promote knowledge and experience exchange in the HPB field, support professional development and contribute to the development of this field in the country. The Association organizes seminars, scientific conferences and training by establishing both local and international collaborations. Supporting young surgeons and specialists, implementing modern surgical methods and promoting scientific research are also among the main directions of our activities.

As the Azerbaijan HPB Surgeons Public Association, we work as a professional society to add value to the healthcare system and improve the quality of life of patients.',
    titleRu = 'Общественная Ассоциация Гепато-Панкреато-Билиарных Хирургов Азербайджана',
    descriptionRu = 'Общественная Ассоциация Гепато-Панкреато-Билиарных Хирургов Азербайджана - это научно-общественная организация, объединяющая специалистов, работающих в области диагностики и хирургии заболеваний печени, желчевыводящих путей и поджелудочной железы.

Основная цель Ассоциации - способствовать обмену знаниями и опытом в области ГПБ, поддерживать профессиональное развитие и вносить вклад в развитие этой области в стране. Ассоциация организует семинары, научные конференции и обучение, устанавливая как местное, так и международное сотрудничество. Поддержка молодых хирургов и специалистов, внедрение современных хирургических методов и продвижение научных исследований также являются одними из основных направлений нашей деятельности.

Как Общественная Ассоциация ГПБ Хирургов Азербайджана, мы работаем как профессиональное общество, чтобы добавить ценности системе здравоохранения и улучшить качество жизни пациентов.'
WHERE id = 1;
