/* ============================================================
   البيانات الافتراضية + البيانات التاريخية المستوردة من ملفات الإكسل
   ============================================================ */
'use strict';

const YT = id => id.startsWith('http') ? id : 'https://youtu.be/' + id;

const DEFAULT_PHASES = [
  {
    id: 'p1',
    name: 'المرحلة الأولى — التمارين الثابتة (Isometric)',
    nameEn: 'Stage 1 — Isometric loading & hip activation',
    start: '2026-08-10',
    end: '2026-09-09',
    painLimit: 2,
    stepTarget: 3000,
    goal: 'تسكين ألم الوتر وتنشيط عضلات الحوض والرباعية بدون حركة للمفصل',
    exercises: [
      { id: 'p1_add',    name: 'Hip Adduction',          short: 'Add',   dose: '10 × 5 ث',  goal: 'تقوية مقربات الورك (العضلات الداخلية للفخذ)', video: YT('ouuk6Ju_f9U'), active: true },
      { id: 'p1_clam',   name: 'Clam Shells',            short: 'Clam',  dose: '10 × 10 ث', goal: 'تقوية الدوران الخارجي للورك وتثبيت الركبة', video: YT('uSKFaUusmuQ'), active: true },
      { id: 'p1_abd',    name: 'Hip Abduction',          short: 'Abd',   dose: '10 × 5 ث',  goal: 'تقوية مبعدات الورك (الألوية الوسطى)', video: YT('2W7aEACeHgk'), active: true },
      { id: 'p1_quad60', name: 'Quad Extension 60° (Isometric)', short: 'Q60', dose: '2 × 45 ث', goal: 'تسكين ألم الوتر وتحميله بشكل ثابت', video: YT('0Zmq1xvL0LQ'), active: true },
      { id: 'p1_slr',    name: 'Straight Leg Raises',    short: 'SLR',   dose: '10 × 10 ث', goal: 'تنشيط الرباعية والركبة ممدودة', video: YT('qKWtvu1TIyE'), active: true }
    ]
  },
  {
    id: 'p2',
    name: 'المرحلة الثانية — التقوية والتحميل الوظيفي',
    nameEn: 'Stage 2 — Strengthening & functional loading',
    start: '2026-09-10',
    end: '',
    painLimit: 0,
    stepTarget: 7000,
    goal: 'تقوية الحوض والرباعية وإدخال تحميل وظيفي مضبوط على الركبة',
    exercises: [
      { id: 'p2_abdBand', name: 'Standing Hip Abduction (Band)', short: 'Abd-B',  dose: '2 × 15',      goal: 'تقوية مبعدات الورك وتحسين ثبات الحوض', video: YT('https://youtube.com/shorts/7Sph-K6Nmgc'), active: true },
      { id: 'p2_addBand', name: 'Standing Hip Adduction (Band)', short: 'Add-B',  dose: '2 × 15',      goal: 'تقوية مقربات الورك والتحكم بالساق', video: YT('https://youtube.com/shorts/IPewvFNyhgk'), active: true },
      { id: 'p2_clam',    name: 'Clam Shells — Thicker Band',    short: 'Clam',   dose: '10 × 10 ث',   goal: 'تقوية الدوران الخارجي للورك وتحسين ثبات الركبة', video: YT('uSKFaUusmuQ'), active: true },
      { id: 'p2_slAbd',   name: 'Side-Lying Hip Abduction (1 kg)', short: 'SL-Abd', dose: '10 × 10 ث', goal: 'تقوية مبعدات الورك وتحسين التحكم الجانبي', video: YT('2W7aEACeHgk'), active: true },
      { id: 'p2_tke',     name: 'Terminal Knee Extension',       short: 'TKE',    dose: '2 × 10 × 5 ث', goal: 'تحسين التحكم بالمد النهائي وتنشيط الرباعية', video: YT('https://youtube.com/shorts/CU7Fn11YMTw'), active: true },
      { id: 'p2_quad60',  name: 'Quad Isometric 60° — Full Power', short: 'Q60',  dose: '2 × 45 ث',    goal: 'رفع قدرة الرباعية على إنتاج القوة بصورة ثابتة', video: YT('0Zmq1xvL0LQ'), active: true },
      { id: 'p2_slr',     name: 'Lying Straight Leg Raise (1 kg)', short: 'SLR',  dose: '10 × 10 ث',   goal: 'تقوية الرباعية مع الحفاظ على الركبة ممدودة', video: YT('qKWtvu1TIyE'), active: true },
      { id: 'p2_heel',    name: 'Single-Leg Heel Touch Down',    short: 'Heel',   dose: '2 × 10',      goal: 'التحكم بساق واحدة والسيطرة على الركبة والحوض', video: YT('7gWtTurbAmk'), active: true },
      { id: 'p2_step',    name: 'Step Down — Knees Over Toes',   short: 'Step',   dose: '2 × 20',      goal: 'تحميل وظيفي مضبوط على الركبة وتحسين تحمل الحركة', video: YT('llRS0KIfcCE'), active: true },
      { id: 'p2_slAdd',   name: 'Side-Lying Hip Adduction (1 kg)', short: 'SL-Add', dose: '10 × 5 ث',  goal: 'تقوية عضلات الفخذ الداخلية والتحكم بالحوض (موجود بتفاصيل الدكتور وغير مسجل بالجدول)', video: YT('https://youtu.be/lhwT35sshrI'), active: false }
    ]
  }
];

