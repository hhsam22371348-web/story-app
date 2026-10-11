import React, { useState } from 'react';
import { STORY_PAGES } from './data/storyData';
import { TopNav } from './components/TopNav';
import { CoverScreen } from './components/CoverScreen';
import { StoryView } from './components/StoryView';
import { ResultScreen } from './components/ResultScreen';
import { DetectiveNotepadModal } from './components/DetectiveNotepadModal';

export default function App() {
  const [currentView, setCurrentView] = useState<'cover' | 'story' | 'results'>('cover');
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);

  // Detective progress tracking
  const [foundClueIds, setFoundClueIds] = useState<string[]>([]);
  const [feelingScore, setFeelingScore] = useState<number>(0);
  const [empathyScore, setEmpathyScore] = useState<number>(0);
  const [sentenceCompleted, setSentenceCompleted] = useState<boolean>(false);

  // UI state
  const [isNotepadOpen, setIsNotepadOpen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Total metrics
  const totalPages = STORY_PAGES.length;
  const totalClues = STORY_PAGES.reduce((acc, p) => acc + (p.clues ? p.clues.length : 0), 0);
  const totalFeelingQuestions = STORY_PAGES.filter((p) => p.feelingCheck).length;
  const totalEmpathyQuestions = STORY_PAGES.filter((p) => p.empathyScenario).length;

  const handleStartStory = () => {
    setCurrentPageIndex(0);
    setCurrentView('story');
  };

  const handlePageChange = (index: number) => {
    setCurrentPageIndex(index);
  };

  const handleFinishStory = () => {
    setCurrentView('results');
  };

  const handleReadAgain = () => {
    setCurrentPageIndex(0);
    setCurrentView('story');
  };

  const handleClueFound = (clueId: string) => {
    setFoundClueIds((prev) => (prev.includes(clueId) ? prev : [...prev, clueId]));
  };

  const handleFeelingAnswerCorrect = () => {
    setFeelingScore((prev) => Math.min(prev + 1, totalFeelingQuestions));
  };

  const handleSentenceCompleted = () => {
    setSentenceCompleted(true);
  };

  const handleEmpathyChoice = (isBest: boolean) => {
    if (isBest) {
      setEmpathyScore((prev) => Math.min(prev + 1, totalEmpathyQuestions));
    }
  };

  const handleToggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-slate-800 flex flex-col font-sans selection:bg-amber-200">
      {/* Top Bar Navigation */}
      <TopNav
        currentView={currentView}
        onNavigateCover={() => setCurrentView('cover')}
        onNavigateStory={() => {
          setCurrentView('story');
        }}
        onOpenNotepad={() => setIsNotepadOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        currentPage={currentPageIndex + 1}
        totalPages={totalPages}
      />

      {/* Main View Container */}
      <div className="flex-1 flex flex-col">
        {currentView === 'cover' && (
          <CoverScreen
            onStartStory={handleStartStory}
            onOpenNotepad={() => setIsNotepadOpen(true)}
            soundEnabled={soundEnabled}
          />
        )}

        {currentView === 'story' && (
          <StoryView
            pages={STORY_PAGES}
            currentPageIndex={currentPageIndex}
            onPageChange={handlePageChange}
            onFinishStory={handleFinishStory}
            foundClueIds={foundClueIds}
            onClueFound={handleClueFound}
            onFeelingAnswerCorrect={handleFeelingAnswerCorrect}
            onSentenceCompleted={handleSentenceCompleted}
            onEmpathyChoice={handleEmpathyChoice}
            onOpenNotepad={() => setIsNotepadOpen(true)}
            soundEnabled={soundEnabled}
          />
        )}

        {currentView === 'results' && (
          <ResultScreen
            feelingScore={feelingScore}
            totalFeelingQuestions={totalFeelingQuestions}
            empathyScore={empathyScore}
            totalEmpathyQuestions={totalEmpathyQuestions}
            foundCluesCount={foundClueIds.length}
            totalCluesCount={totalClues}
            sentenceCompleted={sentenceCompleted}
            onReadAgain={handleReadAgain}
            onOpenNotepad={() => setIsNotepadOpen(true)}
          />
        )}
      </div>

      {/* Detective Case Notebook Modal */}
      <DetectiveNotepadModal
        isOpen={isNotepadOpen}
        onClose={() => setIsNotepadOpen(false)}
        foundClueIds={foundClueIds}
        totalPossibleClues={totalClues}
        feelingScore={feelingScore}
        totalFeelingQuestions={totalFeelingQuestions}
        empathyScore={empathyScore}
        totalEmpathyQuestions={totalEmpathyQuestions}
        sentenceCompleted={sentenceCompleted}
      />
    </div>
  );
}
