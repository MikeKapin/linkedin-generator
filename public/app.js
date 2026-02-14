// ── State ──
let selectedType = 'trending';
let lastSources = [];
let lastHashtags = [];

// ── Elements ──
const $ = id => document.getElementById(id);
const output = $('postOutput');
const charCount = $('charCount');
const generateBtn = $('generateBtn');
const copyBtn = $('copyBtn');
const regenBtn = $('regenBtn');
const saveBtn = $('saveBtn');
const status = $('status');
const sourcesList = $('sourcesList');
const sourcesPanel = $('sourcesPanel');
const draftsList = $('draftsList');
const topicInput = $('topicInput');
const toneSelect = $('toneSelect');

// ── Content Type Selection ──
document.querySelectorAll('.type-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedType = btn.dataset.type;
  });
});

// ── Character Counter ──
output.addEventListener('input', updateCharCount);
function updateCharCount() {
  const len = output.value.length;
  charCount.textContent = `${len} / 3000`;
  charCount.className = 'char-count' + (len > 3000 ? ' over' : len > 2700 ? ' warn' : '');
}

// ── Search Queries by Type ──
const SEARCH_QUERIES = {
  trending: [
    'Canadian HVAC industry news 2026',
    'TSSA gas technician Ontario updates',
    'CSA B149 code changes Canada',
    'natural gas furnace recalls Canada',
    'carbon monoxide incidents Canada furnace'
  ],
  tips: [
    'furnace no heat troubleshooting common causes',
    'gas pressure regulator problems HVAC',
    'furnace venting failures diagnosis',
    'HVAC thermocouple troubleshooting tips',
    'condensing furnace drain issues winter'
  ],
  uncommon: [
    'unusual HVAC problems technicians encounter',
    'cross connected venting gas appliances',
    'intermittent flame rollout furnace causes',
    'HVAC misdiagnosis common mistakes gas technician',
    'strange furnace problems hard to diagnose'
  ],
  code: [
    'CSA B149.1-25 code requirements gas piping',
    'CSA B149.1 venting requirements Canada',
    'TSSA gas code compliance Ontario',
    'CSA gas appliance installation clearances',
    'CSA B149.1 pressure testing requirements'
  ],
  career: [
    'HVAC trade shortage Canada 2026',
    'gas technician apprenticeship Ontario',
    'skilled trades careers Canada demand',
    'HVAC technician salary Canada 2026',
    'Fanshawe College HVAC program gas technician'
  ]
};

// ── Season Awareness ──
function getSeasonContext() {
  const m = new Date().getMonth();
  if (m >= 10 || m <= 2) return { season: 'winter', topics: 'heating season, furnace breakdowns, carbon monoxide safety, no-heat calls, frozen condensate lines' };
  if (m >= 3 && m <= 4) return { season: 'spring', topics: 'AC tune-ups, cooling season prep, spring maintenance, air conditioning startups' };
  if (m >= 5 && m <= 7) return { season: 'summer', topics: 'air conditioning issues, cooling demand, refrigerant, heat pumps' };
  return { season: 'fall', topics: 'furnace inspections, heating season prep, carbon monoxide detectors, fall maintenance' };
}

