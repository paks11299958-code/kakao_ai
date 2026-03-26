/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Bell, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Smartphone, 
  Menu, 
  X,
  Loader2,
  LogIn,
  Phone,
  Lock
} from 'lucide-react';

// Mock data for initial load or if GAS URL is not provided
const MOCK_DATA = {
  memberCount: 1248,
  recentMembers: [
    { name: '김*', status: '활성', timestamp: '2분 전' },
    { name: '이*', status: '활성', timestamp: '5분 전' },
    { name: '박*', status: '활성', timestamp: '12분 전' },
    { name: '최*', status: '활성', timestamp: '20분 전' },
    { name: '정*', status: '활성', timestamp: '45분 전' },
  ],
  recentConsultations: [
    { name: '한*', content: '[마스킹 처리됨]에 대해 문의하셨습니다...', timestamp: '방금 전' },
    { name: '송*', content: '[마스킹 처리됨]에 대해 문의하셨습니다...', timestamp: '3분 전' },
    { name: '윤*', content: '[마스킹 처리됨]에 대해 문의하셨습니다...', timestamp: '10분 전' },
    { name: '장*', content: '[마스킹 처리됨]에 대해 문의하셨습니다...', timestamp: '15분 전' },
    { name: '임*', content: '[마스킹 처리됨]에 대해 문의하셨습니다...', timestamp: '25분 전' },
  ]
};

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [liveData, setLiveData] = useState(MOCK_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', password: '' });
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginData, setLoginData] = useState({ phone: '', password: '' });
  const loginRef = useRef<HTMLDivElement>(null);

  // 로그인 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (loginRef.current && !loginRef.current.contains(e.target as Node)) {
        setIsLoginOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`로그인 시도: ${loginData.phone}`);
    // TODO: 실제 로그인 로직 구현
  };

  // Google Apps Script Web App URL from environment variables
  const GAS_URL = import.meta.env.VITE_GAS_URL;

  const fetchLiveData = async () => {
    if (!GAS_URL) return;
    try {
      const response = await fetch(GAS_URL);
      if (response.ok) {
        const data = await response.json();
        setLiveData(data);
      }
    } catch (error) {
      console.error('실시간 데이터를 가져오는데 실패했습니다:', error);
    }
  };
