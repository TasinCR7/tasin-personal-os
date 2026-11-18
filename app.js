/**
 * তাসিনের পার্সোনাল ওএস (Personal OS & Relationship CRM)
 * Built on Notion Minimal Pro Design System
 */

const STORAGE_KEY = 'tasin_personal_os_v1';
const USERS_KEY = 'tasin_os_users_v1';
const SESSION_KEY = 'tasin_os_session_v1';
const SUPABASE_CONFIG_KEY = 'tasin_os_supabase_config_v1';

// Pre-configured Supabase Project (TasinCR7's Project)
const DEFAULT_SUPABASE_URL = 'https://uezrdvjbazehzjorhfrl.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_jcSthwFxzUPKKEi5i5cjDA_gZG94j_h';
let sbClient = null;

// Helper to get relative date string (YYYY-MM-DD)
function getRelativeDate(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

// Default rich seed data so the workspace feels alive immediately
const DEFAULT_DATA = {
  contacts: [
    {
      id: 'c1',
      name: 'রাশেদুল ইসলাম ভাই',
      relation: 'সিনিয়র টেক মেন্টর ও উদ্যোক্তা',
      level: '1',
      frequencyDays: 30,
      phone: '01711-223344',
      lastContactDate: getRelativeDate(-36), // Due now!
      notes: 'সবসময় ক্যারিয়ার ও নতুন প্রজেক্ট নিয়ে দারুণ দিকনির্দেশনা দেন। প্রতি মাসে একবার হলেও খোঁজ নেওয়া জরুরি।'
    },
    {
      id: 'c2',
      name: 'মাহমুদুল হাসান (সোহেল)',
      relation: 'ব্যবসায়িক পার্টনার ও ঘনিষ্ঠ বন্ধু',
      level: '1',
      frequencyDays: 15,
      phone: '01819-556677',
      lastContactDate: getRelativeDate(-8),
      notes: 'নতুন ওয়েবসাইট ও ডিজিটাল সার্ভিস আইডিয়া নিয়ে একসাথে কাজ করার কথা চলছে।'
    },
    {
      id: 'c3',
      name: 'তানভীর আহমেদ',
      relation: 'সাবেক কলিগ ও সফটওয়্যার ইঞ্জিনিয়ার',
      level: '2',
      frequencyDays: 90,
      phone: '01912-889900',
      lastContactDate: getRelativeDate(-98), // Due!
      notes: 'কয়েক মাস পর পর খোঁজ নিলে সম্পর্ক ভালো থাকে। ক্লাউড ও সার্ভার বিষয়ে অভিজ্ঞ।'
    },
    {
      id: 'c4',
      name: 'আরিফুল হক',
      relation: 'পরিচিত ক্লায়েন্ট (ই-কমার্স)',
      level: '2',
      frequencyDays: 60,
      phone: '01677-112233',
      lastContactDate: getRelativeDate(-25),
      notes: 'ডিসেম্বর মাসের দিকে নতুন ওয়েবসাইট রিডিজাইন করার কথা বলেছেন।'
    },
    {
      id: 'c5',
      name: 'কামরুল হাসান',
      relation: 'এলাকার পরিচিত বড় ভাই',
      level: '3',
      frequencyDays: 180,
      phone: '01552-334455',
      lastContactDate: getRelativeDate(-60),
      notes: 'শুধু ঈদ বা বিশেষ প্রয়োজনে কুশল বিনিময় করলেই যথেষ্ট।'
    }
  ],
  conversations: [
    {
      id: 'conv1',
      person: 'রাশেদুল ইসলাম ভাই',
      date: getRelativeDate(-36),
      tone: 'promise',
      nextDate: getRelativeDate(3),
      quote: 'বলেছেন আমার নতুন পোর্টফোলিও ও সার্ভিস ওয়েবসাইট রেডি হলে উনার দুজন বিদেশি ক্লায়েন্টের সাথে পরিচয় করিয়ে দেবেন।'
    },
    {
      id: 'conv2',
      person: 'আরিফুল হক',
      date: getRelativeDate(-25),
      tone: 'positive',
      nextDate: getRelativeDate(35),
      quote: 'আগের কাজের প্রশংসা করেছেন এবং বলেছেন সামনের মাসে তাদের কোম্পানির অটোমেশন প্রজেক্টের বাজেট পাস হলে আমাকে জানাবেন।'
    },
    {
      id: 'conv3',
      person: 'শাকিল মাহমুদ',
      date: getRelativeDate(-14),
      tone: 'caution',
      nextDate: '',
      quote: 'বারবার প্রজেক্টের পার্টনার হতে চাচ্ছেন কিন্তু কাজের হিসাব পরিষ্কার না। কথায় কিছুটা অতিরঞ্জন মনে হয়েছে, সাবধানে কথা বলতে হবে।'
    }
  ],
  redFlags: [
    {
      id: 'rf1',
      person: 'জাহিদুল করিম',
      date: getRelativeDate(-45),
      severity: 'high',
      incident: 'জরুরি বিপদের কথা বলে ১০ দিনের জন্য টাকা ধার নিয়েছিল, কিন্তু ৩ মাস পরও ফোন ধরেনি এবং উল্টো রূঢ় আচরণ করেছে।',
      boundary: 'ভবিষ্যতে আর কখনো কোনো আর্থিক লেনদেন বা ব্যক্তিগত উপকার করা যাবে না। দূরত্ব বজায় রাখতে হবে।'
    },
    {
      id: 'rf2',
      person: 'নাজমুল হুদা',
      date: getRelativeDate(-20),
      severity: 'medium',
      incident: 'অন্যদের সামনে আমার আইডিয়া নিজের বলে চালিয়ে দেওয়ার চেষ্টা করেছে এবং কথা দিয়ে শেষ মুহূর্তে মিটিং বাতিল করেছে।',
      boundary: 'নিজের কোনো গোপন আইডিয়া বা ভবিষ্যৎ পরিকল্পনা তার সাথে শেয়ার করা যাবে না।'
    }
  ],
  tasks: [
    {
      id: 't1',
      title: 'রাশেদুল ইসলাম ভাইকে ফোন করে খোঁজখবর নেওয়া ও নতুন আপডেট জানানো',
      horizon: 'today',
      priority: 'high',
      dueDate: getRelativeDate(0),
      done: false
    },
    {
      id: 't2',
      title: 'পার্সোনাল ওয়েবসাইটের সব ডাটা ও পরিচিতদের তালিকা সম্পূর্ণ করা',
      horizon: 'today',
      priority: 'high',
      dueDate: getRelativeDate(1),
      done: false
    },
    {
      id: 't3',
      title: 'মাসিক খরচের বাজেট রিভিউ করা এবং অপ্রয়োজনীয় সাবস্ক্রিপশন বন্ধ করা',
      horizon: 'month',
      priority: 'medium',
      dueDate: getRelativeDate(10),
      done: false
    },
    {
      id: 't4',
      title: 'নিজস্ব SaaS বা সার্ভিস এজেন্সির জন্য ল্যান্ডিং পেজ লঞ্চ করা',
      horizon: 'future',
      priority: 'high',
      dueDate: getRelativeDate(45),
      done: false
    }
  ],
  ideas: [
    {
      id: 'id1',
      title: 'প্রফেশনাল নেটওয়ার্ক ও রিলেশনশিপ রিমাইন্ডার অ্যাপ',
      category: 'tech',
      stage: 'কাজ শুরু হয়েছে',
      createdAt: getRelativeDate(-5),
      details: 'ব্যস্ত জীবনে গুরুত্বপূর্ণ মানুষদের সাথে কয়েক মাস পর পর যোগাযোগ রাখার জন্য একটি মিনিমাল ওয়েব অ্যাপ, যেখানে কে কী বলেছে এবং কার আচরণ কেমন তা নোট থাকবে।'
    },
    {
      id: 'id2',
      title: 'লোকাল বিজনেস অটোমেশন ও ওয়েব সলিউশন সার্ভিস',
      category: 'business',
      stage: 'রিসার্চ চলছে',
      createdAt: getRelativeDate(-18),
      details: 'দেশের মাঝারি ব্যবসাগুলোর জন্য ইনভেন্টরি, কাস্টমার ফলো-আপ এবং পেমেন্ট ট্র্যাকিংয়ের সহজ প্যাকেজ তৈরি করে মাসিক সাবস্ক্রিপশনে সার্ভিস দেওয়া।'
    },
    {
      id: 'id3',
      title: 'বাস্তব জীবনের অভিজ্ঞতা ও প্রোডাক্টিভিটি নিয়ে ছোট ভিডিও সিরিজ',
      category: 'content',
      stage: 'নতুন চিন্তা',
      createdAt: getRelativeDate(-12),
      details: 'মানুষ চেনার উপায়, ব্যক্তিগত ফাইন্যান্স এবং ডিসিপ্লিন নিয়ে সপ্তাহে ১টি করে মানসম্মত ভিডিও বা আর্টিকেল প্রকাশ করা।'
    }
  ],
  journal: [
    {
      id: 'j1',
      title: 'নিজের ব্যক্তিগত সিস্টেম ও ডিজিটাল ডায়েরি শুরু করার সিদ্ধান্ত',
      date: getRelativeDate(-2),
      mood: 'milestone',
      story: 'জীবনের সব গুরুত্বপূর্ণ মানুষ, কে কী বলেছে, কার আচরণ কেমন, নিজের আইডিয়া এবং আয়-ব্যয় এক জায়গায় গুছিয়ে রাখার জন্য নিজস্ব প্ল্যাটফর্ম তৈরি করলাম।'
    },
    {
      id: 'j2',
      title: 'মানুষকে অন্ধভাবে বিশ্বাস করার শিক্ষা',
      date: getRelativeDate(-40),
      mood: 'lesson',
      story: 'সবার সাথে সব কথা শেয়ার করতে নেই। মানুষকে Level 1, 2, 3 তে ভাগ করে যার যতটুকু প্রাপ্য তাকে ততটুকু সময় ও গুরুত্ব দেওয়াই বুদ্ধিমানের কাজ।'
    }
  ],
  finance: [
    {
      id: 'f1',
      type: 'income',
      amount: 45000,
      category: 'প্রজেক্ট ও পেশাগত আয়',
      date: getRelativeDate(-10),
      note: 'ওয়েব অ্যাপ্লিকেশন ডেভেলপমেন্ট ও কনসালটেন্সি পেমেন্ট'
    },
    {
      id: 'f2',
      type: 'income',
      amount: 12000,
      category: 'সাইড প্রজেক্ট',
      date: getRelativeDate(-4),
      note: 'ক্লায়েন্ট মেইনটেন্যান্স ফি'
    },
    {
      id: 'f3',
      type: 'expense',
      amount: 14500,
      category: 'পরিবার ও বাসা খরচ',
      date: getRelativeDate(-8),
      note: 'মাসিক বাজার ও ইউটিলিটি বিল'
    },
    {
      id: 'f4',
      type: 'expense',
      amount: 3200,
      category: 'ইন্টারনেট ও সফটওয়্যার',
      date: getRelativeDate(-5),
      note: 'ব্রডব্যান্ড বিল ও ডোমেইন/টুলস রিনিউ'
    },
    {
      id: 'f5',
      type: 'expense',
      amount: 2400,
      category: 'নেটওয়ার্কিং ও যাতায়াত',
      date: getRelativeDate(-2),
      note: 'মিটিং ও কফি আড্ডা'
    }
  ],
  work: [
    {
      id: 'w1',
      title: 'Telegram চ্যানেল অটো-পোস্টিং ও বট ম্যানেজমেন্ট',
      category: 'telegram',
      status: 'active',
      handle: '@tasin_updates',
      client: 'নিজস্ব চ্যানেল',
      budget: 0,
      deadline: getRelativeDate(7),
      notes: 'প্রতিদিন নিয়মিত কন্টেন্ট শেডিউল করা এবং সাবস্ক্রাইবার অ্যাক্টিভিটি চেক করা।'
    },
    {
      id: 'w2',
      title: 'ক্লায়েন্ট টেলিগ্রাম সাপোর্ট ও প্রাইভেট গ্রুপ বট সেটআপ',
      category: 'bot',
      status: 'active',
      handle: '@client_support_bot',
      client: 'আরিফুল হক',
      budget: 8500,
      deadline: getRelativeDate(5),
      notes: 'মেম্বার ভেরিফিকেশন ও পেমেন্ট অ্যালার্ট বট তৈরি করে ডেলিভারি দিতে হবে।'
    },
    {
      id: 'w3',
      title: 'Telegram প্রমোশন ও অ্যাড ডিল সমন্বয়',
      category: 'channel',
      status: 'pending',
      handle: '@bd_tech_hub',
      client: 'রাশেদুল ইসলাম ভাই',
      budget: 4500,
      deadline: getRelativeDate(12),
      notes: 'সাপ্তাহিক স্পনসর পোস্ট ও চ্যানেল কোলাবরেশন নিয়ে চূড়ান্ত কথা বলতে হবে।'
    }
  ]
};

// Auth & State Management
let currentUser = null;
let state = JSON.parse(JSON.stringify(DEFAULT_DATA));
let activeContactFilter = 'all';
let activeConvFilter = 'all';
let activeIdeaFilter = 'all';
let activeFinanceFilter = 'all';
let activeWorkFilter = 'all';

function getActiveStorageKey() {
  return currentUser ? `tasin_personal_os_user_${currentUser.id}` : STORAGE_KEY;
}

async function hashPassword(password) {
  if (window.crypto && window.crypto.subtle) {
    const msgBuffer = new TextEncoder().encode(password);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  return btoa(unescape(encodeURIComponent(password)));
}

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function loadState() {
  try {
    const key = getActiveStorageKey();
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(DEFAULT_DATA));
      return JSON.parse(JSON.stringify(DEFAULT_DATA));
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.work)) {
      parsed.work = JSON.parse(JSON.stringify(DEFAULT_DATA.work));
    }
    return parsed;
  } catch (e) {
    console.error('Failed to load state:', e);
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }
}