// ── Post Templates ──
const TEMPLATES = {
  trending: [
    (data, tone) => `${data.hook}

Here's what every gas tech in Canada needs to know about this right now.

${data.body}

The reality? This affects every technician working in the field today. If you're not staying current with CSA B149.1-25 and TSSA requirements, you're already behind.

${data.callToAction}

${data.hashtags}`,

    (data, tone) => `🔥 This just hit my radar and it matters.

${data.hook}

${data.body}

I've been teaching gas tech for years — this is the kind of thing that separates the pros from the guys who "just install stuff."

Stay sharp. Stay current. Your license depends on it.

${data.hashtags}`,

    (data, tone) => `Let's talk about what's happening in Canadian HVAC right now.

${data.hook}

${data.body}

This isn't US-centric advice. This is specifically about working under CSA B149.1-25 in Canada. Different code, different standards, different expectations.

If you're a gas tech in Ontario or anywhere in Canada — pay attention.

${data.hashtags}`,

    (data, tone) => `⚠️ ${data.hook}

I keep seeing this come up and it needs to be addressed.

${data.body}

The bottom line: know your code, know your responsibilities, and don't cut corners. The CSA B149.1-25 exists for a reason.

What's your take? Drop it in the comments 👇

${data.hashtags}`,

    (data, tone) => `Hot take from someone who trains gas technicians for a living:

${data.hook}

${data.body}

I'm not here to sugarcoat this. The industry is changing, the codes are updating, and the techs who adapt will thrive. The ones who don't? Well...

${data.callToAction}

${data.hashtags}`,

    (data, tone) => `🇨🇦 Canadian HVAC update — this is important.

${data.hook}

${data.body}

We don't reference US codes here. CSA B149.1-25 is what matters. TSSA is who regulates us. If your training didn't cover this, we need to talk.

Share this with a tech who needs to see it.

${data.hashtags}`
  ],

  tips: [
    (data) => `Every gas tech has gotten THAT call. The one where the homeowner says "my furnace won't start" and you already know what it is before you walk in.

Here's a tip that'll save you time:

${data.body}

This is bread-and-butter stuff, but I still see journeyman techs miss it. Don't be that tech.

Pro tip: Always reference CSA B149.1-25 when you're unsure about installation requirements. The code is your best friend.

${data.hashtags}`,

    (data) => `💡 Quick field tip from the classroom to the jobsite:

${data.hook}

${data.body}

I teach this stuff at Fanshawe and I'll tell you — the techs who master these fundamentals are the ones who build real careers. Not the ones chasing shortcuts.

Save this post. You'll need it on a -20°C February night.

${data.hashtags}`,

    (data) => `Here's something I wish someone told me when I started in the trade:

${data.body}

It sounds simple. It IS simple. But simple doesn't mean easy when it's midnight, it's -25°C, and the homeowner is standing behind you asking "is it fixed yet?"

Master the basics. Everything else builds from there.

${data.hashtags}`,

    (data) => `🔧 No heat call? Before you start replacing parts, check these first:

${data.body}

I've seen techs throw a $400 board at a problem that was caused by a $2 fuse. Diagnosis first. Parts second. Always.

The best techs I've trained? They're methodical. They follow procedure. And they reference CSA B149.1-25 requirements — not YouTube videos.

${data.hashtags}`,

    (data) => `Real talk: ${data.hook}

${data.body}

This is the kind of knowledge that separates a gas tech who makes $30/hr from one who makes $50/hr. Expertise pays. Invest in yours.

What's your go-to diagnostic tip? Let's hear it 👇

${data.hashtags}`,

    (data) => `It's peak heating season in Canada. Furnace calls are non-stop. Here's what I'm seeing in the field:

${data.body}

Every one of these is covered in the CSA B149.1-25. Know your code. Trust your training. And for the love of everything — check the simple stuff first.

${data.hashtags}`
  ],

  uncommon: [
    (data) => `This one had me scratching my head for 20 minutes.

${data.hook}

${data.body}

You won't find this in most textbooks. But it happens more often than you'd think. And if you're not looking for it, you'll miss it every time.

This is why experience matters. This is why mentorship matters.

${data.hashtags}`,

    (data) => `🤯 Ever seen this? ${data.hook}

${data.body}

I share stuff like this because the trade needs to talk about the weird calls. The textbook doesn't cover everything. Real-world experience fills the gaps.

Encountered something weird in the field? Share it below — we all learn from each other.

${data.hashtags}`,

    (data) => `Here's a call that would stump most apprentices — and some journeyman techs too.

${data.hook}

${data.body}

The lesson? Never assume. Always verify. And when something doesn't make sense, dig deeper. The CSA B149.1-25 gives you the framework, but field experience gives you the instincts.

${data.hashtags}`,

    (data) => `Nobody teaches you this in school. But you NEED to know it.

${data.hook}

${data.body}

Cross-connected venting, intermittent flame rollout, phantom lockouts — these are the calls that make or break a technician's reputation.

If you've seen something weirder, I want to hear about it 👇

${data.hashtags}`,

    (data) => `⚠️ Safety alert from the field:

${data.hook}

${data.body}

This is exactly why TSSA takes compliance seriously. This is why the code exists. When things go wrong with gas appliances, people can get hurt.

Stay vigilant. Stay trained. Stay safe.

${data.hashtags}`
  ],

  code: [
    (data) => `📖 CSA B149.1-25 Deep Dive:

${data.hook}

${data.body}

This isn't optional knowledge. This is the standard we work under in Canada. If you hold a G2 or G3 license, you need to know this cold.

Bookmark this. Reference it. Live it.

${data.hashtags}`,

    (data) => `Let me break down a CSA B149.1-25 clause that trips up a LOT of technicians:

${data.hook}

${data.body}

The code isn't written to be confusing — but it does require careful reading. I spend hours helping students understand these clauses at Fanshawe.

Here's the short version: when in doubt, go back to the code book. The answer is always there.

${data.hashtags}`,

    (data) => `🇨🇦 This is a CANADIAN code post. Not US. Not international. CSA B149.1-25.

${data.hook}

${data.body}

I see too much US-centric HVAC content online. The codes are DIFFERENT. The requirements are DIFFERENT. If you're working in Canada, you need Canadian code knowledge.

Questions? Drop them below — I'll answer what I can.

${data.hashtags}`,

    (data) => `Pop quiz for Ontario gas techs:

${data.hook}

If you didn't know the answer immediately, that's okay — but it means you need to review.

${data.body}

TSSA doesn't care if "that's how you've always done it." They care if it meets CSA B149.1-25. Period.

${data.hashtags}`,

    (data) => `Code update worth knowing about 👇

${data.hook}

${data.body}

The 25th edition brought some changes that directly affect how you work in the field. If you haven't reviewed them yet, now's the time.

I've put together resources for my students on this exact topic. DM me if you want the breakdown.

${data.hashtags}`
  ],

  career: [
    (data) => `The skilled trades in Canada are facing a crisis — and it's also the biggest opportunity of a generation.

${data.hook}

${data.body}

I teach the next generation of gas technicians. The demand is REAL. The careers are REAL. And the pay? Better than a lot of desk jobs, frankly.

If you know a young person trying to figure out their path — share this with them.

${data.hashtags}`,

    (data) => `Real talk about becoming a gas technician in Canada:

${data.hook}

${data.body}

I've watched students walk into Fanshawe with zero experience and walk out ready to build a career. The trades aren't a backup plan — they're a first choice for smart people.

Your G3 is step one. Your G2 is where it gets real. And it only goes up from there.

${data.hashtags}`,

    (data) => `🎓 To every apprentice grinding through their hours right now:

${data.hook}

${data.body}

The hours are long. The learning curve is steep. But every master technician started exactly where you are right now.

Invest in yourself. Study the CSA B149.1-25. Ask questions. And never stop learning.

The trades need you. Canada needs you.

${data.hashtags}`,

    (data) => `Here's what nobody tells you about a career in HVAC:

${data.hook}

${data.body}

The shortage of qualified gas technicians in Canada isn't slowing down. Companies are desperate for competent, licensed techs.

If you're considering the trades — stop considering and start applying. Programs like Fanshawe's gas technician program are your gateway.

${data.hashtags}`,

    (data) => `I've been asked: "Is HVAC a good career in Canada?"

Short answer: absolutely.

${data.body}

${data.hook}

The industry needs 20,000+ skilled tradespeople in the next decade. Gas technicians are at the top of that list.

Get your G3. Get your G2. Build something real.

${data.hashtags}`
  ]
};

