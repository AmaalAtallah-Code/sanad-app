// 1. قاعدة البيانات الافتراضية لحماية التطبيق من الانهيار في حال عدم تحميل ملف data.js
if (typeof SANAD_OFFLINE_DATABASE === 'undefined') {
    window.SANAD_OFFLINE_DATABASE = {
        water: [],
        power: [],
        maintenance: [],
        aid: []
    };
}

// 2. دالة التنقل الآمنة والمحسنة بين الشاشات
function navigateTo(viewId) {
    console.log("محاولة الانتقال إلى الشاشة:", viewId);
    
    const allViews = document.querySelectorAll('.app-view');
    if (allViews.length === 0) {
        console.error("خطأ: لم يتم العثور على أي عناصر تحمل الكلاس .app-view في ملف HTML!");
        return;
    }

    // إخفاء جميع الشاشات أولاً بأمان
    allViews.forEach(view => {
        view.classList.remove('active-view');
        view.style.display = 'none'; 
    });

    // إظهار الشاشة المطلوبة
    const targetView = document.getElementById(viewId);
    if (targetView) {
        targetView.classList.add('active-view');
        targetView.style.display = 'block';
        console.log(`الشاشة ${viewId} تظهر الآن بنجاح.`);
    } else {
        console.error(`خطأ: لا توجد شاشة في الـ HTML تحمل الـ ID: (${viewId})`);
    }

    // تحديث البيانات تلقائياً عند الدخول للرئيسية أو البحث
    if (viewId === 'viewDashboard' || viewId === 'viewSearch') {
        if (typeof executeOfflineSearch === "function") {
            executeOfflineSearch();
        }
    }
}

// 3. دالة التشغيل الذاتي الآمنة (تنتظر تحميل كل عناصر المتصفح أولاً)
window.addEventListener('DOMContentLoaded', () => {
    console.log("تم تحميل الـ DOM بالكامل، يتم تشغيل التطبيق...");
    
    // تأكدي من أن شاشة البداية تبدأ بشكل صحيح
    setTimeout(() => {
        navigateTo('viewIntro1');
    }, 100); 
});

// ==================== محرك البحث والفلترة المرتبط بجداول البيانات ====================
let activeSearchCategory = 'all';

function switchToSearchTab() {
    navigateTo('viewSearch');
    const input = document.getElementById('mainSearchInput');
    if (input) input.focus();
}

function quickFilterCategory(category) {
    navigateTo('viewSearch');
    setSearchFilter(category);
}

function setSearchFilter(category) {
    activeSearchCategory = category;
    document.querySelectorAll('.mini-tab').forEach(tab => tab.classList.remove('active'));
    
    const targetTab = document.getElementById(`tab-${category}`);
    if (targetTab) targetTab.classList.add('active');
    
    executeOfflineSearch();
}

function executeOfflineSearch() {
    const container = document.getElementById('searchResultsContainer');
    const inputField = document.getElementById('mainSearchInput');
    const countLabel = document.getElementById('resultsCount');
    
    if (!container) return;
    
    const inputVal = inputField ? inputField.value.trim() : "";
    container.innerHTML = "";
    let matches = [];
    
    const categories = activeSearchCategory === 'all' ? ['water', 'power', 'maintenance', 'aid'] : [activeSearchCategory];

    categories.forEach(cat => {
        const dataList = window.SANAD_OFFLINE_DATABASE[cat] || [];
        dataList.forEach(item => {
            const regionStr = item.region || "";
            const locationStr = item.location || "";
            const typeStr = item.type || "";
            
            const matchesText = regionStr.includes(inputVal) || locationStr.includes(inputVal) || typeStr.includes(inputVal);
            if (!matchesText && inputVal !== "") return;

            let catIcon = "💧", iconClass = "icon-bg-water", fillClass = "fill-water";
            let detailsTitle = item.location;
            let subInfoText = "";
            let progressPercent = 100;
            
            // 📸 اختيار صور حقيقية ومباشرة بجودة عالية لكل فئة بدقة
            let serviceImg = ""; 

            if (cat === 'water') {
                catIcon = "💧"; iconClass = "icon-bg-water"; fillClass = "fill-water";
                detailsTitle = `نقطة مياه حي ${item.region}`;
                subInfoText = `المتبقي: ${item.available} لتر / السعة الكلية: ${item.capacity} لتر`;
                progressPercent = parseFloat(item.ratio) || ((item.available / item.capacity) * 100);
                // صورة محطة تحلية وتعبئة مياه حقيقية واضحة
                serviceImg = "https://images.unsplash.com/photo-1514730010915-c266dfedca6f?w=500&auto=format&fit=crop"; 
            } 
            else if (cat === 'power') {
                catIcon = "⚡"; iconClass = "icon-bg-power"; fillClass = "fill-power";
                detailsTitle = item.location;
                subInfoText = `المنافذ الشاغرة حالياً: ${item.available_ports} من أصل ${item.total_ports}`;
                progressPercent = (item.available_ports / item.total_ports) * 100;
                // صورة ألواح طاقة شمسية ونقاط شحن
                serviceImg = "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=500&auto=format&fit=crop"; 
            } 
            else if (cat === 'maintenance') {
                catIcon = "🔧"; iconClass = "icon-bg-maintenance"; fillClass = "fill-maintenance";
                detailsTitle = `مركز صيانة ${item.type}`;
                subInfoText = `طاقم العمل المتواجد: ${item.technicians} فنيين`;
                progressPercent = 100;
                // صورة فني صيانة الكترونيات وهواتف
                serviceImg = "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop"; 
            } 
            else if (cat === 'aid') {
                catIcon = "📦"; iconClass = "icon-bg-aid"; fillClass = "fill-aid";
                detailsTitle = item.location;
                subInfoText = `النوع الموزع: ${item.type} | الجهة: ${item.distributor}`;
                progressPercent = (item.remaining_qty / item.total_qty) * 100;
                // صورة صناديق وطرود طعام ومساعدات إنسانية
                serviceImg = "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=500&auto=format&fit=crop"; 
            }

            const cardHTML = `
                <div class="service-data-card" onclick="openServiceDetails('${cat}', ${item.id})">
                    <img src="${serviceImg}" class="card-thumb-image" alt="صورة الخدمة" onerror="this.src='https://images.unsplash.com/photo-1548839130-3bf96d5c857b?w=500'">

                    <div class="card-top-header">
                        <div class="card-title-group">
                            <div class="card-main-icon ${iconClass}">${catIcon}</div>
                            <div>
                                <h4 class="card-name-text">${detailsTitle}</h4>
                                <span class="card-sub-type">📍 منطقة ${regionStr}</span>
                            </div>
                        </div>
                        <span class="status-badge status-${(item.status || 'متاح').replace(' ', '_')}">${item.status || 'متاح'}</span>
                    </div>
                    
                    <div class="card-meta-row">
                        <span class="meta-icon">🏢</span>
                        <span>${locationStr}</span>
                    </div>

                    <div class="card-progress-section">
                        <div class="progress-labels">
                            <span>حالة الجاهزية المحلية</span>
                            <span>${Math.round(progressPercent)}%</span>
                        </div>
                        <div class="progress-bar-bg">
                            <div class="progress-bar-fill ${fillClass}" style="width: ${progressPercent}%;"></div>
                        </div>
                    </div>
                    <div style="font-size: 11px; color: #718096; margin-top: 2px;">📊 ${subInfoText}</div>
                    <button class="card-action-btn">عرض التفاصيل والتوجيه الكروكي ➔</button>
                </div>
            `;
            matches.push(cardHTML);
        });
    });

    if (countLabel) countLabel.innerText = `يوجد ${matches.length} مراكز متوفرة في القائمة`;
    container.innerHTML = matches.length ? matches.join('') : `<p style="text-align:center; padding:30px; color:#a0aec0;">لا توجد نتائج.</p>`;
}

