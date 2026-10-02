/* ============================================================
   المكتبة العلمية — دروس مبسطة مبنية على الأبحاث
   ============================================================ */
'use strict';

const KNEE_SVG = `
<svg viewBox="0 0 520 420" width="100%" role="img" aria-label="رسم جانبي للركبة يوضح الجهاز الباسط" style="max-width:520px;display:block;margin:auto;font-family:inherit;direction:ltr">
  <g fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" style="color:var(--ink-2)">
    <path d="M190 20 C185 90 182 150 178 190 C175 222 190 246 222 250 C256 254 280 238 284 210 C288 180 282 120 276 20" fill="var(--card-2)"/>
    <path d="M182 300 C176 270 190 262 222 262 C262 262 286 268 284 296 L272 410 L198 410 Z" fill="var(--card-2)"/>
  </g>
  <path d="M130 30 C120 110 128 170 168 188 L188 194" fill="none" stroke="#e8a3a3" stroke-width="22" stroke-linecap="round" opacity=".55"/>
  <path d="M168 190 C160 196 156 205 156 214" stroke="var(--series-1)" stroke-width="7" fill="none" stroke-linecap="round"/>
  <ellipse cx="150" cy="238" rx="15" ry="26" fill="var(--card)" stroke="var(--ink-2)" stroke-width="2"/>
  <path d="M150 264 C152 290 160 312 176 330" stroke="var(--accent)" stroke-width="9" fill="none" stroke-linecap="round"/>
  <circle cx="178" cy="333" r="6" fill="var(--bad)"/>
  <circle cx="153" cy="268" r="6" fill="var(--warn)"/>
  <g font-size="13" fill="var(--ink)">
    <text x="60" y="80" text-anchor="middle">العضلة الرباعية</text><text x="60" y="96" text-anchor="middle" fill="var(--ink-2)" font-size="11">Quadriceps</text>
    <text x="300" y="80">عظم الفخذ</text><text x="300" y="96" fill="var(--ink-2)" font-size="11">Femur</text>
    <text x="40" y="200">وتر الرباعية</text><text x="40" y="214" fill="var(--ink-2)" font-size="11">Quadriceps tendon</text>
    <text x="20" y="244">الرضفة (الصابونة)</text><text x="20" y="258" fill="var(--ink-2)" font-size="11">Patella</text>
    <text x="16" y="300">الوتر الرضفي</text><text x="16" y="314" fill="var(--ink-2)" font-size="11">Patellar tendon</text>
    <text x="300" y="350">عظم الساق</text><text x="300" y="366" fill="var(--ink-2)" font-size="11">Tibia</text>
    <text x="196" y="352" font-size="11" fill="var(--ink-2)">حدبة الظنبوب</text>
    <text x="350" y="240" font-size="12" fill="var(--warn)">● مكان الألم الأشهر:</text>
    <text x="350" y="256" font-size="12" fill="var(--ink-2)">القطب السفلي للرضفة</text>
  </g>
  <path d="M110 300 L146 290" stroke="var(--ink-2)" stroke-width="1"/>
  <path d="M112 240 L134 240" stroke="var(--ink-2)" stroke-width="1"/>
  <path d="M120 205 L156 208" stroke="var(--ink-2)" stroke-width="1"/>
</svg>`;

const LOAD_SVG = `
<svg viewBox="0 0 560 230" width="100%" role="img" aria-label="منحنى قدرة الوتر على التحمل مقابل الحمل" style="max-width:560px;display:block;margin:auto;font-family:inherit;direction:ltr">
  <line x1="40" y1="200" x2="540" y2="200" stroke="var(--line)"/><line x1="40" y1="20" x2="40" y2="200" stroke="var(--line)"/>
  <path d="M40 150 C140 150 180 140 240 125 C320 105 420 80 540 55" stroke="var(--accent)" stroke-width="3" fill="none"/>
  <path d="M40 120 C90 120 100 175 150 175 C200 175 210 115 260 112 C300 110 330 60 360 40 C380 30 390 150 420 150 C470 150 500 95 540 90" stroke="var(--series-2)" stroke-width="2.5" fill="none" stroke-dasharray="6 5"/>
  <circle cx="365" cy="38" r="7" fill="var(--bad)"/>
  <text x="372" y="28" font-size="12" fill="var(--bad)">حمل أعلى من القدرة ← ألم</text>
  <text x="440" y="48" font-size="12" fill="var(--accent)">قدرة الوتر (تزيد ببطء)</text>
  <text x="60" y="110" font-size="12" fill="var(--series-2)">الحمل اليومي</text>
  <text x="290" y="222" font-size="12" fill="var(--ink-2)" text-anchor="middle">الزمن (أسابيع) ⟶</text>
</svg>`;