// ── Content Generators ──
const HOOKS = {
  trending: [
    r => `${r[0]?.title || 'Major changes'} — and Canadian gas techs need to pay attention.`,
    r => `Breaking: the HVAC industry in Canada is shifting. ${r[0]?.title || 'Here\'s what\'s new.'}`,
    r => `If you missed this — ${r[0]?.title || 'here\'s a critical update for Canadian techs'}.`,
    r => `The latest from the Canadian HVAC world is making waves.`,
    r => `Something every licensed gas tech should have on their radar this week.`
  ],
  tips: [
    r => `The #1 thing I see apprentices get wrong on no-heat calls.`,
    r => `This 30-second check saves hours of troubleshooting.`,
    r => `Stop replacing parts before you diagnose. Here's how.`,
    r => `Your combustion analyzer is lying to you — unless you do this first.`,
    r => `Pressure reg issues? Start here before you condemn the unit.`
  ],
  uncommon: [
    r => `A furnace that works perfectly... except when the dryer is running.`,
    r => `Intermittent flame rollout with no obvious cause. Sound familiar?`,
    r => `The venting was "fine" according to the last tech. It wasn't.`,
    r => `Cross-connected venting on a twin installation. Took me 45 minutes to find it.`,
    r => `A CO reading that made no sense — until I checked the flue pipe.`
  ],
  code: [
    r => `Do you actually know what CSA B149.1-25 says about clearance to combustibles?`,
    r => `Section 6 of CSA B149.1-25 — most techs can't recite the pressure test requirements.`,
    r => `The venting table in CSA B149.1-25 Section 8 is misunderstood by 90% of techs.`,
    r => `CSA B149.1-25 changed something critical in the latest edition.`,
    r => `Here's a code clause that could save your license (and maybe someone's life).`
  ],
  career: [
    r => `Ontario needs 5,000+ gas technicians in the next 5 years. Here's the path.`,
    r => `The average G2 technician in Ontario makes more than you think.`,
    r => `I've trained hundreds of gas technicians. Here's what the best ones have in common.`,
    r => `Thinking about a career change? The HVAC trade is calling.`,
    r => `From apprentice to master tech — the roadmap nobody gives you.`
  ]
};

