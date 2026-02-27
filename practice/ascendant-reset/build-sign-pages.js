/**
 * One-time script to inject sign-specific content into copied aries.html files.
 * Run from practice/ascendant-reset: node build-sign-pages.js
 */
const fs = require('fs');
const path = require('path');

const SIGNS = {
  gemini: {
    signLabel: 'Gemini',
    color: '#06A77D',
    ctaTextColor: 'var(--cream-white)',
    hook: "You don't lack ideas.<br>You lack completion.",
    chips1: ['Work focus', 'Communication clarity', 'Financial consistency', 'Health discipline', 'Relationship presence'],
    chips2: ['Multitasking instead of finishing', 'Over-explaining', 'Starting but not completing', 'Scattered spending', 'Avoiding depth'],
    chips2Helper: 'Be specific. One behavior only. Choose something visible. Not emotional.',
    chips3: ['Finish task before opening new one', 'Pause before replying', 'Write summary before sending', 'Close 1 open loop daily', 'Review list before adding'],
    chips3Helper: 'Reduce options before acting.',
    chips4: ['10 min single-task work', '10 min reading deeply', '10 min budgeting', '10 min device-free time', '10 min skill sharpening'],
    acc1: { title: 'Where Gemini Leaks Power', body: '<p>Through distraction. Scattered attention divides force.</p>' },
    acc2: { title: 'Where Obstruction Shows Up (Relationship & Projection)', body: '<p>Obstruction appears in partnerships. Over-talking, under-listening, or relying on others for clarity.</p>' },
    acc3: { title: 'Why Discipline Beats Motivation', body: '<p>Gemini loves ideas. Discipline finishes them.</p>' },
    acc4: { title: 'Read the Rules', body: '<p>Reduce inputs. Increase execution.</p>' },
  },
  cancer: {
    signLabel: 'Cancer',
    color: '#F5E6D3',
    ctaTextColor: 'var(--primary)',
    hook: "You don't lack feeling.<br>You lack structure.",
    chips1: ['Emotional boundaries', 'Work consistency', 'Spending control', 'Health stability', 'Family dynamics'],
    chips2: ['Overreacting emotionally', 'Avoiding confrontation', 'Comfort spending', 'Skipping routines', "Absorbing others' moods"],
    chips2Helper: 'Be specific. One behavior only. Choose something visible. Not emotional.',
    chips3: ['Wait before responding emotionally', 'Ask one clarifying question', 'Step away physically', 'Journal before reacting', 'Set boundary immediately'],
    chips3Helper: 'Pause emotion. Then act.',
    chips4: ['10 min emotional journaling', '10 min workout', '10 min financial tracking', '10 min boundary planning', '10 min focused work'],
    acc1: { title: 'Where Cancer Leaks Power', body: '<p>Through emotional absorption and avoidance.</p>' },
    acc2: { title: 'Where Obstruction Shows Up (Social & Group Friction)', body: '<p>Sensitivity to group dynamics creates hesitation.</p>' },
    acc3: { title: 'Why Discipline Beats Motivation', body: '<p>Emotional waves pass. Structure stabilizes.</p>' },
    acc4: { title: 'Read the Rules', body: '<p>Consistency protects emotional energy.</p>' },
  },
  leo: {
    signLabel: 'Leo',
    color: '#FF6B35',
    ctaTextColor: 'var(--cream-white)',
    hook: "You don't lack presence.<br>You lack discipline.",
    chips1: ['Public image', 'Work leadership', 'Spending control', 'Health discipline', 'Relationship ego'],
    chips2: ['Reacting to criticism', 'Overspending for image', 'Avoiding feedback', 'Over-dominating conversations', 'Procrastinating when not praised'],
    chips2Helper: 'Be specific. One behavior only. Choose something visible. Not emotional.',
    chips3: ['Wait before responding to criticism', 'Review spending before purchase', 'Ask for feedback calmly', 'Let others speak first', 'Delay big decisions'],
    chips3Helper: 'This must happen immediately when triggered.',
    chips4: ['10 min strategic planning', '10 min fitness training', '10 min gratitude practice', '10 min financial review', '10 min skill development'],
    acc1: { title: 'Where Leo Leaks Power', body: '<p>Through ego-driven reaction and validation seeking.</p>' },
    acc2: { title: 'Where Obstruction Shows Up (Belief & Recognition Friction)', body: '<p>Obstruction appears when approval is withheld.</p>' },
    acc3: { title: 'Why Discipline Beats Motivation', body: '<p>Applause fades. Discipline remains.</p>' },
    acc4: { title: 'Read the Rules', body: '<p>Lead yourself before leading others.</p>' },
  },
  virgo: {
    signLabel: 'Virgo',
    color: '#06A77D',
    ctaTextColor: 'var(--cream-white)',
    hook: "You don't lack standards.<br>You lack release.",
    chips1: ['Work efficiency', 'Health routines', 'Financial tracking', 'Communication clarity', 'Relationship expectations'],
    chips2: ['Overthinking', 'Micromanaging', 'Criticizing others', 'Avoiding imperfect action', 'Obsessive checking'],
    chips2Helper: 'Be specific. One behavior only. Choose something visible. Not emotional.',
    chips3: ['Submit before perfect', 'Limit revisions to one pass', 'Ask instead of assume', 'Complete first draft fast', 'Stop checking repeatedly'],
    chips3Helper: 'This must happen immediately when triggered.',
    chips4: ['10 min planning', '10 min fitness', '10 min budget check', '10 min declutter', '10 min structured writing'],
    acc1: { title: 'Where Virgo Leaks Power', body: '<p>Through over-analysis and control.</p>' },
    acc2: { title: 'Where Obstruction Shows Up (Relationship Friction)', body: '<p>Expectations projected onto others create tension.</p>' },
    acc3: { title: 'Why Discipline Beats Motivation', body: '<p>Done beats perfect.</p>' },
    acc4: { title: 'Read the Rules', body: '<p>Clarity over control.</p>' },
  },
  libra: {
    signLabel: 'Libra',
    color: '#E3F2FD',
    ctaTextColor: 'var(--primary)',
    hook: "You don't lack balance.<br>You lack decision.",
    chips1: ['Decision-making', 'Work assertiveness', 'Spending habits', 'Health discipline', 'Relationship balance'],
    chips2: ['Avoiding confrontation', 'Indecision', 'Spending to maintain harmony', 'Skipping routines', 'People-pleasing'],
    chips2Helper: 'Be specific. One behavior only. Choose something visible. Not emotional.',
    chips3: ['Decide within 24 hours', 'Say "No" once daily', 'Review purchase before buying', 'Speak directly', 'Set boundary calmly'],
    chips3Helper: 'This must happen immediately when triggered.',
    chips4: ['10 min focused decision review', '10 min fitness', '10 min budgeting', '10 min boundary reflection', '10 min skill development'],
    acc1: { title: 'Where Libra Leaks Power', body: '<p>Through indecision and over-accommodation.</p>' },
    acc2: { title: 'Where Obstruction Shows Up (Social Friction)', body: '<p>Approval dependency drains momentum.</p>' },
    acc3: { title: 'Why Discipline Beats Motivation', body: '<p>Clarity beats harmony-seeking.</p>' },
    acc4: { title: 'Read the Rules', body: '<p>One rule. No negotiation.</p>' },
  },
  scorpio: {
    signLabel: 'Scorpio',
    color: '#E63946',
    ctaTextColor: 'var(--cream-white)',
    hook: "You don't lack depth.<br>You lack transparency.",
    chips1: ['Emotional intensity', 'Work control', 'Financial secrecy', 'Health discipline', 'Relationship boundaries'],
    chips2: ['Withholding communication', 'Over-controlling', 'Avoiding vulnerability', 'Obsessive thinking', 'Extreme reactions'],
    chips2Helper: 'Be specific. One behavior only. Choose something visible. Not emotional.',
    chips3: ['Communicate within 24 hours', 'Pause before escalating', 'Ask directly', 'Share one honest sentence', 'Review decision calmly'],
    chips3Helper: 'This must happen immediately when triggered.',
    chips4: ['10 min journaling', '10 min training', '10 min strategic planning', '10 min budget review', '10 min focused work'],
    acc1: { title: 'Where Scorpio Leaks Power', body: '<p>Through intensity without transparency.</p>' },
    acc2: { title: 'Where Obstruction Shows Up (Belief Rigidity)', body: '<p>Holding fixed narratives blocks change.</p>' },
    acc3: { title: 'Why Discipline Beats Motivation', body: '<p>Control must be structured, not reactive.</p>' },
    acc4: { title: 'Read the Rules', body: '<p>Precision over emotion.</p>' },
  },
  sagittarius: {
    signLabel: 'Sagittarius',
    color: '#F7B801',
    ctaTextColor: 'var(--primary)',
    hook: "You don't lack vision.<br>You lack follow-through.",
    chips1: ['Work follow-through', 'Spending discipline', 'Health consistency', 'Communication bluntness', 'Travel/restlessness'],
    chips2: ['Starting without finishing', 'Overspending', 'Skipping routines', 'Speaking bluntly', 'Avoiding responsibility'],
    chips2Helper: 'Be specific. One behavior only. Choose something visible. Not emotional.',
    chips3: ['Finish before starting new', 'Wait before purchase', 'Plan before acting', 'Edit before speaking', 'Stick to routine'],
    chips3Helper: 'This must happen immediately when triggered.',
    chips4: ['10 min structured work', '10 min reading', '10 min budgeting', '10 min stretching', '10 min review'],
    acc1: { title: 'Where Sagittarius Leaks Power', body: '<p>Through excess expansion without grounding.</p>' },
    acc2: { title: 'Where Obstruction Shows Up (Relationship Friction)', body: '<p>Commitment resistance creates instability.</p>' },
    acc3: { title: 'Why Discipline Beats Motivation', body: '<p>Freedom needs structure.</p>' },
    acc4: { title: 'Read the Rules', body: '<p>Constrain to expand.</p>' },
  },
  capricorn: {
    signLabel: 'Capricorn',
    color: '#1A1A1A',
    ctaTextColor: 'var(--cream-white)',
    hook: "You don't lack drive.<br>You lack recovery.",
    chips1: ['Work-life balance', 'Financial habits', 'Health discipline', 'Emotional expression', 'Delegation'],
    chips2: ['Overworking', 'Avoiding rest', 'Controlling outcomes', 'Withholding emotion', 'Delaying delegation'],
    chips2Helper: 'Be specific. One behavior only. Choose something visible. Not emotional.',
    chips3: ['Stop work at fixed time', 'Delegate one task', 'Share one honest sentence', 'Pause before deciding', 'Schedule recovery'],
    chips3Helper: 'This must happen immediately when triggered.',
    chips4: ['10 min planning', '10 min exercise', '10 min budgeting', '10 min reflection', '10 min delegation planning'],
    acc1: { title: 'Where Capricorn Leaks Power', body: '<p>Through over-responsibility and rigidity.</p>' },
    acc2: { title: 'Where Obstruction Shows Up (Social Pressure)', body: '<p>External expectations create self-pressure.</p>' },
    acc3: { title: 'Why Discipline Beats Motivation', body: '<p>Efficiency without balance collapses.</p>' },
    acc4: { title: 'Read the Rules', body: '<p>Structure must include recovery.</p>' },
  },
  aquarius: {
    signLabel: 'Aquarius',
    color: '#1A1A1A',
    ctaTextColor: 'var(--cream-white)',
    hook: "You don't lack ideas.<br>You lack routine.",
    chips1: ['Work consistency', 'Social detachment', 'Financial habits', 'Health routine', 'Communication tone'],
    chips2: ['Ignoring emotional cues', 'Over-intellectualizing', 'Skipping routines', 'Avoiding intimacy', 'Being inconsistent'],
    chips2Helper: 'Be specific. One behavior only. Choose something visible. Not emotional.',
    chips3: ['Check in emotionally', 'Follow schedule strictly', 'Finish before debating', 'Pause before detaching', 'Commit before innovating'],
    chips3Helper: 'This must happen immediately when triggered.',
    chips4: ['10 min structured focus', '10 min budgeting', '10 min exercise', '10 min relationship check-in', '10 min priority review'],
    acc1: { title: 'Where Aquarius Leaks Power', body: '<p>Through detachment and inconsistency.</p>' },
    acc2: { title: 'Where Obstruction Shows Up (Belief Conflict)', body: '<p>Strong ideas resist grounding.</p>' },
    acc3: { title: 'Why Discipline Beats Motivation', body: '<p>Ideas require structure.</p>' },
    acc4: { title: 'Read the Rules', body: '<p>Innovation needs routine.</p>' },
  },
  pisces: {
    signLabel: 'Pisces',
    color: '#F7B801',
    ctaTextColor: 'var(--primary)',
    hook: "You don't lack sensitivity.<br>You lack grounding.",
    chips1: ['Emotional regulation', 'Work consistency', 'Spending clarity', 'Health routine', 'Boundary setting'],
    chips2: ['Avoiding reality', 'Escaping responsibility', 'Emotional overspending', 'Skipping routines', 'Blurred boundaries'],
    chips2Helper: 'Be specific. One behavior only. Choose something visible. Not emotional.',
    chips3: ['Clarify before agreeing', 'Log before spending', 'Pause before reacting', 'Write before deciding', 'Step away physically'],
    chips3Helper: 'This must happen immediately when triggered.',
    chips4: ['10 min grounding exercise', '10 min journaling', '10 min budgeting', '10 min task focus', '10 min boundary planning'],
    acc1: { title: 'Where Pisces Leaks Power', body: '<p>Through escapism and blurred boundaries.</p>' },
    acc2: { title: 'Where Obstruction Shows Up (Relationship Projection)', body: '<p>Projection onto others creates confusion.</p>' },
    acc3: { title: 'Why Discipline Beats Motivation', body: '<p>Grounding beats drifting.</p>' },
    acc4: { title: 'Read the Rules', body: '<p>Clarity over emotion.</p>' },
  },
};

function escapeRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

function chipButtons(values) {
  return values.map(v => `<button type="button" class="wizard-chip" data-value="${v.replace(/"/g, '&quot;')}">${v.replace(/</g, '&lt;')}</button>`).join('\n            ');
}

function run(signKey) {
  const d = SIGNS[signKey];
  if (!d) return;
  const signLabel = d.signLabel;
  const filePath = path.join(__dirname, signKey + '.html');
  let html = fs.readFileSync(filePath, 'utf8');

  // Replace from Aries base (so we're editing the copied aries content)
  const from = 'aries';
  const From = 'Aries';

  html = html.replace(new RegExp(escapeRegex('<title>Aries Ascendant: 43-Day Reset'), 'g'), `<title>${signLabel} Ascendant: 43-Day Reset`);
  html = html.replace(new RegExp(escapeRegex('Aries rising 43-day discipline reset'), 'g'), `${signLabel} rising 43-day discipline reset`);
  html = html.replace(new RegExp(escapeRegex('practice/ascendant-reset/aries"'), 'g'), `practice/ascendant-reset/${signKey}"`);

  html = html.replace(new RegExp(escapeRegex('.aries-page'), 'g'), `.${signKey}-page`);
  html = html.replace(new RegExp(escapeRegex('.aries-container'), 'g'), `.${signKey}-container`);
  html = html.replace(new RegExp(escapeRegex('.aries-hero '), 'g'), `.${signKey}-hero `);
  html = html.replace(new RegExp(escapeRegex('.aries-hook'), 'g'), `.${signKey}-hook`);
  html = html.replace(new RegExp(escapeRegex('.aries-cta-wrap'), 'g'), `.${signKey}-cta-wrap`);
  html = html.replace(new RegExp(escapeRegex('.aries-cta '), 'g'), `.${signKey}-cta `);
  html = html.replace(new RegExp(escapeRegex('.aries-cta:hover'), 'g'), `.${signKey}-cta:hover`);
  html = html.replace(new RegExp(escapeRegex('.aries-accordions'), 'g'), `.${signKey}-accordions`);
  html = html.replace(new RegExp(escapeRegex('.aries-accordion"'), 'g'), `.${signKey}-accordion"`);
  html = html.replace(new RegExp(escapeRegex('.aries-accordion '), 'g'), `.${signKey}-accordion `);
  html = html.replace(new RegExp(escapeRegex('.aries-accordion-toggle'), 'g'), `.${signKey}-accordion-toggle`);
  html = html.replace(new RegExp(escapeRegex('.aries-accordion-panel'), 'g'), `.${signKey}-accordion-panel`);
  html = html.replace(new RegExp(escapeRegex('.aries-accordion-content'), 'g'), `.${signKey}-accordion-content`);
  html = html.replace(new RegExp(escapeRegex('.aries-accordion.expanded'), 'g'), `.${signKey}-accordion.expanded`);

  html = html.replace(/#E63946/g, d.color);
  html = html.replace(/background: #E63946; color: var\(--cream-white\)/g, `background: ${d.color}; color: ${d.ctaTextColor}`);

  html = html.replace(new RegExp(escapeRegex('class="aries-page"'), 'g'), `class="${signKey}-page"`);
  html = html.replace(new RegExp(escapeRegex('class="aries-container"'), 'g'), `class="${signKey}-container"`);
  html = html.replace(new RegExp(escapeRegex('class="aries-hero"'), 'g'), `class="${signKey}-hero"`);
  html = html.replace(new RegExp(escapeRegex('class="aries-hook"'), 'g'), `class="${signKey}-hook"`);
  html = html.replace(new RegExp(escapeRegex('class="aries-cta-wrap"'), 'g'), `class="${signKey}-cta-wrap"`);
  html = html.replace(new RegExp(escapeRegex('class="aries-cta"'), 'g'), `class="${signKey}-cta"`);
  html = html.replace(new RegExp(escapeRegex('Aries Ascendant: 43-Day Reset</h1>'), 'g'), `${signLabel} Ascendant: 43-Day Reset</h1>`);
  html = html.replace(new RegExp(escapeRegex("You don't lack drive.<br>You lack containment."), 'g'), d.hook);
  html = html.replace(new RegExp(escapeRegex('class="aries-accordions"'), 'g'), `class="${signKey}-accordions"`);

  // Chips - step 1
  html = html.replace(
    /<button type="button" class="wizard-chip" data-value="Work execution">Work execution<\/button>\s*<button type="button" class="wizard-chip" data-value="Conflict control">Conflict control<\/button>\s*<button type="button" class="wizard-chip" data-value="Spending control">Spending control<\/button>\s*<button type="button" class="wizard-chip" data-value="Health discipline">Health discipline<\/button>\s*<button type="button" class="wizard-chip" data-value="Social restraint">Social restraint<\/button>/s,
    chipButtons(d.chips1)
  );

  // Chips - step 2 (Aries examples)
  html = html.replace(
    /<button type="button" class="wizard-chip" data-value="Sending reactive messages">Sending reactive messages<\/button>\s*<button type="button" class="wizard-chip" data-value="Interrupting people">Interrupting people<\/button>\s*<button type="button" class="wizard-chip" data-value="Impulse spending">Impulse spending<\/button>\s*<button type="button" class="wizard-chip" data-value="Escalating arguments">Escalating arguments<\/button>\s*<button type="button" class="wizard-chip" data-value="Starting tasks without planning">Starting tasks without planning<\/button>/s,
    chipButtons(d.chips2)
  );
  html = html.replace(
    'Be specific. One behavior only. Choose something visible. Not emotional.</p>',
    d.chips2Helper + '</p>'
  );

  // Chips - step 3
  html = html.replace(
    /<button type="button" class="wizard-chip" data-value="Wait 10 minutes before responding">Wait 10 minutes before responding<\/button>\s*<button type="button" class="wizard-chip" data-value="Count to 20 before speaking">Count to 20 before speaking<\/button>\s*<button type="button" class="wizard-chip" data-value="Step away physically">Step away physically<\/button>\s*<button type="button" class="wizard-chip" data-value="Write but do not send">Write but do not send<\/button>\s*<button type="button" class="wizard-chip" data-value="Take 3 slow breaths">Take 3 slow breaths<\/button>/s,
    chipButtons(d.chips3)
  );
  html = html.replace(
    'This must happen immediately when triggered.</p>',
    d.chips3Helper + '</p>'
  );

  // Chips - step 4
  html = html.replace(
    /<button type="button" class="wizard-chip" data-value="10 min planning before work">10 min planning before work<\/button>\s*<button type="button" class="wizard-chip" data-value="10 min strength training">10 min strength training<\/button>\s*<button type="button" class="wizard-chip" data-value="10 min finance review">10 min finance review<\/button>\s*<button type="button" class="wizard-chip" data-value="10 min journaling">10 min journaling<\/button>\s*<button type="button" class="wizard-chip" data-value="10 min reviewing priorities">10 min reviewing priorities<\/button>/s,
    chipButtons(d.chips4)
  );

  // Accordions - titles and content (match Aries structure)
  html = html.replace(
    /<span>Where Aries Leaks Power<\/span>/,
    `<span>${d.acc1.title}</span>`
  );
  html = html.replace(
    /<div class="aries-accordion-content">\s*<p>Aries Rising does not lack courage.<\/p>[\s\S]*?<p>It is unmanaged ignition.<\/p>\s*<\/div>\s*<\/div>\s*<\/div>\s*<div class="aries-accordion" id="acc-obstruction">/,
    `<div class="${signKey}-accordion-content">\n            ${d.acc1.body}\n          </div>\n          </div>\n        </div>\n        <div class="${signKey}-accordion" id="acc-obstruction">`
  );

  html = html.replace(
    /<span>Where Obstruction Shows Up \(Social & Group Friction\)<\/span>/,
    `<span>${d.acc2.title}</span>`
  );
  html = html.replace(
    /<div class="aries-accordion-content">\s*<p>For Aries Rising, obstruction often shows up through:<\/p>[\s\S]*?<p>When energy is wasted fighting the room, progress slows.<\/p>\s*<\/div>\s*<\/div>\s*<\/div>\s*<div class="aries-accordion" id="acc-discipline">/,
    `<div class="${signKey}-accordion-content">\n            ${d.acc2.body}\n          </div>\n          </div>\n        </div>\n        <div class="${signKey}-accordion" id="acc-discipline">`
  );

  html = html.replace(
    /<span>Why Discipline Beats Motivation<\/span>/,
    `<span>${d.acc3.title}</span>`
  );
  html = html.replace(
    /<div class="aries-accordion-content">\s*<p>Aries does not struggle with motivation.<\/p>[\s\S]*?<p>With structure, the same fire builds long-term leverage.<\/p>\s*<\/div>\s*<\/div>\s*<\/div>\s*<div class="aries-accordion" id="acc-rules">/,
    `<div class="${signKey}-accordion-content">\n            ${d.acc3.body}\n          </div>\n          </div>\n        </div>\n        <div class="${signKey}-accordion" id="acc-rules">`
  );

  html = html.replace(
    /<div class="aries-accordion-content">\s*<p>Choose one domain only.<\/p>[\s\S]*?<p>If you simplify the action, you increase survival.<\/p>\s*<\/div>/,
    `<div class="${signKey}-accordion-content">\n            ${d.acc4.body}\n          </div>`
  );

  // Accordion class names (remaining)
  html = html.split('.aries-accordion').join(`.${signKey}-accordion`);
  html = html.split('aries-accordion-toggle').join(`${signKey}-accordion-toggle`);
  html = html.split('aries-accordion-panel').join(`${signKey}-accordion-panel`);
  html = html.split('aries-accordion-content').join(`${signKey}-accordion-content`);

  html = html.replace(/STORAGE_KEY = 'aries_fire_reset'/, `STORAGE_KEY = '${signKey}_fire_reset'`);
  html = html.replace(/43-DAY FIRE CONTRACT \(ARIES\)/, `43-DAY CONTRACT (${signLabel.toUpperCase()})`);
  html = html.replace(/aries-43-day-fire-contract\.txt/, `${signKey}-43-day-contract.txt`);
  html = html.replace(/\.aries-accordion/g, `.${signKey}-accordion`);
  html = html.replace(/aries-accordion-toggle/g, `${signKey}-accordion-toggle`);

  fs.writeFileSync(filePath, html, 'utf8');
  console.log('Updated', signKey + '.html');
}

Object.keys(SIGNS).forEach(run);
