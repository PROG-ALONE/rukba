/* ============================================================
   تقرير المتابعة للدكتور — قابل للطباعة / PDF — عربي أو إنكليزي
   ============================================================ */
'use strict';

const RT = {
  ar: {
    title: 'تقرير متابعة تأهيل الوتر الرضفي', sub: 'تقرير الدورة بين الاستشارات — بيانات يومية مسجلة من المريض',
    reportNo: 'رقم الدورة', prepared: 'تاريخ الإعداد', period: 'الفترة',
    patient: 'المريض', body: 'العمر / الطول / الوزن', diagnosis: 'التشخيص', phase: 'المرحلة الحالية', therapist: 'المعالج',
    summary: 'الملخص التنفيذي', kpis: 'المؤشرات الرئيسية',
    adherence: 'الالتزام بالتمارين', adherenceSub: 'من الحجم الموصوف بالأيام المسجلة',
    logged: 'أيام مسجلة', sessions: 'جلسات كاملة / جزئية / بدون',
    painMax: 'أعلى ألم أثناء التمارين', limit: 'الحد المسموح', painMorning: 'أعلى ألم صباحي', overDays: 'أيام فوق الحد',
    steps: 'معدل الخطوات اليومي', stepsTrend: 'النصف الأول ← النصف الثاني', weight: 'تغير الوزن', sleep: 'معدل النوم', hours: 'ساعة',
    exTable: 'الالتزام حسب التمرين', ex: 'التمرين', dose: 'الجرعة', done: 'منجز', skipped: 'متروك', rate: 'النسبة', exPain: 'ألم مسجل',
    daily: 'السجل اليومي التفصيلي', date: 'التاريخ', pDur: 'ألم تمارين', pMorn: 'ألم صبح', stp: 'خطوات', wt: 'وزن',
    charts: 'الرسوم البيانية', chSteps: 'الخطوات اليومية مقابل هدف المرحلة', chPain: 'الألم: أثناء التمارين (أزرق) والصبح (برتقالي)', chAdh: 'نسبة إنجاز التمارين اليومية %', chWeight: 'الوزن (كغم)',
    flags: 'ملاحظات تستدعي الانتباه', notes: 'ملاحظات المريض اليومية', questions: 'أسئلة المريض للدكتور', none: 'لا توجد',
    sigPatient: 'توقيع المريض', sigPT: 'توقيع المعالج / الملاحظات',
    foot: 'أُعدّ هذا التقرير تلقائياً من سجل المريض اليومي في تطبيق رُكبة. القيم ذاتية التسجيل (مقياس ألم رقمي 0–10، خطوات من Fitbit).',
    legend: '✓ منجز · ✗ متروك · – غير مسجل', yes: '✓', no: '✗', na: '–', kg: 'كغم', target: 'الهدف', nutrition: 'التغذية',
    protein: 'معدل البروتين', kcal: 'معدل السعرات', water: 'معدل الماء', liters: 'لتر', g: 'غ', flagged: 'مهم',
    noData: 'لا توجد بيانات بهذه الفترة.'
  },
  en: {
    title: 'Patellar Tendinopathy Rehabilitation — Progress Report', sub: 'Inter-consultation cycle report · patient-recorded daily data',
    reportNo: 'Cycle', prepared: 'Prepared', period: 'Period',
    patient: 'Patient', body: 'Age / Height / Weight', diagnosis: 'Diagnosis', phase: 'Current phase', therapist: 'Physiotherapist',
    summary: 'Executive summary', kpis: 'Key indicators',
    adherence: 'Exercise adherence', adherenceSub: 'of prescribed volume, logged days',
    logged: 'Days logged', sessions: 'Full / partial / no session',
    painMax: 'Peak exercise pain', limit: 'Limit', painMorning: 'Peak morning pain', overDays: 'Days above limit',
    steps: 'Mean daily steps', stepsTrend: '1st half → 2nd half', weight: 'Weight change', sleep: 'Mean sleep', hours: 'h',
    exTable: 'Adherence by exercise', ex: 'Exercise', dose: 'Dose', done: 'Done', skipped: 'Skipped', rate: 'Rate', exPain: 'Pain rec.',
    daily: 'Daily log', date: 'Date', pDur: 'Ex. pain', pMorn: 'AM pain', stp: 'Steps', wt: 'Weight',
    charts: 'Charts', chSteps: 'Daily steps vs phase target', chPain: 'Pain: during exercise (blue) & next morning (orange)', chAdh: 'Daily exercise completion %', chWeight: 'Body weight (kg)',
    flags: 'Points for clinical attention', notes: 'Patient daily notes', questions: 'Patient questions for the physiotherapist', none: 'None',
    sigPatient: 'Patient signature', sigPT: 'Physiotherapist signature / comments',
    foot: 'Generated automatically from the patient’s daily log (Rukba app). Values are self-reported (NRS pain 0–10; step counts from Fitbit).',
    legend: '✓ done · ✗ skipped · – not recorded', yes: '✓', no: '✗', na: '–', kg: 'kg', target: 'target', nutrition: 'Nutrition',
    protein: 'Mean protein', kcal: 'Mean energy intake', water: 'Mean water', liters: 'L', g: 'g', flagged: 'flag',
    noData: 'No data in this period.'
  }
};

