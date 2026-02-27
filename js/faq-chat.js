// FAQ Chat Widget
// Accordion/Dropdown-based navigation system

const FAQ_DATA = [
  {
    question: "I Want to Book a Consultation",
    answer: "To book a consultation, follow these steps:<br><br><strong>1. Choose your session type:</strong><ul><li>30-minute session (Quick Clarity) — ₹1,200 (Audio) / ₹1,500 (Video)</li><li>60-minute session (Deep Insight) — ₹2,400 (Audio) / ₹2,700 (Video)</li><li>90-minute session (Holistic Guidance) — ₹3,600 (Audio) / ₹3,900 (Video)</li></ul><strong>2. Prepare your birth details:</strong><ul><li>Exact date of birth</li><li>Precise time of birth (as accurate as possible)</li><li>Place of birth (city and state/country)</li></ul><strong>3. Book online:</strong><br>Visit the <a href='intake.html' target='_blank'>booking page</a>, select your preferred session, share your birth details, choose an available slot, and complete payment. Payment is required in advance to confirm the appointment.<br><br>Consultations are conducted online. Rescheduling is possible with 48 hours' notice. Sessions are confidential.",
    category: "getting-started"
  },
  {
    question: "Help Me Choose the Right Service",
    answer: "I offer consultations across multiple life areas. Here's how to choose:<br><br><strong>Areas of Guidance:</strong><ul><li><strong>Career & Professional Direction</strong> — Work decisions, career transitions, stagnation or burnout</li><li><strong>Relationships & Marriage</strong> — Emotional patterns, compatibility, long-term relationship choices</li><li><strong>Health & Wellbeing</strong> — Mental stress patterns, emotional balance, phases calling for rest</li><li><strong>Finances & Stability</strong> — Financial decision-making, risk periods, long-term planning</li><li><strong>Family & Children</strong> — Family dynamics, parenting phases, children's concerns</li><li><strong>Life Transitions & Timing</strong> — Major life changes, relocation, role shifts</li><li><strong>Personal & Spiritual Growth</strong> — Inner patterns, belief shifts, spiritual realignment</li><li><strong>Karmic Patterns & Cycles</strong> — Repeating themes and long-term cycles</li><li><strong>Open Session</strong> — Questions across multiple areas or that don't fit a category</li></ul><strong>Session Length:</strong><ul><li>30-minute: One primary concern, urgent questions</li><li>60-minute: Up to three related themes, layered issues</li><li>90-minute: Multiple life areas, broader view</li></ul>If you're unsure, start with a 60-minute session or an Open Session. You can always book follow-ups as needed.",
    category: "getting-started"
  },
  {
    question: "What's the Pricing and Session Details",
    answer: "I currently offer three consultation formats:<br><br><ul><li><strong>30-minute session (Quick Clarity)</strong> — ₹1,200 (Audio) / ₹1,500 (Video). Focused on one primary concern using one chart. Suitable for urgent questions or immediate direction.</li><li><strong>60-minute session (Deep Insight)</strong> — ₹2,400 (Audio) / ₹2,700 (Video). Covers up to three related themes using a maximum of two charts. Suitable for layered issues or decision-making.</li><li><strong>90-minute session (Holistic Guidance)</strong> — ₹3,600 (Audio) / ₹3,900 (Video). Allows exploration of multiple life areas and charts, offering a broader view of patterns, timing, and long-term direction.</li></ul><strong>Session packages</strong><br>Three-session packages are available with savings of ₹300–₹900. Sessions do not expire.<br><br><strong>Session Details:</strong><ul><li>Consultations are conducted online</li><li>Sessions are structured but conversational</li><li>You're encouraged to ask questions and engage actively</li><li>Most sessions run 60-90 minutes depending on complexity</li><li>Rescheduling is possible with 48 hours' notice</li><li>Sessions are confidential</li><li>Payment is required in advance to confirm the appointment</li></ul>",
    category: "getting-started"
  },
  {
    question: "What details do I need to give for a Vedic Astrology reading?",
    answer: "You need three essential details for a Vedic astrology reading:<br><br><strong>1. Date of birth</strong><br>Your exact date of birth (day, month, year).<br><br><strong>2. Time of birth</strong><br>Exact time of birth (as precise as possible). Birth time accuracy matters significantly—even a 10-15 minute difference can shift key indicators in your chart. If you don't have your exact time, check:<ul><li>Birth certificates</li><li>Hospital records</li><li>Ask family members who were present</li></ul>If you have an approximate time (morning, afternoon, evening), we can work within that range, though predictive accuracy may be limited.<br><br><strong>3. Place of birth</strong><br>City/town and state/country where you were born.<br><br>These three details are essential for accurate chart calculation. The more precise your birth time, the more accurate the reading will be.",
    category: "getting-started"
  },
  {
    question: "Who is this consultation suitable for?",
    answer: "This work is for people who take their decisions and patterns seriously.<br><br>This consultation is suitable if you are:<ul><li>Navigating major transitions, career changes, relationships, relocations, business ventures</li><li>Facing recurring patterns you want to understand structurally, not just manage symptomatically</li><li>Making high-stakes decisions where timing and preparation carry real consequences</li><li>In leadership roles, running businesses, or managing significant professional responsibilities</li><li>Experiencing confusion, crisis, or stagnation and need clarity beyond surface explanations</li><li>Dealing with health concerns, family dynamics, or relationship difficulties that keep repeating</li><li>Willing to examine your life honestly and take responsibility for how you use the information</li></ul>This is particularly valuable for:<ul><li>People stuck despite effort — when hard work and planning exist, yet progress feels blocked</li><li>Those experiencing recurring life patterns across different circumstances</li><li>Individuals where conventional approaches have fallen short</li><li>Anyone facing critical life transitions or high-stakes decisions</li><li>Leaders and those with complex responsibilities affecting many</li></ul>",
    category: "getting-started"
  },
  {
    question: "What happens in a session?",
    answer: "Each session follows a structured yet flexible format designed to maximize clarity and practical value. We begin by confirming your birth details and any specific questions or concerns you want to address. I then analyze your chart using relevant Vedic astrology techniques—examining your birth chart, current planetary periods (dashas), transits, and any divisional charts needed for your specific areas of concern.<br><br>During the discussion, I share what the chart reveals about patterns, timing, and underlying themes. You're invited to share your experiences, ask questions, and challenge interpretations that don't resonate. This interactive approach ensures the reading connects with your actual life rather than remaining abstract.<br><br>The session concludes with clear takeaways: what patterns are active, what timing to be aware of, and what responses support your goals. You'll leave with actionable insights, not just information. If follow-up is recommended, we discuss appropriate timing based on your chart's cycles.",
    category: "getting-started"
  },
  {
    question: "How long is the session for?",
    answer: "I offer three session lengths to suit different needs:<br><br><ul><li><strong>30-minute session (Quick Clarity)</strong> — Focused on one primary concern using one chart. Suitable for urgent questions or immediate direction.</li><li><strong>60-minute session (Deep Insight)</strong> — Covers up to three related themes using a maximum of two charts. Suitable for layered issues or decision-making. Most standard sessions run 60-90 minutes depending on complexity.</li><li><strong>90-minute session (Holistic Guidance)</strong> — Allows exploration of multiple life areas and charts, offering a broader view of patterns, timing, and long-term direction.</li></ul>The actual duration may vary slightly based on the complexity of your chart and the depth of discussion needed. Sessions are structured but conversational, and you're encouraged to engage actively throughout.",
    category: "getting-started"
  },
  {
    question: "I have a career issue",
    answer: "Career & Professional Direction consultations provide clarity on work decisions, career transitions, and periods of stagnation or burnout.<br><br>Vedic astrology can help you understand:<ul><li>Natural strengths and areas of resistance in your professional life</li><li>Timing for career changes, job transitions, or new opportunities</li><li>Periods when effort yields results versus when it meets obstacles</li><li>Whether your current direction aligns with your chart's natural momentum</li><li>When to push forward versus when to consolidate and wait</li></ul>This is particularly valuable if you're experiencing:<ul><li>Stuck despite effort — hard work and planning exist, yet progress feels blocked</li><li>Recurring career obstacles across different jobs or strategies</li><li>High-stakes professional decisions where timing matters</li><li>Leadership challenges or business decisions affecting many</li></ul>I can help you navigate career transitions, assess timing for major moves, and understand the deeper patterns behind professional challenges.",
    category: "life-situation"
  },
  {
    question: "I have a relationships issue",
    answer: "Relationships & Marriage consultations focus on understanding emotional patterns, compatibility dynamics, and long-term relationship choices.<br><br>Vedic astrology can help you understand:<ul><li>Emotional patterns that repeat in relationships</li><li>Compatibility dynamics and how two people's charts interact over time</li><li>Timing for commitment, marriage, or relationship transitions</li><li>Where friction is likely and whether it's manageable or destructive</li><li>Long-term patterns that shape relationship experiences</li></ul>This is particularly valuable if you're experiencing:<ul><li>Recurring relationship dynamics across different partners</li><li>Questions about marriage timing or partnership compatibility</li><li>Relationship difficulties that keep repeating</li><li>High-stakes decisions about commitment or separation</li><li>Confusion about relationship patterns you can't understand</li></ul>I can help you see patterns clearly before committing, guide timing for better structural support, and understand the deeper themes behind relationship challenges.",
    category: "life-situation"
  },
  {
    question: "I have a health issue",
    answer: "Health & Wellbeing consultations provide insight into mental stress patterns, emotional balance, and phases that call for rest or restraint.<br><br>Important: Astrology does not diagnose or replace medical care. What it can do is highlight tendencies and periods of vulnerability.<br><br>Vedic astrology can help you understand:<ul><li>Stress patterns that, if ignored, may manifest emotionally or physically</li><li>Periods of heightened physical or emotional vulnerability</li><li>Timing when self-care, rest, or medical attention may be especially important</li><li>Patterns that suggest when to be more cautious or prioritize wellness</li></ul>This is particularly valuable if you're experiencing:<ul><li>Recurring health concerns that keep repeating</li><li>Mental stress patterns or emotional cycles</li><li>Need for clarity on when to prioritize rest or medical attention</li><li>Phases calling for lifestyle adjustments or restraint</li></ul>Used responsibly, astrology supports awareness and prevention, not fear or medical advice. If your situation requires medical intervention, astrology supports that—it does not replace it.",
    category: "life-situation"
  },
  {
    question: "I have a finances issue",
    answer: "Finances & Stability consultations offer perspective on financial decision-making, risk periods, and sustainable long-term planning.<br><br>Vedic astrology can help you understand:<ul><li>Timing for financial decisions, investments, or major purchases</li><li>Risk periods when caution is especially important</li><li>Natural patterns around money, resources, and material stability</li><li>When effort in financial matters yields results versus when it meets obstacles</li><li>Long-term cycles affecting financial stability</li></ul>This is particularly valuable if you're experiencing:<ul><li>Financial challenges that keep repeating despite different strategies</li><li>High-stakes financial decisions where timing matters</li><li>Stuck despite effort in financial planning or earning</li><li>Need for clarity on when to invest, save, or make major financial moves</li><li>Business financial decisions affecting many</li></ul>I can help you assess risk periods, understand timing for financial moves, and recognize patterns that affect your relationship with money and resources.",
    category: "life-situation"
  },
  {
    question: "I have a family issue",
    answer: "Family & Children consultations provide guidance around family dynamics, parenting phases, and concerns related to children and responsibilities.<br><br>Vedic astrology can help you understand:<ul><li>Family dynamics and patterns that repeat across generations</li><li>Parenting phases and timing for family-related decisions</li><li>Concerns related to children's development or challenges</li><li>Family responsibilities and how to navigate them consciously</li><li>Timing for family transitions or major family decisions</li></ul>This is particularly valuable if you're experiencing:<ul><li>Family dynamics that keep repeating</li><li>Parenting challenges or concerns about children</li><li>High-stakes family decisions affecting many</li><li>Confusion about family patterns you can't understand</li><li>Need for clarity on family responsibilities or transitions</li></ul>I can help you understand the deeper patterns behind family dynamics, recognize timing for family decisions, and navigate family responsibilities with greater clarity.",
    category: "life-situation"
  },
  {
    question: "I'm stuck despite effort",
    answer: "When you're stuck despite effort, it often indicates a timing or pattern issue that conventional approaches can't address. Hard work, planning, and intention exist, yet progress feels blocked, misdirected, or out of sync.<br><br>Vedic astrology can help you understand:<ul><li>Why effort isn't yielding results despite genuine work and planning</li><li>Timing cycles that affect when effort is effective versus when it meets obstacles</li><li>Deeper patterns that create resistance despite different strategies</li><li>What phase you're in and how long it's likely to last</li><li>What responses support progress versus create more resistance</li></ul>This is particularly valuable if you're experiencing:<ul><li>Career stagnation despite hard work and planning</li><li>Relationship challenges that persist despite different approaches</li><li>Financial obstacles that don't respond to conventional solutions</li><li>Personal growth that feels blocked despite inner work</li><li>Any area where effort exists but results don't align</li></ul>I can help you understand the timing and patterns behind being stuck, recognize what phase you're in, and identify responses that support progress rather than resistance.",
    category: "life-situation"
  },
  {
    question: "How is Vedic astrology different from Western astrology?",
    answer: "Vedic astrology examines long-term karmic patterns, life timing, and recurring themes that shape your experiences over years and decades. Western astrology focuses more on psychological traits, current transits, and temporary life phases.<br><br>The technical difference: Vedic uses the sidereal zodiac (based on fixed star positions), while Western uses the tropical zodiac (based on seasons). This means your Vedic sun sign is often different from your Western one.<br><br>But the deeper difference is philosophical. Western astrology asks \"What is happening right now?\" and \"How do I feel about it?\" Vedic astrology asks \"Why does this keep happening?\" and \"What is the root structure behind these events?\" By addressing underlying patterns rather than surface symptoms, Vedic astrology works on causes, not just consequences.",
    category: "understanding"
  },
  {
    question: "What techniques do you use?",
    answer: "I use classical Vedic astrology techniques, chosen based on your chart structure and the nature of your question. No single technique explains everything, and methods are applied with discretion.<br><br><strong>Core techniques include:</strong><ul><li><strong>Birth Chart (Rāśi Chart):</strong> The foundation. Reveals core life patterns, strengths, challenges, and karmic themes.</li><li><strong>Vimśottarī Daśā:</strong> The primary predictive system, mapping life into planetary periods and timing when themes activate.</li><li><strong>Transits (Gochara):</strong> Show how current planetary movements trigger what the dashas indicate.</li><li><strong>Divisional Charts (Varga Charts):</strong> Used for specific areas like marriage (D9) and career (D10).</li><li><strong>Nakṣatras:</strong> Add psychological and karmic depth, especially emotional and behavioral patterns.</li><li><strong>Praśna (Horary Astrology):</strong> Used for focused, time-sensitive questions or when birth time is uncertain.</li></ul>Techniques are selected based on relevance, not routine.<br><br>You don't need to understand the methods, only what they reveal and how to act on that clarity.",
    category: "understanding"
  },
  {
    question: "Is this religious?",
    answer: "No, Vedic astrology is not a religious practice. While it emerged from Hindu philosophical traditions, it functions as a technical system for understanding patterns and timing in life.<br><br>You don't need to adopt Hindu beliefs, worship deities, or change your worldview to engage with it. Many clients practice Christianity, Islam, Buddhism, or hold secular perspectives. The consultation focuses on observable patterns in your life, not spiritual conversion.<br><br>The core work—understanding patterns and making conscious choices—stands independent of any belief system. It's a practical tool for clarity and decision-making, not a religious practice.",
    category: "understanding"
  },
  {
    question: "Are the remedies given religious?",
    answer: "Remedies are not inherently religious. While some remedies (like mantras) may have origins in spiritual traditions, they function as practical tools for supporting awareness, discipline, and internal alignment during specific phases.<br><br>Remedies may include:<ul><li>Mantras (sound-based practices)</li><li>Gemstones (worn for specific planetary influences)</li><li>Charitable acts (giving back as a form of balance)</li><li>Timing adjustments (knowing when to act or wait)</li><li>Behavioral modifications (conscious changes in approach)</li></ul>These are suggested as practical supports, not religious requirements. You can engage with them from any perspective—spiritual, psychological, or simply as structured practices. The focus is on what supports clarity and better decision-making, not on adopting any particular belief system.<br><br>If remedies are suggested, they work best when combined with conscious choices and realistic effort, not when treated as magical fixes.",
    category: "understanding"
  },
  {
    question: "How many sessions would I have to take to resolve my issue?",
    answer: "There's no fixed number of sessions required to resolve an issue. The answer depends on the nature of your concern, the complexity of patterns involved, and your specific chart and life context.<br><br><strong>Some people find one session sufficient</strong> for their immediate needs. A single consultation can provide clarity on patterns, timing, and responses that support better decisions. Many people experience immediate relief from confusion as patterns they've sensed but couldn't name become visible and understandable.<br><br><strong>Others return periodically</strong> when:<ul><li>Major transitions occur (career changes, relocations, relationship decisions)</li><li>New patterns activate in their chart</li><li>They need to understand how longer cycles are unfolding</li><li>Significant shifts happen that require updated perspective</li></ul><strong>Follow-up timing is discussed</strong> at the end of your session based on your chart and life context. The goal is clarity that supports better decisions, not dependency on constant consultation.",
    category: "understanding"
  },
  {
    question: "What can I expect after the first session?",
    answer: "After your first Vedic astrology consultation, you'll have a clearer understanding of the patterns active in your life, the timing cycles you're navigating, and how to respond more consciously to what's unfolding. Many people experience immediate relief from confusion, as patterns they've sensed but couldn't name become visible and understandable.<br><br>You'll receive specific insights about your current planetary periods, what themes are likely to surface, and when significant shifts may occur. This knowledge helps you prepare rather than react, make decisions with better timing, and understand why certain efforts work while others don't.<br><br>Some people find one session sufficient for their immediate needs. Others return periodically—during major transitions, when new patterns activate, or to understand how longer cycles are unfolding. We typically discuss appropriate follow-up timing at the end of your session based on your chart and life context. The goal is clarity that supports better decisions, not dependency on constant consultation.",
    category: "practical"
  },
  {
    question: "What information do I need before booking?",
    answer: "Before booking your Vedic astrology consultation, gather your birth details: exact date of birth, precise time of birth (as accurate as possible), and place of birth (city and state/country). Birth time accuracy is crucial—even a 10-15 minute difference can significantly alter chart calculations.<br><br>Beyond birth details, consider what questions or concerns you want to explore. While you don't need to have everything figured out, having a sense of your primary areas of focus—whether career decisions, relationship patterns, health concerns, or life transitions—helps tailor the session to your needs.<br><br>You may also want to reflect on recurring patterns you've noticed, major life events that feel significant, or decisions you're currently facing. This preparation isn't required, but it helps you engage more actively during the consultation and get maximum value from the session.",
    category: "practical"
  },
  {
    question: "What if my birth time is unknown?",
    answer: "If your birth time is completely unknown, some techniques become unavailable. If you have an approximate time (morning, afternoon, evening), we can narrow possibilities and work within that range. In some cases, chart rectification techniques may help, though this requires detailed life event history and is not always conclusive.<br><br>It's better to be honest about uncertainty than to guess a time. Inaccurate data produces unreliable readings. If you're unsure, check:<ul><li>Birth certificates</li><li>Hospital records</li><li>Ask family members who were present</li></ul>",
    category: "practical"
  },
  {
    question: "How often should I consult?",
    answer: "There is no fixed frequency.<br><br>Some people consult during major transitions: career changes, relocations, relationship decisions, health crises. Others return periodically (annually or every few years) to understand how longer cycles are unfolding.<br><br>We usually discuss appropriate follow-up timing at the end of your session based on your chart and life context.",
    category: "practical"
  },
  {
    question: "Browse All FAQs",
    answer: "For a complete list of all frequently asked questions, please visit our <a href='faq.html' target='_blank'>FAQ page</a>. It contains detailed answers to questions about consultations, Vedic astrology, pricing, and more.",
    category: "more-help"
  },
  {
    question: "Contact Us Directly",
    answer: "If you have specific questions or need personalized assistance, please contact us directly:<br><br><strong>WhatsApp:</strong> <a href='https://wa.me/919217679635' target='_blank' rel='noopener noreferrer'>+91 9217679635</a><br><br><strong>Email:</strong> <a href='mailto:consult@ireadspace.com'>consult@ireadspace.com</a><br><br>We'll be happy to help you.",
    category: "more-help"
  }
];