const LESSONS = [
/* ================= الركبة والوتر ================= */
{ slug: 'anatomy', cat: 'الركبة والوتر', title: 'تشريح الركبة والجهاز الباسط', desc: 'العضلة الرباعية والرضفة والوتر الرضفي: من يسوي الحركة، ومن يتحمل الحمل.',
html: `<p class="lead">الركبة مو مفصل "ثني ومد" فقط. هي نظام بكرات وحبال ينقل قوة أكبر عضلة بجسمك إلى عظم الساق. فهم هذا النظام هو أساس فهم ليش يوجعك الوتر، وليش التمارين اللي تسويها مصممة بهذا الشكل.</p>
<figure>${KNEE_SVG}<figcaption>رسم جانبي مبسّط للجهاز الباسط للركبة <span class="en">(Knee extensor mechanism)</span>.</figcaption></figure>
<h2>السلسلة من الأعلى للأسفل</h2>
<ol>
<li><b>العضلة الرباعية</b> <span class="en">(Quadriceps femoris)</span>: أربع رؤوس، هي المستقيمة الفخذية <span class="en">(Rectus femoris)</span>، والمتسعة الوحشية <span class="en">(Vastus lateralis)</span>، والمتسعة الإنسية <span class="en">(Vastus medialis / VMO)</span>، والمتسعة المتوسطة <span class="en">(Vastus intermedius)</span>. الضمور اللي لاحظته بالجهة الداخلية للفخذ هو بالمتسعة الإنسية، وهي أول عضلة تضمر لما تتوقف عن التحميل أو يكون عندك ألم بالركبة.</li>
<li><b>وتر الرباعية</b> <span class="en">(Quadriceps tendon)</span>: يربط العضلة بالحافة العلوية للرضفة.</li>
<li><b>الرضفة</b> <span class="en">(Patella)</span>: عظمة سمسمانية داخل الوتر. تشتغل مثل البكرة: تبعد خط سحب العضلة عن محور المفصل، فتزيد ذراع القوة وتخلي الرباعية أكفأ.</li>
<li><b>الوتر الرضفي</b> <span class="en">(Patellar tendon)</span>: طوله تقريباً 4–5 سم، ويمتد من القطب السفلي للرضفة إلى حدبة عظم الساق <span class="en">(Tibial tuberosity)</span>. تشريحياً يربط عظم بعظم، لكن وظيفياً هو وتر ينقل قوة العضلة.</li>
</ol>
<h2>مما يتكون الوتر؟</h2>
<p>الوتر حبل من الكولاجين نوع 1 <span class="en">(Type I collagen)</span>، مرتب بتسلسل هرمي: ألياف دقيقة ← ألياف ← حزم <span class="en">(fibrils → fibres → fascicles)</span>. بين الحزم خلايا اسمها الخلايا الوترية <span class="en">(Tenocytes)</span>، وهي اللي "تحس" بالحمل وتقرر تبني كولاجين جديد أو تكسره.</p>
<p>تروية الوتر الدموية ضعيفة مقارنة بالعضلة، وعدد خلاياه قليل. لهذا العضلة تتكيف خلال أسابيع، أما الوتر فيحتاج <b>أشهر</b>. هذي أهم حقيقة بكل رحلة علاجك.</p>
<h2>كم حمل يتحمل الوتر الرضفي؟</h2>
<p>الحمل على الوتر الرضفي يزيد كلما زاد ثني الركبة تحت وزن الجسم، وبالقفز والهبوط يوصل لعدة أضعاف وزن الجسم. ثلاثة أشياء ترفع الحمل بشكل كبير:</p>
<ul><li><b>زاوية الثني</b>: كل ما نزلت أعمق (سكوات عميق، سجود، جلوس على الأرض) زاد الحمل والضغط على الوتر عند الرضفة.</li>
<li><b>السرعة وتخزين الطاقة</b>: القفز وتغيير الاتجاه بالطوبة يستخدمون الوتر مثل النابض، وهذا أعلى أنواع الحمل.</li>
<li><b>وزن الجسم</b>: كل كيلو زائد ينضرب بعدة أضعاف على الوتر بكل خطوة ودرجة.</li></ul>
<div class="box"><b>ربط بقصتك:</b> اللعب بالطوبة (قفز وتغيير اتجاه)، وليك برس بـ 360 باوند، وبعدها 20 ركعة تراويح يومياً (عشرات المرات من الثني العميق تحت وزن الجسم)، ومعها زيادة الوزن من 69 إلى 85. كلها حمل متراكم على نفس الوتر، وأسرع من قدرته على التكيف.</div>
<h3>المصادر</h3><ul class="refs"><li>Malliaras P, et al. Patellar tendinopathy: clinical diagnosis, load management, and advice for challenging case presentations. JOSPT. 2015;45(11):887–898.</li><li>Magnusson SP, Kjaer M. The impact of loading, unloading, ageing and injury on the human tendon. J Physiol. 2019;597(5):1283–1298.</li></ul>`},

{ slug: 'tendinopathy', cat: 'الركبة والوتر', title: 'شنو هو التهاب الوتر الرضفي فعلاً؟', desc: 'ليش العلماء صاروا يسمونه "اعتلال" مو "التهاب"، ونموذج المراحل الثلاث.',
html: `<p class="lead">اسمه الشائع "ركبة القافز" <span class="en">(Jumper's knee)</span>. الطب الحديث يسميه <b>اعتلال الوتر الرضفي</b> <span class="en">(Patellar tendinopathy)</span>، لأن الفحوصات بالحالات المزمنة تبيّن خلايا التهابية قليلة. المشكلة الأساسية هي <b>خلل بإعادة بناء الوتر</b> نتيجة حمل يفوق قدرته.</p>
<h2>نموذج الاستمرارية (Continuum model)</h2>
<p>اقترحه Cook و Purdam سنة 2009، ويقسم الحالة لثلاث مراحل متداخلة:</p>
<table><thead><tr><th>المرحلة</th><th>شنو يصير بالوتر</th><th>الصورة السريرية</th></tr></thead><tbody>
<tr><td><b>تفاعلية</b> <span class="en">(Reactive)</span></td><td>الوتر ينتفخ ويتغير الماء والبروتينات بداخله، رد فعل لحمل مفاجئ.</td><td>ألم حاد بعد زيادة مفاجئة بالحمل. قابل للرجوع بالكامل.</td></tr>
<tr><td><b>خلل الترميم</b> <span class="en">(Disrepair)</span></td><td>محاولة ترميم غير منظمة، وألياف الكولاجين تصير أقل ترتيب.</td><td>ألم متكرر مع الحمل. ما زال قابل للتحسن بشكل كبير.</td></tr>
<tr><td><b>تنكسية</b> <span class="en">(Degenerative)</span></td><td>مناطق من الوتر تغيرت بنيتها ("متآكلة").</td><td>حالة مزمنة. المناطق المتغيرة ما ترجع مثل ما كانت، لكن الوتر يكدر يتحسن وظيفياً.</td></tr>
</tbody></table>
<div class="box"><b>"متآكل" مو معناها "خربان":</b> الأبحاث تبيّن إن الوتر المتغير يبقى بيه نسيج سليم كافي حوله. الهدف إنك تقوّي هذا النسيج السليم ليش يتحمل أكثر، وهذا يسمونه "علاج الدونات مو الفتحة" <span class="en">(treat the donut, not the hole)</span>. الصورة الشعاعية ما تحدد الألم ولا الأداء، القدرة على التحمل هي اللي تحدد.</div>
<h2>علامات الاعتلال الرضفي</h2>
<ul><li>ألم موضعي بالقطب السفلي للرضفة، تكدر تأشر عليه بإصبع.</li>
<li>الألم مرتبط بالحمل: يبدي مع الحمل ويخف لما توقف. أحياناً يخف بالإحماء، ويرجع أقوى بعد النشاط أو باليوم الثاني.</li>
<li>تيبّس الصبح أو بعد الجلوس الطويل.</li>
<li>صعوبة بالدرج نزولاً، والسكوات، والقفز.</li></ul>
<h2>عوامل الخطر</h2>
<p>زيادة مفاجئة بالحمل (أهم عامل)، والرياضات اللي بيها قفز، وضعف الرباعية والحوض، وزيادة الوزن، وقلة مرونة عضلات الفخذ الخلفية والرباعية والسمانة.</p>
<p><b>ليش الراحة التامة ما تعالجه؟</b> الراحة تخفف الألم مؤقتاً، لكنها تنزّل قدرة الوتر أكثر. فأول ما ترجع للنشاط يكون الوتر أضعف من قبل، وهذا بالضبط اللي شخّصه د. أصيل: "قدرتك التحملية نازلة". العلاج هو <b>الحمل المضبوط</b> مو الراحة.</p>
<h3>المصادر</h3><ul class="refs"><li>Cook JL, Purdam CR. Is tendon pathology a continuum? Br J Sports Med. 2009;43(6):409–416.</li><li>Cook JL, et al. Revisiting the continuum model of tendon pathology. Br J Sports Med. 2016;50(19):1187–1191.</li><li>Docking SI, Cook J. Pathological tendons maintain sufficient aligned fibrillar structure on ultrasound tissue characterization. Scand J Med Sci Sports. 2016;26(6):675–683.</li></ul>`},

{ slug: 'loading', cat: 'العلاج الطبيعي', title: 'ليش التحميل التدريجي هو العلاج؟', desc: 'كيف يتحول الحمل الميكانيكي لكولاجين جديد، ومراحل التأهيل الأربع.',
html: `<p class="lead">الوتر نسيج حي "يسمع" الحمل. لما يتعرض لشد مناسب، الخلايا الوترية تترجم الإشارة الميكانيكية إلى أوامر كيميائية تبني كولاجين جديد. هذي العملية اسمها <b>التحويل الميكانيكي</b> <span class="en">(Mechanotransduction)</span>، وهي اللي يعتمد عليها برنامجك بالكامل.</p>
<figure>${LOAD_SVG}<figcaption>الهدف: يبقى الحمل اليومي (المتقطع) تحت خط قدرة الوتر، بينما الخط يرتفع تدريجياً. القفزات المفاجئة هي اللي تسبب الانتكاسات.</figcaption></figure>
<h2>بعد كل جلسة تمرين</h2>
<p>الدراسات على الأوتار تبيّن إن الحمل يرفع <b>بناء</b> الكولاجين ويرفع <b>تكسيره</b> بنفس الوقت. التكسير يغلب بالساعات الأولى، والبناء يغلب لاحقاً. يعني الوتر بعد الحمل الثقيل "أضعف مؤقتاً"، ويحتاج وقت حتى يطلع أقوى. لهذا التمارين الثقيلة بالمراحل المتقدمة تكون يوم ويوم لا، أما الخفيفة والثابتة فممكن تكون يومية.</p>
<h2>المراحل الأربع للتأهيل</h2>
<p>البروتوكولات الحديثة لاعتلال الوتر الرضفي تمشي على أربع مراحل، والانتقال بينها حسب الأعراض مو حسب التاريخ:</p>
<ol>
<li><b>التمارين الثابتة</b> <span class="en">(Isometric)</span>: تقلّص بدون حركة، مثل Quad 60° لمدة 45 ثانية. تخفف الألم عند كثير من المرضى، وتبدي تحميل الوتر بأمان. <i>(أنت خلصتها.)</i></li>
<li><b>التقوية الديناميكية</b> <span class="en">(Isotonic)</span>: حركة كاملة مع مقاومة، مثل TKE وStep Down وتمارين الحوض بالحبل. الهدف تبني قوة الرباعية والحوض. <i>(أنت هنا.)</i></li>
<li><b>تخزين الطاقة</b> <span class="en">(Energy storage)</span>: قفز خفيف، حبل، هبوط، تغيير اتجاه، مع زيادة تدريجية بالسرعة.</li>
<li><b>العودة للرياضة</b> <span class="en">(Return to sport)</span>: تمارين خاصة بالطوبة، ثم تدريب كامل، ثم مباريات.</li></ol>
<div class="box">تجربة سريرية عشوائية (Breda وزملاؤه 2021) قارنت هذا البرنامج التدريجي بالتمارين اللامركزية التقليدية. النتيجة: البرنامج التدريجي أعطى تحسن أكبر بالأعراض، ونسبة أعلى من الرياضيين رجعوا للعب.</div>
<h2>ليش يمكن تحس إنك جاهز قبل لا تكون جاهز؟</h2>
<p>العضلة تقوى خلال أسابيع، والوتر يحتاج من 3 إلى 6 أشهر وأكثر. فبالأسابيع الأولى تحس رجلك قوية، فتزيد الحمل، وهنا يرجع الألم. هذي أشهر سبب للانتكاسة. <b>القاعدة: لا تقيس جاهزيتك بإحساس العضلة. قيسها بألم الصبح.</b></p>
<h3>المصادر</h3><ul class="refs"><li>Malliaras P, et al. Patellar tendinopathy: clinical diagnosis, load management... JOSPT. 2015;45(11):887–898.</li><li>Breda SJ, et al. Effectiveness of progressive tendon-loading exercise therapy in patients with patellar tendinopathy: a randomised clinical trial. Br J Sports Med. 2021;55(9):501–509.</li><li>Rio E, et al. Isometric exercise induces analgesia and reduces inhibition in patellar tendinopathy. Br J Sports Med. 2015;49(19):1277–1283.</li><li>Kongsgaard M, et al. Corticosteroid injections, eccentric decline squat training and heavy slow resistance training in patellar tendinopathy. Scand J Med Sci Sports. 2009;19(6):790–802.</li><li>Magnusson SP, Langberg H, Kjaer M. The pathogenesis of tendinopathy: balancing the response to loading. Nat Rev Rheumatol. 2010;6(5):262–268.</li></ul>`},

{ slug: 'pain-monitoring', cat: 'العلاج الطبيعي', title: 'مراقبة الألم: البوصلة اليومية', desc: 'شلون تقرا ألمك، وليش ألم الصبح أهم رقم بالسجل.',
html: `<p class="lead">بعلاج الأوتار، الألم مو عدو لازم تتجنبه بالكامل، ولا هو إذن تتجاهله. هو <b>مقياس</b> يقول لك إذا الحمل مناسب لقدرة الوتر الحالية.</p>
<h2>مقياس الألم الرقمي (NRS 0–10)</h2>
<table><tbody><tr><td><b>0</b></td><td>لا ألم</td></tr><tr><td><b>1–2</b></td><td>إحساس خفيف، تنتبه له إذا ركزت</td></tr><tr><td><b>3–4</b></td><td>ألم واضح لكن ما يغير طريقة حركتك</td></tr><tr><td><b>5–6</b></td><td>ألم يخليك تعدّل الحركة أو تعرج</td></tr><tr><td><b>7–10</b></td><td>ألم قوي يوقف النشاط</td></tr></tbody></table>
<h2>نموذج مراقبة الألم</h2>
<p>طوّرته Silbernagel وزملاؤها لعلاج أوتار أكيليس، وصار يُستخدم بكل اعتلالات الأوتار. يعتمد على ثلاث قراءات:</p>
<ol><li><b>أثناء التمرين</b>: هل بقي ضمن الحد المسموح؟</li><li><b>بعد التمرين مباشرة</b>: هل رجع بسرعة؟</li><li><b>صباح اليوم التالي</b>: هذا أهم رقم. يبيّن استجابة الوتر خلال 24 ساعة. إذا ألم الصبح أعلى من المعتاد، فالحمل أمس كان أكثر من قدرة الوتر.</li></ol>
<div class="box"><b>حدودك من د. أصيل:</b> بالمرحلة الأولى كان الحد 2 من 10، وبالمرحلة الثانية صفر. هذي حدود أشد من البروتوكولات العامة (اللي تسمح أحياناً بـ 5 من 10)، وهو اختيار الدكتور حسب حالتك. التطبيق يلتزم بحدوده ويلوّن أي رقم فوقها.</div>
<h2>شلون تتصرف حسب الألم؟</h2>
<ul><li><b>ضمن الحد، وألم الصبح طبيعي يومين متتاليين:</b> ممكن تزيد الحمل شوي (خطوات أو تكرارات)، حسب توجيه الدكتور.</li>
<li><b>فوق الحد أثناء تمرين معيّن:</b> خفف المدى أو المقاومة لهذا التمرين بس، وسجّل ملاحظة.</li>
<li><b>ألم الصبح أعلى من المعتاد:</b> ارجع لحمل اليوم اللي قبله، وما تزيد شي لحد ما يرجع.</li>
<li><b>ألم حاد مفاجئ أو انتفاخ أو أعراض عصبية:</b> وقف، وراسل الدكتور.</li></ul>
<h3>المصادر</h3><ul class="refs"><li>Silbernagel KG, et al. Continued sports activity, using a pain-monitoring model, during rehabilitation in patients with Achilles tendinopathy. Am J Sports Med. 2007;35(6):897–906.</li><li>Malliaras P, et al. JOSPT. 2015;45(11):887–898.</li></ul>`},

{ slug: 'kinetic-chain', cat: 'العلاج الطبيعي', title: 'ليش الدكتور بدأ بالحوض مو بالركبة؟', desc: 'السلسلة الحركية: الورك والكاحل يتحكمون بكمية الحمل الواصل للركبة.',
html: `<p class="lead">الركبة مفصل "وسطي" محصور بين الورك والكاحل. حركتها محدودة تقريباً بالثني والمد، فأي ضعف فوق أو تحت ينعكس عليها. مثل ما قال لك د. أصيل: اللي يحدد حركة الركبة هي عضلات الحوض، والرباعية، والكاحل.</p>
<h2>الورك (الحوض)</h2>
<p>عضلات المبعدات <span class="en">(Gluteus medius)</span> والمدوّرات الخارجية تمنع الفخذ إنه "يطيح" للداخل ويدور وقت المشي والنزول من الدرج. هذا الانهيار يسمونه <b>الانحراف الديناميكي للداخل</b> <span class="en">(Dynamic knee valgus)</span>. يغيّر اتجاه سحب الرباعية على الرضفة، ويوزع الحمل على الوتر بشكل غير متوازن.</p>
<p>تمارين مثل <span class="en">Clam Shells</span> و<span class="en">Hip Abduction</span> تقوي هذي العضلات. والإحساس اللي ذكرته بإن الأرداف كبرت دليل إن العضلة استجابت فعلاً 😊.</p>
<h2>الرباعية</h2>
<p>الرباعية القوية تمتص الصدمة وتتحكم بالنزول. لما تضعف، الوتر ياخذ جزء أكبر من الحمل. لهذا تمارين <span class="en">TKE</span> و<span class="en">SLR</span> و<span class="en">Quad 60°</span> تستهدف بشكل خاص المتسعة الإنسية (VMO) اللي لاحظت ضمورها.</p>
<h2>الكاحل</h2>
<p>إذا انثناء الكاحل للأعلى <span class="en">(Ankle dorsiflexion)</span> محدود، الجسم يعوّض بزيادة الثني بالركبة، فيزيد الحمل على الوتر. لهذا مرونة السمانة وقوتها جزء من المراحل اللاحقة.</p>
<h2>تمرين Step Down مع الركبة فوق أصابع القدم</h2>
<p>سنين نسمع "لا تخلي ركبتك تعدّي أصابع رجلك". الحقيقة إن الركبة تعدّي الأصابع طبيعياً بالدرج والجلوس والسجود. الهدف من هذا التمرين <b>تدريب الوتر على تحمّل هذا الوضع</b> بشكل مضبوط وتدريجي، حتى ما يصير "منطقة ممنوعة" يتعب فيها الوتر كل مرة تنزل درجة.</p>
<h3>المصادر</h3><ul class="refs"><li>Powers CM. The influence of abnormal hip mechanics on knee injury: a biomechanical perspective. JOSPT. 2010;40(2):42–51.</li><li>Malliaras P, et al. JOSPT. 2015;45(11):887–898.</li><li>Backman LJ, Danielson P. Low range of ankle dorsiflexion predisposes for patellar tendinopathy in junior elite basketball players. Am J Sports Med. 2011;39(12):2626–2633.</li></ul>`},

{ slug: 'your-exercises', cat: 'العلاج الطبيعي', title: 'تمارينك واحد واحد: شنو يسوي كل تمرين؟', desc: 'شرح وظيفي لكل تمرين بالمرحلة الحالية، مع روابط الفيديو.',
html: () => {
  const ph = currentPhase();
  const extra = {
    p2_abdBand: 'المبعدات (Glute med/min). تثبّت الحوض وقت الوقوف على رجل وحدة. ركّز إن الجذع ما يميل.',
    p2_addBand: 'المقربات (Adductors). توازن الشد على الحوض. إذا سبب ألم بالمنطقة الإربية أو المثانة فلازم يعرف الدكتور، لأن هذا ألم مو من الركبة.',
    p2_clam: 'المدوّرات الخارجية للورك. تمنع دوران الفخذ للداخل. الثبات 10 ثواني يبني تحمل العضلة.',
    p2_slAbd: 'الألوية الوسطى بدون مساعدة الجاذبية. الوزن 1 كغم يرفع المقاومة تدريجياً.',
    p2_tke: 'تنشيط VMO بآخر 15–20 درجة من المد. هذي الزاوية أكثر وحدة تضعف مع ألم الركبة.',
    p2_quad60: 'تقلص ثابت بأقصى قوة. يحافظ على قوة الرباعية، وعند كثير من الناس يخفف الألم.',
    p2_slr: 'الرباعية والركبة ممدودة بالكامل، يعني حمل قليل على الوتر الرضفي مع تقوية العضلة.',
    p2_heel: 'تحكم لا مركزي (eccentric) بساق وحدة. يعلّم الركبة والحوض يشتغلون سوا بالنزول.',
    p2_step: 'تحميل وظيفي حقيقي على الوتر بزاوية الدرج. هذا التمرين هو "الجسر" لصعود ونزول الدرج بدون ألم.'
  };
  return `<p class="lead">التمارين بالضبط مثل ما وصفها د. أصيل بالمرحلة الحالية: <b>${esc(ph?.name || '')}</b>. الشرح هنا للفهم، والجرعة والتعديل من الدكتور.</p>
  <table><thead><tr><th>التمرين</th><th>الجرعة</th><th>شنو يسوي</th></tr></thead><tbody>
  ${activeEx(ph).map(x => `<tr><td dir="ltr" style="text-align:right"><b>${esc(x.name)}</b>${x.video ? `<br><a href="${esc(x.video)}" target="_blank" rel="noopener">▶ video</a>` : ''}</td><td class="num">${esc(x.dose)}</td><td>${esc(extra[x.id] || x.goal)}</td></tr>`).join('')}
  </tbody></table>
  <h2>قواعد التنفيذ</h2>
  <ul><li><b>الجودة قبل العدد:</b> إذا تغير شكل الحركة بالتكرارات الأخيرة، وقف.</li><li><b>الثبات بالثواني يعني ثبات فعلي:</b> عدّ بصوت أو بمؤقت.</li><li><b>التشنج بعد زيادة الشدة طبيعي</b> بأول 2–3 أيام (مثل اللي صار بـ 10/9). هذا ألم عضلي، ويختلف عن ألم الوتر الموضعي تحت الرضفة.</li><li><b>لا "تضغط على نفسك" لحد الحرقان</b> بتمارين المقربات. شفت شنو صار بـ 18/8.</li></ul>
  <div class="box warn"><b>أعراض المثانة والخصية:</b> تكررت مع تمرين المقربات (18/8، ثم 13/9 وبعده). هذي مو أعراض ركبة. التطبيق يحطها تلقائياً بتقرير الدكتور، وصح تذكرها له صراحة بالجلسة، خصوصاً مع وجود عملية سابقة.</div>`;
}},

/* ================= التغذية ================= */
{ slug: 'energy', cat: 'التغذية', title: 'الطاقة: شلون يحرق جسمك السعرات؟', desc: 'BMR وTDEE والخطوات، وليش 7700 سعرة ≈ 1 كغم دهون.',
html: () => { const e = energy(); const p = D.profile; const w = currentWeight(); return `<p class="lead">الوزن بالنهاية معادلة طاقة: الداخل (الأكل) مقابل الخارج (الحرق). المعادلة بسيطة، أما مكوناتها فيها تفاصيل مهمة.</p>
<h2>مكونات الحرق اليومي (TDEE)</h2>
<table><tbody>
<tr><td><b>الأيض الأساسي</b> <span class="en">(BMR)</span></td><td>60–70%</td><td>تشغيل القلب والدماغ والأعضاء وانت مرتاح.</td></tr>
<tr><td><b>هضم الأكل</b> <span class="en">(TEF)</span></td><td>~10%</td><td>البروتين يحتاج طاقة أكثر بهضمه (20–30% من سعراته).</td></tr>
<tr><td><b>النشاط غير الرياضي</b> <span class="en">(NEAT)</span></td><td>15–30%</td><td>المشي، الوقوف، الحركة اليومية. هنا دور خطواتك.</td></tr>
<tr><td><b>التمرين</b> <span class="en">(EAT)</span></td><td>5–10%</td><td>تمارين العلاج نفسها حرقها قليل، فائدتها ببناء القوة.</td></tr></tbody></table>
<h2>حساباتك الحالية</h2>
<p>معادلة Mifflin-St Jeor للرجال: <span class="en">BMR = 10×W + 6.25×H − 5×A + 5</span></p>
<p>= 10×${fmtN(w, 1)} + 6.25×${p.height} − 5×${p.age} + 5 = <b>${fmtN(e.bmr)}</b> سعرة.</p>
<p>× معامل النشاط ${p.activity} = <b>${fmtN(e.tdee)}</b> سعرة باليوم. ناقص عجز ${p.deficit} = هدفك <b>${fmtN(e.target)}</b> سعرة.</p>
<h2>الخطوات: كم تحرق؟</h2>
<p>المشي يحرق تقريباً 0.5 سعرة لكل كغم من وزنك لكل كيلومتر (فوق الحرق الأساسي). بوزن ${fmtN(w)} كغم، 7000 خطوة (≈ 5 كم) تحرق تقريباً <b>${fmtN(0.5 * w * 5)}</b> سعرة إضافية. رقم مفيد، لكنه أقل مما يتخيل الناس، لهذا <b>الأكل هو الأداة الرئيسية</b> لنزول الوزن بمرحلتك.</p>
<h2>7700 سعرة = 1 كغم؟</h2>
<p>الكيلو من الدهون يخزن تقريباً 7700 سعرة. فعجز 500 سعرة يومياً ≈ 3500 بالأسبوع ≈ نص كيلو دهون. عملياً النزول يكون أسرع بالبداية (ماء وغلايكوجين) وأبطأ لاحقاً، لأن الجسم يقلل حرقه شوي مع نزول الوزن <span class="en">(Adaptive thermogenesis)</span>.</p>
<div class="box"><b>الميزان يكذب يومياً:</b> وزنك يتذبذب 0.5–1.5 كغم حسب الماء والملح والأكل. لا تحكم على يوم واحد. شوف اتجاه المعدل الأسبوعي بصفحة التقدم.</div>
<h3>المصادر</h3><ul class="refs"><li>Mifflin MD, et al. A new predictive equation for resting energy expenditure in healthy individuals. Am J Clin Nutr. 1990;51(2):241–247.</li><li>Hall KD, et al. Quantification of the effect of energy imbalance on bodyweight. Lancet. 2011;378(9793):826–837.</li></ul>`; }},

{ slug: 'macros', cat: 'التغذية', title: 'البروتين والكارب والدهون', desc: 'شنو يسوي كل واحد، وكم تحتاج، وشلون توزعه على 3 وجبات.',
html: () => { const e = energy(); return `<p class="lead">كل سعرة تجي من واحد من ثلاث مصادر كبرى <span class="en">(Macronutrients)</span>. نوع السعرة يحدد شنو ينبني بجسمك وشنو ينحرق.</p>
<table><thead><tr><th></th><th>سعرات/غرام</th><th>دوره الرئيسي</th><th>هدفك</th></tr></thead><tbody>
<tr><td><b>البروتين</b></td><td>4</td><td>بناء العضل والكولاجين والإنزيمات. الأكثر إشباعاً.</td><td class="num">${e.protein} غ</td></tr>
<tr><td><b>الكاربوهيدرات</b></td><td>4</td><td>وقود المشي والتمارين والدماغ. يحفظ البروتين من الحرق.</td><td class="num">~${Math.max(0, e.carbs)} غ</td></tr>
<tr><td><b>الدهون</b></td><td>9</td><td>الهرمونات (منها التستوستيرون)، وامتصاص فيتامين D وA وE وK.</td><td class="num">~${e.fat} غ</td></tr></tbody></table>
<h2>البروتين: الأهم بمرحلتك</h2>
<p>العضل ينبني ويتكسر يومياً. لما تكون بعجز سعرات، الجسم يميل يكسر العضل للطاقة، إلا إذا وصلت له إشارتين: <b>تمرين مقاومة</b> و<b>بروتين كافي</b>.</p>
<ul><li>الأبحاث تحدد ~1.6 غ/كغم كحد يتوقف بعده الفائدة بالظروف العادية، و2.0–2.2 أو أكثر بالعجز الشديد عند الرياضيين.</li>
<li>كل وجبة تحتاج ~0.4 غ/كغم (يعني 30–40 غ) حتى تشغّل بناء العضل بأقصى طاقته. هذا يسمونه عتبة الليوسين <span class="en">(Leucine threshold)</span>.</li>
<li>عندك 3 وجبات، فالهدف تقريباً <b>${Math.round(e.protein / 3)} غ بروتين بكل وجبة</b>.</li></ul>
<h2>مصادر البروتين ببيتكم</h2>
<table><thead><tr><th>الغذاء</th><th>الكمية</th><th>بروتين</th></tr></thead><tbody>
<tr><td>بيض</td><td>3 بيضات</td><td class="num">~19 غ</td></tr><tr><td>صدر دجاج</td><td>150 غ مطبوخ</td><td class="num">~46 غ</td></tr><tr><td>سمك</td><td>150 غ</td><td class="num">~37 غ</td></tr><tr><td>تونة بالماء</td><td>علبة (120 غ)</td><td class="num">~31 غ</td></tr><tr><td>لبن مصفى</td><td>200 غ</td><td class="num">~20 غ</td></tr><tr><td>عدس مطبوخ</td><td>كوب (200 غ)</td><td class="num">~18 غ</td></tr><tr><td>جبن أبيض</td><td>50 غ</td><td class="num">~8 غ</td></tr></tbody></table>
<h2>الألياف</h2><p>الخضار اللي تاكلها (باذنجان، شجر، جزر، سلك، خباز) ممتازة: سعرات قليلة وألياف عالية وإشباع. الهدف 25–38 غ ألياف باليوم.</p>
<h3>المصادر</h3><ul class="refs"><li>Morton RW, et al. A systematic review, meta-analysis and meta-regression of the effect of protein supplementation on resistance training-induced gains in muscle mass and strength. Br J Sports Med. 2018;52(6):376–384.</li><li>Schoenfeld BJ, Aragon AA. How much protein can the body use in a single meal for muscle-building? J Int Soc Sports Nutr. 2018;15:10.</li></ul>`; }},

{ slug: 'fatloss', cat: 'التغذية', title: 'تنزيل الدهون مع الحفاظ على العضل', desc: 'ليش العجز الكبير يضرك الآن بالذات، والمعدل الصحيح للنزول.',
html: () => { const e = energy(); const t = ['m_pizza', 'm_chard', 'm_pizza', 'm_tea'].map(mealById).filter(Boolean).reduce((a, m) => { const x = mealTotals(m); a.k += x.kcal; a.p += x.p; return a; }, { k: 0, p: 0 }); return `<p class="lead">الهدف مو "ينزل الوزن". الهدف <b>تنزل الدهون</b> وتبقى العضلات، لأنها هي اللي تحمي ركبتك وترجعك للطوبة.</p>
<h2>المعدل الصحيح</h2>
<p>0.5–1% من وزن الجسم بالأسبوع، يعني لك ~0.4–0.8 كغم. الأسرع من هذا يزيد خسارة العضل بشكل واضح، خصوصاً مع بروتين قليل.</p>
<h2>ليش العجز الكبير خطر عليك الآن بالذات؟</h2>
<div class="box warn">يومك المعتاد تقريباً <b>${fmtN(t.k)} سعرة</b> و<b>${fmtN(t.p)} غ بروتين</b>، وحرقك ~${fmtN(e.tdee)}. يعني عجز ~${fmtN(e.tdee - t.k)} سعرة باليوم. هذا يسبب:
<ul style="margin-bottom:0"><li><b>خسارة عضل</b>: بالضبط العضلات اللي قاعد د. أصيل يبنيها (VMO، الألوية).</li>
<li><b>بطء ترميم الوتر</b>: بناء الكولاجين يحتاج طاقة وأحماض أمينية. قلة توفر الطاقة <span class="en">(Low energy availability)</span> تضعف بناء الكولاجين والعظم.</li>
<li><b>تعب وجوع وانتكاسة</b>: الأنظمة القاسية صعب تستمر عليها، والوزن يرجع.</li></ul></div>
<h2>المعادلة الصحيحة</h2>
<ol><li><b>عجز معتدل</b>: ~${fmtN(e.target)} سعرة (عجز ~${D.profile.deficit}).</li>
<li><b>بروتين عالي</b>: ${e.protein} غ (~${Math.round(e.protein / 3)} غ بكل وجبة).</li>
<li><b>تمارين مقاومة</b>: تمارين د. أصيل هي الإشارة للجسم إنه يحافظ على العضل. لا تتركها بأيام الدايت.</li>
<li><b>نوم 7–9 ساعات</b>: بدراسة معروفة، نفس الدايت مع نوم 5.5 ساعة بدل 8.5 خسّر عضل أكثر ودهون أقل.</li>
<li><b>خطوات ثابتة</b>: ضمن حدود ما يسمح به الدكتور.</li></ol>
<h2>شلون تعرف إنك تخسر دهون مو عضل؟</h2>
<ul><li>محيط الخصر ينزل (سجّله كل جمعة).</li><li>قوتك بالتمارين ثابتة أو تزيد.</li><li>المعدل الأسبوعي للوزن ينزل بهدوء، مو بقفزات.</li></ul>
<h3>المصادر</h3><ul class="refs"><li>Helms ER, et al. A systematic review of dietary protein during caloric restriction in resistance trained lean athletes. Int J Sport Nutr Exerc Metab. 2014;24(2):127–138.</li><li>Garthe I, et al. Effect of two different weight-loss rates on body composition and strength and power-related performance in elite athletes. Int J Sport Nutr Exerc Metab. 2011;21(2):97–104.</li><li>Nedeltcheva AV, et al. Insufficient sleep undermines dietary efforts to reduce adiposity. Ann Intern Med. 2010;153(7):435–441.</li><li>Mountjoy M, et al. IOC consensus statement on relative energy deficiency in sport (RED-S). Br J Sports Med. 2018;52(11):687–697.</li></ul>`; }},

{ slug: 'tendon-nutrition', cat: 'التغذية', title: 'تغذية الوتر: الكولاجين وفيتامين C وD', desc: 'شنو الثابت علمياً وشنو بعده أولي.',
html: `<p class="lead">ماكو غذاء "يعالج" الوتر لوحده. التحميل هو العلاج، والتغذية توفّر مواد البناء. هذا الدرس يفرّق بين الثابت والأولي.</p>
<h2>الثابت</h2>
<ul><li><b>طاقة وبروتين كافيين</b>: الأساس قبل أي مكمل.</li>
<li><b>فيتامين C</b>: ضروري لإنزيمات بناء الكولاجين. الخضار والفواكه تكفي غالباً (طماطة، فلفل، برتقال، كيوي).</li></ul>
<h2>واعد لكن أولي</h2>
<p><b>جيلاتين أو كولاجين + فيتامين C قبل التمرين:</b> دراسة صغيرة (Shaw وزملاؤه 2017) لقت إن 15 غ جيلاتين مع فيتامين C قبل ساعة من تمرين قصير ضاعفت مؤشر بناء الكولاجين بالدم. النتائج مشجعة، لكن ما ثبت للحين إنها تسرّع الشفاء السريري. اسأل الدكتور إذا تحب تجربها.</p>
<h2>فيتامين D</h2>
<p>مهم للعضلات والعظام والمناعة، ونقصه منتشر بالعراق رغم الشمس (الملابس، والبقاء داخل البيت، ولون البشرة).</p>
<div class="box warn"><b>جرعتك 50,000 IU أسبوعياً</b> (تعادل ~7,000 IU يومياً). هذي جرعة علاجية تُستخدم عادة لتعويض النقص لفترة محددة (غالباً 8–12 أسبوع)، وبعدها تتحول لجرعة صيانة. تأكد من الطبيب المعالج عن المدة، وسوِّ تحليل <span class="en">25(OH)D</span> لتعرف مستواك قبل لا تستمر لفترة طويلة. وخذه مع وجبة بيها دهون (مثل بيتزا البيض) حتى يمتص أفضل.</div>
<h2>أوميغا 3</h2><p>بعض الأدلة على تأثير مضاد للالتهاب، لكن الدليل على الأوتار تحديداً ضعيف. السمك مرتين بالأسبوع خيار جيد ويضيف بروتين.</p>
<h3>المصادر</h3><ul class="refs"><li>Shaw G, et al. Vitamin C–enriched gelatin supplementation before intermittent activity augments collagen synthesis. Am J Clin Nutr. 2017;105(1):136–143.</li><li>Holick MF, et al. Evaluation, treatment, and prevention of vitamin D deficiency: an Endocrine Society clinical practice guideline. J Clin Endocrinol Metab. 2011;96(7):1911–1930.</li></ul>`},

{ slug: 'sleep', cat: 'التعافي', title: 'النوم والتعافي', desc: 'ليش النوم جزء من العلاج مو رفاهية.',
html: `<p class="lead">التمرين يعطي الإشارة، والأكل يعطي المواد، والنوم هو <b>الوقت اللي ينبني بيه الجسم</b>.</p>
<ul><li><b>هرمون النمو</b> يُفرز أغلبه بالنوم العميق، وهو مهم لبناء الكولاجين والعضل.</li>
<li><b>الألم</b>: قلة النوم تخفض عتبة الألم، فنفس الحمل يوجع أكثر بعد ليلة سيئة.</li>
<li><b>الشهية</b>: قلة النوم ترفع هرمون الجوع (الغريلين) وتخفض هرمون الشبع (اللبتين).</li>
<li><b>نزول الوزن</b>: النوم القليل مع الدايت يخسّرك عضل بدل دهون.</li></ul>
<h2>نصائح عملية</h2><ul><li>موعد ثابت للنوم والاستيقاظ، حتى بالعطل.</li><li>قيلولة قصيرة (20–30 دقيقة) إذا تحتاج، مو أكثر من ساعة.</li><li>آخر شاي (كافيين) قبل النوم بـ 6–8 ساعات.</li><li>إذا يوجعك الوتر بالليل، سجّل هذا بالملاحظات.</li></ul>
<h3>المصادر</h3><ul class="refs"><li>Nedeltcheva AV, et al. Ann Intern Med. 2010;153(7):435–441.</li><li>Haack M, et al. Sleep deficiency and chronic pain: potential underlying mechanisms and clinical implications. Neuropsychopharmacology. 2020;45(1):205–216.</li></ul>`},

{ slug: 'glossary', cat: 'التعافي', title: 'قاموس المصطلحات', desc: 'المصطلحات الإنكليزية اللي تسمعها من الدكتور وبالفيديوهات.',
html: `<table><thead><tr><th>المصطلح</th><th>المعنى</th></tr></thead><tbody>
${[['Patellar tendinopathy', 'اعتلال الوتر الرضفي'], ['Isometric', 'تقلص ثابت بدون حركة المفصل'], ['Isotonic', 'تقلص مع حركة ومقاومة ثابتة'], ['Eccentric', 'تقلص لا مركزي: العضلة تشتغل وهي تطول (النزول)'], ['Concentric', 'تقلص مركزي: العضلة تشتغل وهي تقصر (الصعود)'], ['HSR — Heavy Slow Resistance', 'مقاومة ثقيلة وبطيئة'], ['Energy storage', 'تمارين تخزين الطاقة (قفز، هبوط)'], ['Load capacity', 'القدرة التحملية للنسيج'], ['VMO — Vastus Medialis Oblique', 'الجزء المائل من المتسعة الإنسية'], ['Gluteus medius', 'الألوية الوسطى'], ['Abduction / Adduction', 'تبعيد / تقريب'], ['TKE — Terminal Knee Extension', 'المد النهائي للركبة'], ['SLR — Straight Leg Raise', 'رفع الرجل وهي ممدودة'], ['Dynamic valgus', 'انحراف الركبة للداخل أثناء الحركة'], ['Dorsiflexion', 'رفع مشط القدم نحو الساق'], ['NRS', 'مقياس الألم الرقمي 0–10'], ['BMR / TDEE', 'الأيض الأساسي / الحرق اليومي الكلي'], ['NEAT', 'الحرق من النشاط غير الرياضي'], ['Caloric deficit', 'عجز السعرات'], ['Mechanotransduction', 'تحويل الحمل الميكانيكي لإشارة بناء']].map(([a, b]) => `<tr><td class="en"><b>${a}</b></td><td>${b}</td></tr>`).join('')}
</tbody></table>`}
];

// تحويل الدروس الديناميكية إلى نص عند العرض
LESSONS.forEach(l => { if (typeof l.html === 'function') { const fn = l.html; Object.defineProperty(l, 'html', { get: fn }); } });