const DEFAULT_CONSULTS = [
  { id: 'c1', date: '2026-08-10', title: 'التقييم الأول مع د. أصيل', notes: 'تشخيص: التهاب مزمن في الوتر الرضفي مع تآكل، وقدرة تحمل منخفضة. بدء المرحلة الأولى (عزل وتقوية الحوض). الخطوات ≤ 3000 باليوم، الصلاة على الكرسي، حد الألم 2 من 10.' },
  { id: 'c2', date: '2026-09-10', title: 'الاستشارة الثانية — الانتقال للمرحلة الثانية', notes: 'زيادة شدة التمارين (من العزل إلى التقوية). الخطوات من 5000 إلى 6000 ثم 7000. حد الألم صفر.' }
];

/* قاعدة بيانات أغذية مبسطة — القيم لكل 100 غرام (تقريبية، USDA) */
const DEFAULT_FOODS = [
  { id: 'egg',      name: 'بيض (بيضة كبيرة ≈ 50غ)', kcal: 143, p: 12.6, c: 0.7,  f: 9.5, unit: 'بيضة', unitG: 50 },
  { id: 'eggplant', name: 'باذنجان',                 kcal: 25,  p: 1.0,  c: 6.0,  f: 0.2 },
  { id: 'zucchini', name: 'شجر (كوسة)',              kcal: 17,  p: 1.2,  c: 3.1,  f: 0.3 },
  { id: 'carrot',   name: 'جزر',                     kcal: 41,  p: 0.9,  c: 9.6,  f: 0.2 },
  { id: 'tomato',   name: 'طماطة',                   kcal: 18,  p: 0.9,  c: 3.9,  f: 0.2 },
  { id: 'onion',    name: 'بصل',                     kcal: 40,  p: 1.1,  c: 9.3,  f: 0.1 },
  { id: 'chard',    name: 'سلك مطبوخ',               kcal: 20,  p: 1.9,  c: 4.1,  f: 0.1 },
  { id: 'mallow',   name: 'خباز مطبوخ (تقديري)',     kcal: 30,  p: 2.5,  c: 5.0,  f: 0.3 },
  { id: 'oil',      name: 'زيت (ملعقة كبيرة ≈ 13.5غ)', kcal: 884, p: 0,  c: 0,    f: 100, unit: 'ملعقة', unitG: 13.5 },
  { id: 'milkpwd',  name: 'حليب مجفف كامل الدسم (ملعقة ≈ 7.5غ)', kcal: 496, p: 26, c: 38, f: 27, unit: 'ملعقة', unitG: 7.5 },
  { id: 'sugar',    name: 'شكر (ملعقة صغيرة ≈ 4غ)', kcal: 400, p: 0,    c: 100,  f: 0, unit: 'ملعقة صغيرة', unitG: 4 },
  { id: 'tea',      name: 'شاي (استكان)',            kcal: 1,   p: 0,    c: 0.3,  f: 0, unit: 'استكان', unitG: 100 },
  { id: 'bread',    name: 'خبز تنور (رغيف ≈ 100غ)', kcal: 270, p: 9,    c: 55,   f: 1.5, unit: 'رغيف', unitG: 100 },
  { id: 'samoon',   name: 'صمون (قطعة ≈ 90غ)',      kcal: 275, p: 9,    c: 54,   f: 2.5, unit: 'صمونة', unitG: 90 },
  { id: 'rice',     name: 'تمن مطبوخ',               kcal: 130, p: 2.7,  c: 28,   f: 0.3 },
  { id: 'chicken',  name: 'صدر دجاج مطبوخ',          kcal: 165, p: 31,   c: 0,    f: 3.6 },
  { id: 'beef',     name: 'لحم أحمر مطبوخ (قليل الدهن)', kcal: 220, p: 27, c: 0,  f: 12 },
  { id: 'fish',     name: 'سمك مشوي',                kcal: 150, p: 25,   c: 0,    f: 5 },
  { id: 'tuna',     name: 'تونة بالماء (مصفاة)',     kcal: 116, p: 26,   c: 0,    f: 1 },
  { id: 'yogurt',   name: 'لبن رائب',                kcal: 61,  p: 3.5,  c: 4.7,  f: 3.3 },
  { id: 'greek',    name: 'لبن يوناني / مصفى قليل الدسم', kcal: 73, p: 10, c: 3.9, f: 1.9 },
  { id: 'cheese',   name: 'جبن أبيض',                kcal: 260, p: 17,   c: 2,    f: 21 },
  { id: 'lentils',  name: 'عدس مطبوخ',               kcal: 116, p: 9,    c: 20,   f: 0.4 },
  { id: 'chickpea', name: 'حمص مطبوخ',               kcal: 164, p: 8.9,  c: 27,   f: 2.6 },
  { id: 'dates',    name: 'تمر (حبة ≈ 8غ)',          kcal: 282, p: 2.5,  c: 75,   f: 0.4, unit: 'حبة', unitG: 8 },
  { id: 'banana',   name: 'موز',                     kcal: 89,  p: 1.1,  c: 23,   f: 0.3 },
  { id: 'apple',    name: 'تفاح',                    kcal: 52,  p: 0.3,  c: 14,   f: 0.2 },
  { id: 'cucumber', name: 'خيار',                    kcal: 15,  p: 0.7,  c: 3.6,  f: 0.1 },
  { id: 'potato',   name: 'بطاطا مسلوقة',            kcal: 87,  p: 1.9,  c: 20,   f: 0.1 },
  { id: 'milk',     name: 'حليب سائل',               kcal: 61,  p: 3.2,  c: 4.8,  f: 3.3 },
  { id: 'whey',     name: 'واي بروتين (سكوب ≈ 30غ)', kcal: 400, p: 80,   c: 8,    f: 5, unit: 'سكوب', unitG: 30 }
];

