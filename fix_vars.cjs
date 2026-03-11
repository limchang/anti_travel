const fs = require('fs');
const content = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Pass submitAiLearningCase to PlaceAddForm
const submitAI_regex = /<PlaceAddForm[\s\S]*?aiLearningCapture={aiLearningCapture}/;
let newContent = content.replace(submitAI_regex, (match) => match + '\n            submitAiLearningCase={submitAiLearningCase}');

// 2. Define askPlanBMoveMode globally
const askPlanB_regex = /const App = \(\) => \{/;
newContent = newContent.replace(askPlanB_regex, 'const askPlanBMoveMode = (item) => item?.alternatives?.length > 0 ? window.confirm(`Plan B도 함께 이동하시겠습니까? (취소 시 현재 기준 일정만 이동합니다)`) : false;\nconst App = () => {');

// 3. Define toggleDurationFix and toggleEndTimeFix near toggleTimeFix
const toggle_regex = /const toggleTimeFix = \(dayIdx, pIdx\) => \{[\s\S]*?\}\);[\s\n]*\};/;
const toggle_code = `const toggleTimeFix = (dayIdx, pIdx) => {
    setItinerary(prev => {
      const draft = JSON.parse(JSON.stringify(prev));
      draft.days[dayIdx].plan[pIdx].isTimeFixed = !draft.days[dayIdx].plan[pIdx].isTimeFixed;
      return draft;
    });
  };
  const toggleDurationFix = (dayIdx, pIdx) => {
    setItinerary(prev => {
      const draft = JSON.parse(JSON.stringify(prev));
      const p = draft.days[dayIdx].plan[pIdx];
      p.isDurationFixed = !p.isDurationFixed;
      if (p.isDurationFixed) p.isEndTimeFixed = false;
      return draft;
    });
  };
  const toggleEndTimeFix = (dayIdx, pIdx) => {
    setItinerary(prev => {
      const draft = JSON.parse(JSON.stringify(prev));
      const p = draft.days[dayIdx].plan[pIdx];
      p.isEndTimeFixed = !p.isEndTimeFixed;
      if (p.isEndTimeFixed) p.isDurationFixed = false;
      return draft;
    });
  };`;
newContent = newContent.replace(toggle_regex, toggle_code);

// 4. Define isEndTimeFixed for the JSX block
const endtimeLoc_regex = /const isDurationControlBlocked = isAutoLocked;/;
newContent = newContent.replace(endtimeLoc_regex, 'const isDurationControlBlocked = isAutoLocked;\n                  const isEndTimeFixed = !!p.isEndTimeFixed;');

// 5. Replace the wrong onClick for the END button
const onClickEndTime_regex = /if \(isAutoLocked\) return; setDurationValue\(dIdx, pIdx, 0\);/g;
newContent = newContent.replace(onClickEndTime_regex, 'if (isAutoLocked) return; toggleEndTimeFix(dIdx, pIdx);');

fs.writeFileSync('src/App.jsx', newContent);
console.log('Fixed variables!');