function getSupabaseConfig() {
  try {
    const saved = JSON.parse(localStorage.getItem(SUPABASE_CONFIG_KEY) || 'null');
    if (saved && saved.url && saved.key) return saved;
  } catch {
    // ignore
  }
  if (DEFAULT_SUPABASE_URL && DEFAULT_SUPABASE_ANON_KEY) {
    return { url: DEFAULT_SUPABASE_URL, key: DEFAULT_SUPABASE_ANON_KEY };
  }
  return null;
}

function initSupabaseClient() {
  const cfg = getSupabaseConfig();
  if (cfg && window.supabase && typeof window.supabase.createClient === 'function') {
    sbClient = window.supabase.createClient(cfg.url, cfg.key);
  } else {
    sbClient = null;
  }
  updateCloudStatusUI();
  return sbClient;
}

function updateCloudStatusUI() {
  const statusEl = document.getElementById('cloudSyncStatusText');
  const noteEl = document.getElementById('authStorageNote');
  if (sbClient) {
    if (statusEl) statusEl.textContent = '☁️ ক্লাউড সিঙ্ক: Supabase সচল';
    if (noteEl) noteEl.textContent = '☁️ Supabase ক্লাউড সিঙ্ক চালু আছে — যেকোনো ডিভাইস থেকে লগইন করতে পারবেন।';
  } else {
    if (statusEl) statusEl.textContent = '💾 ক্লাউড সিঙ্ক: লোকাল মোড';
    if (noteEl) noteEl.textContent = '🔒 বর্তমানে লোকাল মোডে চলছে। ক্লাউড সিঙ্ক করতে নিচে Supabase সেটআপ করুন।';
  }
}

async function syncToSupabase() {
  if (!sbClient || !currentUser || !currentUser.isCloud) return;
  try {
    await sbClient.from('user_workspaces').upsert({
      user_id: currentUser.id,
      data: state,
      updated_at: new Date().toISOString()
    });
  } catch (err) {
    console.error('Supabase sync error:', err);
  }
}

async function loadFromSupabase(userId) {
  if (!sbClient) return null;
  try {
    const { data, error } = await sbClient
      .from('user_workspaces')
      .select('data')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Supabase fetch error:', error);
      return null;
    }
    return data && data.data ? data.data : null;
  } catch (err) {
    console.error('Supabase load exception:', err);
    return null;
  }
}

function saveState() {
  localStorage.setItem(getActiveStorageKey(), JSON.stringify(state));
  renderAll();
  syncToSupabase();
}

// ==========================================================================
// UTILITY & DATE CALCULATIONS
// ==========================================================================
function formatBanglaNumber(num) {
  return Number(num || 0).toLocaleString('bn-BD');
}

function formatBanglaDate(dateStr) {
  if (!dateStr) return 'নির্ধারিত নেই';
  const d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString('bn-BD', { day: 'numeric', month: 'short', year: 'numeric' });
}

function getContactFollowupStatus(contact) {
  const last = new Date(contact.lastContactDate + 'T00:00:00');
  const freq = parseInt(contact.frequencyDays || 90, 10);
  const nextDate = new Date(last);
  nextDate.setDate(nextDate.getDate() + freq);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffDays = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24));
  const daysSinceLast = Math.floor((today - last) / (1000 * 60 * 60 * 24));

  return {
    nextDateStr: nextDate.toISOString().split('T')[0],
    diffDays,
    daysSinceLast,
    isDue: diffDays <= 0,
    isUpcomingSoon: diffDays > 0 && diffDays <= 7
  };
}

function hasRedFlagForPerson(name) {
  if (!name) return false;
  const clean = name.trim().toLowerCase();
  return state.redFlags.some(rf => rf.person.trim().toLowerCase() === clean);
}

function getLevelBadgeHTML(level) {
  if (String(level) === '1') {
    return `<span class="badge-primary">★ Level 1 • কোর ভিআইপি</span>`;
  }
  if (String(level) === '2') {
    return `<span class="badge-success">◆ Level 2 • নিয়মিত</span>`;
  }
  return `<span class="chip">● Level 3 • সাধারণ</span>`;
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.hidden = false;
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => {
    toast.hidden = true;
  }, 2800);
}