// Category structure with shortened labels
const FAQ_CATEGORIES = {
  "getting-started": {
    title: "Getting Started",
    shortTitle: "Getting Started",
    options: [
      { label: "Book Consultation", question: "I Want to Book a Consultation" },
      { label: "Choose Service", question: "Help Me Choose the Right Service" },
      { label: "Pricing", question: "What's the Pricing and Session Details" },
      { label: "Birth Details", question: "What details do I need to give for a Vedic Astrology reading?" },
      { label: "Suitable For", question: "Who is this consultation suitable for?" },
      { label: "Session Format", question: "What happens in a session?" },
      { label: "Session Length", question: "How long is the session for?" }
    ]
  },
  "life-situation": {
    title: "My Life Situation",
    shortTitle: "Life Situation",
    options: [
      { label: "Career", question: "I have a career issue" },
      { label: "Relationships", question: "I have a relationships issue" },
      { label: "Health", question: "I have a health issue" },
      { label: "Finances", question: "I have a finances issue" },
      { label: "Family", question: "I have a family issue" },
      { label: "Stuck", question: "I'm stuck despite effort" }
    ]
  },
  "understanding": {
    title: "Understanding the Process",
    shortTitle: "Understanding",
    options: [
      { label: "Vedic vs Western", question: "How is Vedic astrology different from Western astrology?" },
      { label: "Techniques", question: "What techniques do you use?" },
      { label: "Religious?", question: "Is this religious?" },
      { label: "Remedies Religious?", question: "Are the remedies given religious?" },
      { label: "How Many Sessions", question: "How many sessions would I have to take to resolve my issue?" }
    ]
  },
  "practical": {
    title: "Practical Concerns",
    shortTitle: "Practical",
    options: [
      { label: "After Session", question: "What can I expect after the first session?" },
      { label: "Before Booking", question: "What information do I need before booking?" },
      { label: "Unknown Birth Time", question: "What if my birth time is unknown?" },
      { label: "Frequency", question: "How often should I consult?" }
    ]
  },
  "more-help": {
    title: "Still Have Questions?",
    shortTitle: "More Help",
    options: [
      { label: "Browse FAQs", question: "Browse All FAQs" },
      { label: "Contact", question: "Contact Us Directly" }
    ]
  }
};