const BODIES = {
  trending: [
    (r, s) => {
      const items = r.slice(0, 3).map(x => `→ ${x.title}`).join('\n');
      return `Here's what's trending:\n\n${items}\n\nThis is ${s.season} in Canada — ${s.topics} are dominating the conversation. The regulatory landscape is evolving and every tech needs to keep up.`;
    },
    (r, s) => {
      return `The Canadian HVAC landscape is changing fast. Between TSSA enforcement updates and the CSA B149.1-25 code revisions, there's a lot to keep track of.\n\nKey takeaway: the standards are getting tighter, not looser. Training and continuous education aren't optional anymore — they're survival.`;
    }
  ],
  tips: [
    (r, s) => `Here's what works in the field:\n\n1. Always check the simple stuff first — thermostat settings, power supply, gas valve position\n2. Verify gas pressure at the manifold BEFORE condemning components\n3. Check your venting system — ${s.season === 'winter' ? 'ice blockage is real in Canadian winters' : 'bird nests and debris accumulate in off-season'}\n4. Read the fault codes. The manufacturer put them there for a reason\n5. Document everything. Your paperwork protects you AND the homeowner`,
    (r, s) => `The most common mistake I see on no-heat calls:\n\nTechs jump straight to the control board. They replace a $350 part when the actual problem was:\n\n→ A blocked condensate drain\n→ A dirty flame sensor (2 minutes with emery cloth)\n→ A pressure switch hose full of water\n→ Improper venting causing recirculation\n\nDiagnose FIRST. Replace SECOND. Your reputation depends on it.`,
    (r, s) => `Pressure regulator diagnostics 101:\n\n→ Check inlet pressure — should be 2 PSI (residential) from the meter\n→ Check manifold pressure — typically 3.5" WC for natural gas\n→ Lock-up test: close downstream, watch for creep\n→ If the regulator is hunting, check for debris in the seat\n\nThis is basic CSA B149.1-25 knowledge. If you can't do this in your sleep, it's time to review.`
  ],
  uncommon: [
    (r, s) => `The scenario: Homeowner calls — furnace keeps locking out on flame rollout. Previous tech replaced the rollout switch twice. Problem persists.\n\nThe actual cause? The dryer vent was partially blocked, creating negative pressure in the mechanical room. Every time the dryer ran, it pulled combustion products out of the draft hood.\n\nThe fix wasn't the furnace. It was the dryer vent and combustion air supply. ALWAYS think about the building as a system.`,
    (r, s) => `True story: Twin water heaters, both venting into a common chimney. Intermittent CO spillage that only happened when both units fired simultaneously.\n\nThe problem? The chimney was sized for ONE appliance. When both fired, the combined BTU input overwhelmed the flue capacity. Classic undersized venting scenario.\n\nCSA B149.1-25 Section 8 covers combined venting calculations. This is why you MUST do the math.`,
    (r, s) => `Weird one from last ${s.season}: A high-efficiency furnace that worked perfectly all day but locked out every night around 2 AM.\n\nThe cause? The condensate line ran through an unheated crawl space. Froze solid every night when temperatures dropped. By morning, the secondary heat exchanger was flooded.\n\nCanadian winters don't forgive bad installation practices.`
  ],
  code: [
    (r, s) => `CSA B149.1-25 Section 6 — Gas Piping:\n\n→ All piping must be pressure tested at 1.5x working pressure (minimum 15 minutes)\n→ Leak detection fluid at every joint, every time\n→ CSST requires bonding per manufacturer specs AND the code\n→ Pipe sizing isn't guesswork — use the tables in the code book\n\nI've seen TSSA inspectors fail installations for skipping any one of these. Don't let it be yours.`,
    (r, s) => `Let's talk venting — CSA B149.1-25 Section 8:\n\n→ Category I appliances need proper draft (natural or mechanical)\n→ Clearance to combustibles for B-vent: specific to the vent diameter\n→ Common venting rules have CHANGED in recent editions\n→ High-efficiency (Category IV) venting is NOT the same as conventional\n\nThe venting section alone is worth a week of study. It's where the most dangerous mistakes happen.`,
    (r, s) => `Combustion air requirements — one of the most overlooked sections of CSA B149.1-25:\n\n→ Every gas appliance needs adequate combustion air\n→ The calculation method matters: confined vs unconfined space\n→ Outdoor air openings: size requirements are specific and non-negotiable\n→ Mechanical ventilation changes the equation\n\nGet this wrong and you're creating a CO hazard. Get it right and you're protecting lives.`
  ],
  career: [
    (r, s) => `The numbers don't lie:\n\n→ Canada needs thousands of gas technicians in the next decade\n→ Average G2 technician salary in Ontario: $75,000-$95,000+\n→ Overtime during ${s.season === 'winter' ? 'heating season can push that well over $100K' : 'peak seasons adds significantly'}\n→ Job security is essentially guaranteed — gas appliances aren't going away\n→ Pathway to business ownership is clear and achievable\n\nThe stigma around trades is fading fast. The smart money is on skilled work.`,
    (r, s) => `What it takes to become a licensed gas technician in Ontario:\n\n1. Enroll in a college program (Fanshawe, Mohawk, etc.)\n2. Complete your G3 certification — entry-level gas work\n3. Log your apprenticeship hours under a licensed tech\n4. Pass your G2 exam through TSSA\n5. Never stop learning — code updates, new equipment, continuing education\n\nTotal time: 2-4 years depending on your path. Return on investment: a lifetime career.`,
    (r, s) => `What separates good gas techs from great ones:\n\n→ They know the CSA B149.1-25 inside and out\n→ They diagnose before they replace\n→ They never stop asking "why"\n→ They mentor apprentices and share knowledge\n→ They take pride in clean, code-compliant work\n\nThe trade doesn't need more warm bodies. It needs committed professionals.`
  ]
};