function escapeHTML(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ==========================================================================
// RENDER FUNCTIONS
// ==========================================================================
function renderAll() {
  renderTopbarAndBadges();
  renderDashboard();
  renderContacts();
  renderConversations();
  renderRedFlags();
  renderWork();
  renderTasks();
  renderIdeas();
  renderJournal();
  renderFinance();
  populateContactDatalist();
}

function renderTopbarAndBadges() {
  const todayEl = document.getElementById('todayDateDisplay');
  const now = new Date();
  todayEl.textContent = 'আজ: ' + now.toLocaleDateString('bn-BD', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const dueContacts = state.contacts.filter(c => getContactFollowupStatus(c).isDue);
  document.getElementById('navDueBadge').textContent = formatBanglaNumber(dueContacts.length);
  document.getElementById('navContactsCount').textContent = formatBanglaNumber(state.contacts.length);
  document.getElementById('navConvCount').textContent = formatBanglaNumber(state.conversations.length);
  document.getElementById('navRedFlagsCount').textContent = formatBanglaNumber(state.redFlags.length);
  document.getElementById('navWorkCount').textContent = formatBanglaNumber((state.work || []).filter(w => w.status !== 'done').length);
  document.getElementById('navTasksCount').textContent = formatBanglaNumber(state.tasks.filter(t => !t.done).length);
  document.getElementById('navIdeasCount').textContent = formatBanglaNumber(state.ideas.length);
  document.getElementById('navJournalCount').textContent = formatBanglaNumber(state.journal.length);
}

function renderDashboard() {
  const totalContacts = state.contacts.length;
  const level1Count = state.contacts.filter(c => String(c.level) === '1').length;
  const dueContacts = state.contacts.filter(c => getContactFollowupStatus(c).isDue);

  document.getElementById('dashTotalContacts').textContent = formatBanglaNumber(totalContacts);
  document.getElementById('dashLevel1Count').textContent = `Level 1: ${formatBanglaNumber(level1Count)}`;
  document.getElementById('dashDueText').textContent = `এখনই যোগাযোগ প্রয়োজন: ${formatBanglaNumber(dueContacts.length)} জন`;

  document.getElementById('dashRedFlagCount').textContent = formatBanglaNumber(state.redFlags.length);

  const pendingTasks = state.tasks.filter(t => !t.done);
  const highTasks = pendingTasks.filter(t => t.priority === 'high');
  document.getElementById('dashPendingTasks').textContent = formatBanglaNumber(pendingTasks.length);
  document.getElementById('dashHighPriorityTasks').textContent = `জরুরি: ${formatBanglaNumber(highTasks.length)}`;
  document.getElementById('dashIdeasCountFoot').textContent = `সংরক্ষিত আইডিয়া: ${formatBanglaNumber(state.ideas.length)} টি`;

  const totalIncome = state.finance.filter(f => f.type === 'income').reduce((sum, f) => sum + Number(f.amount), 0);
  const totalExpense = state.finance.filter(f => f.type === 'expense').reduce((sum, f) => sum + Number(f.amount), 0);
  const net = totalIncome - totalExpense;

  document.getElementById('dashNetBalance').textContent = `৳ ${formatBanglaNumber(net)}`;
  document.getElementById('dashIncomeExpenseFoot').textContent = `আয়: ৳${formatBanglaNumber(totalIncome)} • ব্যয়: ৳${formatBanglaNumber(totalExpense)}`;

  // Follow-up list on Dashboard
  const followupContainer = document.getElementById('dashFollowupList');
  const sortedContacts = [...state.contacts].sort((a, b) => {
    const stA = getContactFollowupStatus(a);
    const stB = getContactFollowupStatus(b);
    return stA.diffDays - stB.diffDays;
  });

  if (sortedContacts.length === 0) {
    followupContainer.innerHTML = `<div class="empty-state">কোনো পরিচিত মানুষ যুক্ত করা হয়নি।</div>`;
  } else {
    followupContainer.innerHTML = sortedContacts.slice(0, 5).map(c => {
      const st = getContactFollowupStatus(c);
      const statusBadge = st.isDue
        ? `<span class="badge-error">⏰ যোগাযোগের সময় পার হয়েছে (${formatBanglaNumber(Math.abs(st.diffDays))} দিন)</span>`
        : `<span class="badge-success">পরবর্তী যোগাযোগ: ${formatBanglaNumber(st.diffDays)} দিন পর</span>`;

      return `
        <div class="list-item">
          <div class="list-item-main">
            <div class="list-item-header">
              <span class="list-item-title">${escapeHTML(c.name)}</span>
              ${getLevelBadgeHTML(c.level)}
              ${statusBadge}
            </div>
            <div class="list-item-body">${escapeHTML(c.relation)} — ${escapeHTML(c.notes || '')}</div>
            <div class="list-item-meta">
              <span>সর্বশেষ কথা: ${formatBanglaDate(c.lastContactDate)}</span>
              <span>চক্র: প্রতি ${formatBanglaNumber(c.frequencyDays)} দিন পর পর</span>
            </div>
          </div>
          <button class="btn-secondary btn-sm" onclick="markContactedToday('${c.id}')">✓ আজ কথা হয়েছে</button>
        </div>
      `;
    }).join('');
  }

  // Dashboard Tasks
  const dashTasksEl = document.getElementById('dashTasksList');
  if (pendingTasks.length === 0) {
    dashTasksEl.innerHTML = `<div class="empty-state">সব কাজ সম্পন্ন হয়েছে!</div>`;
  } else {
    dashTasksEl.innerHTML = pendingTasks.slice(0, 4).map(t => `
      <div class="list-item">
        <div class="list-item-main">
          <div class="list-item-header">
            <span class="list-item-title">${escapeHTML(t.title)}</span>
            ${t.priority === 'high' ? '<span class="badge-warning">🔥 জরুরি</span>' : '<span class="chip">পরিকল্পনা</span>'}
          </div>
          <div class="list-item-meta">
            <span>তারিখ: ${formatBanglaDate(t.dueDate)}</span>
          </div>
        </div>
        <button class="btn-outline" onclick="toggleTaskDone('${t.id}')">সম্পন্ন</button>
      </div>
    `).join('');
  }

  // Dashboard Recent Spoken Notes + Red Flags
  const dashNotesEl = document.getElementById('dashRecentNotesList');
  const combinedNotes = [
    ...state.redFlags.map(r => ({
      type: 'redflag',
      person: r.person,
      date: r.date,
      text: r.incident
    })),
    ...state.conversations.map(c => ({
      type: 'conv',
      person: c.person,
      date: c.date,
      text: c.quote
    }))
  ].sort((a, b) => (b.date || '').localeCompare(a.date || '')).slice(0, 3);

  if (combinedNotes.length === 0) {
    dashNotesEl.innerHTML = `<div class="empty-state">কোনো নোট নেই।</div>`;
  } else {
    dashNotesEl.innerHTML = combinedNotes.map(item => `
      <div class="list-item ${item.type === 'redflag' ? 'redflag-item' : ''}">
        <div class="list-item-main">
          <div class="list-item-header">
            <span class="list-item-title">${escapeHTML(item.person)}</span>
            ${item.type === 'redflag'
              ? '<span class="badge-error">⚠️ খারাপ ব্যবহার</span>'
              : '<span class="badge-primary">💬 কে কী বলেছে</span>'}
          </div>
          <div class="list-item-body">"${escapeHTML(item.text)}"</div>
          <div class="list-item-meta"><span>${formatBanglaDate(item.date)}</span></div>
        </div>
      </div>
    `).join('');
  }
}

// ==========================================================================
// CONTACTS (LEVEL 1, 2, 3)
// ==========================================================================
function renderContacts() {
  const grid = document.getElementById('contactsGrid');
  const query = (document.getElementById('contactSearchInput')?.value || '').trim().toLowerCase();

  const filtered = state.contacts.filter(c => {
    const st = getContactFollowupStatus(c);
    const hasRF = hasRedFlagForPerson(c.name);

    if (activeContactFilter === '1' && String(c.level) !== '1') return false;
    if (activeContactFilter === '2' && String(c.level) !== '2') return false;
    if (activeContactFilter === '3' && String(c.level) !== '3') return false;
    if (activeContactFilter === 'due' && !st.isDue) return false;
    if (activeContactFilter === 'redflag' && !hasRF) return false;

    if (query) {
      const hay = `${c.name} ${c.relation} ${c.notes} ${c.phone}`.toLowerCase();
      if (!hay.includes(query)) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="empty-state" style="grid-column: 1/-1;">এই ফিল্টারে কোনো পরিচিত মানুষ পাওয়া যায়নি।</div>`;
    return;
  }

  grid.innerHTML = filtered.map(c => {
    const st = getContactFollowupStatus(c);
    const hasRF = hasRedFlagForPerson(c.name);
    const initial = c.name.trim().charAt(0).toUpperCase();

    let statusPill = '';
    if (st.isDue) {
      statusPill = `<span class="badge-error">⏰ যোগাযোগের সময় হয়েছে (${formatBanglaNumber(Math.abs(st.diffDays))} দিন ওভারডিউ)</span>`;
    } else if (st.isUpcomingSoon) {
      statusPill = `<span class="badge-warning">⏳ ${formatBanglaNumber(st.diffDays)} দিন পর যোগাযোগ</span>`;
    } else {
      statusPill = `<span class="badge-success">✓ ${formatBanglaNumber(st.diffDays)} দিন পর পরবর্তী খোঁজ</span>`;
    }

    return `
      <div class="card contact-card ${hasRF ? 'has-redflag' : ''}">
        <div>
          <div class="contact-top">
            <div class="contact-person">
              <div class="person-avatar lvl-${c.level}">${escapeHTML(initial)}</div>
              <div>
                <div class="person-name">${escapeHTML(c.name)}</div>
                <div class="person-relation">${escapeHTML(c.relation)}</div>
              </div>
            </div>
            ${getLevelBadgeHTML(c.level)}
          </div>

          <div style="margin: 12px 0;">
            ${statusPill}
          </div>

          <div class="contact-schedule-box">
            <div class="schedule-item">
              <span>সর্বশেষ যোগাযোগ</span>
              <strong>${formatBanglaDate(c.lastContactDate)}</strong>
            </div>
            <div class="schedule-item">
              <span>পরবর্তী যোগাযোগের তারিখ</span>
              <strong>${formatBanglaDate(st.nextDateStr)}</strong>
            </div>
            <div class="schedule-item">
              <span>যোগাযোগের বিরতি</span>
              <strong>প্রতি ${formatBanglaNumber(c.frequencyDays)} দিন পর</strong>
            </div>
            <div class="schedule-item">
              <span>ফোন / যোগাযোগ</span>
              <strong>${escapeHTML(c.phone || 'দেওয়া নেই')}</strong>
            </div>
          </div>

          ${c.notes ? `<div class="contact-note-box" style="margin-top: 12px;">${escapeHTML(c.notes)}</div>` : ''}

          ${hasRF ? `<div class="contact-redflag-alert" style="margin-top: 10px;">⚠️ সতর্কতা: এই ব্যক্তির বিরুদ্ধে খারাপ ব্যবহারের নোট রয়েছে!</div>` : ''}
        </div>

        <div class="contact-actions">
          <button class="btn-primary btn-sm" onclick="markContactedToday('${c.id}')">✓ আজ যোগাযোগ সম্পন্ন</button>
          <div style="display:flex; gap:6px;">
            <button class="btn-outline" onclick="openQuickNoteForPerson('${escapeHTML(c.name)}')">+ কথা নোট</button>
            <button class="btn-danger-ghost" onclick="deleteContact('${c.id}')">মুছুন</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

window.markContactedToday = function(contactId) {
  const contact = state.contacts.find(c => c.id === contactId);
  if (!contact) return;
  contact.lastContactDate = getRelativeDate(0);
  saveState();
  showToast(`${contact.name}-এর সাথে আজকের যোগাযোগ আপডেট হয়েছে!`);
};

window.deleteContact = function(contactId) {
  state.contacts = state.contacts.filter(c => c.id !== contactId);
  saveState();
  showToast('পরিচিত ব্যক্তির তথ্য মুছে ফেলা হয়েছে।');
};

window.openQuickNoteForPerson = function(personName) {
  openModal('convModal');
  document.getElementById('convPerson').value = personName;
  document.getElementById('convDate').value = getRelativeDate(0);
};

// ==========================================================================
// CONVERSATIONS (কে আমাকে কী বলেছে)
// ==========================================================================
function renderConversations() {
  const listEl = document.getElementById('conversationsList');
  const query = (document.getElementById('convSearchInput')?.value || '').trim().toLowerCase();

  const toneBadgeMap = {
    promise: `<span class="badge-primary">🤝 কথা / ওয়াদা দিয়েছেন</span>`,
    positive: `<span class="badge-success">✨ ইতিবাচক / পরামর্শ</span>`,
    neutral: `<span class="chip">📝 সাধারণ আলোচনা</span>`,
    caution: `<span class="badge-warning">⚠️ সতর্কতা / মনে রাখা জরুরি</span>`
  };

  const filtered = state.conversations.filter(item => {
    if (activeConvFilter !== 'all' && item.tone !== activeConvFilter) return false;
    if (query) {
      const hay = `${item.person} ${item.quote}`.toLowerCase();
      if (!hay.includes(query)) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    listEl.innerHTML = `<div class="empty-state">কোনো কথোপকথন বা নোট পাওয়া যায়নি।</div>`;
    return;
  }

  listEl.innerHTML = filtered.map(item => `
    <div class="list-item">
      <div class="list-item-main">
        <div class="list-item-header">
          <span class="list-item-title">${escapeHTML(item.person)}</span>
          ${toneBadgeMap[item.tone] || toneBadgeMap.neutral}
          <span class="chip">কথার তারিখ: ${formatBanglaDate(item.date)}</span>
          ${item.nextDate ? `<span class="badge-warning">পরবর্তী ফলো-আপ: ${formatBanglaDate(item.nextDate)}</span>` : ''}
        </div>
        <div class="list-item-body" style="margin-top:6px;">"${escapeHTML(item.quote)}"</div>
      </div>
      <button class="btn-danger-ghost" onclick="deleteConversation('${item.id}')">মুছুন</button>
    </div>
  `).join('');
}

window.deleteConversation = function(id) {
  state.conversations = state.conversations.filter(c => c.id !== id);
  saveState();
  showToast('কথোপকথন নোট মুছে ফেলা হয়েছে।');
};

// ==========================================================================
// RED FLAGS (খারাপ ব্যবহার লগ)
// ==========================================================================
function renderRedFlags() {
  const listEl = document.getElementById('redFlagsList');
  if (state.redFlags.length === 0) {
    listEl.innerHTML = `<div class="empty-state">কোনো খারাপ ব্যবহারের নোট নেই।</div>`;
    return;
  }

  const sevBadge = {
    high: `<span class="badge-error">🚨 গুরুতর (চরম সতর্কতা)</span>`,
    medium: `<span class="badge-warning">⚠️ মাঝারি (দূরত্ব বজায় রাখুন)</span>`,
    low: `<span class="chip">👀 হালকা সতর্কতা</span>`
  };

  listEl.innerHTML = state.redFlags.map(rf => `
    <div class="list-item redflag-item">
      <div class="list-item-main">
        <div class="list-item-header">
          <span class="list-item-title">${escapeHTML(rf.person)}</span>
          ${sevBadge[rf.severity] || sevBadge.medium}
          <span class="chip">ঘটনার তারিখ: ${formatBanglaDate(rf.date)}</span>
        </div>
        <div class="list-item-body" style="margin-top:6px;">
          <strong>কী খারাপ ব্যবহার করেছে:</strong> ${escapeHTML(rf.incident)}
        </div>
        <div class="boundary-box">
          🛡️ <strong>ভবিষ্যৎ সতর্কতা (Boundary):</strong> ${escapeHTML(rf.boundary)}
        </div>
      </div>
      <button class="btn-danger-ghost" onclick="deleteRedFlag('${rf.id}')">মুছুন</button>
    </div>
  `).join('');
}

window.deleteRedFlag = function(id) {
  state.redFlags = state.redFlags.filter(r => r.id !== id);
  saveState();
  showToast('সতর্কতা নোট মুছে ফেলা হয়েছে।');
};

// ==========================================================================
// WORK & TELEGRAM WORK
// ==========================================================================
function renderWork() {
  const workList = state.work || [];
  const activeItems = workList.filter(w => w.status === 'active');
  const tgItems = workList.filter(w => ['telegram', 'bot', 'channel'].includes(w.category));
  const doneItems = workList.filter(w => w.status === 'done');
  const totalBudget = workList
    .filter(w => w.status !== 'done')
    .reduce((sum, w) => sum + Number(w.budget || 0), 0);

  document.getElementById('workActiveCount').textContent = formatBanglaNumber(activeItems.length);
  document.getElementById('workTelegramCount').textContent = formatBanglaNumber(tgItems.length);
  document.getElementById('workDoneCount').textContent = formatBanglaNumber(doneItems.length);
  document.getElementById('workTotalBudget').textContent = `৳ ${formatBanglaNumber(totalBudget)}`;

  const grid = document.getElementById('workGrid');
  const query = (document.getElementById('workSearchInput')?.value || '').trim().toLowerCase();

  const catLabels = {
    telegram: '✈️ Telegram Work',
    bot: '🤖 বট / অটোমেশন',
    channel: '📢 চ্যানেল / গ্রুপ',
    client: '💼 ক্লায়েন্ট / প্রজেক্ট'
  };

  const statusPills = {
    active: '<span class="badge-primary">🚀 চলমান</span>',
    pending: '<span class="badge-warning">⏳ অপেক্ষমাণ</span>',
    done: '<span class="badge-success">✅ সম্পন্ন</span>'
  };

  const filtered = workList.filter(w => {
    if (activeWorkFilter !== 'all' && w.category !== activeWorkFilter) return false;
    if (query) {
      const hay = `${w.title} ${w.handle} ${w.client} ${w.notes}`.toLowerCase();
      if (!hay.includes(query)) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="empty-state" style="grid-column: 1/-1;">এই ফিল্টারে কোনো Work বা Telegram কাজ পাওয়া যায়নি।</div>`;
    return;
  }

  grid.innerHTML = filtered.map(w => {
    const cleanHandle = (w.handle || '').trim();
    let handleHTML = 'দেওয়া নেই';
    if (cleanHandle) {
      const tgUrl = cleanHandle.startsWith('http')
        ? cleanHandle
        : `https://t.me/${cleanHandle.replace(/^@/, '')}`;
      handleHTML = `<a href="${escapeHTML(tgUrl)}" target="_blank" rel="noopener" style="color:var(--link); text-decoration:none;">${escapeHTML(cleanHandle)} ↗</a>`;
    }

    return `
      <div class="card contact-card">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:10px;">
            <span class="chip">${catLabels[w.category] || '💼 Work'}</span>
            ${statusPills[w.status] || statusPills.active}
          </div>

          <h3 class="idea-title" style="margin-top:0;">${escapeHTML(w.title)}</h3>

          <div class="contact-schedule-box" style="margin-top:12px;">
            <div class="schedule-item">
              <span>Telegram / লিংক</span>
              <strong>${handleHTML}</strong>
            </div>
            <div class="schedule-item">
              <span>ক্লায়েন্ট / দায়িত্বশীল</span>
              <strong>${escapeHTML(w.client || 'নিজস্ব')}</strong>
            </div>
            <div class="schedule-item">
              <span>বাজেট / পেমেন্ট</span>
              <strong>${w.budget ? `৳ ${formatBanglaNumber(w.budget)}` : 'নির্ধারিত নয়'}</strong>
            </div>
            <div class="schedule-item">
              <span>ডেডলাইন</span>
              <strong>${w.deadline ? formatBanglaDate(w.deadline) : 'নির্ধারিত নেই'}</strong>
            </div>
          </div>

          ${w.notes ? `<div class="contact-note-box" style="margin-top: 12px;">${escapeHTML(w.notes)}</div>` : ''}
        </div>

        <div class="contact-actions">
          <button class="btn-primary btn-sm" onclick="toggleWorkStatus('${w.id}')">
            ${w.status === 'done' ? '↺ আবার চালু করুন' : '✓ সম্পন্ন হয়েছে'}
          </button>
          <button class="btn-danger-ghost" onclick="deleteWork('${w.id}')">মুছুন</button>
        </div>
      </div>
    `;
  }).join('');
}

window.toggleWorkStatus = function(id) {
  const item = (state.work || []).find(w => w.id === id);
  if (!item) return;
  item.status = item.status === 'done' ? 'active' : 'done';
  saveState();
  showToast(item.status === 'done' ? 'কাজটি সম্পন্ন হিসেবে চিহ্নিত হয়েছে!' : 'কাজটি আবার চলমান করা হয়েছে।');
};

window.deleteWork = function(id) {
  state.work = (state.work || []).filter(w => w.id !== id);
  saveState();
  showToast('Work আইটেমটি মুছে ফেলা হয়েছে।');
};

// ==========================================================================
// UPCOMING TASKS (সামনের কাজ)
// ==========================================================================
function renderTasks() {
  const horizons = ['today', 'month', 'future'];
  const containerIds = {
    today: 'tasksListToday',
    month: 'tasksListMonth',
    future: 'tasksListFuture'
  };
  const countIds = {
    today: 'colCountToday',
    month: 'colCountMonth',
    future: 'colCountFuture'
  };

  const priorityBadge = {
    high: `<span class="badge-error">🔥 জরুরি</span>`,
    medium: `<span class="badge-warning">⚡ মাঝারি</span>`,
    low: `<span class="chip">🌱 সাধারণ</span>`
  };

  horizons.forEach(h => {
    const items = state.tasks.filter(t => t.horizon === h);
    document.getElementById(countIds[h]).textContent = formatBanglaNumber(items.filter(i => !i.done).length);
    const el = document.getElementById(containerIds[h]);

    if (items.length === 0) {
      el.innerHTML = `<div class="empty-state">কোনো কাজ নেই</div>`;
      return;
    }

    el.innerHTML = items.map(t => `
      <div class="task-item ${t.done ? 'done' : ''}">
        <input type="checkbox" class="task-checkbox" ${t.done ? 'checked' : ''} onchange="toggleTaskDone('${t.id}')" />
        <div class="task-content">
          <div class="task-title">${escapeHTML(t.title)}</div>
          <div class="list-item-meta" style="margin-top:6px;">
            ${priorityBadge[t.priority] || ''}
            ${t.dueDate ? `<span>তারিখ: ${formatBanglaDate(t.dueDate)}</span>` : ''}
          </div>
        </div>
        <button class="btn-danger-ghost" onclick="deleteTask('${t.id}')">×</button>
      </div>
    `).join('');
  });
}

window.toggleTaskDone = function(id) {
  const task = state.tasks.find(t => t.id === id);
  if (!task) return;
  task.done = !task.done;
  saveState();
  showToast(task.done ? 'কাজটি সম্পন্ন হিসেবে চিহ্নিত হয়েছে!' : 'কাজটি আবার চালু করা হয়েছে।');
};

window.deleteTask = function(id) {
  state.tasks = state.tasks.filter(t => t.id !== id);
  saveState();
};

// ==========================================================================
// IDEAS VAULT (আইডিয়া ভল্ট)
// ==========================================================================
function renderIdeas() {
  const grid = document.getElementById('ideasGrid');
  const catLabels = {
    business: '💼 ব্যবসা ও আয়',
    tech: '💻 ওয়েবসাইট ও টেক',
    content: '🎬 কনটেন্ট ও মিডিয়া',
    life: '🌟 জীবনধারা ও ব্যক্তিগত'
  };

  const filtered = state.ideas.filter(id => activeIdeaFilter === 'all' || id.category === activeIdeaFilter);

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">এই ক্যাটাগরিতে কোনো আইডিয়া নেই।</div>`;
    return;
  }

  grid.innerHTML = filtered.map(item => `
    <div class="card idea-card">
      <div>
        <div style="display:flex; justify-content:space-between; gap:8px; flex-wrap:wrap;">
          <span class="badge-primary">${catLabels[item.category] || '💡 আইডিয়া'}</span>
          <span class="chip">${escapeHTML(item.stage)}</span>
        </div>
        <h3 class="idea-title">${escapeHTML(item.title)}</h3>
        <p class="idea-details">${escapeHTML(item.details)}</p>
      </div>
      <div class="contact-actions">
        <span class="kpi-foot">যুক্ত হয়েছে: ${formatBanglaDate(item.createdAt)}</span>
        <button class="btn-danger-ghost" onclick="deleteIdea('${item.id}')">মুছুন</button>
      </div>
    </div>
  `).join('');
}

window.deleteIdea = function(id) {
  state.ideas = state.ideas.filter(i => i.id !== id);
  saveState();
  showToast('আইডিয়াটি মুছে ফেলা হয়েছে।');
};

// ==========================================================================
// LIFE EVENTS & JOURNAL (জীবনের ঘটনা)
// ==========================================================================
function renderJournal() {
  const container = document.getElementById('journalTimeline');
  const moodMap = {
    milestone: '<span class="badge-success">🏆 বড় অর্জন / মাইলফলক</span>',
    lesson: '<span class="badge-primary">📘 জীবনের শিক্ষা</span>',
    memory: '<span class="chip">🌿 বিশেষ স্মৃতি</span>',
    challenge: '<span class="badge-warning">⚡ কঠিন সময় ও উত্তরণ</span>'
  };

  const sorted = [...state.journal].sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  if (sorted.length === 0) {
    container.innerHTML = `<div class="empty-state">এখনো কোনো জীবনের ঘটনা লেখা হয়নি।</div>`;
    return;
  }

  container.innerHTML = sorted.map(j => `
    <div class="card timeline-node">
      <div class="list-item-header" style="justify-content: space-between;">
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <span class="list-item-title">${escapeHTML(j.title)}</span>
          ${moodMap[j.mood] || ''}
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <span class="chip">${formatBanglaDate(j.date)}</span>
          <button class="btn-danger-ghost" onclick="deleteJournal('${j.id}')">মুছুন</button>
        </div>
      </div>
      <p class="list-item-body" style="margin-top:10px;">${escapeHTML(j.story)}</p>
    </div>
  `).join('');
}

window.deleteJournal = function(id) {
  state.journal = state.journal.filter(j => j.id !== id);
  saveState();
  showToast('ঘটনাটি মুছে ফেলা হয়েছে।');
};

// ==========================================================================
// PERSONAL FINANCE (আয়-ব্যয় ও খরচ)
// ==========================================================================
function renderFinance() {
  const totalIncome = state.finance.filter(f => f.type === 'income').reduce((s, f) => s + Number(f.amount), 0);
  const totalExpense = state.finance.filter(f => f.type === 'expense').reduce((s, f) => s + Number(f.amount), 0);
  const net = totalIncome - totalExpense;

  document.getElementById('finTotalIncome').textContent = `৳ ${formatBanglaNumber(totalIncome)}`;
  document.getElementById('finTotalExpense').textContent = `৳ ${formatBanglaNumber(totalExpense)}`;
  document.getElementById('finNetBalance').textContent = `৳ ${formatBanglaNumber(net)}`;

  const listEl = document.getElementById('financeList');
  const filtered = [...state.finance]
    .filter(f => activeFinanceFilter === 'all' || f.type === activeFinanceFilter)
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  if (filtered.length === 0) {
    listEl.innerHTML = `<div class="empty-state">কোনো লেনদেনের হিসাব নেই।</div>`;
  } else {
    listEl.innerHTML = filtered.map(f => `
      <div class="list-item">
        <div class="list-item-main">
          <div class="list-item-header">
            <span class="list-item-title">${escapeHTML(f.note)}</span>
            <span class="chip">${escapeHTML(f.category)}</span>
            ${f.type === 'income'
              ? '<span class="badge-success">🔺 আয়</span>'
              : '<span class="badge-error">🔻 খরচ</span>'}
          </div>
          <div class="list-item-meta">
            <span>তারিখ: ${formatBanglaDate(f.date)}</span>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:12px;">
          <strong class="${f.type === 'income' ? 'text-success' : 'text-error'}" style="font-size:16px;">
            ${f.type === 'income' ? '+' : '-'} ৳${formatBanglaNumber(f.amount)}
          </strong>
          <button class="btn-danger-ghost" onclick="deleteFinance('${f.id}')">×</button>
        </div>
      </div>
    `).join('');
  }

  // Category Breakdown for Expenses
  const breakdownEl = document.getElementById('expenseCategoryBreakdown');
  const expenses = state.finance.filter(f => f.type === 'expense');
  if (expenses.length === 0) {
    breakdownEl.innerHTML = `<div class="empty-state">খরচের কোনো খাত নেই।</div>`;
    return;
  }

  const totalsByCat = {};
  expenses.forEach(e => {
    totalsByCat[e.category] = (totalsByCat[e.category] || 0) + Number(e.amount);
  });

  const sortedCats = Object.entries(totalsByCat).sort((a, b) => b[1] - a[1]);
  breakdownEl.innerHTML = sortedCats.map(([cat, amt]) => {
    const pct = totalExpense > 0 ? Math.round((amt / totalExpense) * 100) : 0;
    return `
      <div class="cat-row">
        <div class="cat-row-top">
          <span>${escapeHTML(cat)}</span>
          <span>৳ ${formatBanglaNumber(amt)} (${formatBanglaNumber(pct)}%)</span>
        </div>
        <div class="cat-bar-track">
          <div class="cat-bar-fill" style="width: ${pct}%;"></div>
        </div>
      </div>
    `;
  }).join('');
}

window.deleteFinance = function(id) {
  state.finance = state.finance.filter(f => f.id !== id);
  saveState();
  showToast('হিসাবটি মুছে ফেলা হয়েছে।');
};

function populateContactDatalist() {
  const dl = document.getElementById('contactNamesDatalist');
  if (!dl) return;
  dl.innerHTML = state.contacts.map(c => `<option value="${escapeHTML(c.name)}"></option>`).join('');
}

// ==========================================================================
// NAVIGATION, MODALS & EVENT LISTENERS
// ==========================================================================
const TAB_TITLES = {
  dashboard: 'হোম ড্যাশবোর্ড',
  contacts: 'পরিচিত মানুষ ও যোগাযোগ (Level 1, 2, 3)',
  conversations: 'কে আমাকে কী বলেছে ও কথা নোট',
  redflags: 'খারাপ ব্যবহার ও সতর্কতা লগ',
  work: 'Work ও Telegram কাজ',
  tasks: 'সামনের কাজ ও পরিকল্পনা',
  ideas: 'আমার আইডিয়া ভল্ট',
  journal: 'জীবনের ঘটনা ও ডায়েরি',
  finance: 'ব্যক্তিগত আয়-ব্যয় ও খরচ'
};

function switchTab(tabId) {
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });
  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.classList.toggle('active', panel.id === `tab-${tabId}`);
  });
  document.getElementById('topbarTitle').textContent = TAB_TITLES[tabId] || 'ওয়ার্কস্পেস';
  document.getElementById('sidebar').classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openModal(modalId) {
  const backdrop = document.getElementById('modalBackdrop');
  backdrop.hidden = false;
  document.querySelectorAll('.modal-card').forEach(card => {
    card.hidden = card.id !== modalId;
  });
}

function closeAllModals() {
  document.getElementById('modalBackdrop').hidden = true;
  document.querySelectorAll('.modal-card').forEach(card => {
    card.hidden = true;
  });
}

function showAuthAlert(msg) {
  const alertEl = document.getElementById('authAlert');
  alertEl.textContent = msg;
  alertEl.hidden = false;
}

function translateAuthError(message = '') {
  const m = message.toLowerCase();
  if (m.includes('user already registered') || m.includes('already exists')) {
    return 'এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট খোলা আছে! অনুগ্রহ করে "লগইন (Login)" ট্যাবে গিয়ে লগইন করুন।';
  }
  if (m.includes('invalid login credentials')) {
    return 'ইমেইল বা পাসওয়ার্ড সঠিক নয়! পাসওয়ার্ড ভুলে গেলে নিচে "পাসওয়ার্ড ভুলে গেছেন?" বাটনে ক্লিক করুন।';
  }
  if (m.includes('email not confirmed')) {
    return 'আপনার ইমেইলটি এখনো কনফার্ম করা হয়নি। অনুগ্রহ করে Gmail Inbox/Spam চেক করে লিংকে ক্লিক করুন।';
  }
  if (m.includes('password should be at least')) {
    return 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।';
  }
  return message;
}

function clearAuthAlert() {
  const alertEl = document.getElementById('authAlert');
  alertEl.textContent = '';
  alertEl.hidden = true;
}

async function enterWorkspace(user) {
  currentUser = user;
  if (!user.isCloud) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ id: user.id, identifier: user.identifier }));
  }

  document.getElementById('workspaceAvatar').textContent = (user.name || 'T').trim().charAt(0).toUpperCase();
  document.getElementById('workspaceTitle').textContent = `${user.name}-এর পার্সোনাল ওএস`;
  document.getElementById('workspaceUserEmail').textContent = user.identifier;

  document.getElementById('authScreen').hidden = true;
  document.getElementById('appShell').hidden = false;

  state = loadState();
  renderAll();

  if (user.isCloud && sbClient) {
    const cloudData = await loadFromSupabase(user.id);
    if (cloudData && cloudData.contacts) {
      if (!Array.isArray(cloudData.work)) {
        cloudData.work = JSON.parse(JSON.stringify(DEFAULT_DATA.work));
      }
      state = cloudData;
      localStorage.setItem(getActiveStorageKey(), JSON.stringify(state));
      renderAll();
    } else {
      await syncToSupabase();
    }
  }
}

