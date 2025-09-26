import { useLanguage } from '../context/LanguageContext'

const translations = {
    aze: {
        // About page
        doctors: 'Həkimlər',
        events: 'Tədbirlər',
        aboutTitle: 'Azərbaycan Hepato-Pankreato-Biliar Cərrahlar İctimai Birliyi',
        aboutDescription: 'Azərbaycan Hepato-Pankreato-Biliar Cərrahlar İctimai Birliyi, qaraciyər, öd yolları və mədəaltı vəzi xəstəliklərinin diaqnostika və cərrahiyyəsi sahəsində fəaliyyət göstərən mütəxəssisləri bir araya gətirən elmi-ictimai təşkilatdır.\n\nBirliyin əsas məqsədi HPB sahəsində bilik və təcrübə mübadiləsini təşviq etmək, peşəkar inkişafı dəstəkləmək və ölkədə bu sahənin inkişafına töhfə verməkdir. Birlik həm yerli, həm də beynəlxalq əməkdaşlıqlar quraraq seminarlar, elmi konfranslar və təlimlər təşkil edir. Gənc cərrahların və mütəxəssislərin dəstəklənməsi, müasir cərrahiyyə metodlarının tətbiqi və elmi tədqiqatların təşviqi də fəaliyyətimizin əsas istiqamətlərindəndir.\n\nAzərbaycan HPB Cərrahları İctimai Birliyi olaraq, səhiyyə sisteminə dəyər qatmaq və xəstələrin həyat keyfiyyətini artırmaq üçün peşəkar bir cəmiyyət olaraq çalışırıq.',
        // Header navigation
        home: 'Ana səhifə',
        about: 'Haqqımızda',
        events: 'Tədbirlər',
        members: 'Üzvlər',
        gallery: 'Qalereya',
        blog: 'Bloq',
        contact: 'Əlaqə',
        joinMember: 'Üzv ol',
        // Employee detail page
        whoAmI: 'Mən Kiməm?',
        pathToMedicine: 'Tibbə Aparan Yol',
        now: 'indi',
        more: 'Daha çox',
        less: 'Daha az',
        loadingEmployeeDetails: 'İşçi məlumatları yüklənir...',
        errorLoadingEmployee: 'İşçi yüklənərkən xəta',
        employeeNotFound: 'İşçi tapılmadı',
        backToEmployees: 'İşçilərə qayıt',
        // Employee page
        loadingEmployees: 'İşçilər yüklənir...',
        errorLoadingEmployees: 'İşçilər yüklənərkən xəta',
        retry: 'Yenidən cəhd et',
        noEmployeesFound: 'Həkim tapılmadı'
    },
    en: {
        // About page
        doctors: 'Doctors',
        events: 'Events',
        aboutTitle: 'Azerbaijan Hepato-Pancreato-Biliary Surgeons Public Association',
        aboutDescription: 'The Azerbaijan Hepato-Pancreato-Biliary Surgeons Public Association is a scientific-public organization that brings together specialists working in the field of diagnosis and surgery of liver, biliary tract and pancreatic diseases.\n\nThe main goal of the Association is to promote knowledge and experience exchange in the HPB field, support professional development and contribute to the development of this field in the country. The Association organizes seminars, scientific conferences and training by establishing both local and international collaborations. Supporting young surgeons and specialists, implementing modern surgical methods and promoting scientific research are also among the main directions of our activities.\n\nAs the Azerbaijan HPB Surgeons Public Association, we work as a professional society to add value to the healthcare system and improve the quality of life of patients.',
        // Header navigation
        home: 'Home',
        about: 'About',
        events: 'Events',
        members: 'Members',
        gallery: 'Gallery',
        blog: 'Blog',
        contact: 'Contact',
        joinMember: 'Join Member',
        // Employee detail page
        whoAmI: 'Who Am I?',
        pathToMedicine: 'Path to Medicine',
        now: 'now',
        more: 'More',
        less: 'Less',
        loadingEmployeeDetails: 'Loading employee details...',
        errorLoadingEmployee: 'Error loading employee',
        employeeNotFound: 'Employee not found',
        backToEmployees: 'Back to Employees',
        // Employee page
        loadingEmployees: 'Loading employees...',
        errorLoadingEmployees: 'Error loading employees',
        retry: 'Retry',
        noEmployeesFound: 'No employees found'
    },
    ru: {
        // About page
        doctors: 'Врачи',
        events: 'Мероприятия',
        aboutTitle: 'Общественная Ассоциация Гепато-Панкреато-Билиарных Хирургов Азербайджана',
        aboutDescription: 'Общественная Ассоциация Гепато-Панкреато-Билиарных Хирургов Азербайджана - это научно-общественная организация, объединяющая специалистов, работающих в области диагностики и хирургии заболеваний печени, желчевыводящих путей и поджелудочной железы.\n\nОсновная цель Ассоциации - способствовать обмену знаниями и опытом в области ГПБ, поддерживать профессиональное развитие и вносить вклад в развитие этой области в стране. Ассоциация организует семинары, научные конференции и обучение, устанавливая как местное, так и международное сотрудничество. Поддержка молодых хирургов и специалистов, внедрение современных хирургических методов и продвижение научных исследований также являются одними из основных направлений нашей деятельности.\n\nКак Общественная Ассоциация ГПБ Хирургов Азербайджана, мы работаем как профессиональное общество, чтобы добавить ценности системе здравоохранения и улучшить качество жизни пациентов.',
        // Header navigation
        home: 'Главная',
        about: 'О нас',
        events: 'Мероприятия',
        members: 'Участники',
        gallery: 'Галерея',
        blog: 'Блог',
        contact: 'Контакты',
        joinMember: 'Стать участником',
        // Employee detail page
        whoAmI: 'Кто Я?',
        pathToMedicine: 'Путь к Медицине',
        now: 'сейчас',
        more: 'Больше',
        less: 'Меньше',
        loadingEmployeeDetails: 'Загрузка данных сотрудника...',
        errorLoadingEmployee: 'Ошибка загрузки сотрудника',
        employeeNotFound: 'Сотрудник не найден',
        backToEmployees: 'Назад к Сотрудникам',
        // Employee page
        loadingEmployees: 'Загрузка сотрудников...',
        errorLoadingEmployees: 'Ошибка загрузки сотрудников',
        retry: 'Повторить',
        noEmployeesFound: 'Сотрудники не найдены'
    }
}

export const useTranslation = () => {
    const { selectedLanguage } = useLanguage()

    const t = (key) => {
        const languageTranslations = translations[selectedLanguage] || translations.aze
        return languageTranslations[key] || key
    }

    return { t }
}
