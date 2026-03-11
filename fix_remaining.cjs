const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Add submitAiLearningCase to PlaceAddForm params
content = content.replace(
    /const PlaceAddForm = \(\{ newPlaceName, setNewPlaceName, newPlaceTypes, setNewPlaceTypes, regionHint, onAdd, onCancel, aiEnabled = false, aiSettings = DEFAULT_AI_SMART_FILL_CONFIG, onNotify = null, aiLearningCapture, setAiLearningCapture \}\) => \{/,
    'const PlaceAddForm = ({ newPlaceName, setNewPlaceName, newPlaceTypes, setNewPlaceTypes, regionHint, onAdd, onCancel, aiEnabled = false, aiSettings = DEFAULT_AI_SMART_FILL_CONFIG, onNotify = null, aiLearningCapture, setAiLearningCapture, submitAiLearningCase }) => {'
);

// 2. Add missing functions inside App
const appStart = /const App = \(\) => \{/;
const missingStubs = `
  const getTimingConflictRecommendation = () => null;
  const applyTimingConflictRecommendation = () => {};
  const distanceSortedPlaces = [];
  const budgetSummary = {
    totalExpected: 0,
    totalActual: 0,
    totalUnpaid: 0,
    categories: []
  };
  const updateMemo = (dayIdx, pIdx, val) => {
    setItinerary(prev => {
      const draft = JSON.parse(JSON.stringify(prev));
      const p = draft.days[dayIdx].plan[pIdx];
      p.memo = val;
      return draft;
    });
  };
`;
content = content.replace(appStart, `const App = () => {\n${missingStubs}`);

fs.writeFileSync('src/App.jsx', content);
console.log('Fixed undefined variables by adding stubs/params!');