async function logoutUser() {
  if (sbClient && currentUser && currentUser.isCloud) {
    await sbClient.auth.signOut();
  }
  currentUser = null;
  localStorage.removeItem(SESSION_KEY);
  document.getElementById('appShell').hidden = true;
  document.getElementById('authScreen').hidden = false;
  document.getElementById('loginForm').reset();
  clearAuthAlert();
  showToast('সফলভাবে লগআউট হয়েছে।');
}

function openSupabaseConfigModal() {
  const cfg = getSupabaseConfig();
  document.getElementById('sbUrlInput').value = cfg ? cfg.url : '';
  document.getElementById('sbKeyInput').value = cfg ? cfg.key : '';
  openModal('supabaseModal');
}

async function setupAuth() {
  initSupabaseClient();

  const authTabs = document.getElementById('authTabs');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');

  document.getElementById('openSupabaseSetupFromAuth').addEventListener('click', openSupabaseConfigModal);
  document.getElementById('openSupabaseSetupBtn').addEventListener('click', openSupabaseConfigModal);

  document.getElementById('supabaseForm').addEventListener('submit', e => {
    e.preventDefault();
    const url = document.getElementById('sbUrlInput').value.trim();
    const key = document.getElementById('sbKeyInput').value.trim();
    localStorage.setItem(SUPABASE_CONFIG_KEY, JSON.stringify({ url, key }));
    initSupabaseClient();
    closeAllModals();
    showToast('Supabase ক্লাউড সংযোগ সেভ হয়েছে! এখন ইমেইল দিয়ে লগইন/সাইনআপ করুন।');
  });

  document.getElementById('disconnectSupabaseBtn').addEventListener('click', () => {
    localStorage.removeItem(SUPABASE_CONFIG_KEY);
    initSupabaseClient();
    closeAllModals();
    showToast('লোকাল মোডে ফিরে আসা হয়েছে।');
  });

  authTabs.addEventListener('click', e => {
    const btn = e.target.closest('.auth-tab');
    if (!btn) return;
    clearAuthAlert();
    document.querySelectorAll('.auth-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const mode = btn.dataset.authMode;
    loginForm.hidden = mode !== 'login';
    signupForm.hidden = mode !== 'signup';
  });

  signupForm.addEventListener('submit', async e => {
    e.preventDefault();
    clearAuthAlert();
    const name = document.getElementById('signupName').value.trim();
    const identifier = document.getElementById('signupIdentifier').value.trim().toLowerCase();
    const password = document.getElementById('signupPassword').value;

    // Cloud Sign Up via Supabase
    if (sbClient) {
      const { data, error } = await sbClient.auth.signUp({
        email: identifier,
        password,
        options: { data: { full_name: name } }
      });
      if (error) {
        showAuthAlert(translateAuthError(error.message));
        return;
      }
      if (data.user && !data.session) {
        showToast('আপনার ইমেইলে ভেরিফিকেশন লিংক পাঠানো হয়েছে। কনফার্ম করে লগইন করুন!');
        return;
      }
      if (data.user) {
        signupForm.reset();
        await enterWorkspace({
          id: data.user.id,
          name,
          identifier: data.user.email,
          isCloud: true
        });
        showToast(`স্বাগতম ${name}! Supabase ক্লাউড অ্যাকাউন্ট তৈরি হয়েছে।`);
      }
      return;
    }

    // Local Sign Up fallback
    const users = getUsers();
    if (users.some(u => u.identifier === identifier)) {
      showAuthAlert('এই ইমেইল বা ইউজারনেম দিয়ে আগেই অ্যাকাউন্ট খোলা আছে। অনুগ্রহ করে লগইন করুন।');
      return;
    }

    const passwordHash = await hashPassword(password);
    const newUser = {
      id: 'u_' + Date.now(),
      name,
      identifier,
      passwordHash,
      createdAt: new Date().toISOString()
    };

    if (users.length === 0) {
      const legacyData = localStorage.getItem(STORAGE_KEY);
      if (legacyData) {
        localStorage.setItem(`tasin_personal_os_user_${newUser.id}`, legacyData);
      }
    }

    users.push(newUser);
    saveUsers(users);
    signupForm.reset();
    await enterWorkspace(newUser);
    showToast(`স্বাগতম ${newUser.name}! আপনার অ্যাকাউন্ট তৈরি হয়েছে।`);
  });

  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    clearAuthAlert();
    const identifier = document.getElementById('loginIdentifier').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;

    // Cloud Login via Supabase
    if (sbClient) {
      const { data, error } = await sbClient.auth.signInWithPassword({
        email: identifier,
        password
      });
      if (error) {
        showAuthAlert(translateAuthError(error.message));
        return;
      }
      if (data.user) {
        const fullName = data.user.user_metadata?.full_name || data.user.email.split('@')[0];
        loginForm.reset();
        await enterWorkspace({
          id: data.user.id,
          name: fullName,
          identifier: data.user.email,
          isCloud: true
        });
        showToast(`স্বাগতম, ${fullName}! (Supabase ক্লাউড সিঙ্ক সচল)`);
      }
      return;
    }

    // Local Login fallback
    const users = getUsers();
    const user = users.find(u => u.identifier === identifier);
    if (!user) {
      showAuthAlert('এই ইমেইল বা ইউজারনেমে কোনো অ্যাকাউন্ট পাওয়া যায়নি। প্রথমে Sign Up করুন।');
      return;
    }

    const passwordHash = await hashPassword(password);
    if (user.passwordHash !== passwordHash) {
      showAuthAlert('পাসওয়ার্ডটি সঠিক নয়। আবার চেষ্টা করুন।');
      return;
    }

    loginForm.reset();
    await enterWorkspace(user);
    showToast(`স্বাগতম, ${user.name}!`);
  });

  document.getElementById('logoutBtn').addEventListener('click', logoutUser);

  document.getElementById('forgotPasswordBtn').addEventListener('click', async () => {
    clearAuthAlert();
    const email = document.getElementById('loginIdentifier').value.trim().toLowerCase();
    if (!email) {
      showAuthAlert('পাসওয়ার্ড রিসেট করতে উপরে আপনার ইমেইলটি লিখুন।');
      return;
    }
    if (!sbClient) {
      showAuthAlert('লোকাল মোডে পাসওয়ার্ড রিসেট করা যায় না।');
      return;
    }
    const { error } = await sbClient.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin
    });
    if (error) {
      showAuthAlert(translateAuthError(error.message));
      return;
    }
    showToast('আপনার ইমেইলে পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে!');
  });

  // Restore session (Cloud first if configured, else Local)
  if (sbClient) {
    const { data } = await sbClient.auth.getSession();
    if (data && data.session && data.session.user) {
      const u = data.session.user;
      const fullName = u.user_metadata?.full_name || u.email.split('@')[0];
      await enterWorkspace({
        id: u.id,
        name: fullName,
        identifier: u.email,
        isCloud: true
      });
      return;
    }
  } else {
    try {
      const savedSession = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
      if (savedSession && savedSession.id) {
        const user = getUsers().find(u => u.id === savedSession.id);
        if (user) {
          await enterWorkspace(user);
          return;
        }
      }
    } catch {
      // Ignore invalid session
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setupAuth();
  // Set default dates in forms
  const today = getRelativeDate(0);
  ['contactLastDate', 'convDate', 'rfDate', 'journalDate', 'finDate', 'quickTaskDate'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = today;
  });

  // Sidebar navigation
  document.getElementById('sidebarNav').addEventListener('click', e => {
    const btn = e.target.closest('.nav-item');
    if (btn && btn.dataset.tab) {
      switchTab(btn.dataset.tab);
    }
  });

  // KPI & shortcut navigation
  document.querySelectorAll('[data-goto]').forEach(card => {
    card.addEventListener('click', () => switchTab(card.dataset.goto));
  });
  document.querySelectorAll('[data-goto-btn]').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.gotoBtn));
  });

  // Mobile menu toggle
  document.getElementById('mobileMenuBtn').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });

  // Open Modal Buttons
  document.getElementById('quickAddContactBtn').addEventListener('click', () => openModal('contactModal'));
  document.getElementById('addContactBtnTab').addEventListener('click', () => openModal('contactModal'));
  document.getElementById('quickLogConvBtn').addEventListener('click', () => openModal('convModal'));
  document.getElementById('addConvBtn').addEventListener('click', () => openModal('convModal'));
  document.getElementById('addRedFlagBtn').addEventListener('click', () => openModal('redFlagModal'));
  document.getElementById('addWorkBtn').addEventListener('click', () => openModal('workModal'));
  document.getElementById('addIdeaBtn').addEventListener('click', () => openModal('ideaModal'));
  document.getElementById('addJournalBtn').addEventListener('click', () => openModal('journalModal'));
  document.getElementById('addFinanceBtn').addEventListener('click', () => openModal('financeModal'));
  document.getElementById('addTaskBtn').addEventListener('click', () => {
    document.getElementById('quickTaskTitle').focus();
  });

  // Close Modals
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });
  document.getElementById('modalBackdrop').addEventListener('click', e => {
    if (e.target.id === 'modalBackdrop') closeAllModals();
  });

  // Filter Pills — Contacts
  document.getElementById('contactLevelFilters').addEventListener('click', e => {
    const btn = e.target.closest('.filter-pill');
    if (!btn) return;
    document.querySelectorAll('#contactLevelFilters .filter-pill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeContactFilter = btn.dataset.level;
    renderContacts();
  });
  document.getElementById('contactSearchInput').addEventListener('input', renderContacts);

  // Filter Pills — Conversations
  document.getElementById('convToneFilters').addEventListener('click', e => {
    const btn = e.target.closest('.filter-pill');
    if (!btn) return;
    document.querySelectorAll('#convToneFilters .filter-pill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeConvFilter = btn.dataset.tone;
    renderConversations();
  });
  document.getElementById('convSearchInput').addEventListener('input', renderConversations);

  // Filter Pills — Ideas
  document.getElementById('ideaCategoryFilters').addEventListener('click', e => {
    const btn = e.target.closest('.filter-pill');
    if (!btn) return;
    document.querySelectorAll('#ideaCategoryFilters .filter-pill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeIdeaFilter = btn.dataset.cat;
    renderIdeas();
  });

  // Filter Pills — Finance
  document.getElementById('financeTypeFilters').addEventListener('click', e => {
    const btn = e.target.closest('.filter-pill');
    if (!btn) return;
    document.querySelectorAll('#financeTypeFilters .filter-pill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFinanceFilter = btn.dataset.fintype;
    renderFinance();
  });

  // Filter Pills — Work & Telegram
  document.getElementById('workCategoryFilters').addEventListener('click', e => {
    const btn = e.target.closest('.filter-pill');
    if (!btn) return;
    document.querySelectorAll('#workCategoryFilters .filter-pill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeWorkFilter = btn.dataset.wcat;
    renderWork();
  });
  document.getElementById('workSearchInput').addEventListener('input', renderWork);

  // Form Submissions
  document.getElementById('contactForm').addEventListener('submit', e => {
    e.preventDefault();
    state.contacts.unshift({
      id: 'c_' + Date.now(),
      name: document.getElementById('contactName').value.trim(),
      relation: document.getElementById('contactRelation').value.trim(),
      level: document.getElementById('contactLevel').value,
      frequencyDays: Number(document.getElementById('contactFrequencyDays').value),
      phone: document.getElementById('contactPhone').value.trim(),
      lastContactDate: document.getElementById('contactLastDate').value,
      notes: document.getElementById('contactNotes').value.trim()
    });
    e.target.reset();
    document.getElementById('contactLastDate').value = today;
    closeAllModals();
    saveState();
    showToast('নতুন পরিচিত মানুষ সফলভাবে যুক্ত হয়েছে!');
  });

  document.getElementById('convForm').addEventListener('submit', e => {
    e.preventDefault();
    const personName = document.getElementById('convPerson').value.trim();
    const convDate = document.getElementById('convDate').value;

    state.conversations.unshift({
      id: 'conv_' + Date.now(),
      person: personName,
      date: convDate,
      tone: document.getElementById('convTone').value,
      nextDate: document.getElementById('convNextDate').value,
      quote: document.getElementById('convQuote').value.trim()
    });

    // Also update lastContactDate if person exists in contacts
    const matched = state.contacts.find(c => c.name.trim().toLowerCase() === personName.toLowerCase());
    if (matched && convDate >= matched.lastContactDate) {
      matched.lastContactDate = convDate;
    }

    e.target.reset();
    document.getElementById('convDate').value = today;
    closeAllModals();
    saveState();
    showToast('কথোপকথন ও নোট সংরক্ষিত হয়েছে!');
  });

  document.getElementById('redFlagForm').addEventListener('submit', e => {
    e.preventDefault();
    state.redFlags.unshift({
      id: 'rf_' + Date.now(),
      person: document.getElementById('rfPerson').value.trim(),
      date: document.getElementById('rfDate').value,
      severity: document.getElementById('rfSeverity').value,
      incident: document.getElementById('rfIncident').value.trim(),
      boundary: document.getElementById('rfBoundary').value.trim()
    });
    e.target.reset();
    document.getElementById('rfDate').value = today;
    closeAllModals();
    saveState();
    showToast('খারাপ ব্যবহারের নোট সতর্কতা লগে যুক্ত হয়েছে।');
  });

  document.getElementById('quickTaskForm').addEventListener('submit', e => {
    e.preventDefault();
    state.tasks.unshift({
      id: 't_' + Date.now(),
      title: document.getElementById('quickTaskTitle').value.trim(),
      horizon: document.getElementById('quickTaskHorizon').value,
      priority: document.getElementById('quickTaskPriority').value,
      dueDate: document.getElementById('quickTaskDate').value,
      done: false
    });
    document.getElementById('quickTaskTitle').value = '';
    saveState();
    showToast('সামনের কাজের তালিকায় নতুন কাজ যুক্ত হয়েছে!');
  });

  document.getElementById('ideaForm').addEventListener('submit', e => {
    e.preventDefault();
    state.ideas.unshift({
      id: 'id_' + Date.now(),
      title: document.getElementById('ideaTitle').value.trim(),
      category: document.getElementById('ideaCategory').value,
      stage: document.getElementById('ideaStage').value,
      createdAt: today,
      details: document.getElementById('ideaDetails').value.trim()
    });
    e.target.reset();
    closeAllModals();
    saveState();
    showToast('নতুন আইডিয়া ভল্টে সংরক্ষিত হয়েছে!');
  });

  document.getElementById('journalForm').addEventListener('submit', e => {
    e.preventDefault();
    state.journal.unshift({
      id: 'j_' + Date.now(),
      title: document.getElementById('journalTitle').value.trim(),
      date: document.getElementById('journalDate').value,
      mood: document.getElementById('journalMood').value,
      story: document.getElementById('journalStory').value.trim()
    });
    e.target.reset();
    document.getElementById('journalDate').value = today;
    closeAllModals();
    saveState();
    showToast('জীবনের ঘটনা টাইমলাইনে যুক্ত হয়েছে!');
  });

  document.getElementById('financeForm').addEventListener('submit', e => {
    e.preventDefault();
    state.finance.unshift({
      id: 'f_' + Date.now(),
      type: document.getElementById('finType').value,
      amount: Number(document.getElementById('finAmount').value),
      category: document.getElementById('finCategory').value.trim(),
      date: document.getElementById('finDate').value,
      note: document.getElementById('finNote').value.trim()
    });
    e.target.reset();
    document.getElementById('finDate').value = today;
    closeAllModals();
    saveState();
    showToast('আয়-ব্যয়ের হিসাব সংরক্ষিত হয়েছে!');
  });

  document.getElementById('workForm').addEventListener('submit', e => {
    e.preventDefault();
    if (!Array.isArray(state.work)) state.work = [];
    state.work.unshift({
      id: 'w_' + Date.now(),
      title: document.getElementById('workTitle').value.trim(),
      category: document.getElementById('workCategory').value,
      status: document.getElementById('workStatus').value,
      handle: document.getElementById('workTelegramHandle').value.trim(),
      client: document.getElementById('workClient').value.trim(),
      budget: Number(document.getElementById('workBudget').value || 0),
      deadline: document.getElementById('workDeadline').value,
      notes: document.getElementById('workNotes').value.trim()
    });
    e.target.reset();
    closeAllModals();
    saveState();
    showToast('নতুন Work / Telegram কাজ যুক্ত হয়েছে!');
  });

  // Global Search (Ctrl/Cmd + K)
  document.getElementById('openSearchBtn').addEventListener('click', () => {
    openModal('searchModal');
    const inp = document.getElementById('globalSearchInput');
    inp.value = '';
    inp.focus();
    renderGlobalSearch('');
  });

  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openModal('searchModal');
      const inp = document.getElementById('globalSearchInput');
      inp.value = '';
      inp.focus();
      renderGlobalSearch('');
    } else if (e.key === 'Escape') {
      closeAllModals();
    }
  });

  document.getElementById('globalSearchInput').addEventListener('input', e => {
    renderGlobalSearch(e.target.value);
  });

  // Export & Import JSON Backup
  document.getElementById('exportDataBtn').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasin-personal-os-backup-${getRelativeDate(0)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('ব্যাকআপ ফাইল ডাউনলোড হয়েছে!');
  });

  document.getElementById('importFileInput').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const imported = JSON.parse(ev.target.result);
        if (imported && imported.contacts) {
          state = imported;
          saveState();
          showToast('ডাটা সফলভাবে রিস্টোর হয়েছে!');
        }
      } catch (err) {
        alert('ভুল ফাইল ফরম্যাট!');
      }
    };
    reader.readAsText(file);
  });

  // Initial Render
  renderAll();
});