/* قوالب الوجبات (قابلة للتعديل من تبويب التغذية) — الكميات بالغرام */
const DEFAULT_MEALS = [
  { id: 'm_pizza', name: 'بيتزا الخضار والبيض (بالفرن)', slot: 'b',
    items: [ { f: 'egg', g: 150 }, { f: 'eggplant', g: 150 }, { f: 'zucchini', g: 150 }, { f: 'carrot', g: 80 }, { f: 'oil', g: 13.5 } ] },
  { id: 'm_chard', name: 'سلك / خباز مطبوخ', slot: 'l',
    items: [ { f: 'chard', g: 300 }, { f: 'onion', g: 60 }, { f: 'oil', g: 13.5 } ] },
  { id: 'm_tea', name: 'شاي بالحليب المجفف (ملعقتين)', slot: 'x',
    items: [ { f: 'tea', g: 100 }, { f: 'milkpwd', g: 15 } ] },
  { id: 'm_pizza_p', name: 'بيتزا الخضار + بروتين إضافي (مقترح)', slot: 'b',
    items: [ { f: 'egg', g: 150 }, { f: 'eggplant', g: 150 }, { f: 'zucchini', g: 150 }, { f: 'carrot', g: 80 }, { f: 'oil', g: 7 }, { f: 'cheese', g: 40 }, { f: 'greek', g: 200 } ] },
  { id: 'm_chard_p', name: 'سلك + صدر دجاج (مقترح)', slot: 'l',
    items: [ { f: 'chard', g: 300 }, { f: 'onion', g: 60 }, { f: 'oil', g: 10 }, { f: 'chicken', g: 180 } ] },
  { id: 'm_tuna', name: 'تونة + خيار + خبز ½ (مقترح)', slot: 'd',
    items: [ { f: 'tuna', g: 120 }, { f: 'cucumber', g: 150 }, { f: 'tomato', g: 100 }, { f: 'bread', g: 50 } ] }
];

