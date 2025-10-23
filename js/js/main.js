/*
===================================================
BWP401: دليل فعاليات معرض دمشق الدولي - ملف JavaScript الرئيسي (main.js)
المتطلبات: سلايدر، فلترة، تحقق نموذج اتصال
===================================================
*/

// ملاحظة: نستخدم jQuery ($) لتهيئة Bootstrap Carousel، والباقي نستخدم JavaScript خالص.

// انتظار تحميل DOM بالكامل قبل تشغيل السكربتات
$(document).ready(function() {
    
    // ----------------------------------
    // 1. تأثير السلايدر للفعاليات البارزة (index.html)
    // المتطلب: إضافة تأثيرات سلايدر للفعاليات البارزة [cite: 24, 170, 217]
    // نستخدم مكون Bootstrap Carousel الجاهز
    // ----------------------------------
    if ($('#featuredEventsSlider').length) {
        // تهيئة سلايدر البوتستراب للتشغيل التلقائي مع فاصل زمني
        $('#featuredEventsSlider').carousel({
            interval: 5000 // 5 ثواني
        });
        console.log("تم تهيئة سلايدر الفعاليات البارزة.");
    }


    // ----------------------------------
    // 2. التحقق من نموذج الاتصال (contact.html)
    // المتطلب: تحقق بسيط من النموذج وعرض رسالة نجاح/خطأ [cite: 26, 58, 204, 219]
    // ----------------------------------
    const contactForm = document.getElementById('contactForm');
    const formMessages = document.getElementById('formMessages');

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            // منع الإرسال الافتراضي لتمكين التحقق اليدوي
            event.preventDefault();
            event.stopPropagation();
            
            // إعادة تعيين رسائل الخطأ
            contactForm.classList.remove('was-validated');
            formMessages.innerHTML = ''; 

            if (contactForm.checkValidity() === false) {
                // إذا فشل التحقق الأساسي (حقول مطلوبة أو نوع بريد خاطئ)
                contactForm.classList.add('was-validated');
                displayAlert('فشل الإرسال: الرجاء ملء جميع الحقول المطلوبة بشكل صحيح.', 'danger');
            } else {
                // إذا نجح التحقق (هنا يتم الإرسال في التطبيق الحقيقي)
                
                // عرض رسالة النجاح باستخدام Bootstrap Alert [cite: 59, 205, 220]
                displayAlert('تم استلام رسالتك بنجاح! سنقوم بالرد قريباً.', 'success');
                
                // مسح النموذج بعد الإرسال الناجح
                contactForm.reset();
                contactForm.classList.remove('was-validated');
            }
        }, false);
    }
    
    // دالة عرض رسائل Bootstrap Alert
    function displayAlert(message, type) {
        const alertHtml = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert" dir="rtl">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        formMessages.innerHTML = alertHtml;
    }


    // ----------------------------------
    // 3. فلترة قائمة الفعاليات (events.html)
    // المتطلب: فلترة قائمة الفعاليات حسب التصنيف والبحث النصي [cite: 25, 171, 218]
    // ----------------------------------
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const dateFilter = document.getElementById('dateFilter'); // بالرغم من صعوبة مقارنة التاريخ بدون مكتبة، نضمن الفلترة النصية
    const allEventsContainer = document.getElementById('allEvents');

    if (searchInput || categoryFilter || dateFilter) {
        // الاستماع لتغييرات الفلترة
        [searchInput, categoryFilter, dateFilter].forEach(element => {
            if (element) {
                element.addEventListener('input', filterEvents);
                element.addEventListener('change', filterEvents);
            }
        });
    }

    function filterEvents() {
        if (!allEventsContainer) return;

        const searchText = searchInput ? searchInput.value.toLowerCase() : '';
        const selectedCategory = categoryFilter ? categoryFilter.value : 'all';
        const selectedDate = dateFilter ? dateFilter.value : '';

        // جلب جميع بطاقات الفعاليات
        const eventCards = allEventsContainer.querySelectorAll('.col');

        eventCards.forEach(col => {
            const card = col.querySelector('.event-card-custom');
            if (!card) return;

            // جلب بيانات البطاقة
            const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
            const categoryElement = card.querySelector('.badge');
            const categoryText = categoryElement ? categoryElement.textContent.trim() : '';
            // التاريخ: لتبسيط الفلترة، يجب وضع التاريخ بصيغة YYYY-MM-DD في عنصر مخفي أو نصي للمقارنة السهلة.
            // هنا سنعتمد على أن النص الظاهر يفي بالغرض البسيط.
            const dateText = card.querySelector('.fa-calendar-alt')?.parentElement?.textContent || '';
            
            // شرط الفلترة 1: البحث النصي (في العنوان والوصف)
            const matchesSearch = (title.includes(searchText));

            // شرط الفلترة 2: التصنيف
            const matchesCategory = selectedCategory === 'all' || categoryText.includes(selectedCategory);

            // شرط الفلترة 3: التاريخ (مقارنة نصية بسيطة)
            // إذا كان المستخدم قد اختار تاريخًا، فسنبحث عنه في نص التاريخ بالبطاقة.
            let matchesDate = true;
            if (selectedDate && dateText) {
                // ملاحظة: المقارنة المعقدة للتاريخ (أكبر من/أصغر من) تتطلب تنسيق ISO في HTML.
                // لغرض الوظيفة: نقارن نصيًا.
                matchesDate = dateText.includes(selectedDate); 
            }
            
            // إظهار أو إخفاء البطاقة
            if (matchesSearch && matchesCategory && matchesDate) {
                col.style.display = 'block';
            } else {
                col.style.display = 'none';
            }
        });
    }

    // تشغيل الفلترة عند التحميل الأولي لعرض كل شيء
    filterEvents();
    
    
    // ----------------------------------
    // 4. خاصية إضافية: زر الانتقال للأعلى (Scroll-to-top Button) [cite: 107, 253]
    // ----------------------------------
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.id = 'scrollToTopBtn';
    scrollToTopBtn.classList.add('btn', 'btn-gold-custom', 'shadow');
    
    // تصميم بسيط للزر (يجب أن يكون في styles.css ولكن وضع هنا لسهولة التضمين)
    scrollToTopBtn.style.cssText = `
        position: fixed; 
        bottom: 20px; 
        right: 20px; 
        z-index: 1000; 
        display: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
    `;
    
    document.body.appendChild(scrollToTopBtn);

    // إظهار/إخفاء الزر عند التمرير
    window.onscroll = function() {
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            scrollToTopBtn.style.display = "block";
        } else {
            scrollToTopBtn.style.display = "none";
        }
    };

    // وظيفة الانتقال للأعلى عند الضغط
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

});