function renderGlobalSearch(query) {
  const resEl = document.getElementById('globalSearchResults');
  const q = query.trim().toLowerCase();

  const items = [];
  state.contacts.forEach(c => {
    if (!q || `${c.name} ${c.relation} ${c.notes}`.toLowerCase().includes(q)) {
      items.push({ tab: 'contacts', badge: `Level ${c.level}`, title: c.name, sub: c.relation });
    }
  });
  state.conversations.forEach(c => {
    if (!q || `${c.person} ${c.quote}`.toLowerCase().includes(q)) {
      items.push({ tab: 'conversations', badge: 'কে কী বলেছে', title: c.person, sub: c.quote });
    }
  });
  state.redFlags.forEach(r => {
    if (!q || `${r.person} ${r.incident}`.toLowerCase().includes(q)) {
      items.push({ tab: 'redflags', badge: '⚠️ খারাপ ব্যবহার', title: r.person, sub: r.incident });
    }
  });
  state.ideas.forEach(i => {
    if (!q || `${i.title} ${i.details}`.toLowerCase().includes(q)) {
      items.push({ tab: 'ideas', badge: 'আইডিয়া', title: i.title, sub: i.stage });
    }
  });
  (state.work || []).forEach(w => {
    if (!q || `${w.title} ${w.handle} ${w.client} ${w.notes}`.toLowerCase().includes(q)) {
      items.push({ tab: 'work', badge: '✈️ Work', title: w.title, sub: w.handle || w.client });
    }
  });

  if (items.length === 0) {
    resEl.innerHTML = `<div class="empty-state">কোনো ফলাফল পাওয়া যায়নি।</div>`;
    return;
  }

  resEl.innerHTML = items.slice(0, 12).map(it => `
    <div class="search-result-item" onclick="switchTab('${it.tab}'); closeAllModals();">
      <div>
        <strong>${escapeHTML(it.title)}</strong>
        <div style="font-size:12px; color:var(--neutral-muted);">${escapeHTML(it.sub)}</div>
      </div>
      <span class="chip">${escapeHTML(it.badge)}</span>
    </div>
  `).join('');
}