VIEWS.report = {
  state: null,
  html() {
    const S = VIEWS.report.state || VIEWS.report.defaultRange();
    VIEWS.report.state = S;
    const lang = D.report.lang || 'ar';
    return `
    <div class="page-head"><div><h1>تقرير الدكتور</h1><p>تقرير احترافي للفترة بين استشارتين. اطبعه أو احفظه PDF وأرسله لـ د. أصيل قبل الجلسة.</p></div>
      <button class="btn primary" id="rpPrint">${ic('print')} طباعة / حفظ PDF</button></div>
    <section class="card report-tools">
      <div class="row">
        <label class="f">من<input type="date" id="rpFrom" value="${S.from}"></label>
        <label class="f">إلى<input type="date" id="rpTo" value="${S.to}"></label>
        <div class="f">فترة سريعة<div class="row" style="margin-top:4px">
          <button class="btn sm" data-q="consult">منذ آخر استشارة</button><button class="btn sm" data-q="cycle">الدورة الحالية</button><button class="btn sm" data-q="14">آخر 14 يوم</button></div></div>
        <span class="spacer"></span>
        <div class="f">لغة التقرير<div class="seg" style="margin-top:4px"><button data-lang="ar" aria-pressed="${lang === 'ar'}">عربي</button><button data-lang="en" aria-pressed="${lang === 'en'}">English</button></div></div>
      </div>
      <label class="f" style="margin-top:12px">أسئلتك للدكتور (سطر لكل سؤال، تظهر بالتقرير)<textarea id="rpQ" placeholder="مثلاً: هل أرجع لتمرين Hip Adduction بالحبل؟">${esc(D.report.questions || '')}</textarea></label>
      <p class="muted" style="margin-bottom:0">على الآيباد: طباعة ← اضغط على المعاينة بإصبعين للتكبير ← مشاركة ← حفظ في الملفات. هكذا يصير عندك PDF ترسله بالواتساب.</p>
    </section>
    <div id="rpPaper">${renderReport(S.from, S.to, lang)}</div>`;
  },
  defaultRange() {
    const lc = lastConsult();
    return { from: lc ? lc.date : addDays(today(), -13), to: today() };
  },
  bind(root) {
    const S = VIEWS.report.state;
    const redraw = () => { for (const k in CHARTS) delete CHARTS[k]; $('#rpPaper').innerHTML = renderReport(S.from, S.to, D.report.lang || 'ar'); bindCharts($('#rpPaper')); };
    $('#rpFrom').onchange = e => { S.from = e.target.value; redraw(); };
    $('#rpTo').onchange = e => { S.to = e.target.value; redraw(); };
    $$('[data-q]', root).forEach(b => b.onclick = () => {
      const q = b.dataset.q;
      if (q === 'consult') Object.assign(S, VIEWS.report.defaultRange());
      if (q === 'cycle') { const c = currentCycle(); S.from = c.start; S.to = c.end < today() ? c.end : today(); }
      if (q === '14') { S.from = addDays(today(), -13); S.to = today(); }
      route();
    });
    $$('[data-lang]', root).forEach(b => b.onclick = () => { D.report.lang = b.dataset.lang; saveCfg(); route(); });
    $('#rpQ').addEventListener('input', e => { D.report.questions = e.target.value; clearTimeout(VIEWS.report._t); VIEWS.report._t = setTimeout(() => { saveCfg(); redraw(); }, 700); });
    $('#rpPrint').onclick = () => window.print();
  }
};

