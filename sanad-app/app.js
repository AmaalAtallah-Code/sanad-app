// تسجيل الـ Service Worker لتمكين العمل بدون إنترنت (PWA)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('تم تفعيل نظام العمل بدون إنترنت بنجاح لبرنامج سند!', reg))
      .catch(err => console.log('فشل تفعيل الـ Service Worker:', err));
  });
}


// 1. مصفوفة البيانات الوهمية (Mock Data) - كالتالي سيجهزها زميل المحاسبة لاحقاً
const servicesData = [
    {
        id: 1,
        name: "محطة مياه النصر",
        category: "water",
        type: "مياه شرب",
        status: "available",
        statusText: "متاح حالياً",
        location: "حي النصر، المنطقة الشرقية - بجوار مدرسة النصر الإعدادية",
        icon: "💧"
    },
    {
        id: 2,
        name: "نقطة الأمل للطاقة الشمسية",
        category: "power",
        type: "شحن هواتف",
        status: "available",
        statusText: "متاح حالياً",
        location: "الرمال، شارع الشهداء - مقابل مخبز اليازجي",
        icon: "⚡"
    },
    {
        id: 3,
        name: "مركز صيانة الهندسة السريعة",
        category: "maintenance",
        type: "إصلاح هواتف وأجهزة",
        status: "busy",
        statusText: "مزدحم جداً",
        location: "شمال غزة، جباليا النزلة - قرب الدوار الرئيسي",
        icon: "🛠️"
    },
    {
        id: 4,
        name: "تكيّة وبئر الشيخ رضوان",
        category: "aid",
        type: "وجبات ومياه غسيل",
        status: "unavailable",
        statusText: "غير متاح حالياً",
        location: "حي الشيخ رضوان، قرب سوق الخضار",
        icon: "📦"
    }
];

// 2. تحديد عناصر الواجهة (DOM Elements)
const servicesContainer = document.getElementById('services-container');
const searchBar = document.getElementById('search-bar');
const categoryCards = document.querySelectorAll('.category-card');

// المتغيرات الحالية للتصفية والبحث
let currentCategory = 'water'; // التصنيف الافتراضي عند الفتح
let searchQuery = '';

// 3. دالة عرض البطاقات ديناميكياً (Render Function)
function renderServices() {
    // تفريغ الحاوية أولاً
    servicesContainer.innerHTML = '';

    // تصفية البيانات بناءً على التصنيف المختار وكلمة البحث
    const filteredServices = servicesData.filter(service => {
        const matchesCategory = service.category === currentCategory;
        const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              service.location.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // إذا لم يتم العثور على خدمات مطابقة
    if (filteredServices.length === 0) {
        servicesContainer.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #888;">
                <p>لم يتم العثور على نتائج مطابقة في هذا القسم.</p>
            </div>
        `;
        return;
    }

    // بناء كروت الـ HTML وضخها في الصفحة
    filteredServices.forEach(service => {
        // تحديد كلاس اللون بناءً على الحالة
        let statusClass = 'status-available';
        if (service.status === 'busy') statusClass = 'status-busy'; // يمكنك إضافة تنسيقه في الـ CSS لاحقاً
        if (service.status === 'unavailable') statusClass = 'status-unavailable';

        const cardHTML = `
            <div class="service-card">
                <div class="card-image-placeholder">
                    <span class="image-icon">${service.icon}</span>
                </div>
                <div class="card-details">
                    <h4 class="service-name">${service.name}</h4>
                    <div class="badges-row">
                        <span class="badge ${statusClass}">${service.statusText}</span>
                        <span class="badge type-badge">${service.type}</span>
                    </div>
                    <p class="service-location">📍 ${service.location}</p>
                    <div class="card-actions">
                        <button class="btn btn-primary" onclick="alert('سيتم فتح الخريطة المحلية قريباً')">طلب اتجاه</button>
                        <button class="btn btn-secondary" onclick="alert('سيتم تحويلك لصفحة البلاغات')">إبلاغ عن مشكلة</button>
                    </div>
                </div>
            </div>
        `;
        servicesContainer.insertAdjacentHTML('beforeend', cardHTML);
    });
}

// 4. دالة التصفية عند الضغط على أزرار التصنيفات
function filterService(category) {
    currentCategory = category;
    
    // تحديث الشكل البصري للزر النشط
    categoryCards.forEach(card => card.classList.remove('active'));
    event.currentTarget.classList.add('active');
    
    // إعادة عرض البيانات
    renderServices();
}

// 5. الاستماع لحدث الكتابة في صندوق البحث
searchBar.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderServices();
});

// 6. تشغيل الدالة تلقائياً عند فتح الصفحة لأول مرة
document.addEventListener('DOMContentLoaded', () => {
    renderServices();
});