// Initialize FAQ Chat Widget
function initFAQChat() {
  const chatButton = document.getElementById('faq-chat-button');
  const chatPanel = document.getElementById('faq-chat-panel');
  const chatClose = document.getElementById('faq-chat-close');
  const chatContent = document.getElementById('faq-chat-content');

  if (!chatButton || !chatPanel) return;

  let isOpen = false;

  // Toggle chat panel
  function toggleChat() {
    isOpen = !isOpen;
    chatPanel.classList.toggle('active', isOpen);
    chatButton.classList.toggle('active', isOpen);
    
    if (isOpen) {
      renderCategories();
    }
  }

  // Render categories
  function renderCategories() {
    chatContent.innerHTML = '';
    
    Object.keys(FAQ_CATEGORIES).forEach(categoryKey => {
      const category = FAQ_CATEGORIES[categoryKey];
      const categoryItem = document.createElement('div');
      categoryItem.className = 'faq-category-item';
      
      const categoryHeader = document.createElement('button');
      categoryHeader.className = 'faq-category-header';
      categoryHeader.innerHTML = `
        <span>${category.title}</span>
        <span class="faq-category-arrow">▼</span>
      `;
      
      const categoryOptions = document.createElement('div');
      categoryOptions.className = 'faq-category-options';
      
      // Container for answer (shared across all options in category)
      const answerContainer = document.createElement('div');
      answerContainer.className = 'faq-answer-container';
      
      category.options.forEach(option => {
        const optionButton = document.createElement('button');
        optionButton.className = 'faq-option-button';
        optionButton.textContent = option.label;
        
        optionButton.addEventListener('click', (e) => {
          e.stopPropagation();
          const isOpen = answerContainer.classList.contains('active') && 
                         answerContainer.dataset.question === option.question;
          
          // Close answer if clicking the same button
          if (isOpen) {
            answerContainer.classList.remove('active');
            answerContainer.dataset.question = '';
          } else {
            // Show answer for this option
            const faq = FAQ_DATA.find(f => f.question === option.question);
            if (faq) {
              answerContainer.innerHTML = `<div class="faq-answer-text">${faq.answer}</div>`;
              answerContainer.dataset.question = option.question;
              answerContainer.classList.add('active');
            }
          }
        });
        
        categoryOptions.appendChild(optionButton);
      });
      
      // Add answer container at the end
      categoryOptions.appendChild(answerContainer);
      
      categoryHeader.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = categoryItem.classList.contains('active');
        
        // Close all other categories
        chatContent.querySelectorAll('.faq-category-item').forEach(item => {
          if (item !== categoryItem) {
            item.classList.remove('active');
          }
        });
        
        // Toggle current category
        categoryItem.classList.toggle('active', !isOpen);
      });
      
      categoryItem.appendChild(categoryHeader);
      categoryItem.appendChild(categoryOptions);
      chatContent.appendChild(categoryItem);
    });
  }

  // Event listeners
  chatButton.addEventListener('click', toggleChat);
  chatClose.addEventListener('click', toggleChat);
  
  // Close on outside click
  document.addEventListener('click', (e) => {
    if (isOpen && 
        !chatPanel.contains(e.target) && 
        !chatButton.contains(e.target)) {
      toggleChat();
    }
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFAQChat);
} else {
  initFAQChat();
}