const CTAS = [
  'Follow me for more Canadian HVAC content — no fluff, just real talk from the field and the classroom.',
  'Agree? Disagree? Drop your thoughts below 👇',
  'Share this with a tech who needs to see it.',
  'Tag an apprentice who\'s grinding right now. They need to hear this.',
  'If this helped you, hit that share button. Let\'s raise the bar for Canadian gas techs.'
];

const HASHTAG_POOL = {
  trending: ['#HVAC', '#GasTechnician', '#CSA', '#TSSA', '#CanadianHVAC', '#NaturalGas', '#HeatingAndCooling', '#GasTech', '#B149', '#OntarioTrades'],
  tips: ['#HVACTips', '#GasTech', '#NoHeatCall', '#FurnaceRepair', '#HVAC', '#TroubleShooting', '#GasTechnician', '#HeatingSeason', '#ProTip', '#TradeSkills'],
  uncommon: ['#HVACLife', '#WeirdCalls', '#GasTech', '#FieldWork', '#HVAC', '#Troubleshooting', '#RealWorld', '#GasTechnician', '#DiagnosticSkills', '#TradeStories'],
  code: ['#CSAB149', '#GasCode', '#TSSA', '#CodeCompliance', '#HVAC', '#GasTechnician', '#CanadianCode', '#GasSafety', '#B149125', '#CodeDeepDive'],
  career: ['#SkilledTrades', '#HVACCareer', '#GasTechnician', '#Apprenticeship', '#TradesLife', '#HVAC', '#CareerChange', '#OntarioTrades', '#GasTech', '#TradeShortage']
};