/*
  useEffect(() => {
    fetchLiveData();
    const interval = setInterval(fetchLiveData, 10000); // 10초마다 업데이트
    return () => clearInterval(interval);
  }, [GAS_URL]);
*/
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
  // 시트에서 0이 사라지지 않게 번호 앞에 ' 를 붙이고 010 확인
  const formattedPhone = formData.phone.startsWith('0') 
    ? `'${formData.phone}` 
    : `'0${formData.phone}`;

  const submissionData = { 
    ...formData, 
    phone: formattedPhone // 가공된 번호로 교체
  };
    
    if (!GAS_URL) {
      alert('Google Apps Script URL이 설정되지 않았습니다. .env 파일에 VITE_GAS_URL을 추가해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        mode: 'no-cors', // GAS POST 요청은 종종 no-cors가 필요할 수 있음 (리다이렉션 때문)
        headers: {
          'Content-Type': 'application/json',
        },
       // body: JSON.stringify(formData),
        body: JSON.stringify(submissionData),
      });

      // no-cors 모드에서는 response.ok를 확인할 수 없으므로 성공으로 간주
      setSubmitSuccess(true);
      // 폼 데이터 초기화 (password 추가)
  setFormData({ name: '', phone: '', password: '' });
     // fetchLiveData(); // 가입 후 데이터 갱신
    } catch (error) {
      console.error('가입 신청 중 오류가 발생했습니다:', error);
      alert('가입 신청 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitSuccess(false), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
              <MessageSquare size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">상담톡<span className="text-red-600">AI</span></span>
          </div>
          
          <div className="hidden md:flex md:items-center md:gap-3">
            <a href="#features" className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition-all hover:shadow-lg active:scale-95">주요 기능</a>
            <a href="#dashboard" className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition-all hover:shadow-lg active:scale-95">실시간 현황</a>
            <a href="#register" className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition-all hover:shadow-lg active:scale-95">회원가입 신청</a>
            <div className="relative" ref={loginRef}>
              <button 
                onClick={() => setIsLoginOpen(!isLoginOpen)}
                className="flex items-center gap-1.5 rounded-full bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-slate-900 transition-all hover:shadow-lg active:scale-95"
              >
                <LogIn size={16} />
                로그인
              </button>
              <AnimatePresence>
                {isLoginOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-72 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl"
                  >
                    <h3 className="text-base font-bold text-slate-900">로그인</h3>
                    <form onSubmit={handleLogin} className="mt-4 space-y-3">
                      <div>
  <label htmlFor="phone" className="block text-sm font-bold text-slate-700">연락처</label>
  <input
    type="tel"               // 전화번호 타입 유지
    inputMode="numeric"      // 모바일에서 숫자 키패드가 바로 뜨게 함
    id="phone"
    required
    value={formData.phone}
    // 🔥 아래 onChange 부분이 핵심입니다!
    onChange={(e) => {
      const onlyNumber = e.target.value.replace(/[^0-9]/g, ''); // 숫자가 아닌 모든 문자 제거
      setFormData({ ...formData, phone: onlyNumber });
    }}
    className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
    placeholder="숫자만 입력해주세요 (예: 01012345678)" // 하이픈 없이 안내하는 게 좋습니다.
    maxLength={11}           // 최대 11자리까지만 입력 가능하게 제한
  />
</div>
                      <div className="relative">
                        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="password"
                          placeholder="암호"
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-md hover:bg-indigo-700 transition-all active:scale-[0.98]"
                      >
                        로그인
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <button 
            className="md:hidden text-slate-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-slate-100 bg-white px-4 py-6"
            >
              <div className="flex flex-col gap-4">
                <a href="#features" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-slate-600">주요 기능</a>
                <a href="#dashboard" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-slate-600">실시간 현황</a>
                <a href="#register" onClick={() => setIsMenuOpen(false)} className="rounded-xl bg-indigo-600 py-4 text-center text-lg font-bold text-white">회원가입 신청</a>
                <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <h4 className="text-base font-bold text-slate-900">로그인</h4>
                  <form onSubmit={handleLogin} className="mt-3 space-y-3">
                    <div className="relative">
                      <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="tel"
                        placeholder="전화번호"
                        value={loginData.phone}
                        onChange={(e) => setLoginData({ ...loginData, phone: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        required
                      />
                    </div>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="password"
                        placeholder="암호"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white hover:bg-indigo-700 transition-all"
                    >
                      로그인
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,rgba(79,70,229,0.05)_0%,transparent_100%)]" />
          <div className="mx-auto max-w-7xl text-center">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-bold text-indigo-600 ring-1 ring-inset ring-indigo-200">
                차세대 AI 고객센터 솔루션
              </span>
              <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
                고객 응대의 자동화, <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">상담톡AI로 시작하세요</span>
              </h1>
              <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl">
                카카오톡 채널 연동을 통해 고객 문의에 즉각적으로 대응합니다.
                관리자에게는 실시간 알림을, 고객에게는 완벽한 상담 경험을 제공합니다.
              </p>
              <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
  {/* 1. 지금 회원가입 하기 (기본) */}
  <a 
    href="#register" 
    className="group flex items-center gap-2 rounded-full bg-indigo-600 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-indigo-300 active:scale-95"
  >
    지금 회원가입 하기
    <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
  </a>

  {/* 2. 추가된 AI상담 테스트 버튼 (카카오톡 연결) */}
  <a 
    href="http://pf.kakao.com/_dhMqK/chat" 
    target="_blank" 
    rel="noopener noreferrer"
    className="flex items-center gap-2 rounded-full bg-emerald-500 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-emerald-200 transition-all hover:bg-emerald-600 hover:shadow-emerald-300 active:scale-95"
  >
    <MessageSquare size={20} />
    AI상담 테스트
  </a>

  {/* 3. 실시간 현황 보기 (기본) */}
  <a 
    href="#dashboard" 
    className="rounded-full bg-white px-8 py-4 text-lg font-bold text-slate-600 ring-1 ring-slate-200 transition-all hover:bg-slate-50 active:scale-95"
  >
    실시간 현황 보기
  </a>
</div>
            </motion.div>
          </div>
        </section>

        {/* Live Dashboard Section */}
        <section id="dashboard" className="bg-slate-900 py-24 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-16 lg:grid-cols-2">
              {/* Registration Status */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex flex-col justify-center"
              >
                <div className="flex items-center gap-3 text-indigo-400">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-indigo-400" />
                  <span className="text-sm font-bold uppercase tracking-widest">실시간 회원 가입 현황</span>
                </div>
                <h2 className="mt-4 text-3xl font-bold sm:text-4xl">전국의 수많은 기업들이 <br />상담톡AI를 신뢰합니다</h2>
                
                <div className="mt-10 grid grid-cols-2 gap-6">
                  <div className="rounded-2xl border border-slate-800 bg-slate-800/50 p-6">
                    <div className="text-4xl font-black text-indigo-400">{liveData.memberCount.toLocaleString()}+</div>
                    <div className="mt-1 text-sm font-medium text-slate-400">누적 회원수</div>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-800/50 p-6">
                    <div className="text-4xl font-black text-emerald-400">99.9%</div>
                    <div className="mt-1 text-sm font-medium text-slate-400">서비스 가동률</div>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <h4 className="text-sm font-bold text-slate-500 uppercase">최근 가입 현황</h4>
                  <div className="h-64 overflow-hidden rounded-xl relative">
                    <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-slate-900 to-transparent z-10 pointer-events-none" />
                    <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-slate-900 to-transparent z-10 pointer-events-none" />
                    <div className="animate-scroll-up space-y-3">
                      {[...liveData.recentMembers, ...liveData.recentMembers].map((member, i) => (
                        <div key={i} className="flex items-center justify-between rounded-xl bg-slate-800/30 p-4 ring-1 ring-slate-800">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-900/50 text-indigo-400">
                              <Users size={14} />
                            </div>
                            <span className="font-medium">{member.name} 님</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-xs font-bold text-emerald-500">{member.status}</span>
                            <span className="text-xs text-slate-500">{member.timestamp}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Live Inquiry Feed */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative rounded-3xl border border-slate-800 bg-slate-800/50 p-8 shadow-2xl"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600">
                      <MessageSquare size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold">실시간 상담 피드</h3>
                      <p className="text-xs text-slate-400">AI가 실시간으로 응대 중입니다</p>
                    </div>
                  </div>
                  <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-bold text-emerald-500 ring-1 ring-inset ring-emerald-500/20">
                    LIVE
                  </div>
                </div>

                <div className="mt-8 h-72 overflow-hidden rounded-xl relative">
                  <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-slate-800/80 to-transparent z-10 pointer-events-none" />
                  <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-slate-800/80 to-transparent z-10 pointer-events-none" />
                  <div className="animate-scroll-up space-y-3">
                    {[...liveData.recentConsultations, ...liveData.recentConsultations].map((item, i) => (
                      <div key={i} className="flex items-center justify-between rounded-xl bg-slate-900/60 p-4 ring-1 ring-slate-700">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-900/50 text-indigo-400">
                            <MessageSquare size={14} />
                          </div>
                          <div>
                            <span className="font-medium">{item.name} 님</span>
                            <p className="text-xs text-slate-400 mt-0.5">{item.content}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                          <span className="text-xs font-bold text-emerald-500">응대완료</span>
                          <span className="text-xs text-slate-500">{item.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex items-center gap-2 rounded-xl bg-indigo-900/20 p-4 text-xs text-indigo-300 ring-1 ring-indigo-500/20">
                  <ShieldCheck size={16} />
                  <span>개인정보 보호를 위해 실제 상담 내용은 마스킹 처리되어 표시됩니다.</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">상담톡AI의 특별함</h2>
              <p className="mt-4 text-lg text-slate-600">비즈니스 효율을 극대화하는 강력한 기능들을 확인하세요.</p>
            </div>

            <div className="mt-20 grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: '24/7 자동 응대',
                  desc: '고객의 문의에 365일 24시간 쉬지 않고 즉각적으로 답변합니다.',
                  icon: MessageSquare,
                  color: 'bg-yellow-50 text-yellow-600'
                },
                {
                  title: '스마트 알림 시스템',
                  desc: '중요한 문의나 직접 응대가 필요한 경우 관리자에게 즉시 알림을 보냅니다.',
                  icon: Bell,
                  color: 'bg-rose-50 text-rose-600'
                },
                {
                  title: '강력한 보안 및 프라이버시',
                  desc: '모든 상담 데이터는 암호화되어 안전하게 관리되며 개인정보를 철저히 보호합니다.',
                  icon: ShieldCheck,
                  color: 'bg-emerald-50 text-emerald-600'
                },
                {
                  title: '실시간 데이터 동기화',
                  desc: '상담 내역과 회원 정보를 실시간으로 기록하여 효율적인 관리가 가능합니다.',
                  icon: Users,
                  color: 'bg-blue-50 text-blue-600'
                },
                {
                  title: '간편한 연동',
                  desc: '복잡한 설정 없이 기존 카카오톡 채널과 빠르게 연동할 수 있습니다.',
                  icon: Zap,
                  color: 'bg-indigo-50 text-indigo-600'
                },
                {
                  title: '모바일 최적화 관리',
                  desc: '언제 어디서나 모바일로 실시간 현황을 확인하고 관리할 수 있습니다.',
                  icon: Smartphone,
                  color: 'bg-slate-50 text-slate-600'
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group rounded-3xl border border-slate-200 bg-white p-8 transition-all hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100"
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${feature.color}`}>
                    <feature.icon size={24} />
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-slate-900">{feature.title}</h3>
                  <p className="mt-3 leading-relaxed text-slate-600">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Registration Form Section */}
        <section id="register" className="relative py-24 bg-white border-t border-slate-200">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-slate-50 p-8 shadow-inner sm:p-12 border border-slate-200">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-slate-900">상담톡AI 회원가입 신청</h2>
                <p className="mt-4 text-slate-600">지금 바로 아래 양식을 작성하여 혁신적인 고객 서비스를 경험하세요.</p>
              </div>

              <form onSubmit={handleSubmit} className="mt-10 space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-bold text-slate-700">성함 / 업체명</label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    placeholder="성함 또는 업체명을 입력해주세요"
                  />
                </div>
                <div>
 <label htmlFor="phone" className="block text-sm font-bold text-slate-700">연락처</label>
<input
  type="tel"
  id="phone"
  required
  value={formData.phone}
  // 🔥 이 부분을 아래와 같이 수정하세요
  onChange={(e) => {
    // 숫자가 아닌 모든 문자(한글, 영어 등)를 즉시 제거합니다.
    const onlyNumber = e.target.value.replace(/[^0-9]/g, '');
    setFormData({ ...formData, phone: onlyNumber });
  }}
  inputMode="numeric" // 모바일에서 숫자 키패드가 기본으로 뜨게 합니다.
  maxLength={11}      // 최대 11자리까지만 입력 가능하게 제한합니다.
  className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
  placeholder="01012345678 (숫자만 입력)"
/>      
</div>

{/* 암호 입력 필드 추가 */}
<div>
  <label htmlFor="password" className="block text-sm font-bold text-slate-700">상담 확인용 암호</label>
  <input
    type="password"
    id="password"
    required
    value={formData.password}
    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
    className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
    placeholder="암호를 입력해주세요"
  />
</div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="relative flex w-full items-center justify-center rounded-xl bg-indigo-600 py-5 text-lg font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    '무료 상담 신청하기'
                  )}
                </button>

                <AnimatePresence>
                  {submitSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 py-4 text-emerald-700 ring-1 ring-emerald-200"
                    >
                      <CheckCircle2 size={20} />
                      <span className="font-bold">신청이 완료되었습니다! 곧 연락드리겠습니다.</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>

              <p className="mt-8 text-center text-xs text-slate-400">
                등록 시 서비스 이용약관 및 개인정보 처리방침에 동의하게 됩니다.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <MessageSquare size={18} />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">상담톡<span className="text-red-600">AI</span></span>
            </div>
            
            <div className="flex gap-8 text-sm font-medium text-slate-500">
              <a href="#register" className="text-indigo-600 font-bold">회원가입 신청</a>
              <a href="#" className="hover:text-indigo-600">개인정보 처리방침</a>
              <a href="#" className="hover:text-indigo-600">이용약관</a>
              <a href="#" className="hover:text-indigo-600">문의하기</a>
            </div>

            <div className="text-right">
              <p className="text-sm font-bold text-slate-900">DBZone Managed Services Inc.</p>
              <p className="text-xs text-slate-500 mt-1">충청북도 청주시 흥덕구 오송</p>
              <p className="text-[10px] text-slate-400 mt-2">
                © 2026 DBZone Managed Services Inc. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
