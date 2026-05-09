import React, { useState, useMemo, useEffect } from 'react';
import {
  Home, Wallet, TrendingUp, PieChart as PieChartIcon, User as UserIcon,
  Plus, ArrowLeft, ArrowUp, ArrowDown, ArrowLeftRight,
  Trash2, Edit3, X, Check, Calendar as CalendarIcon, ChevronLeft, ChevronRight,
  Building2, Coffee, ShoppingBag, Car, Home as HomeIcon,
  Gift, Briefcase, Heart, Utensils, Gamepad2, BookOpen,
  Bell, Settings as SettingsIcon, LogOut, CreditCard,
  Search, Filter, MoreVertical, ChevronDown, List, Grid3x3,
  TrendingDown, Banknote, Coins, BarChart3, PiggyBank,
  Eye, EyeOff, Crown, Users, UserPlus, Mail, Lock, Globe, AlertCircle,
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';

/* =========================================================
   토스풍 디자인 토큰
   ========================================================= */
const C = {
  blue: '#3182F6',
  blueLight: '#E8F3FF',
  blueDark: '#1B64DA',
  red: '#F04452',
  redLight: '#FFE5E8',
  bg: '#F2F4F6',
  card: '#FFFFFF',
  text: '#191F28',
  textSub: '#4E5968',
  textMuted: '#8B95A1',
  border: '#F2F4F6',
  borderStrong: '#E5E8EB',
  green: '#22C55E',
  purple: '#8B5CF6',
  purpleLight: '#F3F0FF',
  gold: '#F59E0B',
};

/* =========================================================
   초기 데이터
   ========================================================= */
const INITIAL_USER = {
  id: 'u1',
  email: 'jinho@example.com',
  name: '진호',
  language: 'ko',
};

const INITIAL_HOUSEHOLDS = [
  { id: 'h1', name: '내 가계부', currency: 'KRW', owner_id: 'u1', description: '', started_at: '2026-01-01' },
  { id: 'h2', name: '우리 가족', currency: 'KRW', owner_id: 'u1', description: '부부 공동 가계부', started_at: '2026-03-01' },
];

const INITIAL_MEMBERS = {
  h1: [{ id: 'm1', user_id: 'u1', name: '진호', email: 'jinho@example.com', role: 'owner', joined_at: '2026-01-01' }],
  h2: [
    { id: 'm2', user_id: 'u1', name: '진호', email: 'jinho@example.com', role: 'owner', joined_at: '2026-03-01' },
    { id: 'm3', user_id: 'u2', name: '수민', email: 'sumin@example.com', role: 'member', joined_at: '2026-03-05' },
  ],
};

const INITIAL_ACCOUNTS = [
  { id: 'a1', name: '기업은행 주거래', type: '생활', balance: 1181659, startBalance: 1500000, color: C.blue, icon: 'building' },
  { id: 'a2', name: '신한 SOL', type: '생활', balance: 532400, startBalance: 800000, color: '#0046FF', icon: 'building' },
  { id: 'a3', name: '카카오뱅크 세이프', type: '적립', balance: 3200000, startBalance: 3000000, color: '#FFD600', icon: 'piggy' },
  { id: 'a4', name: '청년도약계좌', type: '적립', balance: 4800000, startBalance: 4500000, color: C.green, icon: 'piggy' },
  { id: 'a5', name: 'ISA (토스증권)', type: '투자', balance: 12500000, startBalance: 12000000, color: C.purple, icon: 'trending' },
  { id: 'a6', name: '연금저축 (한투)', type: '투자', balance: 8900000, startBalance: 8500000, color: '#FF6B35', icon: 'trending' },
];

const INITIAL_CATEGORIES = [
  { id: 'c1', name: '식비', color: '#FF6B6B', icon: 'utensils' },
  { id: 'c2', name: '교통', color: '#339AF0', icon: 'car' },
  { id: 'c3', name: '주거', color: '#845EF7', icon: 'home' },
  { id: 'c4', name: '데이트', color: '#FF6B9D', icon: 'heart' },
  { id: 'c5', name: '쇼핑', color: '#FFA94D', icon: 'shopping' },
  { id: 'c6', name: '여가', color: '#51CF66', icon: 'gamepad' },
  { id: 'c7', name: '월급', color: C.blue, icon: 'briefcase', isIncome: true },
  { id: 'c8', name: '기타수입', color: C.green, icon: 'gift', isIncome: true },
];

const INITIAL_TRANSACTIONS = [
  { id: 't1', type: 'income', amount: 3500000, accountId: 'a1', categoryId: 'c7', date: '2026-05-01', memo: '5월 월급' },
  { id: 't2', type: 'expense', amount: 9180, accountId: 'a1', categoryId: 'c1', date: '2026-05-08', memo: '점심 - 김치찌개' },
  { id: 't3', type: 'expense', amount: 1500, accountId: 'a2', categoryId: 'c2', date: '2026-05-08', memo: '지하철' },
  { id: 't4', type: 'expense', amount: 45000, accountId: 'a1', categoryId: 'c4', date: '2026-05-07', memo: '저녁 데이트' },
  { id: 't5', type: 'expense', amount: 65000, accountId: 'a1', categoryId: 'c3', date: '2026-05-06', memo: '관리비' },
  { id: 't6', type: 'expense', amount: 32000, accountId: 'a2', categoryId: 'c5', date: '2026-05-05', memo: '쿠팡 생활용품' },
  { id: 't7', type: 'expense', amount: 12000, accountId: 'a1', categoryId: 'c1', date: '2026-05-04', memo: '저녁 - 백반' },
  { id: 't8', type: 'expense', amount: 18000, accountId: 'a2', categoryId: 'c6', date: '2026-05-03', memo: '영화관' },
  { id: 't9', type: 'expense', amount: 7800, accountId: 'a1', categoryId: 'c1', date: '2026-05-02', memo: '아침 - 샌드위치' },
  { id: 't10', type: 'transfer', amount: 300000, accountId: 'a1', toAccountId: 'a4', date: '2026-05-02', memo: '청년도약 적금' },
  { id: 't11', type: 'transfer', amount: 500000, accountId: 'a1', toAccountId: 'a5', date: '2026-05-02', memo: 'ISA 자동이체' },
];

const INITIAL_PORTFOLIO = [
  { id: 'p1', name: 'TIGER 미국S&P500', broker: 'ISA', quantity: 50, currentValue: 6250000, avgPrice: 120000 },
  { id: 'p2', name: 'KODEX 200', broker: 'ISA', quantity: 30, currentValue: 3150000, avgPrice: 100000 },
  { id: 'p3', name: '삼성전자', broker: 'ISA', quantity: 40, currentValue: 3100000, avgPrice: 70000 },
  { id: 'p4', name: 'TIGER 차이나전기차', broker: '연금저축', quantity: 100, currentValue: 4500000, avgPrice: 42000 },
  { id: 'p5', name: 'KODEX 코스닥150', broker: '연금저축', quantity: 80, currentValue: 4400000, avgPrice: 53000 },
];

const INITIAL_FIXED = [
  { id: 'f1', name: '월세', amount: 550000, day: 1 },
  { id: 'f2', name: '관리비', amount: 65000, day: 5 },
  { id: 'f3', name: '인터넷', amount: 25000, day: 10 },
  { id: 'f4', name: '휴대폰', amount: 35000, day: 15 },
  { id: 'f5', name: '넷플릭스', amount: 13500, day: 20 },
];

/* =========================================================
   유틸
   ========================================================= */
const fmt = (n) => new Intl.NumberFormat('ko-KR').format(Math.round(n));
const today = () => new Date().toISOString().slice(0, 10);
const newId = () => Math.random().toString(36).slice(2, 10);
const getCategoryIcon = (iconName) => ({
  utensils: Utensils, car: Car, home: HomeIcon, heart: Heart,
  shopping: ShoppingBag, gamepad: Gamepad2, briefcase: Briefcase,
  gift: Gift, building: Building2, piggy: PiggyBank, trending: TrendingUp,
}[iconName] || Coffee);

/* =========================================================
   루트 — 인증 게이트
   ========================================================= */
export default function App() {
  // 인증 상태
  const [user, setUser] = useState(null); // null = 비로그인
  const [authPage, setAuthPage] = useState('login'); // 'login' | 'register' | 'forgot'

  // 로그인 시뮬레이션
  const handleLogin = () => setUser(INITIAL_USER);
  const handleLogout = () => { setUser(null); setAuthPage('login'); };

  return (
    <div className="min-h-screen" style={{ background: C.bg, fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css" />
      <style>{`
        * { font-feature-settings: 'tnum' on; -webkit-tap-highlight-color: transparent; }
        button { transition: all 0.15s ease; }
        button:active { transform: scale(0.97); }
        input { font-family: inherit; }
        .scroll-hide::-webkit-scrollbar { display: none; }
        .scroll-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes slideIn { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .slide-in { animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        .slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .fade-in { animation: fadeIn 0.2s ease; }
      `}</style>

      <div className="max-w-md mx-auto min-h-screen relative" style={{ background: user ? C.bg : C.card }}>
        {!user ? (
          <AuthFlow page={authPage} setPage={setAuthPage} onLogin={handleLogin} />
        ) : (
          <BudgetApp user={user} setUser={setUser} onLogout={handleLogout} />
        )}
      </div>
    </div>
  );
}

/* =========================================================
   인증 플로우 — 로그인/회원가입/비밀번호 찾기
   ========================================================= */
function AuthFlow({ page, setPage, onLogin }) {
  if (page === 'login') return <LoginScreen onLogin={onLogin} goRegister={() => setPage('register')} goForgot={() => setPage('forgot')} />;
  if (page === 'register') return <RegisterScreen onLogin={onLogin} goLogin={() => setPage('login')} />;
  if (page === 'forgot') return <ForgotPasswordScreen goBack={() => setPage('login')} />;
  return null;
}

function LoginScreen({ onLogin, goRegister, goForgot }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const valid = email.includes('@') && password.length >= 6;

  return (
    <div className="min-h-screen flex flex-col fade-in" style={{ background: C.card }}>
      <div className="flex-1 px-6 pt-16">
        <div className="mb-12">
          <div className="w-12 h-12 rounded-2xl mb-6 flex items-center justify-center" style={{ background: C.blue }}>
            <span className="text-white text-xl font-extrabold">₩</span>
          </div>
          <h1 className="text-2xl font-extrabold leading-tight" style={{ color: C.text }}>
            안녕하세요!<br />가계부에 오신 걸 환영해요
          </h1>
          <p className="text-sm font-medium mt-2" style={{ color: C.textMuted }}>
            이메일로 시작하기
          </p>
        </div>

        <div className="space-y-3">
          <FloatingInput label="이메일" value={email} onChange={setEmail} type="email" placeholder="example@email.com" />
          <FloatingInput
            label="비밀번호" value={password} onChange={setPassword}
            type={showPw ? 'text' : 'password'} placeholder="6자 이상"
            right={
              <button onClick={() => setShowPw(!showPw)} className="p-1">
                {showPw ? <EyeOff className="w-4 h-4" style={{ color: C.textMuted }} /> : <Eye className="w-4 h-4" style={{ color: C.textMuted }} />}
              </button>
            }
          />
        </div>

        <button onClick={goForgot} className="mt-3 text-xs font-semibold" style={{ color: C.textMuted }}>
          비밀번호를 잊어버리셨나요?
        </button>
      </div>

      <div className="px-6 pb-8 pt-4 bg-white">
        <button
          disabled={!valid}
          onClick={onLogin}
          className="w-full h-14 rounded-2xl text-base font-bold text-white"
          style={{ background: C.blue, opacity: valid ? 1 : 0.4 }}
        >
          로그인
        </button>
        <div className="flex items-center justify-center gap-1 mt-4 text-xs">
          <span style={{ color: C.textMuted }}>처음 오셨어요?</span>
          <button onClick={goRegister} className="font-bold" style={{ color: C.blue }}>회원가입</button>
        </div>
      </div>
    </div>
  );
}

function RegisterScreen({ onLogin, goLogin }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPw, setShowPw] = useState(false);

  const titles = {
    1: { t: '이메일을\n입력해주세요', s: '로그인할 때 사용할 이메일' },
    2: { t: '비밀번호를\n설정해주세요', s: '6자 이상, 영문 + 숫자 조합' },
    3: { t: '이름을\n알려주세요', s: '가계부에 표시될 이름' },
  };
  const valid = { 1: email.includes('@') && email.includes('.'), 2: password.length >= 6, 3: name.length >= 1 }[step];
  const next = () => { if (step < 3) setStep(step + 1); else onLogin(); };

  return (
    <div className="min-h-screen flex flex-col fade-in" style={{ background: C.card }}>
      <TopBar title="" onBack={() => step > 1 ? setStep(step - 1) : goLogin()} />
      <div className="h-1 bg-gray-100">
        <div className="h-full transition-all" style={{ width: `${(step / 3) * 100}%`, background: C.blue }} />
      </div>

      <div className="flex-1 px-6 pt-12">
        <h1 className="text-2xl font-extrabold leading-tight whitespace-pre-line" style={{ color: C.text }}>{titles[step].t}</h1>
        <p className="text-sm font-medium mt-2 mb-10" style={{ color: C.textMuted }}>{titles[step].s}</p>

        {step === 1 && <FloatingInput label="이메일" value={email} onChange={setEmail} type="email" placeholder="example@email.com" autoFocus />}
        {step === 2 && (
          <>
            <FloatingInput label="비밀번호" value={password} onChange={setPassword}
              type={showPw ? 'text' : 'password'} placeholder="6자 이상" autoFocus
              right={
                <button onClick={() => setShowPw(!showPw)} className="p-1">
                  {showPw ? <EyeOff className="w-4 h-4" style={{ color: C.textMuted }} /> : <Eye className="w-4 h-4" style={{ color: C.textMuted }} />}
                </button>
              }
            />
            <div className="mt-4 space-y-2">
              <RuleCheck ok={password.length >= 6} text="6자 이상" />
              <RuleCheck ok={/[a-zA-Z]/.test(password)} text="영문 포함" />
              <RuleCheck ok={/\d/.test(password)} text="숫자 포함" />
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <FloatingInput label="이름" value={name} onChange={setName} placeholder="진호" autoFocus maxLength={20} />
            <div className="rounded-2xl p-4 mt-6" style={{ background: C.bg }}>
              <p className="text-xs font-semibold mb-2" style={{ color: C.textSub }}>가입 후 자동으로 만들어져요</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: C.blueLight }}>
                  <Home className="w-4 h-4" style={{ color: C.blue }} />
                </div>
                <span className="text-sm font-bold" style={{ color: C.text }}>{name || '내'} 가계부</span>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="px-6 pb-8 pt-4 bg-white">
        <button disabled={!valid} onClick={next}
          className="w-full h-14 rounded-2xl text-base font-bold text-white"
          style={{ background: C.blue, opacity: valid ? 1 : 0.4 }}>
          {step === 3 ? '가입 완료' : '다음'}
        </button>
      </div>
    </div>
  );
}

function ForgotPasswordScreen({ goBack }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="min-h-screen flex flex-col fade-in" style={{ background: C.card }}>
        <TopBar title="" onBack={goBack} />
        <div className="flex-1 px-6 pt-16">
          <div className="w-14 h-14 rounded-2xl mb-6 flex items-center justify-center" style={{ background: C.blueLight }}>
            <Mail className="w-7 h-7" style={{ color: C.blue }} />
          </div>
          <h1 className="text-2xl font-extrabold leading-tight" style={{ color: C.text }}>메일을 확인해주세요</h1>
          <p className="text-sm font-medium mt-3" style={{ color: C.textSub }}>
            <span className="font-bold" style={{ color: C.text }}>{email}</span>으로<br />비밀번호 재설정 링크를 보냈어요
          </p>
          <p className="text-xs mt-6" style={{ color: C.textMuted }}>메일이 오지 않으면 스팸함도 확인해주세요</p>
        </div>
        <div className="px-6 pb-8">
          <button onClick={goBack} className="w-full h-14 rounded-2xl text-base font-bold text-white" style={{ background: C.blue }}>
            로그인으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col fade-in" style={{ background: C.card }}>
      <TopBar title="" onBack={goBack} />
      <div className="flex-1 px-6 pt-12">
        <h1 className="text-2xl font-extrabold leading-tight" style={{ color: C.text }}>비밀번호를<br />잊어버리셨나요?</h1>
        <p className="text-sm font-medium mt-2 mb-10" style={{ color: C.textMuted }}>가입한 이메일로 재설정 링크를 보내드릴게요</p>
        <FloatingInput label="이메일" value={email} onChange={setEmail} type="email" placeholder="example@email.com" autoFocus />
      </div>
      <div className="px-6 pb-8 pt-4 bg-white">
        <button disabled={!email.includes('@')} onClick={() => setSent(true)}
          className="w-full h-14 rounded-2xl text-base font-bold text-white"
          style={{ background: C.blue, opacity: email.includes('@') ? 1 : 0.4 }}>
          재설정 링크 받기
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   본 앱 — 가계부
   ========================================================= */
function BudgetApp({ user, setUser, onLogout }) {
  const [page, setPage] = useState('home');
  const [pageParam, setPageParam] = useState(null);

  // 가계부 / 멤버
  const [households, setHouseholds] = useState(INITIAL_HOUSEHOLDS);
  const [currentHouseholdId, setCurrentHouseholdId] = useState('h1');
  const [members, setMembers] = useState(INITIAL_MEMBERS);

  // 가계부 데이터 (현재는 모든 가계부 공통이지만 실제로는 household_id별로 분리)
  const [accounts, setAccounts] = useState(INITIAL_ACCOUNTS);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [portfolio, setPortfolio] = useState(INITIAL_PORTFOLIO);
  const [fixed, setFixed] = useState(INITIAL_FIXED);

  // 모달 상태
  const [showSwitcher, setShowSwitcher] = useState(false);

  const currentHousehold = households.find(h => h.id === currentHouseholdId);
  const currentMembers = members[currentHouseholdId] || [];
  const myMembership = currentMembers.find(m => m.user_id === user.id);
  const isOwner = myMembership?.role === 'owner';

  const navigate = (p, param = null) => {
    setPage(p);
    setPageParam(param);
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
  };

  const stats = useMemo(() => {
    const monthTx = transactions.filter(t => t.date.startsWith('2026-05'));
    const income = monthTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = monthTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const totalAssets = accounts.reduce((s, a) => s + a.balance, 0) + portfolio.reduce((s, p) => s + p.currentValue, 0);
    return { income, expense, save: income - expense, totalAssets, savingRate: income ? ((income - expense) / income) * 100 : 0 };
  }, [transactions, accounts, portfolio]);

  // CRUD 함수들
  const addTransaction = (data) => setTransactions(prev => [{ ...data, id: newId() }, ...prev]);
  const updateTransaction = (id, data) => setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
  const deleteTransaction = (id) => setTransactions(prev => prev.filter(t => t.id !== id));
  const addAccount = (data) => setAccounts(prev => [...prev, { ...data, id: newId() }]);
  const updateAccount = (id, data) => setAccounts(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
  const deleteAccount = (id) => setAccounts(prev => prev.filter(a => a.id !== id));
  const addPortfolio = (data) => setPortfolio(prev => [...prev, { ...data, id: newId() }]);
  const updatePortfolio = (id, data) => setPortfolio(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  const deletePortfolio = (id) => setPortfolio(prev => prev.filter(p => p.id !== id));
  const addCategory = (data) => setCategories(prev => [...prev, { ...data, id: newId() }]);
  const updateCategory = (id, data) => setCategories(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  const deleteCategory = (id) => setCategories(prev => prev.filter(c => c.id !== id));
  const addFixed = (data) => setFixed(prev => [...prev, { ...data, id: newId() }]);
  const updateFixed = (id, data) => setFixed(prev => prev.map(f => f.id === id ? { ...f, ...data } : f));
  const deleteFixed = (id) => setFixed(prev => prev.filter(f => f.id !== id));

  // 가계부 / 멤버 CRUD
  const addHousehold = (data) => {
    const id = newId();
    setHouseholds(prev => [...prev, { ...data, id, owner_id: user.id }]);
    setMembers(prev => ({
      ...prev,
      [id]: [{ id: newId(), user_id: user.id, name: user.name, email: user.email, role: 'owner', joined_at: today() }]
    }));
    setCurrentHouseholdId(id);
  };
  const updateHousehold = (id, data) => setHouseholds(prev => prev.map(h => h.id === id ? { ...h, ...data } : h));
  const deleteHousehold = (id) => {
    setHouseholds(prev => prev.filter(h => h.id !== id));
    setMembers(prev => { const next = { ...prev }; delete next[id]; return next; });
    const remaining = households.filter(h => h.id !== id);
    if (remaining.length > 0) setCurrentHouseholdId(remaining[0].id);
  };
  const addMember = (householdId, data) => setMembers(prev => ({
    ...prev,
    [householdId]: [...(prev[householdId] || []), { ...data, id: newId(), joined_at: today() }]
  }));
  const removeMember = (householdId, memberId) => setMembers(prev => ({
    ...prev,
    [householdId]: prev[householdId].filter(m => m.id !== memberId)
  }));

  const updateUser = (data) => setUser(prev => ({ ...prev, ...data }));

  const ctx = {
    page, navigate, pageParam,
    user, updateUser, onLogout,
    households, currentHousehold, currentHouseholdId, setCurrentHouseholdId,
    addHousehold, updateHousehold, deleteHousehold,
    members, currentMembers, myMembership, isOwner,
    addMember, removeMember,
    accounts, categories, transactions, portfolio, fixed, stats,
    addTransaction, updateTransaction, deleteTransaction,
    addAccount, updateAccount, deleteAccount,
    addPortfolio, updatePortfolio, deletePortfolio,
    addCategory, updateCategory, deleteCategory,
    addFixed, updateFixed, deleteFixed,
    showSwitcher, setShowSwitcher,
  };

  return (
    <div className="pb-24 min-h-screen relative">
      {page === 'home' && <HomePage ctx={ctx} />}
      {page === 'transactions' && <TransactionsPage ctx={ctx} />}
      {page === 'transaction-form' && <TransactionForm ctx={ctx} />}
      {page === 'transaction-detail' && <TransactionDetail ctx={ctx} />}
      {page === 'transfer-form' && <TransferForm ctx={ctx} />}
      {page === 'wealth' && <WealthPage ctx={ctx} />}
      {page === 'account-form' && <AccountForm ctx={ctx} />}
      {page === 'account-detail' && <AccountDetail ctx={ctx} />}
      {page === 'portfolio' && <PortfolioPage ctx={ctx} />}
      {page === 'portfolio-form' && <PortfolioForm ctx={ctx} />}
      {page === 'portfolio-detail' && <PortfolioDetail ctx={ctx} />}
      {page === 'settings' && <SettingsPage ctx={ctx} />}
      {page === 'category-manage' && <CategoryManage ctx={ctx} />}
      {page === 'fixed-manage' && <FixedManage ctx={ctx} />}
      {/* 가계부 / 계정 관리 */}
      {page === 'household-create' && <HouseholdCreateForm ctx={ctx} />}
      {page === 'household-settings' && <HouseholdSettings ctx={ctx} />}
      {page === 'household-edit' && <HouseholdEditForm ctx={ctx} />}
      {page === 'member-manage' && <MemberManage ctx={ctx} />}
      {page === 'member-invite' && <MemberInvite ctx={ctx} />}
      {page === 'profile-edit' && <ProfileEdit ctx={ctx} />}
      {page === 'password-change' && <PasswordChange ctx={ctx} />}
      {page === 'account-delete' && <AccountDelete ctx={ctx} />}

      {showSwitcher && <HouseholdSwitcher ctx={ctx} />}

      {['home', 'transactions', 'wealth', 'portfolio'].includes(page) && <FAB page={page} navigate={navigate} />}
      {['home', 'transactions', 'wealth', 'portfolio', 'settings'].includes(page) && <BottomTab page={page} navigate={navigate} />}
    </div>
  );
}

/* =========================================================
   FAB & 바텀탭 & 상단바
   ========================================================= */
function FAB({ page, navigate }) {
  const config = {
    home: { action: () => navigate('transaction-form'), color: C.blue },
    transactions: { action: () => navigate('transaction-form'), color: C.blue },
    wealth: { action: () => navigate('account-form'), color: C.blue },
    portfolio: { action: () => navigate('portfolio-form'), color: C.purple },
  }[page];
  return (
    <button onClick={config.action}
      className="fixed bottom-24 right-1/2 translate-x-[200px] w-14 h-14 rounded-full flex items-center justify-center shadow-lg z-40"
      style={{ background: config.color, boxShadow: `0 8px 20px ${config.color}66` }}>
      <Plus className="w-6 h-6 text-white" strokeWidth={2.5} />
    </button>
  );
}

function BottomTab({ page, navigate }) {
  const tabs = [
    { id: 'home', label: '홈', icon: Home },
    { id: 'transactions', label: '거래', icon: Wallet },
    { id: 'wealth', label: '자산', icon: BarChart3 },
    { id: 'portfolio', label: '포트폴리오', icon: TrendingUp },
    { id: 'settings', label: '내정보', icon: UserIcon },
  ];
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t z-30" style={{ borderColor: C.borderStrong }}>
      <div className="flex justify-around items-center h-16">
        {tabs.map(({ id, label, icon: Icon }) => {
          const active = page === id;
          return (
            <button key={id} onClick={() => navigate(id)} className="flex-1 flex flex-col items-center justify-center gap-0.5 h-full">
              <Icon className="w-5 h-5" style={{ color: active ? C.blue : C.textMuted }} strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] font-semibold" style={{ color: active ? C.blue : C.textMuted }}>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function TopBar({ title, onBack, right }) {
  return (
    <div className="sticky top-0 bg-white z-20 border-b" style={{ borderColor: C.border }}>
      <div className="flex items-center justify-between px-4 h-14">
        {onBack ? (
          <button onClick={onBack} className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5" style={{ color: C.text }} />
          </button>
        ) : <div className="w-10" />}
        <h1 className="text-base font-bold" style={{ color: C.text }}>{title}</h1>
        <div className="w-10 flex justify-end">{right}</div>
      </div>
    </div>
  );
}

/* =========================================================
   가계부 스위처 (바텀 시트)
   ========================================================= */
function HouseholdSwitcher({ ctx }) {
  const { households, currentHouseholdId, setCurrentHouseholdId, setShowSwitcher, navigate, members, user } = ctx;

  const select = (id) => {
    setCurrentHouseholdId(id);
    setShowSwitcher(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end z-50 fade-in" onClick={() => setShowSwitcher(false)}>
      <div className="w-full max-w-md mx-auto bg-white rounded-t-3xl slide-in" onClick={e => e.stopPropagation()}>
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full" style={{ background: C.borderStrong }} />
        </div>
        <div className="px-5 pb-2">
          <h2 className="text-base font-extrabold" style={{ color: C.text }}>가계부 선택</h2>
          <p className="text-xs font-medium mt-1" style={{ color: C.textMuted }}>관리 중인 가계부 {households.length}개</p>
        </div>

        <div className="px-3 py-2 max-h-96 overflow-y-auto">
          {households.map(h => {
            const hMembers = members[h.id] || [];
            const myRole = hMembers.find(m => m.user_id === user.id)?.role;
            return (
              <button key={h.id} onClick={() => select(h.id)}
                className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: myRole === 'owner' ? C.blueLight : C.purpleLight }}>
                  {myRole === 'owner'
                    ? <Home className="w-5 h-5" style={{ color: C.blue }} />
                    : <Users className="w-5 h-5" style={{ color: C.purple }} />}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold truncate" style={{ color: C.text }}>{h.name}</p>
                    {myRole === 'owner' && <Crown className="w-3 h-3 flex-shrink-0" style={{ color: C.gold }} fill={C.gold} />}
                  </div>
                  <p className="text-xs font-medium" style={{ color: C.textMuted }}>
                    {myRole === 'owner' ? '소유자' : '멤버'} · {hMembers.length}명
                  </p>
                </div>
                {currentHouseholdId === h.id && (
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: C.blue }}>
                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="px-3 pb-6 pt-2 border-t" style={{ borderColor: C.border }}>
          <button onClick={() => { setShowSwitcher(false); navigate('household-create'); }}
            className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: C.bg }}>
              <Plus className="w-5 h-5" style={{ color: C.textSub }} />
            </div>
            <span className="text-sm font-bold" style={{ color: C.text }}>새 가계부 만들기</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   홈
   ========================================================= */
function HomePage({ ctx }) {
  const { stats, transactions, accounts, categories, navigate, currentHousehold, setShowSwitcher, currentMembers } = ctx;
  const recentTx = transactions.slice(0, 5);

  const categorySpend = useMemo(() => {
    const map = {};
    transactions.filter(t => t.type === 'expense' && t.date.startsWith('2026-05')).forEach(t => {
      map[t.categoryId] = (map[t.categoryId] || 0) + t.amount;
    });
    return Object.entries(map).map(([cid, amount]) => ({ ...categories.find(c => c.id === cid), amount }))
      .sort((a, b) => b.amount - a.amount).slice(0, 5);
  }, [transactions, categories]);
  const totalCatSpend = categorySpend.reduce((s, c) => s + c.amount, 0);

  return (
    <div className="fade-in">
      {/* 헤더 — 가계부 스위처 + 알림 */}
      <div className="px-4 pt-4 pb-3 bg-white">
        <div className="flex items-center justify-between">
          <button onClick={() => setShowSwitcher(true)} className="flex items-center gap-1.5 -ml-1 px-2 py-1.5 rounded-xl hover:bg-gray-50">
            <h1 className="text-lg font-extrabold" style={{ color: C.text }}>{currentHousehold?.name}</h1>
            <ChevronDown className="w-4 h-4" style={{ color: C.textMuted }} />
            {currentMembers.length > 1 && (
              <div className="ml-1 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full" style={{ background: C.bg }}>
                <Users className="w-3 h-3" style={{ color: C.textSub }} />
                <span className="text-[10px] font-bold" style={{ color: C.textSub }}>{currentMembers.length}</span>
              </div>
            )}
          </button>
          <button className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: C.bg }}>
            <Bell className="w-4 h-4" style={{ color: C.textSub }} />
          </button>
        </div>
      </div>

      <div className="px-4 pt-4">
        <div className="bg-white rounded-3xl p-6" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
          <p className="text-xs font-medium mb-2" style={{ color: C.textMuted }}>총 자산</p>
          <p className="text-3xl font-extrabold tabular-nums" style={{ color: C.text }}>
            {fmt(stats.totalAssets)}<span className="text-lg ml-1">원</span>
          </p>
          <button onClick={() => navigate('wealth')} className="mt-3 text-xs font-semibold flex items-center gap-1" style={{ color: C.blue }}>
            자세히 보기 <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="px-4 pt-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4">
            <div className="flex items-center gap-1.5 mb-2">
              <ArrowDown className="w-3 h-3" style={{ color: C.blue }} strokeWidth={3} />
              <p className="text-xs font-medium" style={{ color: C.textMuted }}>수입</p>
            </div>
            <p className="text-lg font-bold tabular-nums" style={{ color: C.text }}>{fmt(stats.income)}<span className="text-xs ml-0.5 font-semibold">원</span></p>
          </div>
          <div className="bg-white rounded-2xl p-4">
            <div className="flex items-center gap-1.5 mb-2">
              <ArrowUp className="w-3 h-3" style={{ color: C.red }} strokeWidth={3} />
              <p className="text-xs font-medium" style={{ color: C.textMuted }}>지출</p>
            </div>
            <p className="text-lg font-bold tabular-nums" style={{ color: C.text }}>{fmt(stats.expense)}<span className="text-xs ml-0.5 font-semibold">원</span></p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 mt-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: C.textMuted }}>이번 달 저축</p>
              <p className="text-xl font-bold tabular-nums" style={{ color: C.text }}>{fmt(stats.save)}원</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium mb-1" style={{ color: C.textMuted }}>저축률</p>
              <p className="text-lg font-bold tabular-nums" style={{ color: C.blue }}>{stats.savingRate.toFixed(0)}%</p>
            </div>
          </div>
        </div>
      </div>

      {categorySpend.length > 0 && (
        <div className="px-4 pt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold" style={{ color: C.text }}>이번 달 지출</h2>
            <button onClick={() => navigate('transactions')} className="text-xs font-semibold" style={{ color: C.textMuted }}>전체 →</button>
          </div>
          <div className="bg-white rounded-2xl p-5 space-y-3">
            {categorySpend.map(c => {
              const Icon = getCategoryIcon(c.icon);
              const pct = (c.amount / totalCatSpend) * 100;
              return (
                <div key={c.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: c.color + '20' }}>
                        <Icon className="w-3.5 h-3.5" style={{ color: c.color }} strokeWidth={2.2} />
                      </div>
                      <span className="text-sm font-semibold" style={{ color: C.text }}>{c.name}</span>
                    </div>
                    <span className="text-sm font-bold tabular-nums" style={{ color: C.text }}>{fmt(c.amount)}원</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: C.bg }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: c.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="px-4 pt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold" style={{ color: C.text }}>최근 거래</h2>
          <button onClick={() => navigate('transactions')} className="text-xs font-semibold" style={{ color: C.textMuted }}>전체 →</button>
        </div>
        <div className="bg-white rounded-2xl p-2">
          {recentTx.length === 0 ? <p className="text-center py-8 text-sm" style={{ color: C.textMuted }}>거래 내역이 없습니다</p>
            : recentTx.map(t => <TxRow key={t.id} t={t} ctx={ctx} />)}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   거래 페이지
   ========================================================= */
function TransactionsPage({ ctx }) {
  const { transactions, navigate } = ctx;
  const [view, setView] = useState('list');
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return transactions;
    return transactions.filter(t => t.type === filter);
  }, [transactions, filter]);

  return (
    <div className="fade-in">
      <div className="bg-white sticky top-0 z-20">
        <div className="px-4 pt-4 pb-2 flex items-center justify-between">
          <h1 className="text-xl font-extrabold" style={{ color: C.text }}>거래</h1>
          <button onClick={() => navigate('transfer-form')} className="px-3 py-1.5 rounded-full flex items-center gap-1" style={{ background: C.purpleLight }}>
            <ArrowLeftRight className="w-3.5 h-3.5" style={{ color: C.purple }} />
            <span className="text-xs font-bold" style={{ color: C.purple }}>이체</span>
          </button>
        </div>
        <div className="px-4 pb-3 flex gap-2">
          {[{ v: 'list', l: '목록', i: List }, { v: 'calendar', l: '달력', i: Grid3x3 }].map(o => (
            <button key={o.v} onClick={() => setView(o.v)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ background: view === o.v ? C.text : C.bg, color: view === o.v ? '#fff' : C.textSub }}>
              <o.i className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold">{o.l}</span>
            </button>
          ))}
        </div>
        {view === 'list' && (
          <div className="px-4 pb-3 flex gap-2 overflow-x-auto scroll-hide">
            {[{ v: 'all', l: '전체' }, { v: 'expense', l: '지출' }, { v: 'income', l: '수입' }, { v: 'transfer', l: '이체' }].map(f => (
              <button key={f.v} onClick={() => setFilter(f.v)}
                className="px-3 py-1.5 rounded-full whitespace-nowrap"
                style={{ background: filter === f.v ? C.blueLight : C.bg, color: filter === f.v ? C.blue : C.textSub }}>
                <span className="text-xs font-semibold">{f.l}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {view === 'list' ? (
        <div className="px-4 pt-3">
          <div className="bg-white rounded-2xl p-2">
            {filtered.length === 0
              ? <p className="text-center py-12 text-sm" style={{ color: C.textMuted }}>거래 내역이 없습니다</p>
              : filtered.map(t => <TxRow key={t.id} t={t} ctx={ctx} />)}
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold" style={{ color: C.text }}>고정지출 참조</h3>
              <button onClick={() => navigate('fixed-manage')} className="text-xs font-semibold" style={{ color: C.textMuted }}>관리 →</button>
            </div>
            <div className="bg-white rounded-2xl p-4">
              <div className="grid grid-cols-2 gap-3">
                {ctx.fixed.map(f => (
                  <div key={f.id}>
                    <p className="text-xs font-medium mb-0.5" style={{ color: C.textMuted }}>{f.name} · 매월 {f.day}일</p>
                    <p className="text-sm font-bold tabular-nums" style={{ color: C.text }}>{fmt(f.amount)}원</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : <CalendarView ctx={ctx} />}
    </div>
  );
}

function CalendarView({ ctx }) {
  const { transactions, navigate } = ctx;
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(5);
  const [selectedDate, setSelectedDate] = useState(today());

  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells = [...Array(firstDay).fill(null), ...Array(daysInMonth).keys()].slice(0, firstDay + daysInMonth);
  while (cells.length % 7 !== 0) cells.push(null);

  const dayStats = useMemo(() => {
    const map = {};
    transactions.forEach(t => {
      const d = t.date.slice(0, 10);
      if (!d.startsWith(`${year}-${String(month).padStart(2, '0')}`)) return;
      if (!map[d]) map[d] = { in: 0, out: 0 };
      if (t.type === 'income') map[d].in += t.amount;
      else if (t.type === 'expense') map[d].out += t.amount;
    });
    return map;
  }, [transactions, year, month]);

  const selectedTx = transactions.filter(t => t.date.slice(0, 10) === selectedDate);
  const dayLabels = ['일', '월', '화', '수', '목', '금', '토'];
  const prev = () => { if (month === 1) { setYear(y => y - 1); setMonth(12); } else setMonth(m => m - 1); };
  const next = () => { if (month === 12) { setYear(y => y + 1); setMonth(1); } else setMonth(m => m + 1); };

  return (
    <div className="px-4 pt-3">
      <div className="bg-white rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={prev} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100">
            <ChevronLeft className="w-4 h-4" style={{ color: C.text }} />
          </button>
          <h2 className="text-base font-bold" style={{ color: C.text }}>{year}년 {month}월</h2>
          <button onClick={next} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100">
            <ChevronRight className="w-4 h-4" style={{ color: C.text }} />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-1">
          {dayLabels.map((d, i) => (
            <div key={d} className="text-center text-[10px] font-bold py-1"
              style={{ color: i === 0 ? C.red : i === 6 ? C.blue : C.textMuted }}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            if (day === null) return <div key={i} />;
            const date = `${year}-${String(month).padStart(2, '0')}-${String(day + 1).padStart(2, '0')}`;
            const stat = dayStats[date];
            const isSelected = selectedDate === date;
            const isToday = date === today();
            const dow = i % 7;
            return (
              <button key={i} onClick={() => setSelectedDate(date)}
                className="aspect-square rounded-lg flex flex-col items-center justify-center p-0.5 relative"
                style={{
                  background: isSelected ? C.blue : isToday ? C.blueLight : 'transparent',
                  color: isSelected ? '#fff' : dow === 0 ? C.red : dow === 6 ? C.blue : C.text,
                }}>
                <span className="text-xs font-bold">{day + 1}</span>
                {stat && (
                  <div className="text-[8px] leading-tight font-semibold mt-0.5">
                    {stat.in > 0 && <div style={{ color: isSelected ? '#fff' : C.blue }}>+{Math.round(stat.in / 10000)}만</div>}
                    {stat.out > 0 && <div style={{ color: isSelected ? '#fff' : C.red }}>-{Math.round(stat.out / 10000)}만</div>}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-bold mb-2 px-1" style={{ color: C.text }}>{selectedDate.slice(5).replace('-', '월 ')}일 거래</h3>
        <div className="bg-white rounded-2xl p-2">
          {selectedTx.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm mb-3" style={{ color: C.textMuted }}>거래가 없습니다</p>
              <button onClick={() => navigate('transaction-form', { date: selectedDate })}
                className="text-xs font-semibold px-4 py-2 rounded-full"
                style={{ background: C.blueLight, color: C.blue }}>
                + 거래 추가
              </button>
            </div>
          ) : selectedTx.map(t => <TxRow key={t.id} t={t} ctx={ctx} />)}
        </div>
      </div>
    </div>
  );
}

function TxRow({ t, ctx }) {
  const { categories, accounts, navigate } = ctx;
  const cat = categories.find(c => c.id === t.categoryId);
  const acc = accounts.find(a => a.id === t.accountId);
  const toAcc = accounts.find(a => a.id === t.toAccountId);

  if (t.type === 'transfer') {
    return (
      <button onClick={() => navigate('transaction-detail', { id: t.id })} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 text-left">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: C.purpleLight }}>
          <ArrowLeftRight className="w-4 h-4" style={{ color: C.purple }} strokeWidth={2.2} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate" style={{ color: C.text }}>{t.memo || '이체'}</p>
          <p className="text-xs mt-0.5 truncate" style={{ color: C.textMuted }}>{acc?.name} → {toAcc?.name}</p>
        </div>
        <p className="text-sm font-bold tabular-nums flex-shrink-0" style={{ color: C.purple }}>{fmt(t.amount)}원</p>
      </button>
    );
  }
  const isIncome = t.type === 'income';
  const Icon = getCategoryIcon(cat?.icon);
  return (
    <button onClick={() => navigate('transaction-detail', { id: t.id })} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 text-left">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: (cat?.color || C.textMuted) + '20' }}>
        <Icon className="w-4 h-4" style={{ color: cat?.color || C.textMuted }} strokeWidth={2.2} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate" style={{ color: C.text }}>{t.memo || cat?.name}</p>
        <p className="text-xs mt-0.5 truncate" style={{ color: C.textMuted }}>{t.date.slice(5).replace('-', '/')} · {acc?.name}</p>
      </div>
      <p className="text-sm font-bold tabular-nums flex-shrink-0" style={{ color: isIncome ? C.blue : C.text }}>
        {isIncome ? '+' : '-'}{fmt(t.amount)}원
      </p>
    </button>
  );
}

/* =========================================================
   거래 폼 / 상세 / 이체
   ========================================================= */
function TransactionForm({ ctx }) {
  const { navigate, accounts, categories, addTransaction, updateTransaction, transactions, pageParam } = ctx;
  const editId = pageParam?.id;
  const editing = editId ? transactions.find(t => t.id === editId) : null;

  const [type, setType] = useState(editing?.type || 'expense');
  const [amount, setAmount] = useState(editing?.amount || 0);
  const [accountId, setAccountId] = useState(editing?.accountId || accounts[0]?.id);
  const [categoryId, setCategoryId] = useState(editing?.categoryId || categories.find(c => !c.isIncome)?.id);
  const [date, setDate] = useState(editing?.date || pageParam?.date || today());
  const [memo, setMemo] = useState(editing?.memo || '');

  const filteredCats = categories.filter(c => type === 'income' ? c.isIncome : !c.isIncome);

  const save = () => {
    if (!amount || amount <= 0) { alert('금액을 입력해주세요'); return; }
    const data = { type, amount: Number(amount), accountId, categoryId, date, memo };
    if (editing) updateTransaction(editing.id, data); else addTransaction(data);
    navigate('transactions');
  };

  return (
    <div className="slide-in min-h-screen" style={{ background: C.bg }}>
      <TopBar title={editing ? '거래 수정' : '거래 추가'} onBack={() => navigate(editing ? 'transaction-detail' : 'transactions', editing ? { id: editing.id } : null)} />
      <div className="px-4 py-4 space-y-4">
        <div className="bg-white rounded-2xl p-1 grid grid-cols-2 gap-1">
          {['expense', 'income'].map(tp => (
            <button key={tp} onClick={() => { setType(tp); setCategoryId(categories.find(c => tp === 'income' ? c.isIncome : !c.isIncome)?.id); }}
              className="py-3 rounded-xl text-sm font-bold"
              style={{ background: type === tp ? (tp === 'expense' ? C.text : C.blue) : 'transparent', color: type === tp ? '#fff' : C.textMuted }}>
              {tp === 'expense' ? '지출' : '수입'}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-5">
          <p className="text-xs font-medium mb-2" style={{ color: C.textMuted }}>얼마를 {type === 'income' ? '받았' : '썼'}나요?</p>
          <div className="flex items-baseline gap-2">
            <input type="number" value={amount || ''} onChange={e => setAmount(e.target.value)} placeholder="0"
              className="text-3xl font-extrabold tabular-nums outline-none flex-1 min-w-0" style={{ color: C.text }} autoFocus />
            <span className="text-xl font-bold" style={{ color: C.textSub }}>원</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4">
          <p className="text-xs font-bold mb-3 px-1" style={{ color: C.textSub }}>카테고리</p>
          <div className="flex gap-2 overflow-x-auto scroll-hide pb-1">
            {filteredCats.map(c => {
              const Icon = getCategoryIcon(c.icon);
              const sel = categoryId === c.id;
              return (
                <button key={c.id} onClick={() => setCategoryId(c.id)}
                  className="px-3 py-2 rounded-full flex items-center gap-1.5 whitespace-nowrap flex-shrink-0"
                  style={{ background: sel ? c.color + '20' : C.bg, border: `1.5px solid ${sel ? c.color : 'transparent'}` }}>
                  <Icon className="w-3.5 h-3.5" style={{ color: sel ? c.color : C.textMuted }} strokeWidth={2.2} />
                  <span className="text-xs font-bold" style={{ color: sel ? c.color : C.textSub }}>{c.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <FieldSelect label="통장" value={accountId} options={accounts.map(a => ({ value: a.id, label: a.name }))} onChange={setAccountId} />

        <div className="bg-white rounded-2xl p-4">
          <p className="text-xs font-bold mb-2" style={{ color: C.textSub }}>날짜</p>
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            className="w-full text-sm font-semibold outline-none bg-transparent" style={{ color: C.text }} />
        </div>

        <div className="bg-white rounded-2xl p-4">
          <p className="text-xs font-bold mb-2" style={{ color: C.textSub }}>메모 (선택)</p>
          <input type="text" value={memo} onChange={e => setMemo(e.target.value)} placeholder="예: 점심 김치찌개"
            className="w-full text-sm font-semibold outline-none bg-transparent" style={{ color: C.text }} />
        </div>

        <button onClick={save} className="w-full h-14 rounded-2xl text-base font-bold text-white" style={{ background: C.blue }}>
          {editing ? '수정 완료' : '저장'}
        </button>
      </div>
    </div>
  );
}

function TransactionDetail({ ctx }) {
  const { transactions, accounts, categories, navigate, deleteTransaction, pageParam } = ctx;
  const t = transactions.find(tx => tx.id === pageParam?.id);
  const [confirmDel, setConfirmDel] = useState(false);
  if (!t) return null;
  const cat = categories.find(c => c.id === t.categoryId);
  const acc = accounts.find(a => a.id === t.accountId);
  const toAcc = accounts.find(a => a.id === t.toAccountId);
  const isTransfer = t.type === 'transfer';
  const isIncome = t.type === 'income';
  const handleDelete = () => { deleteTransaction(t.id); navigate('transactions'); };

  return (
    <div className="fade-in min-h-screen" style={{ background: C.bg }}>
      <TopBar title="거래 상세" onBack={() => navigate('transactions')} />
      <div className="px-4 py-6">
        <div className="bg-white rounded-3xl p-6 text-center">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center"
            style={{ background: (isTransfer ? C.purpleLight : (cat?.color || C.textMuted) + '20') }}>
            {isTransfer ? <ArrowLeftRight className="w-7 h-7" style={{ color: C.purple }} strokeWidth={2.2} />
              : (() => { const Icon = getCategoryIcon(cat?.icon); return <Icon className="w-7 h-7" style={{ color: cat?.color || C.textMuted }} strokeWidth={2.2} />; })()}
          </div>
          <p className="text-xs font-medium mb-1" style={{ color: C.textMuted }}>{isTransfer ? '이체' : cat?.name}</p>
          <p className="text-3xl font-extrabold tabular-nums" style={{ color: isTransfer ? C.purple : isIncome ? C.blue : C.text }}>
            {isIncome ? '+' : isTransfer ? '' : '-'}{fmt(t.amount)}원
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 mt-4 space-y-3">
          {isTransfer ? <><Row label="출금 통장" value={acc?.name} /><Row label="입금 통장" value={toAcc?.name} /></>
            : <Row label="통장" value={acc?.name} />}
          <Row label="날짜" value={t.date} />
          {!isTransfer && <Row label="분류" value={isIncome ? '수입' : '지출'} />}
          {t.memo && <Row label="메모" value={t.memo} />}
        </div>

        {!isTransfer && (
          <div className="grid grid-cols-2 gap-3 mt-4">
            <button onClick={() => navigate('transaction-form', { id: t.id })}
              className="h-12 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5"
              style={{ background: C.bg, color: C.text }}>
              <Edit3 className="w-4 h-4" /> 수정
            </button>
            <button onClick={() => setConfirmDel(true)}
              className="h-12 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5"
              style={{ background: C.redLight, color: C.red }}>
              <Trash2 className="w-4 h-4" /> 삭제
            </button>
          </div>
        )}
        {isTransfer && (
          <button onClick={() => setConfirmDel(true)}
            className="w-full h-12 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 mt-4"
            style={{ background: C.redLight, color: C.red }}>
            <Trash2 className="w-4 h-4" /> 삭제
          </button>
        )}
      </div>

      {confirmDel && <ConfirmModal title="이 거래를 삭제할까요?" desc="삭제하면 되돌릴 수 없습니다"
        onCancel={() => setConfirmDel(false)} onConfirm={handleDelete} />}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs font-medium" style={{ color: C.textMuted }}>{label}</span>
      <span className="text-sm font-semibold" style={{ color: C.text }}>{value}</span>
    </div>
  );
}

function TransferForm({ ctx }) {
  const { accounts, navigate, addTransaction } = ctx;
  const [fromId, setFromId] = useState(accounts[0]?.id);
  const [toId, setToId] = useState(accounts[1]?.id);
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState(today());
  const [memo, setMemo] = useState('');

  const save = () => {
    if (!amount || amount <= 0) return alert('금액을 입력해주세요');
    if (fromId === toId) return alert('출금/입금 통장이 같습니다');
    addTransaction({ type: 'transfer', amount: Number(amount), accountId: fromId, toAccountId: toId, date, memo });
    navigate('transactions');
  };

  return (
    <div className="slide-in min-h-screen" style={{ background: C.bg }}>
      <TopBar title="이체하기" onBack={() => navigate('transactions')} />
      <div className="px-4 py-4 space-y-4">
        <FieldSelect label="출금 통장" value={fromId} onChange={setFromId}
          options={accounts.map(a => ({ value: a.id, label: `${a.name} · ${fmt(a.balance)}원` }))} />
        <div className="flex justify-center -my-2">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm">
            <ArrowDown className="w-4 h-4" style={{ color: C.purple }} strokeWidth={3} />
          </div>
        </div>
        <FieldSelect label="입금 통장" value={toId} onChange={setToId}
          options={accounts.filter(a => a.id !== fromId).map(a => ({ value: a.id, label: a.name }))} />

        <div className="bg-white rounded-2xl p-5">
          <p className="text-xs font-medium mb-2" style={{ color: C.textMuted }}>이체 금액</p>
          <div className="flex items-baseline gap-2">
            <input type="number" value={amount || ''} onChange={e => setAmount(e.target.value)} placeholder="0"
              className="text-3xl font-extrabold tabular-nums outline-none flex-1 min-w-0" style={{ color: C.text }} autoFocus />
            <span className="text-xl font-bold" style={{ color: C.textSub }}>원</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4">
          <p className="text-xs font-bold mb-2" style={{ color: C.textSub }}>날짜</p>
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            className="w-full text-sm font-semibold outline-none bg-transparent" style={{ color: C.text }} />
        </div>
        <div className="bg-white rounded-2xl p-4">
          <p className="text-xs font-bold mb-2" style={{ color: C.textSub }}>메모 (선택)</p>
          <input type="text" value={memo} onChange={e => setMemo(e.target.value)} placeholder="예: 청년도약 적금"
            className="w-full text-sm font-semibold outline-none bg-transparent" style={{ color: C.text }} />
        </div>

        <button onClick={save} className="w-full h-14 rounded-2xl text-base font-bold text-white" style={{ background: C.purple }}>
          이체하기
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   자산 / 통장 폼 / 통장 상세
   ========================================================= */
function WealthPage({ ctx }) {
  const { accounts, navigate } = ctx;
  const total = accounts.reduce((s, a) => s + a.balance, 0);
  const byType = useMemo(() => {
    const types = ['생활', '적립', '투자'];
    return types.map(type => {
      const accs = accounts.filter(a => a.type === type);
      const sum = accs.reduce((s, a) => s + a.balance, 0);
      const colors = { '생활': C.blue, '적립': C.green, '투자': C.purple };
      return { type, sum, accs, color: colors[type], pct: total ? (sum / total) * 100 : 0 };
    });
  }, [accounts, total]);
  const trendData = useMemo(() => {
    const months = ['12월', '1월', '2월', '3월', '4월', '5월'];
    return months.map((m, i) => ({ month: m, value: Math.round(total * (0.85 + i * 0.03)) }));
  }, [total]);

  return (
    <div className="fade-in">
      <div className="bg-white px-4 pt-4 pb-3"><h1 className="text-xl font-extrabold" style={{ color: C.text }}>자산</h1></div>
      <div className="px-4 pt-4">
        <div className="bg-white rounded-3xl p-6">
          <p className="text-xs font-medium mb-2" style={{ color: C.textMuted }}>총 자산</p>
          <p className="text-3xl font-extrabold tabular-nums mb-4" style={{ color: C.text }}>{fmt(total)}원</p>
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="trendG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.blue} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={C.blue} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke={C.blue} strokeWidth={2.5} fill="url(#trendG)" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: C.textMuted }} axisLine={false} tickLine={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4">
        <div className="bg-white rounded-2xl p-5">
          <h2 className="text-sm font-bold mb-3" style={{ color: C.text }}>자산 분포</h2>
          <div className="space-y-3">
            {byType.map(t => (
              <div key={t.type}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: t.color }} />
                    <span className="text-sm font-semibold" style={{ color: C.text }}>{t.type}</span>
                    <span className="text-xs font-medium" style={{ color: C.textMuted }}>{t.pct.toFixed(0)}%</span>
                  </div>
                  <span className="text-sm font-bold tabular-nums" style={{ color: C.text }}>{fmt(t.sum)}원</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: C.bg }}>
                  <div className="h-full rounded-full" style={{ width: `${t.pct}%`, background: t.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 pt-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold" style={{ color: C.text }}>통장 ({accounts.length})</h2>
          <button onClick={() => navigate('account-form')} className="text-xs font-semibold flex items-center gap-0.5" style={{ color: C.blue }}>
            <Plus className="w-3 h-3" /> 추가
          </button>
        </div>
        <div className="bg-white rounded-2xl p-2">
          {accounts.map(a => {
            const Icon = getCategoryIcon(a.icon);
            return (
              <button key={a.id} onClick={() => navigate('account-detail', { id: a.id })}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-left">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: a.color + '20' }}>
                  <Icon className="w-4 h-4" style={{ color: a.color }} strokeWidth={2.2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: C.text }}>{a.name}</p>
                  <p className="text-[10px] font-medium" style={{ color: C.textMuted }}>{a.type}</p>
                </div>
                <p className="text-sm font-bold tabular-nums flex-shrink-0" style={{ color: C.text }}>{fmt(a.balance)}원</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AccountForm({ ctx }) {
  const { accounts, navigate, addAccount, updateAccount, pageParam } = ctx;
  const editId = pageParam?.id;
  const editing = editId ? accounts.find(a => a.id === editId) : null;
  const [name, setName] = useState(editing?.name || '');
  const [type, setType] = useState(editing?.type || '생활');
  const [balance, setBalance] = useState(editing?.balance || 0);
  const [color, setColor] = useState(editing?.color || C.blue);
  const colors = [C.blue, C.green, C.purple, '#FF6B35', '#FFD600', '#FF6B9D'];
  const types = ['생활', '적립', '투자'];

  const save = () => {
    if (!name) return alert('통장 이름을 입력해주세요');
    const data = { name, type, balance: Number(balance), startBalance: editing?.startBalance ?? Number(balance), color, icon: type === '투자' ? 'trending' : type === '적립' ? 'piggy' : 'building' };
    if (editing) updateAccount(editing.id, data); else addAccount(data);
    navigate('wealth');
  };

  return (
    <div className="slide-in min-h-screen" style={{ background: C.bg }}>
      <TopBar title={editing ? '통장 수정' : '통장 추가'} onBack={() => navigate(editing ? 'account-detail' : 'wealth', editing ? { id: editing.id } : null)} />
      <div className="px-4 py-4 space-y-4">
        <div className="bg-white rounded-2xl p-4">
          <p className="text-xs font-bold mb-2" style={{ color: C.textSub }}>통장 이름</p>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="예: 신한 주거래"
            className="w-full text-sm font-semibold outline-none bg-transparent" style={{ color: C.text }} />
        </div>
        <div className="bg-white rounded-2xl p-4">
          <p className="text-xs font-bold mb-3" style={{ color: C.textSub }}>분류</p>
          <div className="grid grid-cols-3 gap-2">
            {types.map(tp => (
              <button key={tp} onClick={() => setType(tp)} className="py-3 rounded-xl text-sm font-bold"
                style={{ background: type === tp ? C.text : C.bg, color: type === tp ? '#fff' : C.textSub }}>{tp}</button>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4">
          <p className="text-xs font-bold mb-2" style={{ color: C.textSub }}>{editing ? '현재 잔액' : '시작 잔액'}</p>
          <div className="flex items-baseline gap-2">
            <input type="number" value={balance || ''} onChange={e => setBalance(e.target.value)} placeholder="0"
              className="text-2xl font-extrabold tabular-nums outline-none flex-1 min-w-0" style={{ color: C.text }} />
            <span className="text-base font-bold" style={{ color: C.textSub }}>원</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4">
          <p className="text-xs font-bold mb-3" style={{ color: C.textSub }}>색상</p>
          <div className="flex gap-2">
            {colors.map(c => (
              <button key={c} onClick={() => setColor(c)} className="w-10 h-10 rounded-full"
                style={{ background: c, outline: color === c ? `3px solid ${c}40` : 'none', outlineOffset: 2 }} />
            ))}
          </div>
        </div>
        <button onClick={save} className="w-full h-14 rounded-2xl text-base font-bold text-white" style={{ background: C.blue }}>
          {editing ? '수정 완료' : '저장'}
        </button>
      </div>
    </div>
  );
}

function AccountDetail({ ctx }) {
  const { accounts, transactions, navigate, deleteAccount, pageParam } = ctx;
  const a = accounts.find(x => x.id === pageParam?.id);
  const [confirmDel, setConfirmDel] = useState(false);
  if (!a) return null;
  const Icon = getCategoryIcon(a.icon);
  const accTx = transactions.filter(t => t.accountId === a.id || t.toAccountId === a.id).slice(0, 10);
  const change = a.balance - a.startBalance;
  const handleDelete = () => { deleteAccount(a.id); navigate('wealth'); };

  return (
    <div className="fade-in min-h-screen" style={{ background: C.bg }}>
      <TopBar title="통장 상세" onBack={() => navigate('wealth')} />
      <div className="px-4 py-6">
        <div className="bg-white rounded-3xl p-6 text-center">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center" style={{ background: a.color + '20' }}>
            <Icon className="w-7 h-7" style={{ color: a.color }} strokeWidth={2.2} />
          </div>
          <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold mb-2" style={{ background: C.bg, color: C.textSub }}>{a.type}</span>
          <p className="text-base font-bold mb-2" style={{ color: C.text }}>{a.name}</p>
          <p className="text-3xl font-extrabold tabular-nums" style={{ color: C.text }}>{fmt(a.balance)}원</p>
          <p className="text-xs font-semibold mt-2 tabular-nums" style={{ color: change >= 0 ? C.blue : C.red }}>
            시작 대비 {change >= 0 ? '+' : ''}{fmt(change)}원
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <button onClick={() => navigate('account-form', { id: a.id })} className="h-12 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5" style={{ background: C.bg, color: C.text }}>
            <Edit3 className="w-4 h-4" /> 수정
          </button>
          <button onClick={() => setConfirmDel(true)} className="h-12 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5" style={{ background: C.redLight, color: C.red }}>
            <Trash2 className="w-4 h-4" /> 삭제
          </button>
        </div>
        {accTx.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-bold mb-2 px-1" style={{ color: C.text }}>거래 내역</h3>
            <div className="bg-white rounded-2xl p-2">{accTx.map(t => <TxRow key={t.id} t={t} ctx={ctx} />)}</div>
          </div>
        )}
      </div>
      {confirmDel && <ConfirmModal title="이 통장을 삭제할까요?" desc="관련 거래는 유지되지만 통장 정보가 삭제됩니다"
        onCancel={() => setConfirmDel(false)} onConfirm={handleDelete} />}
    </div>
  );
}

/* =========================================================
   포트폴리오
   ========================================================= */
function PortfolioPage({ ctx }) {
  const { portfolio, navigate } = ctx;
  const total = portfolio.reduce((s, p) => s + p.currentValue, 0);
  const totalCost = portfolio.reduce((s, p) => s + p.quantity * p.avgPrice, 0);
  const profit = total - totalCost;
  const profitRate = totalCost ? (profit / totalCost) * 100 : 0;
  const byBroker = useMemo(() => {
    const map = {};
    portfolio.forEach(p => {
      if (!map[p.broker]) map[p.broker] = { broker: p.broker, items: [], sum: 0 };
      map[p.broker].items.push(p);
      map[p.broker].sum += p.currentValue;
    });
    return Object.values(map);
  }, [portfolio]);

  return (
    <div className="fade-in">
      <div className="bg-white px-4 pt-4 pb-3"><h1 className="text-xl font-extrabold" style={{ color: C.text }}>포트폴리오</h1></div>
      <div className="px-4 pt-4">
        <div className="rounded-3xl p-6 text-white" style={{ background: `linear-gradient(135deg, ${C.purple} 0%, #6D5DCB 100%)` }}>
          <p className="text-xs font-medium mb-2 text-white/80">총 평가금액</p>
          <p className="text-3xl font-extrabold tabular-nums mb-4">{fmt(total)}원</p>
          <div className="flex items-center justify-between text-xs">
            <div>
              <p className="text-white/70 mb-0.5">평가손익</p>
              <p className="font-bold tabular-nums">{profit >= 0 ? '+' : ''}{fmt(profit)}원</p>
            </div>
            <div>
              <p className="text-white/70 mb-0.5">수익률</p>
              <p className="font-bold tabular-nums">{profit >= 0 ? '+' : ''}{profitRate.toFixed(2)}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold" style={{ color: C.text }}>보유 종목 ({portfolio.length})</h2>
          <button onClick={() => navigate('portfolio-form')} className="text-xs font-semibold flex items-center gap-0.5" style={{ color: C.purple }}>
            <Plus className="w-3 h-3" /> 추가
          </button>
        </div>
        <div className="bg-white rounded-2xl p-2">
          {portfolio.map(p => {
            const cost = p.quantity * p.avgPrice;
            const pf = p.currentValue - cost;
            const rate = cost ? (pf / cost) * 100 : 0;
            return (
              <button key={p.id} onClick={() => navigate('portfolio-detail', { id: p.id })}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 text-left">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold truncate" style={{ color: C.text }}>{p.name}</p>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: C.bg, color: C.textMuted }}>{p.broker}</span>
                  </div>
                  <p className="text-xs font-medium" style={{ color: C.textMuted }}>{p.quantity}주</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold tabular-nums" style={{ color: C.text }}>{fmt(p.currentValue)}원</p>
                  <p className="text-xs font-bold tabular-nums" style={{ color: pf >= 0 ? C.red : C.blue }}>
                    {pf >= 0 ? '+' : ''}{rate.toFixed(2)}%
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-4 pt-4">
        <h2 className="text-sm font-bold mb-2" style={{ color: C.text }}>보유처별</h2>
        <div className="space-y-2">
          {byBroker.map(b => (
            <div key={b.broker} className="bg-white rounded-2xl p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold" style={{ color: C.text }}>{b.broker}</span>
                <span className="text-sm font-bold tabular-nums" style={{ color: C.text }}>{fmt(b.sum)}원</span>
              </div>
              <p className="text-xs font-medium" style={{ color: C.textMuted }}>{b.items.length}개 종목</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PortfolioForm({ ctx }) {
  const { portfolio, navigate, addPortfolio, updatePortfolio, pageParam } = ctx;
  const editId = pageParam?.id;
  const editing = editId ? portfolio.find(p => p.id === editId) : null;
  const [name, setName] = useState(editing?.name || '');
  const [broker, setBroker] = useState(editing?.broker || 'ISA');
  const [quantity, setQuantity] = useState(editing?.quantity || 0);
  const [avgPrice, setAvgPrice] = useState(editing?.avgPrice || 0);
  const [currentValue, setCurrentValue] = useState(editing?.currentValue || 0);
  const brokers = ['ISA', '연금저축', '토스증권', 'KB증권', '기타'];

  const save = () => {
    if (!name) return alert('종목명을 입력해주세요');
    const data = { name, broker, quantity: Number(quantity), avgPrice: Number(avgPrice), currentValue: Number(currentValue) };
    if (editing) updatePortfolio(editing.id, data); else addPortfolio(data);
    navigate('portfolio');
  };

  return (
    <div className="slide-in min-h-screen" style={{ background: C.bg }}>
      <TopBar title={editing ? '종목 수정' : '종목 추가'} onBack={() => navigate(editing ? 'portfolio-detail' : 'portfolio', editing ? { id: editing.id } : null)} />
      <div className="px-4 py-4 space-y-4">
        <div className="bg-white rounded-2xl p-4">
          <p className="text-xs font-bold mb-2" style={{ color: C.textSub }}>종목명</p>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="예: TIGER 미국S&P500"
            className="w-full text-sm font-semibold outline-none bg-transparent" style={{ color: C.text }} />
        </div>
        <FieldSelect label="보유처" value={broker} onChange={setBroker} options={brokers.map(b => ({ value: b, label: b }))} />
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4">
            <p className="text-xs font-bold mb-2" style={{ color: C.textSub }}>수량</p>
            <input type="number" value={quantity || ''} onChange={e => setQuantity(e.target.value)} placeholder="0"
              className="w-full text-base font-bold tabular-nums outline-none bg-transparent" style={{ color: C.text }} />
          </div>
          <div className="bg-white rounded-2xl p-4">
            <p className="text-xs font-bold mb-2" style={{ color: C.textSub }}>평균단가</p>
            <input type="number" value={avgPrice || ''} onChange={e => setAvgPrice(e.target.value)} placeholder="0"
              className="w-full text-base font-bold tabular-nums outline-none bg-transparent" style={{ color: C.text }} />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5">
          <p className="text-xs font-medium mb-2" style={{ color: C.textMuted }}>현재 평가금액</p>
          <div className="flex items-baseline gap-2">
            <input type="number" value={currentValue || ''} onChange={e => setCurrentValue(e.target.value)} placeholder="0"
              className="text-2xl font-extrabold tabular-nums outline-none flex-1 min-w-0" style={{ color: C.text }} />
            <span className="text-base font-bold" style={{ color: C.textSub }}>원</span>
          </div>
        </div>
        <button onClick={save} className="w-full h-14 rounded-2xl text-base font-bold text-white" style={{ background: C.purple }}>
          {editing ? '수정 완료' : '저장'}
        </button>
      </div>
    </div>
  );
}

function PortfolioDetail({ ctx }) {
  const { portfolio, navigate, deletePortfolio, updatePortfolio, pageParam } = ctx;
  const p = portfolio.find(x => x.id === pageParam?.id);
  const [confirmDel, setConfirmDel] = useState(false);
  const [updateMode, setUpdateMode] = useState(false);
  const [newValue, setNewValue] = useState(p?.currentValue || 0);
  if (!p) return null;
  const cost = p.quantity * p.avgPrice;
  const profit = p.currentValue - cost;
  const rate = cost ? (profit / cost) * 100 : 0;
  const handleDelete = () => { deletePortfolio(p.id); navigate('portfolio'); };
  const handleUpdate = () => { updatePortfolio(p.id, { currentValue: Number(newValue) }); setUpdateMode(false); };

  return (
    <div className="fade-in min-h-screen" style={{ background: C.bg }}>
      <TopBar title="종목 상세" onBack={() => navigate('portfolio')} />
      <div className="px-4 py-6">
        <div className="rounded-3xl p-6 text-white" style={{ background: `linear-gradient(135deg, ${C.purple} 0%, #6D5DCB 100%)` }}>
          <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold mb-2 bg-white/20">{p.broker}</span>
          <p className="text-base font-bold mb-2">{p.name}</p>
          <p className="text-3xl font-extrabold tabular-nums">{fmt(p.currentValue)}원</p>
          <p className="text-xs font-semibold mt-2 tabular-nums">
            {profit >= 0 ? '+' : ''}{fmt(profit)}원 ({profit >= 0 ? '+' : ''}{rate.toFixed(2)}%)
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 mt-4 space-y-3">
          <Row label="보유처" value={p.broker} />
          <Row label="수량" value={`${p.quantity}주`} />
          <Row label="평균단가" value={`${fmt(p.avgPrice)}원`} />
          <Row label="평가손익" value={`${profit >= 0 ? '+' : ''}${fmt(profit)}원`} />
        </div>
        <button onClick={() => { setNewValue(p.currentValue); setUpdateMode(true); }}
          className="w-full h-12 rounded-xl text-sm font-bold mt-4 flex items-center justify-center gap-1.5"
          style={{ background: C.purpleLight, color: C.purple }}>
          <TrendingUp className="w-4 h-4" /> 평가금액 갱신
        </button>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <button onClick={() => navigate('portfolio-form', { id: p.id })} className="h-12 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5" style={{ background: C.bg, color: C.text }}>
            <Edit3 className="w-4 h-4" /> 수정
          </button>
          <button onClick={() => setConfirmDel(true)} className="h-12 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5" style={{ background: C.redLight, color: C.red }}>
            <Trash2 className="w-4 h-4" /> 삭제
          </button>
        </div>
      </div>

      {updateMode && (
        <div className="fixed inset-0 bg-black/40 flex items-end z-50 fade-in" onClick={() => setUpdateMode(false)}>
          <div className="w-full max-w-md mx-auto bg-white rounded-t-3xl p-6 slide-in" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-bold mb-1" style={{ color: C.text }}>평가금액 갱신</h3>
            <p className="text-xs mb-4" style={{ color: C.textMuted }}>이번 달 평가금액을 입력하세요</p>
            <div className="rounded-2xl p-4 mb-4" style={{ background: C.bg }}>
              <div className="flex items-baseline gap-2">
                <input type="number" value={newValue} onChange={e => setNewValue(e.target.value)}
                  className="text-2xl font-extrabold tabular-nums outline-none flex-1 min-w-0 bg-transparent" style={{ color: C.text }} autoFocus />
                <span className="text-base font-bold" style={{ color: C.textSub }}>원</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setUpdateMode(false)} className="h-12 rounded-xl text-sm font-bold" style={{ background: C.bg, color: C.text }}>취소</button>
              <button onClick={handleUpdate} className="h-12 rounded-xl text-sm font-bold text-white" style={{ background: C.purple }}>갱신</button>
            </div>
          </div>
        </div>
      )}
      {confirmDel && <ConfirmModal title="이 종목을 삭제할까요?" desc="삭제하면 되돌릴 수 없습니다"
        onCancel={() => setConfirmDel(false)} onConfirm={handleDelete} />}
    </div>
  );
}

/* =========================================================
   내정보 페이지 — 사용자 + 가계부 통합
   ========================================================= */
function SettingsPage({ ctx }) {
  const { navigate, accounts, categories, portfolio, transactions, user, currentHousehold, currentMembers, isOwner, setShowSwitcher, households, fixed, onLogout } = ctx;
  const [confirmLogout, setConfirmLogout] = useState(false);

  return (
    <div className="fade-in">
      <div className="bg-white px-4 pt-4 pb-3"><h1 className="text-xl font-extrabold" style={{ color: C.text }}>내정보</h1></div>

      {/* 사용자 카드 */}
      <div className="px-4 pt-4">
        <button onClick={() => navigate('profile-edit')} className="w-full bg-white rounded-2xl p-5 flex items-center gap-4 hover:bg-gray-50">
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: C.blueLight }}>
            <span className="text-xl font-extrabold" style={{ color: C.blue }}>{user.name[0]}</span>
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-base font-bold truncate" style={{ color: C.text }}>{user.name}</p>
            <p className="text-xs font-medium truncate" style={{ color: C.textMuted }}>{user.email}</p>
          </div>
          <ChevronRight className="w-4 h-4" style={{ color: C.textMuted }} />
        </button>
      </div>

      {/* 가계부 — 핵심 위치에 */}
      <div className="px-4 pt-4">
        <p className="text-xs font-bold px-2 mb-2" style={{ color: C.textMuted }}>현재 가계부</p>
        <div className="bg-white rounded-2xl p-2">
          <button onClick={() => setShowSwitcher(true)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-left">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: isOwner ? C.blueLight : C.purpleLight }}>
              {isOwner ? <Home className="w-5 h-5" style={{ color: C.blue }} /> : <Users className="w-5 h-5" style={{ color: C.purple }} />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-bold truncate" style={{ color: C.text }}>{currentHousehold?.name}</p>
                {isOwner && <Crown className="w-3 h-3" style={{ color: C.gold }} fill={C.gold} />}
              </div>
              <p className="text-xs font-medium" style={{ color: C.textMuted }}>
                {isOwner ? '소유자' : '멤버'} · {currentMembers.length}명 · 전체 {households.length}개 가계부
              </p>
            </div>
            <span className="text-xs font-bold" style={{ color: C.blue }}>전환</span>
          </button>
          <SettingsItem label="가계부 설정" icon={SettingsIcon} onClick={() => navigate('household-settings')} />
          <SettingsItem label="멤버 관리" icon={Users} value={`${currentMembers.length}명`} onClick={() => navigate('member-manage')} />
        </div>
      </div>

      {/* 통계 */}
      <div className="px-4 pt-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 text-center">
            <p className="text-lg font-extrabold" style={{ color: C.text }}>{accounts.length}</p>
            <p className="text-[10px] font-medium" style={{ color: C.textMuted }}>통장</p>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center">
            <p className="text-lg font-extrabold" style={{ color: C.text }}>{transactions.length}</p>
            <p className="text-[10px] font-medium" style={{ color: C.textMuted }}>거래</p>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center">
            <p className="text-lg font-extrabold" style={{ color: C.text }}>{portfolio.length}</p>
            <p className="text-[10px] font-medium" style={{ color: C.textMuted }}>종목</p>
          </div>
        </div>
      </div>

      {/* 데이터 관리 */}
      <div className="px-4 pt-4">
        <p className="text-xs font-bold px-2 mb-2" style={{ color: C.textMuted }}>관리</p>
        <div className="bg-white rounded-2xl p-2">
          <SettingsItem label="카테고리 관리" value={`${categories.length}개`} onClick={() => navigate('category-manage')} />
          <SettingsItem label="고정지출 관리" value={`${fixed.length}개`} onClick={() => navigate('fixed-manage')} />
          <SettingsItem label="통장 관리" value={`${accounts.length}개`} onClick={() => navigate('wealth')} />
        </div>
      </div>

      {/* 보안 */}
      <div className="px-4 pt-4">
        <p className="text-xs font-bold px-2 mb-2" style={{ color: C.textMuted }}>보안</p>
        <div className="bg-white rounded-2xl p-2">
          <SettingsItem label="비밀번호 변경" icon={Lock} onClick={() => navigate('password-change')} />
        </div>
      </div>

      {/* 로그아웃 / 계정 */}
      <div className="px-4 pt-4">
        <div className="bg-white rounded-2xl p-2">
          <SettingsItem label="로그아웃" icon={LogOut} onClick={() => setConfirmLogout(true)} />
          <SettingsItem label="계정 삭제" icon={Trash2} danger onClick={() => navigate('account-delete')} />
        </div>
      </div>

      {confirmLogout && <ConfirmModal
        title="로그아웃할까요?" desc="다시 로그인해야 사용할 수 있어요"
        confirmLabel="로그아웃" confirmColor={C.text}
        onCancel={() => setConfirmLogout(false)} onConfirm={onLogout} />}
    </div>
  );
}

function SettingsItem({ label, value, onClick, icon: Icon, danger, accent, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 disabled:hover:bg-transparent"
      style={{ opacity: disabled ? 0.5 : 1 }}>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4" style={{ color: danger ? C.red : accent ? C.blue : C.text }} />}
        <span className="text-sm font-bold" style={{ color: danger ? C.red : accent ? C.blue : C.text }}>{label}</span>
      </div>
      <div className="flex items-center gap-1">
        {value && <span className="text-xs font-medium" style={{ color: C.textMuted }}>{value}</span>}
        {onClick && !danger && !accent && <ChevronRight className="w-4 h-4" style={{ color: C.textMuted }} />}
      </div>
    </button>
  );
}

/* =========================================================
   가계부 관리 — 생성 / 설정 / 멤버
   ========================================================= */
function HouseholdCreateForm({ ctx }) {
  const { navigate, addHousehold } = ctx;
  const [name, setName] = useState('');
  const [currency, setCurrency] = useState('KRW');
  const [startedAt, setStartedAt] = useState(today());
  const [description, setDescription] = useState('');

  const save = () => {
    if (!name) return alert('가계부 이름을 입력해주세요');
    addHousehold({ name, currency, started_at: startedAt, description });
    navigate('home');
  };

  return (
    <div className="slide-in min-h-screen" style={{ background: C.bg }}>
      <TopBar title="새 가계부" onBack={() => navigate('settings')} />
      <div className="px-4 py-6">
        <div className="rounded-2xl p-4 mb-4" style={{ background: C.blueLight }}>
          <div className="flex gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: C.blue }} />
            <p className="text-xs font-semibold leading-relaxed" style={{ color: C.blueDark }}>
              만든 가계부의 소유자가 되며, 다른 사람을 멤버로 초대할 수 있어요
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <FieldCard label="가계부 이름" required>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="예: 우리 가족 가계부" maxLength={50}
              className="w-full text-base font-bold outline-none bg-transparent" style={{ color: C.text }} />
            <p className="text-[10px] font-medium mt-1 text-right" style={{ color: C.textMuted }}>{name.length}/50</p>
          </FieldCard>
          <FieldSelectCard label="기준 통화" value={currency} onChange={setCurrency} options={[
            { value: 'KRW', label: '원 (KRW)' }, { value: 'USD', label: '달러 (USD)' }, { value: 'JPY', label: '엔 (JPY)' }, { value: 'EUR', label: '유로 (EUR)' },
          ]} />
          <FieldCard label="시작일">
            <input type="date" value={startedAt} onChange={e => setStartedAt(e.target.value)}
              className="w-full text-base font-bold outline-none bg-transparent" style={{ color: C.text }} />
            <p className="text-[10px] font-medium mt-1" style={{ color: C.textMuted }}>이 날짜 이후의 거래만 입력할 수 있어요</p>
          </FieldCard>
          <FieldCard label="설명 (선택)">
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="이 가계부의 용도를 적어보세요"
              rows={3} maxLength={200}
              className="w-full text-sm font-semibold outline-none bg-transparent resize-none" style={{ color: C.text }} />
          </FieldCard>
        </div>
      </div>
      <div className="sticky bottom-0 px-4 pb-6 pt-3 bg-white border-t" style={{ borderColor: C.border }}>
        <button disabled={!name} onClick={save}
          className="w-full h-14 rounded-2xl text-base font-bold text-white"
          style={{ background: C.blue, opacity: name ? 1 : 0.4 }}>
          가계부 만들기
        </button>
      </div>
    </div>
  );
}

function HouseholdSettings({ ctx }) {
  const { navigate, currentHousehold, currentMembers, isOwner, deleteHousehold } = ctx;
  const [confirmDel, setConfirmDel] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);

  const handleDelete = () => { deleteHousehold(currentHousehold.id); navigate('home'); };

  const currencyLabel = { KRW: '원 (KRW)', USD: '달러 (USD)', JPY: '엔 (JPY)', EUR: '유로 (EUR)' }[currentHousehold?.currency] || currentHousehold?.currency;

  return (
    <div className="fade-in min-h-screen" style={{ background: C.bg }}>
      <TopBar title="가계부 설정" onBack={() => navigate('settings')} />

      <div className="px-4 py-4 space-y-4">
        <div className="bg-white rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: C.blueLight }}>
              <Home className="w-6 h-6" style={{ color: C.blue }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-bold truncate" style={{ color: C.text }}>{currentHousehold?.name}</p>
              <p className="text-xs font-medium" style={{ color: C.textMuted }}>{isOwner ? '소유자' : '멤버'} · {currentMembers.length}명</p>
            </div>
            {isOwner && <Crown className="w-4 h-4" style={{ color: C.gold }} fill={C.gold} />}
          </div>
        </div>

        <div>
          <p className="text-xs font-bold px-2 mb-2" style={{ color: C.textMuted }}>기본 정보</p>
          <div className="bg-white rounded-2xl p-2">
            <SettingsItem label="가계부 이름" value={currentHousehold?.name} onClick={isOwner ? () => navigate('household-edit', { field: 'name' }) : null} disabled={!isOwner} />
            <SettingsItem label="기준 통화" value={currencyLabel} onClick={isOwner ? () => navigate('household-edit', { field: 'currency' }) : null} disabled={!isOwner} />
            <SettingsItem label="시작일" value={currentHousehold?.started_at} onClick={isOwner ? () => navigate('household-edit', { field: 'started_at' }) : null} disabled={!isOwner} />
            <SettingsItem label="설명" value={currentHousehold?.description || '없음'} onClick={isOwner ? () => navigate('household-edit', { field: 'description' }) : null} disabled={!isOwner} />
          </div>
        </div>

        <div>
          <p className="text-xs font-bold px-2 mb-2" style={{ color: C.textMuted }}>멤버</p>
          <div className="bg-white rounded-2xl p-2">
            <SettingsItem label="멤버 관리" value={`${currentMembers.length}명`} onClick={() => navigate('member-manage')} />
            {isOwner && <SettingsItem label="멤버 초대하기" icon={UserPlus} accent onClick={() => navigate('member-invite')} />}
          </div>
        </div>

        <div>
          <p className="text-xs font-bold px-2 mb-2" style={{ color: C.textMuted }}>{isOwner ? '관리' : ''}</p>
          <div className="bg-white rounded-2xl p-2">
            {isOwner
              ? <SettingsItem label="가계부 삭제" danger icon={Trash2} onClick={() => setConfirmDel(true)} />
              : <SettingsItem label="가계부 나가기" danger icon={LogOut} onClick={() => setConfirmLeave(true)} />}
          </div>
        </div>
      </div>

      {confirmDel && <ConfirmModal title="가계부를 삭제할까요?" desc="모든 거래/통장/종목 데이터가 영구 삭제됩니다"
        onCancel={() => setConfirmDel(false)} onConfirm={handleDelete} />}
      {confirmLeave && <ConfirmModal title="가계부를 나갈까요?" desc="다시 초대받아야 접근할 수 있어요"
        onCancel={() => setConfirmLeave(false)} onConfirm={() => { /* 멤버 본인 제거 로직 */ navigate('home'); }} />}
    </div>
  );
}

function HouseholdEditForm({ ctx }) {
  const { navigate, currentHousehold, updateHousehold, pageParam } = ctx;
  const field = pageParam?.field || 'name';
  const [value, setValue] = useState(
    field === 'name' ? currentHousehold?.name :
    field === 'currency' ? currentHousehold?.currency :
    field === 'started_at' ? currentHousehold?.started_at :
    field === 'description' ? currentHousehold?.description || '' : ''
  );

  const titles = {
    name: '가계부 이름',
    currency: '기준 통화',
    started_at: '시작일',
    description: '설명',
  };

  const save = () => {
    updateHousehold(currentHousehold.id, { [field]: value });
    navigate('household-settings');
  };

  return (
    <div className="slide-in min-h-screen" style={{ background: C.bg }}>
      <TopBar title={titles[field]} onBack={() => navigate('household-settings')} />
      <div className="px-4 py-6">
        <FieldCard label={titles[field]}>
          {field === 'currency' ? (
            <div className="space-y-2">
              {[{ v: 'KRW', l: '원 (KRW)' }, { v: 'USD', l: '달러 (USD)' }, { v: 'JPY', l: '엔 (JPY)' }, { v: 'EUR', l: '유로 (EUR)' }].map(o => (
                <button key={o.v} onClick={() => setValue(o.v)}
                  className="w-full flex items-center justify-between p-3 rounded-xl"
                  style={{ background: value === o.v ? C.blueLight : C.bg }}>
                  <span className="text-sm font-bold" style={{ color: value === o.v ? C.blue : C.text }}>{o.l}</span>
                  {value === o.v && <Check className="w-4 h-4" style={{ color: C.blue }} />}
                </button>
              ))}
            </div>
          ) : field === 'started_at' ? (
            <input type="date" value={value} onChange={e => setValue(e.target.value)}
              className="w-full text-base font-bold outline-none bg-transparent" style={{ color: C.text }} />
          ) : field === 'description' ? (
            <textarea value={value} onChange={e => setValue(e.target.value)} rows={3} maxLength={200}
              className="w-full text-sm font-semibold outline-none bg-transparent resize-none" style={{ color: C.text }} />
          ) : (
            <input value={value} onChange={e => setValue(e.target.value)} maxLength={50}
              className="w-full text-base font-bold outline-none bg-transparent" style={{ color: C.text }} autoFocus />
          )}
        </FieldCard>
      </div>
      <div className="sticky bottom-0 px-4 pb-6 pt-3 bg-white border-t" style={{ borderColor: C.border }}>
        <button onClick={save} className="w-full h-14 rounded-2xl text-base font-bold text-white" style={{ background: C.blue }}>
          저장
        </button>
      </div>
    </div>
  );
}

function MemberManage({ ctx }) {
  const { navigate, currentMembers, isOwner, currentHouseholdId, removeMember } = ctx;
  const [confirmRemove, setConfirmRemove] = useState(null);

  const handleRemove = () => {
    removeMember(currentHouseholdId, confirmRemove.id);
    setConfirmRemove(null);
  };

  return (
    <div className="fade-in min-h-screen" style={{ background: C.bg }}>
      <TopBar title="멤버" onBack={() => navigate('settings')}
        right={isOwner ? (
          <button onClick={() => navigate('member-invite')} className="w-9 h-9 -mr-2 rounded-full flex items-center justify-center" style={{ background: C.blueLight }}>
            <UserPlus className="w-4 h-4" style={{ color: C.blue }} />
          </button>
        ) : null} />
      <div className="px-4 py-4">
        <div className="bg-white rounded-2xl p-2">
          {currentMembers.map(m => (
            <div key={m.id} className="flex items-center gap-3 p-3">
              <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: m.role === 'owner' ? C.blueLight : C.bg }}>
                <span className="text-sm font-bold" style={{ color: m.role === 'owner' ? C.blue : C.textSub }}>{m.name[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-bold truncate" style={{ color: C.text }}>{m.name}</p>
                  {m.role === 'owner' && <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded" style={{ background: C.blueLight, color: C.blue }}>소유자</span>}
                </div>
                <p className="text-xs font-medium truncate" style={{ color: C.textMuted }}>{m.email}</p>
              </div>
              {m.role !== 'owner' && isOwner && (
                <button onClick={() => setConfirmRemove(m)} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-red-50">
                  <Trash2 className="w-4 h-4" style={{ color: C.red }} />
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-2xl p-4" style={{ background: C.blueLight }}>
          <p className="text-xs font-semibold leading-relaxed" style={{ color: C.blueDark }}>
            💡 멤버는 거래 추가/수정/삭제, 통장 관리, 종목 관리 모두 할 수 있어요. 신뢰하는 사람만 초대해주세요.
          </p>
        </div>
      </div>
      {confirmRemove && <ConfirmModal title={`${confirmRemove.name}님을 내보낼까요?`} desc="다시 초대해야 접근할 수 있어요"
        onCancel={() => setConfirmRemove(null)} onConfirm={handleRemove} />}
    </div>
  );
}

function MemberInvite({ ctx }) {
  const { navigate, currentHouseholdId, addMember } = ctx;
  const [email, setEmail] = useState('');
  const valid = email.includes('@') && email.includes('.');

  const invite = () => {
    // 실제로는 백엔드에서 user 조회 후 추가
    addMember(currentHouseholdId, { user_id: newId(), name: email.split('@')[0], email, role: 'member' });
    navigate('member-manage');
  };

  return (
    <div className="fade-in min-h-screen" style={{ background: C.bg }}>
      <TopBar title="멤버 초대" onBack={() => navigate('member-manage')} />
      <div className="px-4 py-6">
        <div className="bg-white rounded-2xl p-5 mb-3">
          <h2 className="text-base font-extrabold mb-1" style={{ color: C.text }}>함께 쓸 사람을 초대하세요</h2>
          <p className="text-xs font-medium leading-relaxed" style={{ color: C.textMuted }}>가입된 이메일을 입력하면 즉시 멤버로 추가돼요</p>
        </div>
        <FieldCard label="이메일">
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="example@email.com" autoFocus
            className="w-full text-base font-bold outline-none bg-transparent" style={{ color: C.text }} />
        </FieldCard>
        <div className="mt-4 rounded-2xl p-4" style={{ background: C.bg }}>
          <p className="text-xs font-bold mb-2" style={{ color: C.textSub }}>초대 후 멤버는 이걸 할 수 있어요</p>
          <ul className="space-y-1.5">
            {['거래 추가, 수정, 삭제', '통장 관리', '종목 관리', '카테고리, 고정지출 관리'].map(t => (
              <li key={t} className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5" style={{ color: C.blue }} strokeWidth={3} />
                <span className="text-xs font-semibold" style={{ color: C.textSub }}>{t}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 pt-3 border-t" style={{ borderColor: C.borderStrong }}>
            <p className="text-xs font-bold mb-2" style={{ color: C.textSub }}>이건 못 해요 (소유자만 가능)</p>
            <ul className="space-y-1.5">
              {['가계부 이름/통화 변경', '멤버 초대/제거', '가계부 삭제'].map(t => (
                <li key={t} className="flex items-center gap-2">
                  <X className="w-3.5 h-3.5" style={{ color: C.textMuted }} strokeWidth={3} />
                  <span className="text-xs font-semibold" style={{ color: C.textMuted }}>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="sticky bottom-0 px-4 pb-6 pt-3 bg-white border-t" style={{ borderColor: C.border }}>
        <button disabled={!valid} onClick={invite}
          className="w-full h-14 rounded-2xl text-base font-bold text-white"
          style={{ background: C.blue, opacity: valid ? 1 : 0.4 }}>
          초대하기
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   프로필 / 비밀번호 / 계정 삭제
   ========================================================= */
function ProfileEdit({ ctx }) {
  const { navigate, user, updateUser } = ctx;
  const [name, setName] = useState(user.name);
  const [language, setLanguage] = useState(user.language);

  const save = () => {
    updateUser({ name, language });
    navigate('settings');
  };

  return (
    <div className="fade-in min-h-screen" style={{ background: C.bg }}>
      <TopBar title="프로필" onBack={() => navigate('settings')} />
      <div className="px-4 py-6">
        <div className="bg-white rounded-2xl p-5 flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: C.blueLight }}>
            <span className="text-xl font-extrabold" style={{ color: C.blue }}>{name[0] || '?'}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold truncate" style={{ color: C.text }}>{name}</p>
            <p className="text-xs font-medium truncate" style={{ color: C.textMuted }}>{user.email}</p>
          </div>
        </div>

        <div className="space-y-3">
          <FieldCard label="이름">
            <input value={name} onChange={e => setName(e.target.value)} maxLength={20}
              className="w-full text-base font-bold outline-none bg-transparent" style={{ color: C.text }} />
          </FieldCard>
          <FieldCard label="이메일" disabled>
            <p className="text-base font-bold" style={{ color: C.textMuted }}>{user.email}</p>
            <p className="text-[10px] font-medium mt-1" style={{ color: C.textMuted }}>이메일은 변경할 수 없어요</p>
          </FieldCard>
          <FieldSelectCard label="언어" value={language} onChange={setLanguage}
            options={[{ value: 'ko', label: '한국어' }, { value: 'en', label: 'English' }, { value: 'ja', label: '日本語' }]} />
        </div>
      </div>
      <div className="sticky bottom-0 px-4 pb-6 pt-3 bg-white border-t" style={{ borderColor: C.border }}>
        <button onClick={save} className="w-full h-14 rounded-2xl text-base font-bold text-white" style={{ background: C.blue }}>저장</button>
      </div>
    </div>
  );
}

function PasswordChange({ ctx }) {
  const { navigate } = ctx;
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showCur, setShowCur] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const valid = current && next.length >= 6 && next === confirm;

  return (
    <div className="fade-in min-h-screen" style={{ background: C.bg }}>
      <TopBar title="비밀번호 변경" onBack={() => navigate('settings')} />
      <div className="px-4 py-6 space-y-3">
        <FieldCard label="현재 비밀번호">
          <div className="flex items-center">
            <input value={current} onChange={e => setCurrent(e.target.value)} type={showCur ? 'text' : 'password'}
              className="flex-1 text-base font-bold outline-none bg-transparent" style={{ color: C.text }} />
            <button onClick={() => setShowCur(!showCur)} className="p-1">
              {showCur ? <EyeOff className="w-4 h-4" style={{ color: C.textMuted }} /> : <Eye className="w-4 h-4" style={{ color: C.textMuted }} />}
            </button>
          </div>
        </FieldCard>
        <FieldCard label="새 비밀번호">
          <div className="flex items-center">
            <input value={next} onChange={e => setNext(e.target.value)} type={showNew ? 'text' : 'password'} placeholder="6자 이상"
              className="flex-1 text-base font-bold outline-none bg-transparent" style={{ color: C.text }} />
            <button onClick={() => setShowNew(!showNew)} className="p-1">
              {showNew ? <EyeOff className="w-4 h-4" style={{ color: C.textMuted }} /> : <Eye className="w-4 h-4" style={{ color: C.textMuted }} />}
            </button>
          </div>
        </FieldCard>
        <FieldCard label="새 비밀번호 확인">
          <input value={confirm} onChange={e => setConfirm(e.target.value)} type="password" placeholder="다시 입력"
            className="w-full text-base font-bold outline-none bg-transparent" style={{ color: C.text }} />
          {confirm && next !== confirm && <p className="text-[10px] font-bold mt-1" style={{ color: C.red }}>비밀번호가 일치하지 않아요</p>}
        </FieldCard>
      </div>
      <div className="sticky bottom-0 px-4 pb-6 pt-3 bg-white border-t" style={{ borderColor: C.border }}>
        <button disabled={!valid} className="w-full h-14 rounded-2xl text-base font-bold text-white"
          style={{ background: C.blue, opacity: valid ? 1 : 0.4 }}>변경하기</button>
      </div>
    </div>
  );
}

function AccountDelete({ ctx }) {
  const { navigate, onLogout } = ctx;
  const [confirm, setConfirm] = useState('');
  const [agreed, setAgreed] = useState(false);
  const valid = confirm === '삭제' && agreed;

  return (
    <div className="fade-in min-h-screen" style={{ background: C.bg }}>
      <TopBar title="계정 삭제" onBack={() => navigate('settings')} />
      <div className="px-4 py-6">
        <div className="rounded-2xl p-5 mb-4" style={{ background: C.redLight }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: '#fff' }}>
            <AlertCircle className="w-5 h-5" style={{ color: C.red }} />
          </div>
          <h2 className="text-base font-extrabold mb-2" style={{ color: C.red }}>정말 계정을 삭제할까요?</h2>
          <p className="text-xs font-semibold leading-relaxed" style={{ color: C.red }}>삭제 후에는 복구할 수 없어요</p>
        </div>
        <div className="bg-white rounded-2xl p-5 mb-4">
          <p className="text-sm font-bold mb-3" style={{ color: C.text }}>삭제되는 데이터</p>
          <ul className="space-y-2">
            {['내가 소유한 가계부 전체', '거래, 통장, 종목 등 모든 기록', '다른 가계부에서의 멤버십', '프로필 정보'].map(t => (
              <li key={t} className="flex items-start gap-2">
                <X className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: C.red }} strokeWidth={3} />
                <span className="text-xs font-semibold" style={{ color: C.textSub }}>{t}</span>
              </li>
            ))}
          </ul>
        </div>
        <FieldCard label="확인을 위해 '삭제'를 입력해주세요">
          <input value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="삭제"
            className="w-full text-base font-bold outline-none bg-transparent" style={{ color: C.text }} />
        </FieldCard>
        <button onClick={() => setAgreed(!agreed)} className="w-full flex items-center gap-3 p-4 mt-3 bg-white rounded-2xl">
          <div className="w-5 h-5 rounded flex items-center justify-center" style={{ background: agreed ? C.red : C.borderStrong }}>
            {agreed && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
          </div>
          <span className="text-xs font-semibold flex-1 text-left" style={{ color: C.text }}>
            위 내용을 확인했고, 모든 데이터가 영구 삭제됨에 동의합니다
          </span>
        </button>
      </div>
      <div className="sticky bottom-0 px-4 pb-6 pt-3 bg-white border-t" style={{ borderColor: C.border }}>
        <button disabled={!valid} onClick={onLogout}
          className="w-full h-14 rounded-2xl text-base font-bold text-white"
          style={{ background: C.red, opacity: valid ? 1 : 0.4 }}>
          계정 영구 삭제
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   카테고리 / 고정지출 관리
   ========================================================= */
function CategoryManage({ ctx }) {
  const { categories, navigate, addCategory, updateCategory, deleteCategory } = ctx;
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="fade-in min-h-screen" style={{ background: C.bg }}>
      <TopBar title="카테고리 관리" onBack={() => navigate('settings')}
        right={
          <button onClick={() => { setEditing(null); setShowForm(true); }} className="w-8 h-8 -mr-2 rounded-full flex items-center justify-center" style={{ background: C.blueLight }}>
            <Plus className="w-4 h-4" style={{ color: C.blue }} />
          </button>
        } />
      <div className="px-4 py-4">
        <div className="bg-white rounded-2xl p-2">
          {categories.map(c => {
            const Icon = getCategoryIcon(c.icon);
            return (
              <div key={c.id} className="flex items-center gap-3 p-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: c.color + '20' }}>
                  <Icon className="w-4 h-4" style={{ color: c.color }} strokeWidth={2.2} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: C.text }}>{c.name}</p>
                  <p className="text-[10px] font-medium" style={{ color: C.textMuted }}>{c.isIncome ? '수입' : '지출'}</p>
                </div>
                <button onClick={() => { setEditing(c); setShowForm(true); }} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100">
                  <Edit3 className="w-3.5 h-3.5" style={{ color: C.textSub }} />
                </button>
                <button onClick={() => { if (confirm(`"${c.name}" 삭제할까요?`)) deleteCategory(c.id); }}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-50">
                  <Trash2 className="w-3.5 h-3.5" style={{ color: C.red }} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
      {showForm && <CategoryFormModal editing={editing} onCancel={() => setShowForm(false)}
        onSave={(data) => { if (editing) updateCategory(editing.id, data); else addCategory(data); setShowForm(false); }} />}
    </div>
  );
}

function CategoryFormModal({ editing, onCancel, onSave }) {
  const [name, setName] = useState(editing?.name || '');
  const [color, setColor] = useState(editing?.color || '#FF6B6B');
  const [isIncome, setIsIncome] = useState(editing?.isIncome || false);
  const [icon, setIcon] = useState(editing?.icon || 'utensils');
  const colors = ['#FF6B6B', '#FFA94D', '#FFD600', '#51CF66', '#339AF0', '#845EF7', '#FF6B9D', C.text];
  const icons = ['utensils', 'car', 'home', 'heart', 'shopping', 'gamepad', 'briefcase', 'gift'];

  const save = () => {
    if (!name) return alert('이름을 입력해주세요');
    onSave({ name, color, isIncome, icon });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end z-50 fade-in" onClick={onCancel}>
      <div className="w-full max-w-md mx-auto bg-white rounded-t-3xl p-6 slide-in" onClick={e => e.stopPropagation()}>
        <h3 className="text-base font-bold mb-4" style={{ color: C.text }}>{editing ? '카테고리 수정' : '카테고리 추가'}</h3>
        <div className="space-y-3">
          <div className="rounded-2xl p-4" style={{ background: C.bg }}>
            <p className="text-xs font-bold mb-2" style={{ color: C.textSub }}>이름</p>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="예: 식비"
              className="w-full text-sm font-semibold outline-none bg-transparent" style={{ color: C.text }} />
          </div>
          <div className="rounded-2xl p-4" style={{ background: C.bg }}>
            <p className="text-xs font-bold mb-2" style={{ color: C.textSub }}>분류</p>
            <div className="grid grid-cols-2 gap-2">
              {[{ v: false, l: '지출' }, { v: true, l: '수입' }].map(o => (
                <button key={o.l} onClick={() => setIsIncome(o.v)} className="py-2 rounded-lg text-xs font-bold"
                  style={{ background: isIncome === o.v ? C.text : '#fff', color: isIncome === o.v ? '#fff' : C.textSub }}>{o.l}</button>
              ))}
            </div>
          </div>
          <div className="rounded-2xl p-4" style={{ background: C.bg }}>
            <p className="text-xs font-bold mb-2" style={{ color: C.textSub }}>색상</p>
            <div className="flex gap-2 flex-wrap">
              {colors.map(c => (
                <button key={c} onClick={() => setColor(c)} className="w-8 h-8 rounded-full"
                  style={{ background: c, outline: color === c ? `3px solid ${c}40` : 'none', outlineOffset: 2 }} />
              ))}
            </div>
          </div>
          <div className="rounded-2xl p-4" style={{ background: C.bg }}>
            <p className="text-xs font-bold mb-2" style={{ color: C.textSub }}>아이콘</p>
            <div className="flex gap-2 flex-wrap">
              {icons.map(i => {
                const I = getCategoryIcon(i);
                const sel = icon === i;
                return (
                  <button key={i} onClick={() => setIcon(i)} className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ background: sel ? color + '20' : '#fff', border: sel ? `1.5px solid ${color}` : '1.5px solid transparent' }}>
                    <I className="w-4 h-4" style={{ color: sel ? color : C.textMuted }} strokeWidth={2.2} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <button onClick={onCancel} className="h-12 rounded-xl text-sm font-bold" style={{ background: C.bg, color: C.text }}>취소</button>
          <button onClick={save} className="h-12 rounded-xl text-sm font-bold text-white" style={{ background: C.blue }}>저장</button>
        </div>
      </div>
    </div>
  );
}

function FixedManage({ ctx }) {
  const { fixed, navigate, addFixed, updateFixed, deleteFixed } = ctx;
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="fade-in min-h-screen" style={{ background: C.bg }}>
      <TopBar title="고정지출 관리" onBack={() => navigate('settings')}
        right={
          <button onClick={() => { setEditing(null); setShowForm(true); }} className="w-8 h-8 -mr-2 rounded-full flex items-center justify-center" style={{ background: C.blueLight }}>
            <Plus className="w-4 h-4" style={{ color: C.blue }} />
          </button>
        } />
      <div className="px-4 py-4">
        <div className="bg-white rounded-2xl p-2">
          {fixed.map(f => (
            <div key={f.id} className="flex items-center gap-3 p-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: C.bg }}>
                <CalendarIcon className="w-4 h-4" style={{ color: C.textSub }} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: C.text }}>{f.name}</p>
                <p className="text-[10px] font-medium" style={{ color: C.textMuted }}>매월 {f.day}일</p>
              </div>
              <p className="text-sm font-bold tabular-nums mr-2" style={{ color: C.text }}>{fmt(f.amount)}원</p>
              <button onClick={() => { setEditing(f); setShowForm(true); }} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100">
                <Edit3 className="w-3.5 h-3.5" style={{ color: C.textSub }} />
              </button>
              <button onClick={() => { if (confirm(`"${f.name}" 삭제할까요?`)) deleteFixed(f.id); }}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-50">
                <Trash2 className="w-3.5 h-3.5" style={{ color: C.red }} />
              </button>
            </div>
          ))}
        </div>
      </div>
      {showForm && <FixedFormModal editing={editing} onCancel={() => setShowForm(false)}
        onSave={(data) => { if (editing) updateFixed(editing.id, data); else addFixed(data); setShowForm(false); }} />}
    </div>
  );
}

function FixedFormModal({ editing, onCancel, onSave }) {
  const [name, setName] = useState(editing?.name || '');
  const [amount, setAmount] = useState(editing?.amount || 0);
  const [day, setDay] = useState(editing?.day || 1);

  const save = () => {
    if (!name || !amount) return alert('이름과 금액을 입력해주세요');
    onSave({ name, amount: Number(amount), day: Number(day) });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end z-50 fade-in" onClick={onCancel}>
      <div className="w-full max-w-md mx-auto bg-white rounded-t-3xl p-6 slide-in" onClick={e => e.stopPropagation()}>
        <h3 className="text-base font-bold mb-4" style={{ color: C.text }}>{editing ? '고정지출 수정' : '고정지출 추가'}</h3>
        <div className="space-y-3">
          <div className="rounded-2xl p-4" style={{ background: C.bg }}>
            <p className="text-xs font-bold mb-2" style={{ color: C.textSub }}>이름</p>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="예: 월세"
              className="w-full text-sm font-semibold outline-none bg-transparent" style={{ color: C.text }} />
          </div>
          <div className="rounded-2xl p-4" style={{ background: C.bg }}>
            <p className="text-xs font-bold mb-2" style={{ color: C.textSub }}>금액</p>
            <div className="flex items-baseline gap-2">
              <input type="number" value={amount || ''} onChange={e => setAmount(e.target.value)} placeholder="0"
                className="text-xl font-extrabold tabular-nums outline-none flex-1 min-w-0 bg-transparent" style={{ color: C.text }} />
              <span className="text-sm font-bold" style={{ color: C.textSub }}>원</span>
            </div>
          </div>
          <div className="rounded-2xl p-4" style={{ background: C.bg }}>
            <p className="text-xs font-bold mb-2" style={{ color: C.textSub }}>매월</p>
            <div className="flex items-baseline gap-2">
              <input type="number" min="1" max="31" value={day} onChange={e => setDay(e.target.value)}
                className="text-xl font-extrabold tabular-nums outline-none flex-1 min-w-0 bg-transparent" style={{ color: C.text }} />
              <span className="text-sm font-bold" style={{ color: C.textSub }}>일</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <button onClick={onCancel} className="h-12 rounded-xl text-sm font-bold" style={{ background: C.bg, color: C.text }}>취소</button>
          <button onClick={save} className="h-12 rounded-xl text-sm font-bold text-white" style={{ background: C.blue }}>저장</button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   공통 컴포넌트
   ========================================================= */
function FloatingInput({ label, value, onChange, type = 'text', placeholder, right, autoFocus, maxLength }) {
  const [focus, setFocus] = useState(false);
  return (
    <div className="rounded-2xl px-4 py-3 transition-all"
      style={{ background: C.bg, outline: focus ? `2px solid ${C.blue}` : 'none' }}>
      <p className="text-[10px] font-bold mb-0.5" style={{ color: focus ? C.blue : C.textMuted }}>{label}</p>
      <div className="flex items-center">
        <input value={value} onChange={e => onChange(e.target.value)} type={type} placeholder={placeholder}
          autoFocus={autoFocus} maxLength={maxLength}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          className="flex-1 text-base font-bold outline-none bg-transparent" style={{ color: C.text }} />
        {right}
      </div>
    </div>
  );
}

function RuleCheck({ ok, text }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: ok ? C.blue : C.borderStrong }}>
        <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
      </div>
      <span className="text-xs font-semibold" style={{ color: ok ? C.text : C.textMuted }}>{text}</span>
    </div>
  );
}

function FieldCard({ label, children, required, disabled }) {
  return (
    <div className="bg-white rounded-2xl p-4" style={{ opacity: disabled ? 0.6 : 1 }}>
      <div className="flex items-center gap-1 mb-2">
        <p className="text-xs font-bold" style={{ color: C.textSub }}>{label}</p>
        {required && <span className="text-xs font-bold" style={{ color: C.red }}>*</span>}
      </div>
      {children}
    </div>
  );
}

function FieldSelect({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const sel = options.find(o => o.value === value);
  return (
    <div className="bg-white rounded-2xl p-4">
      <p className="text-xs font-bold mb-2" style={{ color: C.textSub }}>{label}</p>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between">
        <span className="text-sm font-semibold" style={{ color: C.text }}>{sel?.label || '선택'}</span>
        <ChevronDown className="w-4 h-4 transition-transform" style={{ color: C.textMuted, transform: open ? 'rotate(180deg)' : 'none' }} />
      </button>
      {open && (
        <div className="mt-3 -mx-2 overflow-hidden rounded-xl" style={{ border: `1px solid ${C.border}` }}>
          {options.map(o => (
            <button key={o.value} onClick={() => { onChange(o.value); setOpen(false); }}
              className="w-full px-3 py-2.5 text-left text-sm font-semibold hover:bg-gray-50 flex items-center justify-between"
              style={{ color: o.value === value ? C.blue : C.text }}>
              <span>{o.label}</span>
              {o.value === value && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function FieldSelectCard({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const sel = options.find(o => o.value === value);
  return (
    <div className="bg-white rounded-2xl p-4">
      <p className="text-xs font-bold mb-2" style={{ color: C.textSub }}>{label}</p>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between">
        <span className="text-base font-bold" style={{ color: C.text }}>{sel?.label}</span>
        <ChevronDown className="w-4 h-4 transition-transform" style={{ color: C.textMuted, transform: open ? 'rotate(180deg)' : 'none' }} />
      </button>
      {open && (
        <div className="mt-3 -mx-2 overflow-hidden rounded-xl border" style={{ borderColor: C.border }}>
          {options.map(o => (
            <button key={o.value} onClick={() => { onChange(o.value); setOpen(false); }}
              className="w-full px-3 py-3 text-left text-sm font-bold hover:bg-gray-50 flex items-center justify-between"
              style={{ color: o.value === value ? C.blue : C.text }}>
              <span>{o.label}</span>
              {o.value === value && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ConfirmModal({ title, desc, onCancel, onConfirm, confirmLabel = '삭제', confirmColor = C.red }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-6 fade-in" onClick={onCancel}>
      <div className="w-full max-w-sm bg-white rounded-3xl p-6" onClick={e => e.stopPropagation()}>
        <div className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center" style={{ background: confirmColor === C.red ? C.redLight : C.bg }}>
          {confirmColor === C.red
            ? <Trash2 className="w-6 h-6" style={{ color: C.red }} strokeWidth={2.2} />
            : <AlertCircle className="w-6 h-6" style={{ color: C.text }} strokeWidth={2.2} />}
        </div>
        <h3 className="text-base font-bold text-center mb-1" style={{ color: C.text }}>{title}</h3>
        <p className="text-xs text-center mb-5" style={{ color: C.textMuted }}>{desc}</p>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={onCancel} className="h-12 rounded-xl text-sm font-bold" style={{ background: C.bg, color: C.text }}>취소</button>
          <button onClick={onConfirm} className="h-12 rounded-xl text-sm font-bold text-white" style={{ background: confirmColor }}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