// ── API Detection (local Express vs Netlify Functions) ──
function getSearchUrl() {
  // If running on Netlify (or any non-localhost), use serverless functions
  if (location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
    return '/.netlify/functions/search';
  }
  return '/api/search';
}

function getDraftsUrl() {
  if (location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
    return null; // Use localStorage on Netlify
  }
  return '/api/drafts';
}

// ── Brave Search ──
async function searchBrave(query) {
  try {
    const res = await fetch(getSearchUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    const data = await res.json();
    return data.results || [];
  } catch { return []; }
}

// ── Generate Post ──
async function generate() {
  generateBtn.disabled = true;
  generateBtn.innerHTML = '<span class="spinner"></span> Researching...';
  status.textContent = 'Searching for trending topics...';

  const topic = topicInput.value.trim();
  const tone = toneSelect.value;
  const season = getSeasonContext();

  // Pick 2 search queries
  const queries = SEARCH_QUERIES[selectedType];
  const q1 = topic || queries[Math.floor(Math.random() * queries.length)];
  const q2 = queries[Math.floor(Math.random() * queries.length)];

  status.textContent = `Searching: "${q1}"...`;
  const [r1, r2] = await Promise.all([searchBrave(q1), searchBrave(q2)]);
  const results = [...r1, ...r2].filter((v, i, a) => a.findIndex(x => x.url === v.url) === i);

  lastSources = results.slice(0, 6);
  status.textContent = `Found ${results.length} sources. Generating post...`;

  // Build post
  const hooks = HOOKS[selectedType];
  const bodies = BODIES[selectedType];
  const templates = TEMPLATES[selectedType];

  const hook = hooks[Math.floor(Math.random() * hooks.length)](results);
  const body = bodies[Math.floor(Math.random() * bodies.length)](results, season);
  const cta = CTAS[Math.floor(Math.random() * CTAS.length)];

  // Pick 5-6 hashtags
  const pool = HASHTAG_POOL[selectedType];
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  lastHashtags = shuffled.slice(0, 5 + Math.floor(Math.random() * 2));
  const hashtagStr = lastHashtags.join(' ');

  const template = templates[Math.floor(Math.random() * templates.length)];
  const post = template({ hook, body, callToAction: cta, hashtags: hashtagStr }, tone);

  output.value = post;
  updateCharCount();

  // Show sources
  sourcesPanel.style.display = 'block';
  sourcesList.innerHTML = lastSources.map(s =>
    `<a class="source-item" href="${s.url}" target="_blank" title="${s.title}">📄 ${s.title}</a>`
  ).join('') || '<span style="color:var(--muted);font-size:12px">No sources found</span>';

  generateBtn.disabled = false;
  generateBtn.innerHTML = '🚀 Research & Generate';
  status.textContent = `✅ Post generated (${output.value.length} chars) — edit as needed`;

  copyBtn.disabled = false;
  regenBtn.disabled = false;
  saveBtn.disabled = false;
}

// ── Event Listeners ──
generateBtn.addEventListener('click', generate);
regenBtn.addEventListener('click', generate);

copyBtn.addEventListener('click', () => {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(output.value).then(() => {
      showToast('📋 Copied to clipboard!');
    }).catch(() => fallbackCopy());
  } else {
    fallbackCopy();
  }
});