const MEAL_SLOTS = { b: 'الريوك (الصبح)', l: 'الغداء (الظهر)', d: 'العصر / العشاء', x: 'إضافات ومشروبات' };

const DEFAULT_PROFILE = {
  name: 'حيدر ناصف',
  nameEn: 'Haider Nassef',
  age: 26, sex: 'm', height: 175,
  startWeight: 85, startDate: '2026-08-02', goalWeight: 65, fitWeight: 69,
  activity: 1.4, deficit: 500,
  proteinPerKg: 1.6,
  waterTarget: 3, sleepTarget: 8,
  diagnosis: 'التهاب/اعتلال مزمن في الوتر الرضفي (Chronic patellar tendinopathy)',
  diagnosisEn: 'Chronic patellar tendinopathy with reduced tendon load capacity',
  therapist: 'د. أصيل بدار — علاج طبيعي',
  therapistEn: 'Dr. Aseel Baddar — Physiotherapy',
  vitD: '50,000 IU أسبوعياً (يوم الجمعة)',
  nextConsult: ''
};

/* ---- البيانات التاريخية من ملفات الإكسل ---- */
function buildSeedLogs() {
  const L = {};
  const p1 = ['p1_add', 'p1_clam', 'p1_abd', 'p1_quad60', 'p1_slr'];
  const s1 = [
    ['2026-08-14', 3, "I have completed two sessions, one in the morning and one in the evening, but there is pain on the inner side of the knee, below the patella, right next to the patellar tendon, a ratio of 4-10 due to the \"Quad Ext 60°\" exercise."],
    ['2026-08-15', 4, ""],
    ['2026-08-16', 3, "There is a feeling of building and at the same time of weakness. I feel this when I want to stand or when standing to the left, leaning on the knee and on a small muscle to the right, below the quadriceps muscle, next to the knee itself and above the patellar tendon, and I feel a feeling of weakness in the inner quadriceps muscle."],
    ['2026-08-17', 2, ""],
    ['2026-08-18', 2, "I completed the exercises at night, but because of the Hip Adduction exercise, I admit I pushed myself too hard until I felt muscle burns. Immediately afterward, while sleeping, I experienced pain in my bladder and testicle. It was nerve-related, not localized, on the right side, not the site of the surgery. However, the next day, Wednesday morning, it disappeared by 95%."],
    ['2026-08-19', 0, ""],
    ['2026-08-20', 0, "It was a good day, but during work, I try not to sit for long periods, and my legs are usually at a 90-degree angle to the chair. This causes me slight pain. Also, when I'm exposed to cold, I tried to walk today and increase my daily steps, as my daily step count has decreased significantly. Before the 1st of this month, I used to take at least 12,000 steps, and I also exercised. But since the 2nd of August, my steps have ranged between 3,000 and 4,000. Today I walked 7,000 steps while wearing a knee brace. I felt a strange sensation and discomfort in my left leg, and I limped slightly. My right leg also felt a little pain in the knee, but after I got home and did my daily exercises, I experienced a feeling of pain, looseness, and lack of focus. Today, none of that is present, but I still feel looseness in my left knee and muscles."]
  ];
  s1.forEach(([d, pain, note]) => {
    const ex = {}; p1.forEach(id => ex[id] = { d: true, p: null });
    L[d] = { date: d, ex, painDuring: pain, notes: note, steps: d === '2026-08-20' ? 7000 : null, updatedAt: 1 };
  });

  const p2 = ['p2_abdBand', 'p2_addBand', 'p2_clam', 'p2_slAbd', 'p2_tke', 'p2_quad60', 'p2_slr', 'p2_heel', 'p2_step'];
  // [date, steps, addBand state, pattern] pattern: 'all' | 'stepOnly' | 'none'
  const s2 = [
    ['2026-09-10', 4878, true,  'all', "Severe cramps due to the intense exercise session we had, followed by further exercises, led to cramps for 3 days, after which I got used to it."],
    ['2026-09-11', 3331, true,  'all', ""],
    ['2026-09-12', 5276, true,  'all', ""],
    ['2026-09-13', 6136, false, 'all', "I can do this exercise on my left leg, but on my right leg, I get pain in my right testicle and bladder. The \"Hip Adduction Band\" and the \"Terminal Knee Extension\" exercise on my left leg cause pain in my kneecap on the outside and above my leg in the quadriceps tendon. The internal atrophy in the quadriceps becomes more pronounced. There's an observation I know is funny, but honestly, it's made me anxious because my buttocks have gotten bigger, honestly, due to the exercises that target the external pelvis. 😅 Overall, I'm doing very well. To summarize the feeling simply, when I do these exercises, I feel great relief in my knee. It feels freer, more flexible, and easier to move. But here, please pay attention: sometimes I get a moment similar to when you crack all your fingers except one. You get a feeling of discomfort because it's the only one that doesn't crack. This feeling is more neurological than muscular, and it's the same feeling I sometimes have. I feel like I want to crack my knee and the area around it to feel better."],
    ['2026-09-14', 4962, false, 'all', ""],
    ['2026-09-15', 5058, false, 'all', ""],
    ['2026-09-16', 4834, false, 'all', ""],
    ['2026-09-17', 5237, false, 'all', ""],
    ['2026-09-18', 1023, null,  'stepOnly', ""],
    ['2026-09-19', 6444, false, 'all', ""],
    ['2026-09-20', 7175, false, 'all', ""],
    ['2026-09-21', 8029, false, 'all', ""],
    ['2026-09-22', 8009, null,  'none', ""],
    ['2026-09-23', 8059, null,  'none', ""],
    ['2026-09-24', 7008, false, 'all', ""],
    ['2026-09-25', 6611, false, 'all', ""],
    ['2026-09-26', 3957, false, 'all', "[Overall note for weeks 1–2] Every day I climbed the stairs, and the height of the steps was high and not normal. On the same day, I did my exercises and took steps, and I didn't experience any pain. However, when I first started taking more steps, I felt slow and limped. Over the days, the distance increased until I reached 7000-8000 steps, which was normal. After I returned home, did my exercises, and went to sleep, I woke up feeling fine."]
  ];
  s2.forEach(([d, steps, add, pat, note]) => {
    const ex = {};
    p2.forEach(id => {
      let v = null;
      if (pat === 'all') v = true;
      if (pat === 'stepOnly') v = id === 'p2_step' ? true : null;
      if (id === 'p2_addBand' && pat === 'all') v = add;
      ex[id] = { d: v, p: null };
    });
    L[d] = { date: d, ex, painDuring: 0, steps, notes: note, updatedAt: 1 };
  });
  L['2026-08-02'] = { date: '2026-08-02', weight: 85, notes: 'الوزن عند بداية التوقف عن الرياضة (كان 69 كغم وقت التمرين).', updatedAt: 1 };
  return L;
}
