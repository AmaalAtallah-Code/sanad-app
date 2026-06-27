// قاعدة بيانات سند المحلية المستخرجة بالكامل من جداول الإكسل المرفقة
const SANAD_OFFLINE_DATABASE = {
    water: [
        { id: 1, region: "الزيتون", location: "بالقرب من دوار أبو عبيدة", phone: "599000099", capacity: 5000, consumed: 4500, available: 5000, ratio: "90.00%", status: "متوفر" },
        { id: 2, region: "الرمال", location: "شارع الوحدة قرب الشفاء", phone: "599554679", capacity: 5000, consumed: 900, available: 4100, ratio: "18.00%", status: "منخفض" },
        { id: 3, region: "النصر", location: "بجانب الجامعة الاسلامية", phone: "599993563", capacity: 5000, consumed: 1500, available: 3500, ratio: "30.00%", status: "متوفر" },
        { id: 4, region: "تل الهوا", location: "قرب دوار الـ 17", phone: "588553221", capacity: 5000, consumed: 3800, available: 1200, ratio: "76.00%", status: "متوفر" },
        { id: 5, region: "الشيخ رضوان", location: "مقابل المسجد العمري", phone: "597842355", capacity: 5000, consumed: 4700, available: 300, ratio: "94.00%", status: "متوفر" },
        { id: 6, region: "جباليا", location: "السوق المركزي", phone: "59435679", capacity: 5000, consumed: 400, available: 4600, ratio: "8.00%", status: "شبه منتهي" }
    ],
    power: [
        { id: 1, region: "الزيتون", location: "مركز شباب الزيتون", phone: "599000099", available_ports: 5, total_ports: 20, status: "محدود" },
        { id: 2, region: "الرمال", location: "شارع عمر المختار", phone: "599554679", available_ports: 2, total_ports: 20, status: "شبه ممتلئ" },
        { id: 3, region: "النصر", location: "بجانب الجامعة الاسلامية", phone: "599993563", available_ports: 8, total_ports: 20, status: "متوفر" },
        { id: 4, region: "تل الهوا", location: "قرب دوار الـ 17", phone: "588553221", available_ports: 17, total_ports: 20, status: "متوفر" },
        { id: 5, region: "الشيخ رضوان", location: "بجانب مستشفى الكرامة", phone: "597842355", available_ports: 10, total_ports: 20, status: "متوفر" },
        { id: 6, region: "جباليا", location: "السوق المركزي", phone: "594435679", available_ports: 19, total_ports: 20, status: "متوفر" }
    ],
    maintenance: [
        { id: 1, region: "الزيتون", location: "شارع صلاح الدين", phone: "599220001", type: "هواتف", technicians: 8, status: "متاح" },
        { id: 2, region: "الرمال", location: "شارع الوحدة", phone: "599220002", type: "أجهزة كهربائية", technicians: 15, status: "ضغط متوسط" },
        { id: 3, region: "النصر", location: "شارع النصر", phone: "599220003", type: "هواتف وحواسيب", technicians: 6, status: "متاح" },
        { id: 4, region: "تل الهوا", location: "شارع الصناعة", phone: "599220004", type: "ألواح شمسية", technicians: 18, status: "ضغط متوسط" },
        { id: 5, region: "الشيخ رضوان", location: "شارع الجلاء", phone: "599220005", type: "حواسيب", technicians: 7, status: "متاح" },
        { id: 6, region: "جباليا", location: "السوق المركزي", phone: "599220006", type: "هواتف وأجهزة", technicians: 22, status: "ضغط مرتفع" }
    ],
    aid: [
        { id: 1, region: "الزيتون", location: "مدرسة الزيتون الإعدادية", phone: "599330001", type: "طرود غذائية", total_qty: 350, remaining_qty: 150, distributor: "الموزع الأهلية", status: "متوفر" },
        { id: 2, region: "الرمال", location: "مركز الرمال التجمعي", phone: "599330002", type: "مياه شرب", total_qty: 120, remaining_qty: 180, distributor: "الموزع التجمعي", status: "منخفض" },
        { id: 3, region: "النصر", location: "جمعية أرض الإنسان", phone: "599330003", type: "طرود غذائية", total_qty: 280, remaining_qty: 120, distributor: "الموزع الإنسانية", status: "متوفر" },
        { id: 4, region: "تل الهوا", location: "مدرسة تل الهوا", phone: "599330004", type: "مستلزمات صحية", total_qty: 90, remaining_qty: 160, distributor: "الموزع الإغاثي", status: "منخفض" },
        { id: 5, region: "الشيخ رضوان", location: "مركز الشيخ رضوان", phone: "599330005", type: "بطانيات", total_qty: 200, remaining_qty: 100, distributor: "الموزع المحلي", status: "متوفر" },
        { id: 6, region: "جباليا", location: "مدرسة الفاخورة", phone: "599330006", type: "طرود غذائية", total_qty: 40, remaining_qty: 160, distributor: "الموزع الأممي", status: "شبه منتهي" }
    ]
};

// جعل الكائن متاحاً على النطاق العام للتطبيق لحل مشكلة كونسول المتصفح
window.SANAD_OFFLINE_DATABASE = SANAD_OFFLINE_DATABASE;