function openServiceDetails(category, id) {
    navigateTo('viewDetails');
    const item = window.SANAD_OFFLINE_DATABASE[category].find(x => x.id === id);
    const bodyContainer = document.getElementById('detailsContentBody');
    if (!item || !bodyContainer) return;

    bodyContainer.innerHTML = `
        <div style="background:#fff; border-radius:16px; padding:8px; box-shadow:0 4px 12px rgba(0,0,0,0.05);">
            <h3 style="color:#031A30; margin-bottom:5px;">${item.type || item.location}</h3>
            <p style="color:#718096; font-size:13px; margin:0 0 15px 0;">📍 المنطقة المستهدفة: غزة، ${item.region}</p>
            
            <label style="font-size:12px; font-weight:bold; color:#031A30;">🗺️ خريطة الموقع التوجيهية (تعمل بدون اتصال):</label>
            
            <div style="width:100%; height:160px; background-color:#e2e8f0; border-radius:14px; position:relative; margin:10px 0; border:1px dashed #7fa43b; display:flex; justify-content:center; align-items:center; flex-direction:column; background-image: radial-gradient(#cbd5e1 2px, transparent 2px); background-size: 16px 16px;">
                <div style="font-size:28px; animation: bounce 2s infinite;">📍</div>
                <div style="font-size:12px; font-weight:bold; color:#031A30; background:rgba(255,255,255,0.9); padding:4px 8px; border-radius:8px; margin-top:5px; border:1px solid #edf2f7;">
                    قرب ${item.location}
                </div>
                <div style="position:absolute; bottom:5px; right:8px; font-size:10px; color:#718096;">خريطة سند الكروكية المحدّثة أوفلاين</div>
            </div>
            
            <div style="margin-top:15px; display:flex; flex-direction:column; gap:10px; font-size:14px; color:#2d3748; text-align:right;">
                <p>🏢 <strong>الموقع الدقيق:</strong> ${item.location}</p>
                <p>📞 <strong>رقم طوارئ التنسيق:</strong> ${item.phone || '059900000'}</p>
                <p>📊 <strong>الحالة الميدانية:</strong> <span class="status-badge status-${(item.status || 'متاح').replace(' ', '_')}">${item.status || 'متاح'}</span></p>
            </div>
            
            <button class="btn-sanad-dark" style="width:100%; margin-top:20px; border-radius:12px;" onclick="navigateTo('viewSearch')">العودة لقائمة البحث ➔</button>
        </div>
    `;
}
function selectAccountType(element, typeId) {
    // إزالة كلاس الاختيار النشط من جميع البطاقات
    document.querySelectorAll('.account-type-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // إضافة كلاس النشط للبطاقة المضغوطة حالياً
    element.classList.add('selected');
    
    // تفعيل زر الـ Radio المخفي بداخلها برمجياً
    if(typeId === 'seeker') {
        document.getElementById('typeSeeker').checked = true;
    } else {
        document.getElementById('typeProvider').checked = true;
    }
}