function fallbackCopy() {
  output.select();
  output.setSelectionRange(0, 99999);
  document.execCommand('copy');
  showToast('📋 Copied to clipboard!');
}

saveBtn.addEventListener('click', async () => {
  const draft = {
    content: output.value,
    contentType: selectedType,
    sources: lastSources,
    hashtags: lastHashtags,
    createdAt: new Date().toISOString()
  };

  const draftsUrl = getDraftsUrl();
  if (draftsUrl) {
    // Local Express server
    try {
      const res = await fetch(draftsUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft)
      });
      const data = await res.json();
      showToast(`💾 Draft saved: ${data.saved}`);
    } catch {
      // Fallback to localStorage
      saveToLocalStorage(draft);
      showToast('💾 Draft saved locally');
    }
  } else {
    // Netlify: use localStorage
    saveToLocalStorage(draft);
    showToast('💾 Draft saved locally');
  }
  loadDrafts();
});

function saveToLocalStorage(draft) {
  const drafts = JSON.parse(localStorage.getItem('smartdraft-drafts') || '[]');
  drafts.unshift(draft);
  if (drafts.length > 50) drafts.length = 50;
  localStorage.setItem('smartdraft-drafts', JSON.stringify(drafts));
}

// ── Toast ──
function showToast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// ── Load Drafts ──
async function loadDrafts() {
  let drafts = [];

  const draftsUrl = getDraftsUrl();
  if (draftsUrl) {
    try {
      const res = await fetch(draftsUrl);
      const data = await res.json();
      drafts = data.drafts || [];
    } catch { /* fall through to localStorage */ }
  }

  // Merge localStorage drafts
  const localDrafts = JSON.parse(localStorage.getItem('smartdraft-drafts') || '[]');
  if (localDrafts.length && !drafts.length) {
    drafts = localDrafts;
  }

  if (!drafts.length) {
    draftsList.innerHTML = '<div class="empty-state">No saved drafts yet</div>';
    return;
  }

  draftsList.innerHTML = drafts.slice(0, 20).map(d => {
    const date = new Date(d.createdAt).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    const preview = d.content.substring(0, 60).replace(/\n/g, ' ') + '...';
    return `<div class="draft-item" data-content="${encodeURIComponent(d.content)}">
      <span class="draft-type">${d.contentType}</span> ${preview}
      <span class="draft-date">${date}</span>
    </div>`;
  }).join('');

  draftsList.querySelectorAll('.draft-item').forEach(item => {
    item.addEventListener('click', () => {
      output.value = decodeURIComponent(item.dataset.content);
      updateCharCount();
      copyBtn.disabled = false;
      regenBtn.disabled = false;
      saveBtn.disabled = false;
    });
  });
}

loadDrafts();