function renderReport(from, to, lang) {
  const T = RT[lang], en = lang === 'en';
  if (!from || !to || from > to) return `<div class="paper"><p>${T.noData}</p></div>`;
  const fd = (s, long) => new Intl.DateTimeFormat(en ? 'en-GB' : 'ar-IQ-u-nu-latn', long ? { day: 'numeric', month: 'short', year: 'numeric' } : { day: 'numeric', month: 'short' }).format(parse(s));
  const wd = s => new Intl.DateTimeFormat(en ? 'en-GB' : 'ar-IQ', { weekday: 'short' }).format(parse(s));
  const N = (v, d = 0) => fmtN(v, d);
  const dz = s => en ? String(s || '').replace(/ث/g, 's') : s;
  const p = D.profile;
  const days = dateRange(from, to);
  const st = days.map(dayStats);
  const logged = st.filter(s => s.log && (s.session !== 'nodata' || s.log.steps != null));
  const withPlan = logged.filter(s => s.planned > 0);
  const plannedSum = sum(withPlan.map(s => s.planned)), doneSum = sum(withPlan.map(s => s.done));
  const adh = plannedSum ? doneSum / plannedSum : null;
  const full = withPlan.filter(s => s.session === 'full').length, part = withPlan.filter(s => s.session === 'partial').length, nos = withPlan.filter(s => s.session === 'none').length;
  const phs = [...new Map(st.filter(s => s.ph).map(s => [s.ph.id, s.ph])).values()];
  const ph = phs.at(-1) || currentPhase();
  const limit = ph?.painLimit ?? 0;
  const painVals = st.map(s => s.painMax).filter(v => v != null);
  const mornVals = st.map(s => s.painMorning).filter(v => v != null);
  const painMax = painVals.length ? Math.max(...painVals) : null, mornMax = mornVals.length ? Math.max(...mornVals) : null;
  const over = st.filter(s => (s.painMax != null && s.painMax > s.limit) || (s.painMorning != null && s.painMorning > s.limit));
  const stepDays = st.filter(s => s.log?.steps != null);
  const stepsAvg = avg(stepDays.map(s => s.log.steps));
  const half = Math.ceil(stepDays.length / 2);
  const s1 = avg(stepDays.slice(0, half).map(s => s.log.steps)), s2 = avg(stepDays.slice(half).map(s => s.log.steps));
  const stepT = ph?.stepTarget || 7000;
  const hitT = stepDays.filter(s => s.log.steps >= stepT).length;
  const ws = weightSeries().filter(w => w.x >= from && w.x <= to);
  const wPrev = weightSeries().filter(w => w.x < from).at(-1);
  const wStart = ws[0] || wPrev, wEnd = ws.at(-1) || wPrev;
  const wChange = wStart && wEnd && wStart !== wEnd ? wEnd.y - wStart.y : null;
  const sleepAvg = avg(st.map(s => s.log?.sleep ?? null));
  const protAvg = avg(st.map(s => s.log ? dayProtein(s.log) : null));
  const kcalAvg = avg(st.map(s => s.log ? dayKcal(s.log) : null));
  const waterAvg = avg(st.map(s => s.log?.water || null));
  const cy = currentCycle(to);

  /* الالتزام حسب التمرين */
  const exRows = [];
  for (const P of phs) {
    const pDays = st.filter(s => s.ph === P && s.log && (s.session !== 'nodata' || s.log.steps != null));
    for (const x of activeEx(P)) {
      let dn = 0, sk = 0; const pains = [];
      for (const s of pDays) { const v = s.log.ex?.[x.id]; if (v?.d === true) dn++; if (v?.d === false) sk++; if (v?.p != null) pains.push(v.p); }
      exRows.push({ P, x, dn, sk, n: pDays.length, rate: pDays.length ? dn / pDays.length : 0, pmax: pains.length ? Math.max(...pains) : null });
    }
  }

  /* نقاط الانتباه */
  const flags = [];
  for (const r of exRows) if (r.n >= 3 && r.rate < .6) flags.push(['warn', en
    ? `<b dir="ltr">${esc(r.x.name)}</b> performed on ${r.dn}/${r.n} logged days${r.sk ? ` (explicitly skipped ${r.sk}×)` : ''} — see patient notes.`
    : `تمرين <b dir="ltr">${esc(r.x.name)}</b> نُفّذ في ${r.dn} من ${r.n} يوم مسجل${r.sk ? ` (تُرك عمداً ${r.sk} مرات)` : ''}. راجع ملاحظات المريض.`]);
  if (over.length) flags.push(['bad', en
    ? `Pain above the phase limit (${limit}/10) on ${over.length} day(s): ${over.map(s => fd(s.date)).join(', ')}.`
    : `ألم فوق حد المرحلة (${limit}/10) في ${over.length} يوم: ${over.map(s => fd(s.date)).join('، ')}.`]);
  else if (painVals.length) flags.push(['ok', en ? `No exercise-related pain above the phase limit (${limit}/10) during the period.` : `لا يوجد ألم فوق حد المرحلة (${limit}/10) طوال الفترة.`]);
  if (!mornVals.length) flags.push(['muted', en ? 'Next-morning (24 h) pain response was not recorded in this period — now tracked daily.' : 'لم يُسجّل ألم الصبح (استجابة 24 ساعة) بهذه الفترة، وصار يُسجّل يومياً.']);
  // قفزات الحمل: زيادة > 30% عن معدل الأيام الثلاثة السابقة
  const spikes = [];
  stepDays.forEach((s, i) => { if (i < 3) return; const b = avg(stepDays.slice(i - 3, i).map(x => x.log.steps)); if (b && s.log.steps > b * 1.3 && s.log.steps - b > 1200) spikes.push(s); });
  if (spikes.length) flags.push(['warn', en
    ? `Step-load spikes (>30% above the previous 3-day mean): ${spikes.map(s => `${fd(s.date)} (${N(s.log.steps)})`).join(', ')}.`
    : `قفزات بحمل المشي (أكثر من 30% فوق معدل الأيام الثلاثة السابقة): ${spikes.map(s => `${fd(s.date)} (${N(s.log.steps)})`).join('، ')}.`]);
  if (nos) flags.push(['muted', en ? `${nos} logged day(s) without an exercise session.` : `${nos} يوم مسجل بدون جلسة تمارين.`]);
  if (protAvg != null && protAvg < energy().protein * .75) flags.push(['warn', en ? `Mean protein intake ${N(protAvg)} g/day is below target (${energy().protein} g).` : `معدل البروتين ${N(protAvg)} غ/يوم أقل من الهدف (${energy().protein} غ).`]);

  /* الملخص */
  const pct = v => v == null ? '—' : r0(v * 100) + '%';
  const sumLines = en ? [
    `Over <b>${days.length}</b> days (${fd(from, 1)} – ${fd(to, 1)}), <b>${logged.length}</b> were logged. The patient completed <b>${pct(adh)}</b> of the prescribed exercise volume on logged days (${full} full, ${part} partial, ${nos} without a session).`,
    painVals.length ? `Peak exercise pain was <b>${painMax}/10</b> against a phase limit of <b>${limit}/10</b>${over.length ? `, exceeded on ${over.length} day(s)` : ', with no exceedances'}.` : '',
    stepsAvg != null ? `Mean daily steps were <b>${N(stepsAvg)}</b>${s1 && s2 && stepDays.length >= 4 ? ` (${N(s1)} → ${N(s2)}, ${s2 >= s1 ? '+' : ''}${r0((s2 / s1 - 1) * 100)}%)` : ''}; the ${N(stepT)}-step target was reached on ${hitT}/${stepDays.length} days.` : '',
    wChange != null ? `Body weight changed by <b>${wChange > 0 ? '+' : ''}${N(wChange, 1)} kg</b> (${N(wStart.y, 1)} → ${N(wEnd.y, 1)} kg).` : (wEnd ? `Latest recorded weight: <b>${N(wEnd.y, 1)} kg</b> (${fd(wEnd.x, 1)}).` : '')
  ] : [
    `من أصل <b>${days.length}</b> يوم (${fd(from, 1)} – ${fd(to, 1)}) سُجّل <b>${logged.length}</b> يوم. أنجز المريض <b>${pct(adh)}</b> من حجم التمارين الموصوف بالأيام المسجلة (${full} جلسة كاملة، ${part} جزئية، ${nos} بدون جلسة).`,
    painVals.length ? `أعلى ألم أثناء التمارين <b>${painMax}/10</b> مقابل حد المرحلة <b>${limit}/10</b>${over.length ? `، وتم تجاوز الحد في ${over.length} يوم` : '، بدون أي تجاوز'}.` : '',
    stepsAvg != null ? `معدل الخطوات اليومي <b>${N(stepsAvg)}</b>${s1 && s2 && stepDays.length >= 4 ? `، وارتفع من ${N(s1)} بالنصف الأول إلى ${N(s2)} بالنصف الثاني (${s2 >= s1 ? '+' : ''}${r0((s2 / s1 - 1) * 100)}%)` : ''}، وتحقق هدف ${N(stepT)} خطوة في ${hitT} من ${stepDays.length} يوم.` : '',
    wChange != null ? `تغير الوزن <b>${wChange > 0 ? '+' : ''}${N(wChange, 1)} كغم</b> (من ${N(wStart.y, 1)} إلى ${N(wEnd.y, 1)}).` : (wEnd ? `آخر وزن مسجل <b>${N(wEnd.y, 1)} كغم</b> (${fd(wEnd.x, 1)}).` : '')
  ];

  /* المصفوفة اليومية */
  const matrixPhases = phs.map(P => {
    const exs = activeEx(P);
    const rows = st.filter(s => s.ph === P);
    return `<div class="tbl-wrap"><table><thead><tr><th class="l">${T.date}</th>${exs.map(x => `<th title="${esc(x.name)}" dir="ltr">${esc(x.short || x.name.slice(0, 6))}</th>`).join('')}<th>${T.pDur}</th><th>${T.pMorn}</th><th>${T.stp}</th><th>${T.wt}</th></tr></thead><tbody>
      ${rows.map(s => `<tr><td class="l" style="white-space:nowrap">${wd(s.date)} ${fd(s.date)}</td>${exs.map(x => { const v = s.log?.ex?.[x.id]?.d; return v === true ? `<td class="ok">${T.yes}</td>` : v === false ? `<td class="no">${T.no}</td>` : `<td class="na">${T.na}</td>`; }).join('')}
        <td style="color:${painColor(s.painMax, s.limit)};font-weight:700">${s.painMax ?? '–'}</td><td style="color:${painColor(s.painMorning, s.limit)};font-weight:700">${s.painMorning ?? '–'}</td><td>${s.log?.steps != null ? N(s.log.steps) : '–'}</td><td>${s.log?.weight ?? '–'}</td></tr>`).join('')}
      </tbody></table></div>
      <p style="font-size:11px;color:var(--rp-muted);margin:6px 0 0">${T.legend} · ${exs.map(x => `<span dir="ltr">${esc(x.short)} = ${esc(x.name)}</span>`).join(' · ')}</p>`;
  }).join('');

  const notes = st.filter(s => s.log?.notes);
  const qs = (D.report.questions || '').split('\n').map(x => x.trim()).filter(Boolean);
  const phName = P => en ? (P.nameEn || P.name) : P.name;
  const dot = c => ({ ok: '#1e8e4e', warn: '#b97800', bad: '#cf3a3a', muted: '#9aa9a8' }[c]);

  const chartSteps = chart({ type: 'bar', w: 420, h: 190, data: st.map(s => ({ x: s.date, y: s.log?.steps ?? null })), refs: [{ y: stepT, label: N(stepT) }], tip: d => `${fd(d.x)}: <b>${d.y == null ? '—' : N(d.y)}</b>` });
  const chartPain = chart({ type: 'line', w: 420, h: 190, data: st.map(s => ({ x: s.date, y: s.painMax, m: s.painMorning })), series: [{ key: 'y', color: '#2a78d6' }, { key: 'm', color: '#eb6834' }], yMin: 0, yMax: 10, ticks: [0, 2, 4, 6, 8, 10], refs: [{ y: limit, label: (en ? 'limit ' : 'الحد ') + limit, color: '#1e8e4e' }], tip: d => `${fd(d.x)}: ${d.y ?? '—'} / ${d.m ?? '—'}` });
  const chartAdh = chart({ type: 'bar', w: 420, h: 190, yMin: 0, yMax: 100, ticks: [0, 25, 50, 75, 100], data: st.map(s => ({ x: s.date, y: s.session === 'nodata' ? null : r0((s.pct || 0) * 100), c: s.pct >= .999 ? '#1baf7a' : '#2a78d6' })), tip: d => `${fd(d.x)}: <b>${d.y ?? '—'}%</b>` });
  const wAll = weightSeries().filter(w => w.x <= to).slice(-12);
  const chartW = wAll.length >= 2 ? chart({ type: 'line', w: 420, h: 190, connect: true, data: wAll, refs: [{ y: p.goalWeight, label: (en ? 'goal ' : 'الهدف ') + p.goalWeight, color: '#1e8e4e' }], tip: d => `${fd(d.x, 1)}: <b>${N(d.y, 1)}</b>` }) : `<p style="color:var(--rp-muted);font-size:12px">${en ? 'Not enough weight entries yet.' : 'لا توجد قراءات وزن كافية بعد.'}</p>`;

  return `<div class="paper" dir="${en ? 'ltr' : 'rtl'}" lang="${lang}">
    <div class="rp-head">
      <div class="mark">${LOGO}<div><h1>${T.title}</h1><div style="color:var(--rp-muted);font-size:12.5px">${T.sub}</div></div></div>
      <div class="meta">${T.reportNo}: <b>#${cy.index}</b><br>${T.period}: <b>${fd(from, 1)} – ${fd(to, 1)}</b><br>${T.prepared}: ${fd(today(), 1)}</div>
    </div>
    <div class="rp-id">
      <div><span>${T.patient}</span><b>${esc(en ? (p.nameEn || p.name) : p.name)}</b></div>
      <div><span>${T.body}</span><b>${p.age} · ${p.height} cm · ${wEnd ? N(wEnd.y, 1) : p.startWeight} kg</b></div>
      <div><span>${T.phase}</span><b>${esc(ph ? phName(ph) : '—')}</b></div>
      <div><span>${T.therapist}</span><b>${esc(en ? (p.therapistEn || p.therapist) : p.therapist)}</b></div>
    </div>
    <div style="font-size:12px;color:var(--rp-muted);margin-top:8px">${T.diagnosis}: <b style="color:#17282a">${esc(en ? (p.diagnosisEn || p.diagnosis) : p.diagnosis)}</b></div>

    <h2>${T.summary}</h2>
    <div class="rp-summary">${sumLines.filter(Boolean).map(l => `<div>${l}</div>`).join('')}</div>

    <h2>${T.kpis}</h2>
    <div class="rp-kpis">
      <div class="rp-kpi"><span>${T.adherence}</span><b>${pct(adh)}</b><em>${T.adherenceSub}</em></div>
      <div class="rp-kpi"><span>${T.logged}</span><b>${logged.length}/${days.length}</b><em>${T.sessions}: ${full} / ${part} / ${nos}</em></div>
      <div class="rp-kpi"><span>${T.painMax}</span><b style="color:${painColor(painMax, limit)}">${painMax ?? '—'}<small style="font-size:13px;color:var(--rp-muted)">/10</small></b><em>${T.limit} ${limit}/10 · ${T.overDays}: ${over.length}</em></div>
      <div class="rp-kpi"><span>${T.painMorning}</span><b style="color:${painColor(mornMax, limit)}">${mornMax ?? '—'}<small style="font-size:13px;color:var(--rp-muted)">/10</small></b><em>${T.limit} ${limit}/10</em></div>
      <div class="rp-kpi"><span>${T.steps}</span><b>${N(stepsAvg)}</b><em>${en ? `${T.stepsTrend}: ${N(s1)} → ${N(s2)}` : `النصف الأول ${N(s1)} · الثاني ${N(s2)}`}</em></div>
      <div class="rp-kpi"><span>${T.weight}</span><b>${wChange == null ? '—' : (wChange > 0 ? '+' : '') + N(wChange, 1)}</b><em>${wEnd ? N(wEnd.y, 1) + ' ' + T.kg : ''} · ${T.target} ${p.goalWeight}</em></div>
      <div class="rp-kpi"><span>${T.sleep}</span><b>${sleepAvg == null ? '—' : N(sleepAvg, 1)}</b><em>${T.hours}</em></div>
      <div class="rp-kpi"><span>${T.protein}</span><b>${protAvg == null ? '—' : N(protAvg)}</b><em>${T.g}/day · ${T.target} ${energy().protein}</em></div>
    </div>

    <h2>${T.flags}</h2>
    ${flags.length ? flags.map(([c, t]) => `<div class="rp-flag"><i style="background:${dot(c)}"></i><div>${t}</div></div>`).join('') : `<p>${T.none}</p>`}

    <h2>${T.exTable}</h2>
    <table><thead><tr><th class="l">${T.ex}</th><th>${T.dose}</th><th>${T.done}</th><th>${T.skipped}</th><th style="width:22%">${T.rate}</th><th>${T.exPain}</th></tr></thead><tbody>
    ${exRows.map((r, i) => `${i === 0 || exRows[i - 1].P !== r.P ? `<tr><td class="l" colspan="6" style="background:#fafcfc;font-weight:700;color:var(--rp-accent)">${esc(phName(r.P))} · ${T.limit} ${r.P.painLimit}/10</td></tr>` : ''}
      <tr><td class="l" dir="ltr" style="text-align:${en ? 'left' : 'right'}">${esc(r.x.name)}</td><td dir="ltr">${esc(dz(r.x.dose))}</td><td>${r.dn}/${r.n}</td><td>${r.sk || '–'}</td>
      <td><div style="display:flex;align-items:center;gap:6px"><div class="rp-bar" style="flex:1"><i style="width:${r0(r.rate * 100)}%;${r.rate < .6 ? 'background:#b97800' : ''}"></i></div><span style="min-width:34px">${r0(r.rate * 100)}%</span></div></td><td>${r.pmax ?? '–'}</td></tr>`).join('')}
    </tbody></table>

    <h2>${T.charts}</h2>
    <div class="rp-charts">
      <div class="c"><h4>${T.chSteps}</h4>${chartSteps}</div>
      <div class="c"><h4>${T.chPain}</h4>${chartPain}</div>
      <div class="c"><h4>${T.chAdh}</h4>${chartAdh}</div>
      <div class="c"><h4>${T.chWeight}</h4>${chartW}</div>
    </div>

    <h2>${T.daily}</h2>
    ${matrixPhases || `<p>${T.noData}</p>`}

    ${kcalAvg != null || waterAvg != null ? `<h2>${T.nutrition}</h2><p>${T.kcal}: <b>${N(kcalAvg)}</b> kcal · ${T.protein}: <b>${N(protAvg)}</b> ${T.g} · ${T.water}: <b>${waterAvg == null ? '—' : N(waterAvg, 1)}</b> ${T.liters}</p>` : ''}

    <h2>${T.notes}</h2>
    <div class="rp-notes">${notes.length ? notes.map(s => `<div class="n"><b>${wd(s.date)} ${fd(s.date, 1)}${s.log.flag ? ` · <span style="color:#cf3a3a">★ ${T.flagged}</span>` : ''}</b><p dir="auto">${esc(s.log.notes)}</p></div>`).join('') : `<p>${T.none}</p>`}</div>

    <h2>${T.questions}</h2>
    ${qs.length ? `<ol>${qs.map(q => `<li dir="auto">${esc(q)}</li>`).join('')}</ol>` : `<p style="color:var(--rp-muted)">${T.none}</p>`}

    <div class="rp-sign"><div>${T.sigPatient}</div><div>${T.sigPT}</div></div>
    <div class="rp-foot"><span>${T.foot}</span><span dir="ltr">Rukba v${APP_VERSION}</span></div>
  </div>`;
}
