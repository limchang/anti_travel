import React, { useState, useEffect, useMemo } from 'react';
import {
  Navigation, MessageSquare, RotateCcw,
  Hourglass, ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
  ArrowUpRight, ArrowUpLeft, ArrowDownRight, ArrowDownLeft,
  PlusCircle, Waves, QrCode, CheckSquare, Square,
  Plus, Minus, MapPin, Trash2, Map as MapIcon,
  ChevronsRight, Sparkles, Undo2, CornerDownRight, GitBranch, Umbrella, ArrowLeftRight, Store, PlusSquare, FileText, Clock, Lock, Unlock, ChevronLeft, ChevronRight, Timer, Banknote, Anchor, Pin, Utensils, Coffee, Camera, Bed, Receipt, ChevronDown, Package, Eye, Star
} from 'lucide-react';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  // 초기 상태 안전하게 설정
  const [itinerary, setItinerary] = useState({ days: [] });
  const [history, setHistory] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [lastAction, setLastAction] = useState("3일차 시작 일정이 수정되었습니다.");
  const [aiSuggestions, setAiSuggestions] = useState({});
  const [activeDay, setActiveDay] = useState(1);
  const [routeCache, setRouteCache] = useState({});
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);


  const MAX_BUDGET = 1500000;
  const FUEL_PRICE_PER_LITER = 1700;
  const CAR_EFFICIENCY = 13;
  // 코드 오류 수정 및 3일차 일정 변경 키
  const STORAGE_KEY = 'travel_planner_v105_fix_syntax_day3';
  const TIME_UNIT = 5;

  const calculateFuelCost = (km) => Math.round((km / CAR_EFFICIENCY) * FUEL_PRICE_PER_LITER);

  const timeToMinutes = (timeStr) => {
    if (!timeStr || typeof timeStr !== 'string') return 0;
    const parts = timeStr.split(':');
    if (parts.length < 2) return 0;
    const hrs = parseInt(parts[0], 10);
    const mins = parseInt(parts[1], 10);
    return (isNaN(hrs) ? 0 : hrs) * 60 + (isNaN(mins) ? 0 : mins);
  };

  const minutesToTime = (minutes) => {
    if (typeof minutes !== 'number' || isNaN(minutes)) return "00:00";
    let h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h >= 24) h = h % 24;
    if (h < 0) h = 24 + (h % 24);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const getPlanLabel = (index) => `Plan ${String.fromCharCode(66 + index)}`;

  const saveHistory = () => {
    setHistory(prev => {
      try {
        const newHistory = [...prev, JSON.parse(JSON.stringify(itinerary))];
        return newHistory.slice(-20);
      } catch (e) { return prev; }
    });
  };

  const handleUndo = () => {
    if (history.length === 0) {
      setLastAction("되돌릴 작업이 없습니다.");
      return;
    }
    const previousState = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setItinerary(previousState);
    setLastAction("이전 상태로 복구했습니다.");
  };

  const recalculateSchedule = (dayPlan) => {
    if (!Array.isArray(dayPlan)) return [];

    let currentEndMinutes = 0;
    let lastMainItemIndex = -1;

    for (let i = 0; i < dayPlan.length; i++) {
      const currentItem = dayPlan[i];
      if (!currentItem || currentItem.type === 'backup') continue;

      if (lastMainItemIndex === -1) {
        const waiting = currentItem.waitingTime || 0;
        currentEndMinutes = timeToMinutes(currentItem.time) + waiting + (currentItem.duration || 0);
        lastMainItemIndex = i;
        continue;
      }

      const travelStr = currentItem.travelTimeOverride || '15분';
      const travelMatches = travelStr.match(/(\d+)/);
      const travelMinutes = travelMatches ? parseInt(travelMatches[0], 10) : 15;
      const waiting = currentItem.waitingTime || 0;

      const naturalArrivalMinutes = currentEndMinutes + travelMinutes;

      if (currentItem.isTimeFixed) {
        const fixedStartMinutes = timeToMinutes(currentItem.time);
        const requiredArrivalMinutes = fixedStartMinutes - waiting;
        const diff = requiredArrivalMinutes - naturalArrivalMinutes;

        if (diff !== 0 && lastMainItemIndex !== -1) {
          const prevItem = dayPlan[lastMainItemIndex];
          const oldDuration = prevItem.duration || 0;
          const newDuration = Math.max(0, oldDuration + diff);
          prevItem.duration = newDuration;

          const actualDiff = newDuration - oldDuration;
          currentEndMinutes += actualDiff;
        }
      } else {
        const actualStartMinutes = naturalArrivalMinutes + waiting;
        currentItem.time = minutesToTime(actualStartMinutes);
      }

      const currentStartMinutes = timeToMinutes(currentItem.time);
      const currentWaiting = currentItem.waitingTime || 0;
      currentEndMinutes = currentStartMinutes + currentWaiting + (currentItem.duration || 0);
      lastMainItemIndex = i;
    }
    return dayPlan;
  };

  const updateStartTime = (dayIdx, pIdx, delta) => {
    saveHistory();
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const dayPlan = nextData.days[dayIdx].plan;
      const item = dayPlan[pIdx];

      const currentMinutes = timeToMinutes(item.time);
      item.time = minutesToTime(currentMinutes + delta);
      item.isTimeFixed = true;

      nextData.days[dayIdx].plan = recalculateSchedule(dayPlan);
      return nextData;
    });
    setLastAction("시작 시간을 조정했습니다.");
  };

  const updateDuration = (dayIdx, pIdx, delta) => {
    saveHistory();
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const dayPlan = nextData.days[dayIdx].plan;
      const item = dayPlan[pIdx];

      item.duration = Math.max(0, (item.duration || 0) + delta);
      nextData.days[dayIdx].plan = recalculateSchedule(dayPlan);
      return nextData;
    });
    setLastAction("소요 시간을 변경했습니다.");
  };

  const resetDuration = (dayIdx, pIdx) => {
    saveHistory();
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const dayPlan = nextData.days[dayIdx].plan;
      const item = dayPlan[pIdx];

      item.duration = 60;
      nextData.days[dayIdx].plan = recalculateSchedule(dayPlan);
      return nextData;
    });
    setLastAction("소요 시간을 60분으로 초기화했습니다.");
  };

  const updateWaitingTime = (dayIdx, pIdx, delta) => {
    saveHistory();
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const dayPlan = nextData.days[dayIdx].plan;
      const item = dayPlan[pIdx];

      item.waitingTime = Math.max(0, (item.waitingTime || 0) + delta);
      if (item.waitingTime === 0) delete item.waitingTime;

      nextData.days[dayIdx].plan = recalculateSchedule(dayPlan);
      return nextData;
    });

    if (delta > 0) setLastAction("대기 시간을 추가했습니다.");
    else setLastAction("대기 시간을 줄였습니다.");
  };

  const updateTravelTime = (dayIdx, pIdx, delta) => {
    saveHistory();
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const dayPlan = nextData.days[dayIdx].plan;
      const item = dayPlan[pIdx];

      const currentStr = item.travelTimeOverride || '15분';
      const match = currentStr.match(/(\d+)/);
      let minutes = match ? parseInt(match[0], 10) : 15;

      minutes = Math.max(0, minutes + delta);
      item.travelTimeOverride = `${minutes}분`;

      nextData.days[dayIdx].plan = recalculateSchedule(dayPlan);
      return nextData;
    });
    setLastAction("이동 시간을 조정했습니다.");
  };

  const toggleTimeFix = (dayIdx, pIdx) => {
    saveHistory();
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const item = nextData.days[dayIdx].plan[pIdx];

      item.isTimeFixed = !item.isTimeFixed;
      if (!item.isTimeFixed) {
        nextData.days[dayIdx].plan = recalculateSchedule(nextData.days[dayIdx].plan);
      }
      return nextData;
    });
    setLastAction(itinerary.days[dayIdx].plan[pIdx].isTimeFixed ? "시간이 고정되었습니다." : "시간 고정이 해제되었습니다.");
  };

  const budgetSummary = useMemo(() => {
    let totalSpent = 0;
    if (!itinerary || !itinerary.days) return { total: 0, remaining: MAX_BUDGET };
    itinerary.days.forEach(day => {
      day.plan?.forEach(p => {
        if (p.state !== 'unconfirmed' && p.type !== 'backup') {
          totalSpent += Number(p.price || 0);
          if (p.distance) totalSpent += calculateFuelCost(p.distance);
        }
      });
    });
    return { total: totalSpent, remaining: MAX_BUDGET - totalSpent };
  }, [itinerary]);

  const updateMemo = (dayIdx, pIdx, value) => {
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      nextData.days[dayIdx].plan[pIdx].memo = value;
      return nextData;
    });
  };

  const updateActivityName = (dayIdx, pIdx, value) => {
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      nextData.days[dayIdx].plan[pIdx].activity = value;
      return nextData;
    });
  };

  const updateMenuData = (dayIdx, pIdx, menuIdx, field, value) => {
    saveHistory();
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const planItem = nextData.days[dayIdx].plan[pIdx];
      const items = planItem.receipt?.items || [];
      const target = items[menuIdx];

      if (!target) return nextData;

      if (field === 'toggle') {
        target.selected = !target.selected;
        if (target.selected && (target.qty || 0) === 0) target.qty = 1;
      } else if (field === 'qty') {
        target.qty = Math.max(0, (target.qty || 0) + value);
        target.selected = target.qty > 0;
      } else if (field === 'qty_direct') {
        const numVal = parseInt(value, 10);
        target.qty = isNaN(numVal) ? 0 : Math.max(0, numVal);
        target.selected = target.qty > 0;
      } else if (field === 'name') {
        target.name = value;
      } else if (field === 'price') {
        target.price = value === '' ? 0 : Number(value);
      }

      planItem.price = items.reduce((sum, m) =>
        sum + (m.selected ? (Number(m.price || 0) * (Number(m.qty || 0))) : 0), 0
      );
      return nextData;
    });
    setLastAction("메뉴 정보가 저장되었습니다.");
  };

  const addMenuItem = (dayIdx, pIdx) => {
    saveHistory();
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const planItem = nextData.days[dayIdx].plan[pIdx];
      if (!planItem.receipt) planItem.receipt = { address: '', items: [] };
      if (!planItem.receipt.items) planItem.receipt.items = [];
      planItem.receipt.items.push({ name: "새 메뉴", price: 0, qty: 1, selected: true });
      return nextData;
    });
  };

  const addPlanB = (dayIdx, pIdx) => {
    saveHistory();
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const targetItem = nextData.days[dayIdx].plan[pIdx];

      if (!targetItem.alternatives) {
        targetItem.alternatives = [];
      }

      targetItem.alternatives.push({
        activity: '새로운 플랜',
        price: 0,
        memo: ''
      });
      return nextData;
    });
    setLastAction("플랜 B가 추가되었습니다.");
  };

  const removeAlternative = (dayIdx, pIdx, altIdx) => {
    saveHistory();
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const targetItem = nextData.days[dayIdx].plan[pIdx];
      if (targetItem.alternatives) {
        targetItem.alternatives.splice(altIdx, 1);
      }
      return nextData;
    });
    setLastAction("플랜이 삭제되었습니다.");
  };

  const swapAlternative = (dayIdx, pIdx, altIdx) => {
    saveHistory();
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const item = nextData.days[dayIdx].plan[pIdx];

      if (!item.alternatives || !item.alternatives[altIdx]) return nextData;

      const alt = item.alternatives[altIdx];

      const tempActivity = item.activity;
      const tempPrice = item.price;
      const tempMemo = item.memo || '';
      const tempTypes = item.types;

      item.activity = alt.activity;
      item.price = alt.price;
      item.memo = alt.memo;
      item.types = alt.types || ['place'];

      alt.activity = tempActivity;
      alt.price = tempPrice;
      alt.memo = tempMemo;
      alt.types = tempTypes;

      if (item.state === 'confirmed') item.state = 'assumed';

      item.receipt = {
        address: '주소 정보 없음',
        items: [{ name: '기본 항목', price: item.price, qty: 1, selected: true }]
      };

      return nextData;
    });
    setLastAction("플랜을 교체했습니다.");
  };

  const updateAlternative = (dayIdx, pIdx, altIdx, field, value) => {
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const alt = nextData.days[dayIdx].plan[pIdx].alternatives[altIdx];
      if (alt) {
        if (field === 'price') alt.price = value === '' ? 0 : Number(value);
        else alt[field] = value;
      }
      return nextData;
    });
  };

  const deleteMenuItem = (dayIdx, pIdx, menuIdx) => {
    saveHistory();
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const planItem = nextData.days[dayIdx].plan[pIdx];
      if (planItem.receipt && planItem.receipt.items) {
        planItem.receipt.items.splice(menuIdx, 1);
        planItem.price = planItem.receipt.items.reduce((sum, m) =>
          sum + (m.selected ? (Number(m.price || 0) * (Number(m.qty || 0))) : 0), 0
        );
      }
      return nextData;
    });
  };

  const deletePlanItem = (dayIdx, pIdx) => {
    saveHistory();
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      nextData.days[dayIdx].plan.splice(pIdx, 1);
      nextData.days[dayIdx].plan = recalculateSchedule(nextData.days[dayIdx].plan);
      return nextData;
    });
    setLastAction("일정이 삭제되었습니다.");
  };

  const toggleReceipt = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const cycleStatus = (dayIdx, pIdx, e) => {
    e.stopPropagation();
    saveHistory();
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const item = nextData.days[dayIdx].plan[pIdx];
      const states = ['unconfirmed', 'assumed', 'confirmed'];
      const currentIdx = states.indexOf(item.state || 'unconfirmed');
      item.state = states[(currentIdx + 1) % 3];
      return nextData;
    });
  };

  const getStateStyles = (state) => {
    switch (state) {
      case 'confirmed': return 'border-[#00D082] bg-white ring-1 ring-emerald-50 shadow-sm';
      case 'assumed': return 'border-[#F97316] bg-white ring-1 ring-orange-50 shadow-sm';
      default: return 'border-[#E5E8EB] bg-white text-[#8B95A1] opacity-70';
    }
  };

  const getCategoryBadge = (type) => {
    const style = "flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border shrink-0";
    switch (type) {
      case 'food': return <div key={type} className={`${style} text-rose-500 bg-red-50 border-red-100`}><Utensils size={10} /> 식당</div>;
      case 'cafe': return <div key={type} className={`${style} text-amber-600 bg-amber-50 border-amber-100`}><Coffee size={10} /> 카페</div>;
      case 'tour': return <div key={type} className={`${style} text-purple-600 bg-purple-50 border-purple-100`}><Camera size={10} /> 관광</div>;
      case 'lodge': return <div key={type} className={`${style} text-indigo-600 bg-indigo-50 border-indigo-100`}><Bed size={10} /> 숙소</div>;
      case 'ship': return <div key={type} className={`${style} text-blue-600 bg-blue-50 border-blue-100`}><Anchor size={10} /> 선박</div>;
      case 'openrun': return <div key={type} className={`${style} text-red-500 bg-red-50 border-red-100`}><Timer size={10} /> 오픈런</div>;
      case 'view': return <div key={type} className={`${style} text-sky-600 bg-sky-50 border-sky-100`}><Eye size={10} /> 뷰맛집</div>;
      case 'experience': return <div key={type} className={`${style} text-emerald-600 bg-emerald-50 border-emerald-100`}><Star size={10} /> 체험</div>;
      case 'pickup': return <div key={type} className={`${style} text-orange-500 bg-orange-50 border-orange-100`}><Package size={10} /> 픽업</div>;
      default: return <div key={type} className={`${style} text-slate-500 bg-slate-100 border-slate-200`}><MapIcon size={10} /> 장소</div>;
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    saveHistory();
    const updatedDays = itinerary.days.map(day => ({
      ...day,
      plan: recalculateSchedule(day.plan.map(item => ({ ...item })))
    }));
    setTimeout(() => {
      setItinerary(prev => ({ ...prev, days: updatedDays }));
      setLastAction("시간 및 일정이 재계산되었습니다.");
      setRefreshing(false);
    }, 600);
  };

  const addSuggestionAsAlternative = (dayIdx, pIdx, suggestion) => {
    saveHistory();
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const targetItem = nextData.days[dayIdx].plan[pIdx];

      if (!targetItem.alternatives) targetItem.alternatives = [];

      targetItem.alternatives.push({
        activity: suggestion.name,
        price: suggestion.price,
        memo: 'AI 추천 장소',
        types: ['place']
      });
      return nextData;
    });
    setAiSuggestions(prev => {
      const next = { ...prev };
      delete next[itinerary.days[dayIdx].plan[pIdx].id];
      return next;
    });
    setLastAction(`'${suggestion.name}'이(가) 대안 일정으로 등록되었습니다.`);
  };

  const autoCalculateRouteFor = async (dayIdx, targetIdx) => {
    const prevItem = itinerary.days[dayIdx].plan[targetIdx - 1];
    const targetItem = itinerary.days[dayIdx].plan[targetIdx];
    const addr1 = prevItem?.receipt?.address;
    const addr2 = targetItem?.receipt?.address;

    if (!addr1 || !addr2 || addr1.includes('없음') || addr2.includes('없음')) {
      setLastAction("두 장소의 올바른 주소가 필요합니다.");
      return;
    }

    const key = `${addr1}|${addr2}`;
    if (routeCache[key] && !routeCache[key].failed) {
      applyRoute(dayIdx, targetIdx, routeCache[key]);
      return;
    }

    setIsCalculatingRoute(true);
    setLastAction("경로와 거리를 자동 계산 중입니다...");

    try {
      const getCoords = async (addr) => {
        // 주소 정제 (상세 주소, 괄호 제거)
        const cleanAddr = addr.split(/[,\(]/)[0].replace(/제주특별자치도/g, '제주').trim();
        const r = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cleanAddr)}&format=json&limit=1`);
        const data = await r.json();
        return (data && data.length > 0) ? { lat: data[0].lat, lon: data[0].lon } : null;
      };

      const c1 = await getCoords(addr1);
      if (!c1) throw new Error("출발지 좌표를 찾지 못했습니다.");
      await new Promise(r => setTimeout(r, 1000)); // Respect OpenStreetMaps limits
      const c2 = await getCoords(addr2);
      if (!c2) throw new Error("도착지 좌표를 찾지 못했습니다.");

      const r2 = await fetch(`https://router.project-osrm.org/route/v1/driving/${c1.lon},${c1.lat};${c2.lon},${c2.lat}?overview=false`);
      const d2 = await r2.json();

      if (d2 && d2.routes && d2.routes.length > 0) {
        const routeData = {
          distance: +(d2.routes[0].distance / 1000).toFixed(1),
          durationMins: Math.max(1, Math.ceil(d2.routes[0].duration / 60))
        };
        setRouteCache(prev => ({ ...prev, [key]: routeData }));
        applyRoute(dayIdx, targetIdx, routeData);
        setLastAction(`경로 확인: ${routeData.distance}km, ${routeData.durationMins}분`);
      } else {
        throw new Error("경로를 탐색할 수 없습니다.");
      }
    } catch (e) {
      console.error(e);
      setRouteCache(prev => ({ ...prev, [key]: { failed: true } }));
      setLastAction(e.message || "경로 계산에 실패했습니다.");
    } finally {
      setIsCalculatingRoute(false);
    }
  };

  const applyRoute = (dayIdx, targetIdx, { distance, durationMins }) => {
    saveHistory();
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      const p = nextData.days[dayIdx].plan[targetIdx];
      p.distance = distance;
      p.travelTimeOverride = `${durationMins}분`;
      nextData.days[dayIdx].plan = recalculateSchedule(nextData.days[dayIdx].plan);
      return nextData;
    });
  };

  const addBackupItem = (dayIdx, insertIndex) => {
    saveHistory();
    setItinerary(prev => {
      const nextData = JSON.parse(JSON.stringify(prev));
      nextData.days[dayIdx].plan.splice(insertIndex + 1, 0, {
        id: `backup_${Date.now()}`,
        time: '-',
        activity: '별도 일정',
        type: 'backup',
        price: 0,
        duration: 60,
        state: 'unconfirmed',
        receipt: { address: '장소 미정', items: [] },
        types: ['place']
      });
      return nextData;
    });
    setLastAction("별도 일정이 추가되었습니다.");
  };

  useEffect(() => {
    const handleScroll = () => {
      const dayElements = document.querySelectorAll('[data-day]');
      let currentActiveDay = null; // Will store the ID of closest element
      let minDistance = Infinity;

      dayElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        // Calculate offset (roughly targeting near top of the window, ~200px)
        const distance = Math.abs(rect.top - 200);
        if (distance < minDistance) {
          minDistance = distance;
          currentActiveDay = parseInt(el.getAttribute('data-day'), 10);
        }
      });
      if (currentActiveDay) setActiveDay(currentActiveDay);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!loading && itinerary && itinerary.days && itinerary.days.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(itinerary));
    }
  }, [itinerary, loading]);

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed && Array.isArray(parsed.days)) {
          // 마이그레이션: 기존 데이터에 선박 장거리 이동 정보가 없는 경우 추가
          const patchedDays = parsed.days.map(d => ({
            ...d,
            plan: d.plan.map(p => {
              if (p.types?.includes('ship')) {
                // 임시: 1일차는 목포->제주, 3일차는 제주->목포로 가정하는 로직 보완
                const defaultStart = d.day === 1 ? '목포항' : '제주항';
                const defaultEnd = d.day === 1 ? '제주항' : '목포항';
                return {
                  ...p,
                  startPoint: p.startPoint || defaultStart,
                  endPoint: p.endPoint || defaultEnd
                };
              }
              return p;
            })
          }));
          setItinerary({ days: patchedDays });
          setLoading(false);
          return;
        }
      } catch (e) { console.error(e); }
    }

    // 초기 데이터
    const initialData = {
      days: [
        {
          day: 1,
          plan: [
            { id: 'd1_s1', time: '01:00', activity: '퀸 제누비아 2호', types: ['ship'], startPoint: '목포항', endPoint: '제주항', price: 310000, duration: 300, state: 'confirmed', isTimeFixed: true, receipt: { address: '전남 목포시 해안로 148', shipDetails: { depart: '01:00', loading: '22:30 ~ 00:00' }, items: [{ name: '차량 선적', price: 160000, qty: 1, selected: true }, { name: '주니어룸 (3인)', price: 150000, qty: 1, selected: true }] } },
            { id: 'd1_p1', time: '06:30', activity: '진아떡집', types: ['food', 'pickup'], price: 24000, duration: 15, state: 'confirmed', distance: 2, travelTimeOverride: '5분', receipt: { address: '제주 제주시 동문로4길 7-1', items: [{ name: '오메기떡 8알팩', price: 12000, qty: 2, selected: true }] }, memo: '오메기떡 픽업 필수!' },
            { id: 'd1_c1', time: '06:50', activity: '카페 듀포레', types: ['cafe', 'view'], price: 38500, duration: 145, state: 'confirmed', distance: 8, receipt: { address: '제주시 서해안로 579', items: [{ name: '아메리카노', price: 6500, qty: 2, selected: true }, { name: '비행기 팡도르', price: 12500, qty: 1, selected: true }, { name: '크로와상', price: 13000, qty: 1, selected: true }] }, memo: '비행기 이착륙 뷰 맛집' },
            { id: 'd1_f1', time: '09:30', activity: '말고기연구소', types: ['food', 'openrun'], price: 36000, duration: 60, state: 'confirmed', distance: 3, isTimeFixed: true, receipt: { address: '제주시 북성로 43', items: [{ name: '말육회 부각초밥', price: 12000, qty: 3, selected: true }] }, memo: '10:00 영업 시작' },
            { id: 'd1_c2', time: '12:30', activity: '만다리노카페 & 승마', types: ['cafe', 'experience'], price: 26000, duration: 120, state: 'confirmed', distance: 18, receipt: { address: '조천읍 함와로 585', items: [{ name: '만다리노 라떼', price: 8000, qty: 2, selected: true }, { name: '승마 체험', price: 10000, qty: 1, selected: true }, { name: '귤 따기 체험', price: 10000, qty: 1, selected: false }] }, memo: '승마 및 귤 체험 가능' },
            { id: 'd1_t1', time: '15:00', activity: '함덕잠수함', types: ['tour'], price: 79000, duration: 90, state: 'confirmed', distance: 10, receipt: { address: '조천읍 조함해안로 378', items: [{ name: '입장권', price: 28000, qty: 2, selected: true }] }, memo: '사전 예약 확인 필요' },
            { id: 'd1_f2', time: '18:30', activity: '존맛식당', types: ['food'], price: 69000, duration: 90, state: 'confirmed', distance: 2, receipt: { address: '제주시 조천읍 신북로 493', items: [{ name: '문어철판볶음', price: 39000, qty: 1, selected: true }] }, memo: '저녁 웨이팅 있을 수 있음' }
          ]
        },
        {
          day: 2,
          plan: [
            { id: 'd2_c1', time: '09:00', activity: '델문도', types: ['cafe', 'view'], price: 42500, duration: 60, state: 'confirmed', distance: 2, receipt: { address: '함덕 조함해안로 519-10', items: [{ name: '문도샌드', price: 12000, qty: 1, selected: true }] } },
            { id: 'd2_f1', time: '11:00', activity: '존맛식당', types: ['food'], price: 69000, duration: 90, state: 'confirmed', distance: 1, receipt: { address: '조천읍 신북로 493', items: [{ name: '재방문', price: 69000, qty: 1, selected: true }] } },
            { id: 'd2_l1', time: '20:00', activity: '통나무파크', types: ['lodge'], price: 100000, duration: 600, state: 'confirmed', distance: 45, receipt: { address: '애월읍 도치돌길 303', items: [{ name: '숙박비', price: 100000, qty: 1, selected: true }] } }
          ]
        },
        {
          day: 3,
          plan: [
            { id: 'd3_t1', time: '09:00', activity: '도치돌알파카', types: ['tour', 'experience'], price: 21000, duration: 120, state: 'confirmed', distance: 0, travelTimeOverride: '30분', receipt: { address: '애월읍 도치돌길 303', items: [{ name: '입장권', price: 7000, qty: 3, selected: true }] } },
            {
              id: 'd3_s1',
              time: '15:15',
              activity: '퀸 제누비아 2호',
              types: ['ship'],
              startPoint: '제주항',
              endPoint: '목포항',
              price: 260000,
              duration: 300,
              state: 'confirmed',
              distance: 25,
              isTimeFixed: true,
              receipt: {
                address: '제주항',
                shipDetails: { depart: '16:45', loading: '14:45 ~ 15:45' },
                items: [{ name: '차량 선적', price: 160000, qty: 1, selected: true }, { name: '이코노미 인원권', price: 100000, qty: 1, selected: true }]
              },
              memo: '동승자 하차 후 차량 선적 (셔틀 이동) / 16:45 출항'
            }
          ]
        }
      ]
    };

    // 초기 로딩 시 한 번 전체 계산
    const calculatedDays = initialData.days.map(day => ({
      ...day,
      plan: recalculateSchedule(day.plan)
    }));

    setItinerary({ days: calculatedDays });
    setLoading(false);
  }, []);

  if (loading) return <div className="min-h-screen bg-[#F2F4F6] flex items-center justify-center font-bold text-slate-400">PLANNER LOADING...</div>;

  return (
    <div className="min-h-screen bg-[#F2F4F6] text-[#191F28] font-sans flex overflow-x-hidden font-bold flex-row relative">
      {/* 🟢 좌측 네비게이션바 (사이드바) */}
      <div className="hidden lg:flex flex-col w-[260px] fixed left-0 top-0 bottom-0 bg-white border-r border-[#E5E8EB] z-[140] py-10 px-6 shadow-[4px_0_24px_rgba(0,0,0,0.02)] overflow-y-auto no-scrollbar">
        <h2 className="text-[22px] font-black text-slate-800 tracking-tight mb-10 flex items-center gap-2">
          <MapIcon className="text-[#3182F6]" size={24} /> 전체 일정 안내
        </h2>
        <nav className="flex flex-col gap-6 relative">
          <div className="absolute left-[19px] top-4 bottom-8 w-px bg-slate-100 -z-10" />
          {itinerary.days?.map((d) => (
            <a
              key={d.day}
              href={`#day-${d.day}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(`day-${d.day}`)?.scrollIntoView({ behavior: 'smooth' });
                setActiveDay(d.day);
              }}
              className="flex items-start gap-4 group cursor-pointer"
            >
              <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-[15px] font-black shadow-sm transition-all duration-300 ${activeDay === d.day ? 'bg-[#3182F6] text-white ring-4 ring-blue-50' : 'bg-white text-slate-400 border border-slate-200 group-hover:border-[#3182F6] group-hover:text-[#3182F6]'}`}>
                {d.day}
              </div>
              <div className="flex flex-col pt-1">
                <span className={`text-[15px] tracking-tight transition-colors duration-300 ${activeDay === d.day ? 'text-[#3182F6] font-black' : 'text-slate-500 font-bold group-hover:text-slate-800'}`}>Day {d.day}</span>
                <span className="text-[11px] text-slate-400 font-semibold">{d.plan?.filter(p => p.type !== 'backup').length || 0}개 일정 · 제주</span>
              </div>
            </a>
          ))}
        </nav>
      </div>

      <div className="flex-1 flex flex-col items-center lg:ml-[260px] w-full min-w-0">
        {/* 🔴 대시보드 */}
        <div className="fixed top-0 left-0 lg:left-[260px] right-0 z-[120] bg-white/95 backdrop-blur-xl border-b border-[#E5E8EB] pt-6 pb-5 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <div className="max-w-3xl w-full mx-auto px-6 flex flex-col gap-6">
            <div className="flex items-center justify-between border-b pb-2.5 border-slate-100 font-bold">
              <div className="w-10" />
              <div className="text-[11px] text-[#8B95A1] uppercase tracking-[0.2em] flex-1 text-center">성인 2 · 유아 1 · 자차 · 배편 · 2박 3일</div>
              <div className="flex items-center gap-2">
                <button onClick={handleUndo} disabled={history.length === 0} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 border border-slate-200 text-slate-500 disabled:opacity-30 hover:bg-slate-100 transition-colors"><Undo2 size={18} /></button>
                <button onClick={handleRefresh} className={`w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 border border-slate-200 text-slate-400 hover:bg-slate-100 transition-colors ${refreshing ? 'animate-spin' : ''}`}><RotateCcw size={18} /></button>
              </div>
            </div>
            <div className="grid grid-cols-3 items-center px-1 font-bold">
              <div className="flex flex-col items-start gap-1"><span className="text-[10px] text-[#3182F6]">남은 예산</span><span className="text-xl sm:text-4xl tracking-tighter text-[#3182F6]">₩{budgetSummary.remaining.toLocaleString()}</span></div>
              <div className="flex flex-col items-center gap-1 border-x border-slate-100"><span className="text-[10px] text-slate-400">지출 합계</span><span className="text-xl sm:text-4xl tracking-tighter text-slate-800">₩{budgetSummary.total.toLocaleString()}</span></div>
              <div className="flex flex-col items-end gap-1 text-slate-400"><span className="text-[10px]">총 예산</span><span className="text-xl sm:text-4xl tracking-tighter">₩1,500,000</span></div>
            </div>

            {/* 🟢 모바일 가로 네비게이션바 (lg 미만 해상도에서만 표시) */}
            <div className="flex lg:hidden overflow-x-auto no-scrollbar gap-2 px-1 pb-1">
              {itinerary.days?.map((d) => (
                <button
                  key={d.day}
                  onClick={() => {
                    document.getElementById(`day-${d.day}`)?.scrollIntoView({ behavior: 'smooth' });
                    setActiveDay(d.day);
                  }}
                  className={`flex-none px-4 py-2 rounded-full text-xs font-black transition-colors ${activeDay === d.day ? 'bg-[#3182F6] text-white shadow-md' : 'bg-slate-50 text-slate-500 border border-slate-100'}`}
                >
                  Day {d.day}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 일정 목록 */}
        <div className="w-full max-w-2xl px-3 sm:px-5 mt-[210px] lg:mt-44 pb-32 space-y-8">
          {itinerary.days?.map((d, dIdx) => (
            <div key={`day-${dIdx}`} id={`day-${d.day}`} data-day={d.day} className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden mb-8 animate-in font-bold scroll-mt-52">
              <div className="bg-gradient-to-r from-slate-50 to-white px-6 py-5 border-b border-slate-100 flex items-center gap-3">
                <span className="bg-[#3182F6] text-white px-3 py-1 rounded-lg text-sm font-black shadow-md">Day {d.day}</span>
                <h2 className="text-xl font-black text-slate-800 tracking-tight">제주 여행 {d.day}일차</h2>
              </div>
              <div className="p-4 sm:p-6 flex flex-col gap-6">
                {d.plan?.map((p, pIdx) => {
                  const isExpanded = expandedId === p.id;
                  const stateStyles = p.state === 'confirmed' ? 'border-[#00D082] shadow-sm' : p.state === 'assumed' ? 'border-[#F97316] shadow-sm' : 'border-slate-200';

                  const chips = p.types ? p.types.map(t => getCategoryBadge(t)) : (p.type ? [getCategoryBadge(p.type)] : []);
                  const isOpenRun = p.memo?.includes('오픈런');
                  const isNextFixed = (pIdx < d.plan.length - 1) && d.plan[pIdx + 1]?.isTimeFixed;
                  // 스마트 락(숙소 자동 계산) 여부 확인
                  const isAutoLocked = p.isAutoDuration;

                  return (
                    <div key={p.id} className="relative group">

                      {/* ✅ 3일차 첫 번째 일정: '바로 이동' 칩 렌더링 */}
                      {d.day === 3 && pIdx === 0 && (
                        <div className="flex items-center justify-center pb-6 relative select-none">
                          <div className="absolute top-0 bottom-0 border-l-2 border-slate-100 border-dashed left-1/2 -translate-x-1/2 h-full z-0"></div>
                          <div className="z-10 flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm text-xs font-bold text-slate-500">
                            <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-400">
                              {minutesToTime(timeToMinutes(p.time) - parseInt(p.travelTimeOverride || '0', 10))} 출발
                            </span>
                            <span className="text-[#3182F6]">통나무파크에서 출발</span>
                            <span className="text-[10px] text-slate-400">{p.travelTimeOverride || '이동'}</span>
                          </div>
                        </div>
                      )}

                      <div
                        className={`relative flex flex-col border-2 rounded-3xl bg-white hover:shadow-lg transition-all overflow-hidden ${stateStyles}`}
                        onClick={() => toggleReceipt(p.id)}
                      >
                        <div className="flex items-stretch gap-4 sm:gap-6 p-4 sm:p-5 pb-3 border-b border-slate-100 border-dashed">

                          {/* 🟢 좌측 컨트롤 타워 */}
                          <div className="flex flex-col items-center justify-center gap-2 w-[100px] sm:w-[7.5rem] shrink-0 bg-slate-50 border-r border-slate-100 py-6 px-2 lg:px-4 -my-5 -ml-4 sm:-ml-5 h-auto">
                            {/* 시간 조절 */}
                            <div className="w-full flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer select-none mb-1 group" onClick={(e) => { e.stopPropagation(); toggleTimeFix(dIdx, pIdx); }}>
                              <button onClick={(e) => { e.stopPropagation(); updateStartTime(dIdx, pIdx, -TIME_UNIT); }} className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-blue-500 transition-colors shrink-0"><ChevronLeft size={14} /></button>

                              {/* 락 스타일: 배경 활성화 방식으로 변경 */}
                              <div className={`relative flex items-center px-1 sm:px-1.5 py-0.5 rounded-lg transition-colors ${p.isTimeFixed ? 'bg-blue-50 ring-1 ring-blue-100 shadow-sm' : 'hover:bg-slate-200/50'}`}>
                                <span className={`text-[17px] sm:text-[19px] italic font-black tracking-tighter transition-colors ${p.isTimeFixed ? 'text-[#3182F6]' : 'text-slate-800'}`}>{p.time}</span>
                              </div>

                              <button onClick={(e) => { e.stopPropagation(); updateStartTime(dIdx, pIdx, TIME_UNIT); }} className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-blue-500 transition-colors shrink-0"><ChevronRight size={14} /></button>
                            </div>

                            {/* ✅ 소요 시간 조절 (스마트 락 스타일 적용) */}
                            <div className={`flex items-center justify-between w-full bg-white px-1 sm:px-2 py-1.5 rounded-xl border shadow-sm my-3 transition-colors ${isNextFixed || isAutoLocked ? 'border-orange-200 ring-1 ring-orange-100' : 'border-slate-200'}`} onClick={(e) => e.stopPropagation()}>
                              <button onClick={() => updateDuration(dIdx, pIdx, -TIME_UNIT)} className={`w-4 sm:w-5 h-5 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors shrink-0 ${isNextFixed || isAutoLocked ? 'text-orange-300' : 'text-slate-400 hover:text-blue-500'}`}><Minus size={10} /></button>
                              <span
                                className={`text-[12px] whitespace-nowrap font-extrabold tabular-nums cursor-pointer hover:underline ${isNextFixed || isAutoLocked ? 'text-orange-500' : 'text-slate-600 hover:text-blue-600'}`}
                                onClick={() => resetDuration(dIdx, pIdx)}
                                title={isNextFixed || isAutoLocked ? "다음 일정에 맞춰 자동으로 계산된 시간입니다" : "60분으로 초기화"}
                              >{p.duration}분</span>
                              <button onClick={() => updateDuration(dIdx, pIdx, TIME_UNIT)} className={`w-4 sm:w-5 h-5 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors shrink-0 ${isNextFixed || isAutoLocked ? 'text-orange-300 hover:text-orange-500' : 'text-slate-400 hover:text-blue-500'}`}><Plus size={10} /></button>
                            </div>

                            {/* 확정 버튼 & 플랜 B 추가 */}
                            {p.type !== 'backup' && (
                              <div className="w-full flex flex-col gap-1.5" onClick={(e) => e.stopPropagation()}>
                                {(p.state === 'unconfirmed' || p.state === 'assumed') ? (
                                  <div className="flex gap-1.5 w-full">
                                    <button
                                      onClick={() => addPlanB(dIdx, pIdx)}
                                      className="flex-none w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-blue-500 hover:border-blue-300 transition-colors shadow-sm"
                                      title="플랜 B 추가"
                                    >
                                      <PlusSquare size={14} />
                                    </button>
                                    <button
                                      onClick={(e) => cycleStatus(dIdx, pIdx, e)}
                                      className={`flex-1 py-1.5 rounded-lg text-[10px] font-black transition-all shadow-sm ${p.state === 'assumed' ? 'bg-[#F97316] text-white hover:bg-orange-500' : 'bg-white border border-slate-200 text-slate-400 hover:bg-slate-50'}`}
                                    >
                                      {p.state === 'assumed' ? '가정' : '미정'}
                                    </button>
                                  </div>
                                ) : (
                                  <button onClick={(e) => cycleStatus(dIdx, pIdx, e)} className="w-full py-2.5 rounded-xl text-[10px] font-black bg-[#00D082] text-white hover:bg-emerald-500 transition-all shadow-sm flex items-center justify-center gap-1">
                                    <CheckSquare size={12} strokeWidth={3} /> 확정
                                  </button>
                                )}
                              </div>
                            )}
                          </div>

                          {/* 🟢 우측 정보 영역 */}
                          <div className="flex-1 min-w-0 flex flex-col justify-start h-full pr-0 gap-3">
                            {p.types?.includes('ship') ? (
                              <div className="flex flex-col h-full bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="bg-blue-600 font-bold text-white text-[10px] px-2 py-0.5 rounded uppercase tracking-wider shrink-0">Ferry</div>
                                  <input
                                    value={p.activity}
                                    onChange={(e) => updateActivityName(dIdx, pIdx, e.target.value)}
                                    className="bg-transparent text-lg font-black text-blue-900 leading-tight focus:outline-none flex-1 w-full truncate"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </div>
                                <div className="flex items-center justify-between w-full h-full pb-2">
                                  <div className="flex flex-col text-center w-[4.5rem] shrink-0">
                                    <span className="text-[10px] text-blue-400 font-bold mb-1">Departure</span>
                                    <span className="text-[16px] font-black text-blue-950 truncate tracking-tight">{p.startPoint || '목포항'}</span>
                                  </div>
                                  <div className="flex-1 px-3 mt-[-5px] flex flex-col items-center">
                                    <div className="w-full h-[0px] border-t-2 border-dashed border-blue-200 relative flex items-center justify-center">
                                      <div className="absolute bg-blue-50 px-2 text-blue-400">
                                        <Anchor size={14} />
                                      </div>
                                    </div>
                                    <span className="text-[10px] text-blue-400 font-bold mt-2">{((p.duration || 300) / 60).toFixed(0)}시간 소요</span>
                                  </div>
                                  <div className="flex flex-col text-center w-[4.5rem] shrink-0">
                                    <span className="text-[10px] text-blue-400 font-bold mb-1">Arrival</span>
                                    <span className="text-[16px] font-black text-blue-950 truncate tracking-tight">{p.endPoint || '제주항'}</span>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <>
                                {/* 1행: 카테고리 칩 + 오픈런 */}
                                <div className="flex items-center gap-2 flex-wrap">
                                  {chips}
                                </div>

                                {/* 2행: 이름 (수정 가능한 Input) */}
                                <div className="w-full" onClick={(e) => e.stopPropagation()}>
                                  <input
                                    value={p.activity}
                                    onChange={(e) => updateActivityName(dIdx, pIdx, e.target.value)}
                                    className="w-full bg-transparent text-xl font-black text-slate-800 truncate leading-tight focus:outline-none focus:border-b focus:border-slate-300 transition-colors"
                                    placeholder="일정 이름 입력"
                                  />
                                </div>

                                {/* 3행: 주소 박스 (영수증 스타일) */}
                                <div className="flex items-center gap-2 text-slate-500 bg-white w-fit px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-sm transition-all hover:border-[#3182F6]/30" onClick={(e) => e.stopPropagation()}>
                                  <MapPin size={12} className="text-[#3182F6]" />
                                  <span className="text-[11px] font-bold">{p.receipt?.address || '주소 정보 없음'}</span>
                                </div>

                                {/* 4행: 메모 입력란 */}
                                <div className="w-full mb-1" onClick={(e) => e.stopPropagation()}>
                                  <input
                                    value={p.memo || ''}
                                    onChange={(e) => updateMemo(dIdx, pIdx, e.target.value)}
                                    className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2.5 text-[11px] font-medium text-slate-600 w-full outline-none placeholder:text-slate-400 focus:outline-none focus:border-slate-300 focus:bg-white transition-all"
                                    placeholder="메모를 입력하세요..."
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        {/* 🟩 하단 영수증 영역 (전체 너비 100%) */}
                        {p.type !== 'backup' && (
                          <div className="w-full bg-slate-50/50" onClick={(e) => e.stopPropagation()}>
                            {isExpanded && (
                              <div className="px-5 py-4 animate-in slide-in-from-top-1 bg-white border-b border-slate-100 border-dashed">
                                {p.receipt?.shipDetails && (
                                  <div className="bg-blue-50/80 border border-blue-100 rounded-xl p-3 mb-4 text-xs">
                                    <div className="grid grid-cols-2 gap-2 text-slate-600 font-bold">
                                      <div>🚗 선적: <span className="text-red-500">{p.receipt.shipDetails.loading}</span></div>
                                      <div>🛫 출항: <span className="text-black">{p.receipt.shipDetails.depart}</span></div>
                                    </div>
                                  </div>
                                )}
                                <div className="space-y-3 mb-3">
                                  {p.receipt?.items?.map((m, mIdx) => (
                                    <div key={mIdx} className="flex justify-between items-center text-xs group/item">
                                      <div className="flex items-center gap-2 flex-1">
                                        <div className="cursor-pointer text-slate-300 hover:text-[#3182F6]" onClick={(e) => { e.stopPropagation(); updateMenuData(dIdx, pIdx, mIdx, 'toggle'); }}>
                                          {m.selected ? <CheckSquare size={14} className="text-[#3182F6]" /> : <Square size={14} />}
                                        </div>
                                        <input value={m.name} onChange={(e) => updateMenuData(dIdx, pIdx, mIdx, 'name', e.target.value)} onClick={(e) => e.stopPropagation()} className="bg-transparent border-none outline-none text-slate-700 font-bold w-full" />
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded p-0.5 shadow-sm">
                                          <button onClick={(e) => { e.stopPropagation(); updateMenuData(dIdx, pIdx, mIdx, 'qty', -1); }}><Minus size={10} /></button>
                                          <span className="w-4 text-center text-[10px]">{m.qty}</span>
                                          <button onClick={(e) => { e.stopPropagation(); updateMenuData(dIdx, pIdx, mIdx, 'qty', 1); }}><Plus size={10} /></button>
                                        </div>
                                        <div className="w-16 text-right font-bold text-slate-500">₩{m.price.toLocaleString()}</div>
                                        <button onClick={(e) => { e.stopPropagation(); deleteMenuItem(dIdx, pIdx, mIdx); }} className="text-slate-300 hover:text-red-500"><Trash2 size={12} /></button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); addMenuItem(dIdx, pIdx); }} className="w-full py-2 border border-dashed border-slate-300 rounded-xl text-[10px] font-bold text-slate-400 hover:text-[#3182F6] hover:bg-white transition-all">+ 메뉴 추가</button>

                                {/* 플랜 B 목록 */}
                                <div className="mt-3 pt-3 border-t border-dashed border-slate-200">
                                  {p.alternatives?.map((alt, altIdx) => (
                                    <div key={altIdx} className="bg-white rounded-lg p-2 border border-slate-200 mb-2 flex justify-between items-center">
                                      <span className="text-xs font-bold text-slate-600">{getPlanLabel(altIdx)}: {alt.activity}</span>
                                      <div className="flex gap-2">
                                        <button onClick={() => swapAlternative(dIdx, pIdx, altIdx)} className="text-[10px] bg-slate-100 px-2 py-1 rounded hover:bg-slate-200 text-blue-600 font-bold">선택</button>
                                        <button onClick={() => removeAlternative(dIdx, pIdx, altIdx)} className="text-slate-300 hover:text-red-500 p-1"><Trash2 size={12} /></button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* 🟢 하단: 총액 표시 (상시 노출) */}
                            <div className="flex justify-between items-center px-5 py-3 hover:bg-slate-100/50 transition-colors cursor-pointer" onClick={() => toggleReceipt(p.id)}>
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                                Total Estimated Cost {isExpanded ? <ChevronDown size={12} className="rotate-180 transition-transform" /> : <ChevronDown size={12} className="transition-transform" />}
                              </span>
                              <span className="text-xl font-black text-[#3182F6]">₩{Number(p.price).toLocaleString()}</span>
                            </div>
                          </div>
                        )}

                        {/* 독립 일정(backup)용 삭제 버튼 */}
                        {p.type === 'backup' && (
                          <button onClick={(e) => { e.stopPropagation(); deletePlanItem(dIdx, pIdx); }} className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"><Trash2 size={16} /></button>
                        )}
                      </div>

                      {/* 이동 정보 칩 (좌우 여백과 라인 중앙 정렬 완전 최적화) */}
                      {pIdx < d.plan.length - 1 && p.type !== 'backup' && (
                        <div className="flex items-center py-5 relative w-full">
                          {/* Timeline vertical connection line - matching exact center of the left block */}
                          {/* sm이상일 때는 왼쪽 패딩이 커져서 3.9rem정도가 축이 되고, 모바일일 땐 더 좁은 것이 반영됨 */}
                          <div className="absolute top-0 bottom-0 w-[2px] bg-slate-100 -z-10 left-[2.4rem] sm:left-[3.9rem]"></div>

                          {(() => {
                            const prevEndTime = timeToMinutes(p.time) + (p.duration || 0) + (p.waitingTime || 0);
                            let nextItem = d.plan[pIdx + 1];
                            if (nextItem && nextItem.type !== 'backup') {
                              return (
                                <div className="z-10 flex flex-col sm:flex-row sm:items-center w-full gap-2 sm:gap-4 pl-0 sm:pl-0 sm:-ml-5">
                                  {/* Timeline Axis Area (Exact width matching the left controller 8rem total approx) */}
                                  <div className="hidden sm:flex w-[8.5rem] shrink-0 justify-center py-1 bg-transparent">
                                    {/* 좌측 시간 표시 삭제 요청 반영 */}
                                  </div>

                                  {/* Actual Travel Detail Chip Block */}
                                  <div className="flex items-center gap-1.5 sm:gap-2 bg-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-full border border-slate-200 shadow-sm ml-10 flex-wrap shrink-0 sm:ml-0 overflow-hidden max-w-[calc(100%-3rem)]">

                                    <div className="flex items-center gap-2 bg-slate-50 px-2 sm:px-3 py-1.5 rounded-xl border border-slate-100 text-[#3182F6]">
                                      <button onClick={(e) => { e.stopPropagation(); updateTravelTime(dIdx, pIdx + 1, -TIME_UNIT); }} className="w-5 h-5 flex items-center justify-center bg-white rounded-lg shadow-sm hover:bg-blue-50"><Minus size={10} /></button>
                                      <span className="min-w-[3rem] text-center tracking-tight text-xs font-black">{nextItem.travelTimeOverride || '15분'}</span>
                                      <button onClick={(e) => { e.stopPropagation(); updateTravelTime(dIdx, pIdx + 1, TIME_UNIT); }} className="w-5 h-5 flex items-center justify-center bg-white rounded-lg shadow-sm hover:bg-blue-50"><Plus size={10} /></button>
                                    </div>

                                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold px-1.5">
                                      <MapIcon size={12} /><span>{nextItem.distance || 0}km</span>
                                    </div>

                                    <button
                                      onClick={(e) => { e.stopPropagation(); autoCalculateRouteFor(dIdx, pIdx + 1); }}
                                      disabled={isCalculatingRoute}
                                      className={`flex items-center gap-1 transition-colors border rounded-lg px-2 py-1.5 text-[10px] font-black shadow-sm ${isCalculatingRoute ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-white hover:bg-[#3182F6] hover:text-white text-slate-400 border-slate-200 hover:border-[#3182F6]'}`}
                                      title="실시간 경로 자동 계산"
                                    >
                                      <Sparkles size={10} /> {isCalculatingRoute ? '계산중' : '자동경로'}
                                    </button>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          })()}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <footer className="fixed bottom-0 left-0 lg:left-[260px] right-0 bg-white/95 backdrop-blur-xl border-t px-8 py-5 flex items-center gap-5 z-[130] shadow-[0_-5px_20px_rgba(0,0,0,0.02)]">
          <MessageSquare size={20} className="text-[#3182F6]" />
          <p className="text-[13px] font-bold text-slate-600 truncate flex-1 animate-pulse">"{lastAction}"</p>
          <div className="bg-[#3182F6]/10 text-[#3182F6] px-3 py-1.5 rounded-lg border border-[#3182F6]/20 tracking-widest text-[9px] font-black uppercase">Active Agent v19.5</div>
        </footer>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pretendard:wght@400;600;700;900&display=swap');
        body { font-family: 'Pretendard', -apple-system, sans-serif; letter-spacing: -0.02em; margin: 0; background-color: #F2F4F6; }
        .animate-in { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        /* input number 스피너 숨기기 */
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { 
          -webkit-appearance: none; 
          margin: 0; 
        }
      `}</style>
    </div>
  );
};

export default App;
