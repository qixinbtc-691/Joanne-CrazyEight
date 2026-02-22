/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Diamond, 
  Club, 
  Spade, 
  RotateCcw, 
  Trophy, 
  User, 
  Cpu,
  Info,
  ChevronRight,
  Home,
  Languages
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { Card, Suit, GameStatus, GameState } from './types';
import { createDeck, shuffleDeck, SUITS } from './constants';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const SuitIcon = ({ suit, className }: { suit: Suit; className?: string }) => {
  switch (suit) {
    case 'hearts': return <Heart className={cn("fill-red-500 text-red-500", className)} />;
    case 'diamonds': return <Diamond className={cn("fill-red-500 text-red-500", className)} />;
    case 'clubs': return <Club className={cn("fill-slate-800 text-slate-800", className)} />;
    case 'spades': return <Spade className={cn("fill-slate-800 text-slate-800", className)} />;
  }
};

interface PlayingCardProps {
  card: Card;
  isFlipped?: boolean;
  onClick?: () => void;
  isPlayable?: boolean;
  className?: string;
  style?: React.CSSProperties;
  key?: React.Key;
}

const PlayingCard = ({ 
  card, 
  isFlipped = true, 
  onClick, 
  isPlayable = false,
  className,
  style
}: PlayingCardProps) => {
  const isRed = card.suit === 'hearts' || card.suit === 'diamonds';

  return (
    <motion.div
      layoutId={card.id}
      onClick={isPlayable ? onClick : undefined}
      style={style}
      whileHover={isPlayable ? { y: -20, scale: 1.05 } : {}}
      className={cn(
        "relative w-24 h-36 sm:w-32 sm:h-48 rounded-xl shadow-lg cursor-pointer transition-shadow",
        isFlipped ? "bg-white" : "bg-indigo-700 border-4 border-white",
        isPlayable && "ring-4 ring-yellow-400 shadow-yellow-400/50",
        !isFlipped && "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_var(--tw-gradient-to)_100%)] from-indigo-600 to-indigo-900",
        className
      )}
    >
      {isFlipped ? (
        <div className={cn("flex flex-col h-full p-2 sm:p-3", isRed ? "text-red-500" : "text-slate-900")}>
          <div className="flex justify-between items-start">
            <span className="text-xl sm:text-2xl font-bold leading-none">{card.rank}</span>
            <SuitIcon suit={card.suit} className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
          <div className="flex-1 flex items-center justify-center">
            <SuitIcon suit={card.suit} className="w-10 h-10 sm:w-16 sm:h-16 opacity-20" />
            <span className="absolute text-2xl sm:text-4xl font-bold">{card.rank}</span>
          </div>
          <div className="flex justify-between items-end rotate-180">
            <span className="text-xl sm:text-2xl font-bold leading-none">{card.rank}</span>
            <SuitIcon suit={card.suit} className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
        </div>
      ) : (
        <div className="h-full w-full flex items-center justify-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-white/20 rounded-full flex items-center justify-center">
            <span className="text-white/20 font-bold text-xl sm:text-2xl">J</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// --- Constants & Translations ---

const translations = {
  en: {
    title: "Joanne Crazy Eights",
    welcome: "Welcome to Joanne Crazy Eights!",
    newGame: "New Game",
    home: "Home",
    rules: "Rules",
    yourTurn: "Your turn! Match the suit or rank.",
    aiThinking: "AI is thinking...",
    youDrew: "You drew a card. AI's turn.",
    youChose: (suit: string) => `You chose ${suit.toUpperCase()}. AI's turn.`,
    aiPlayed: (rank: string, suit: string) => `AI played ${rank} of ${suit}. Your turn!`,
    aiDrew: "AI had to draw a card. Your turn!",
    deckEmpty: "Deck is empty! Skipping turn.",
    opponentHand: "Opponent Hand",
    yourHand: "Your Hand",
    drawPile: "Draw Pile",
    discardPile: "Discard Pile",
    empty: "Empty",
    crazy8: "Crazy 8!",
    chooseSuit: "Choose the next suit to play",
    youWin: "You Win!",
    aiWin: "AI Wins!",
    winMsg: "Incredible performance! You're a Crazy Eights master.",
    loseMsg: "The AI outsmarted you this time. Better luck next game!",
    playAgain: "Play Again",
    startGame: "START GAME",
    howToPlay: "HOW TO PLAY",
    gameRules: "Game Rules",
    gotIt: "Got it!",
    rule1: "Each player starts with 8 cards. The goal is to be the first to empty your hand.",
    rule2: "Match the top card's Suit or Rank to play a card.",
    rule3: "8s are Wild! Play an 8 anytime to change the current suit.",
    rule4: "If you have no playable cards, you must draw one from the deck.",
    hearts: "Hearts",
    diamonds: "Diamonds",
    clubs: "Clubs",
    spades: "Spades"
  },
  zh: {
    title: "Joanne 疯狂 8 点",
    welcome: "欢迎来到 Joanne 疯狂 8 点！",
    newGame: "新游戏",
    home: "首页",
    rules: "规则",
    yourTurn: "轮到你了！匹配花色或点数。",
    aiThinking: "AI 正在思考...",
    youDrew: "你摸了一张牌。轮到 AI 了。",
    youChose: (suit: string) => `你选择了 ${suit}。轮到 AI 了。`,
    aiPlayed: (rank: string, suit: string) => `AI 出了 ${suit}${rank}。轮到你了！`,
    aiDrew: "AI 必须摸一张牌。轮到你了！",
    deckEmpty: "摸牌堆已空！跳过回合。",
    opponentHand: "对手手牌",
    yourHand: "你的手牌",
    drawPile: "摸牌堆",
    discardPile: "弃牌堆",
    empty: "空",
    crazy8: "疯狂 8 点！",
    chooseSuit: "选择接下来的花色",
    youWin: "你赢了！",
    aiWin: "AI 赢了！",
    winMsg: "表现出色！你是疯狂 8 点大师。",
    loseMsg: "这次 AI 技高一筹。下次好运！",
    playAgain: "再玩一次",
    startGame: "开始游戏",
    howToPlay: "玩法介绍",
    gameRules: "游戏规则",
    gotIt: "知道了！",
    rule1: "每位玩家开始有 8 张牌。目标是第一个清空手牌。",
    rule2: "匹配弃牌堆顶牌的 花色 或 点数 即可出牌。",
    rule3: "8 是万能牌！随时可以出 8 并改变当前花色。",
    rule4: "如果你没有可出的牌，必须从摸牌堆摸一张。",
    hearts: "红心",
    diamonds: "方块",
    clubs: "梅花",
    spades: "黑桃"
  }
};

// --- Main App ---

export default function App() {
  const [language, setLanguage] = useState<'en' | 'zh'>('en');
  const [gameState, setGameState] = useState<GameState>({
    deck: [],
    discardPile: [],
    playerHand: [],
    aiHand: [],
    currentTurn: 'player',
    status: 'idle',
    winner: null,
    currentSuit: null,
  });

  const t = (key: keyof typeof translations.en) => translations[language][key];

  const [message, setMessage] = useState(translations.en.welcome);
  const [showRules, setShowRules] = useState(false);

  const goHome = () => {
    setGameState(prev => ({ ...prev, status: 'idle' }));
    setMessage(t('welcome') as string);
  };

  // --- Game Logic ---

  const initGame = useCallback(() => {
    const fullDeck = shuffleDeck(createDeck());
    const playerHand = fullDeck.splice(0, 8);
    const aiHand = fullDeck.splice(0, 8);
    
    // Find a starting card that is not an 8
    let startIndex = 0;
    while (fullDeck[startIndex].rank === '8') {
      startIndex++;
    }
    const firstDiscard = fullDeck.splice(startIndex, 1)[0];

    setGameState({
      deck: fullDeck,
      discardPile: [firstDiscard],
      playerHand,
      aiHand,
      currentTurn: 'player',
      status: 'playing',
      winner: null,
      currentSuit: firstDiscard.suit,
    });
    setMessage(t('yourTurn') as string);
  }, [language]);

  const checkWinner = useCallback((state: GameState) => {
    if (state.playerHand.length === 0) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
      return 'player';
    }
    if (state.aiHand.length === 0) {
      return 'ai';
    }
    return null;
  }, []);

  const isCardPlayable = (card: Card) => {
    if (gameState.status !== 'playing' || gameState.currentTurn !== 'player') return false;
    
    const topCard = gameState.discardPile[gameState.discardPile.length - 1];
    
    // 8 is always playable
    if (card.rank === '8') return true;
    
    // Match rank or current suit
    return card.rank === topCard.rank || card.suit === gameState.currentSuit;
  };

  const playCard = (cardId: string, isPlayer: boolean) => {
    setGameState(prev => {
      const hand = isPlayer ? prev.playerHand : prev.aiHand;
      const card = hand.find(c => c.id === cardId);
      if (!card) return prev;

      const newHand = hand.filter(c => c.id !== cardId);
      const newDiscardPile = [...prev.discardPile, card];
      
      const nextState: GameState = {
        ...prev,
        [isPlayer ? 'playerHand' : 'aiHand']: newHand,
        discardPile: newDiscardPile,
        currentSuit: card.suit,
        currentTurn: isPlayer ? 'ai' : 'player',
      };

      // If it's an 8, we need suit selection
      if (card.rank === '8') {
        if (isPlayer) {
          return { ...nextState, status: 'suit_selection', currentTurn: 'player' };
        } else {
          // AI picks a suit (most common in its hand)
          const suitCounts: Record<Suit, number> = { hearts: 0, diamonds: 0, clubs: 0, spades: 0 };
          newHand.forEach(c => suitCounts[c.suit]++);
          const bestSuit = (Object.keys(suitCounts) as Suit[]).reduce((a, b) => suitCounts[a] > suitCounts[b] ? a : b);
          return { ...nextState, currentSuit: bestSuit, currentTurn: 'player' };
        }
      }

      const winner = checkWinner(nextState);
      if (winner) {
        return { ...nextState, status: 'game_over', winner };
      }

      return nextState;
    });

    if (isPlayer) {
      setMessage(t('aiThinking') as string);
    }
  };

  const drawCard = (isPlayer: boolean) => {
    setGameState(prev => {
      if (prev.deck.length === 0) {
        setMessage(t('deckEmpty') as string);
        return { ...prev, currentTurn: isPlayer ? 'ai' : 'player' };
      }

      const newDeck = [...prev.deck];
      const drawnCard = newDeck.pop()!;
      const newHand = [...(isPlayer ? prev.playerHand : prev.aiHand), drawnCard];

      return {
        ...prev,
        deck: newDeck,
        [isPlayer ? 'playerHand' : 'aiHand']: newHand,
        currentTurn: isPlayer ? 'ai' : 'player',
      };
    });

    if (isPlayer) {
      setMessage(t('youDrew') as string);
    }
  };

  const selectSuit = (suit: Suit) => {
    setGameState(prev => ({
      ...prev,
      currentSuit: suit,
      status: 'playing',
      currentTurn: 'ai'
    }));
    const suitName = language === 'zh' ? (t(suit as any) as string) : suit.toUpperCase();
    setMessage((translations[language].youChose as any)(suitName));
  };

  // --- AI Logic ---
  useEffect(() => {
    if (gameState.status === 'playing' && gameState.currentTurn === 'ai') {
      const timer = setTimeout(() => {
        const playableCards = gameState.aiHand.filter(card => {
          const topCard = gameState.discardPile[gameState.discardPile.length - 1];
          return card.rank === '8' || card.rank === topCard.rank || card.suit === gameState.currentSuit;
        });

        if (playableCards.length > 0) {
          // AI plays a card (prefers non-8 if possible, or matches suit)
          const cardToPlay = playableCards.find(c => c.rank !== '8') || playableCards[0];
          playCard(cardToPlay.id, false);
          const suitName = language === 'zh' ? (t(cardToPlay.suit as any) as string) : cardToPlay.suit;
          setMessage((translations[language].aiPlayed as any)(cardToPlay.rank, suitName));
        } else {
          drawCard(false);
          setMessage(t('aiDrew') as string);
        }
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [gameState.status, gameState.currentTurn, gameState.aiHand, gameState.discardPile, gameState.currentSuit]);

  // --- UI Helpers ---

  const topDiscard = gameState.discardPile[gameState.discardPile.length - 1];

  return (
    <div className="min-h-screen bg-emerald-900 text-white font-sans selection:bg-emerald-500/30 overflow-hidden flex flex-col">
      {/* Header */}
      <header className="p-4 flex justify-between items-center bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-500/20">
            <span className="text-black font-black text-xl">8</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight hidden sm:block">{t('title') as string}</h1>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setLanguage(prev => prev === 'en' ? 'zh' : 'en')}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition-all text-xs font-bold uppercase tracking-wider"
            title="Switch Language"
          >
            <Languages className="w-4 h-4" />
            <span>{language === 'en' ? '中文' : 'EN'}</span>
          </button>
          {gameState.status !== 'idle' && (
            <button 
              onClick={goHome}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white"
              title="Back to Home"
            >
              <Home className="w-6 h-6" />
            </button>
          )}
          <button 
            onClick={() => setShowRules(true)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <Info className="w-6 h-6" />
          </button>
          <button 
            onClick={initGame}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="font-medium text-sm">{t('newGame') as string}</span>
          </button>
        </div>
      </header>

      {/* Game Board */}
      <main className="flex-1 relative flex flex-col items-center justify-between p-4 sm:p-8">
        
        {/* AI Hand */}
        <div className="w-full flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-white/60 mb-2">
            <Cpu className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">{t('opponentHand') as string} ({gameState.aiHand.length})</span>
          </div>
          <div className="flex -space-x-12 sm:-space-x-16 overflow-visible h-40 sm:h-52 items-center">
            <AnimatePresence>
              {gameState.aiHand.map((card, index) => (
                <PlayingCard 
                  key={card.id} 
                  card={card} 
                  isFlipped={false} 
                  className="scale-75 sm:scale-90"
                  style={{ zIndex: index }}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Center Area (Deck & Discard) */}
        <div className="flex items-center gap-8 sm:gap-16 my-8">
          {/* Draw Pile */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              {gameState.deck.length > 0 ? (
                <PlayingCard 
                  card={gameState.deck[0]} 
                  isFlipped={false} 
                  onClick={() => gameState.currentTurn === 'player' && drawCard(true)}
                  isPlayable={gameState.currentTurn === 'player' && gameState.status === 'playing'}
                  className="shadow-2xl"
                />
              ) : (
                <div className="w-24 h-36 sm:w-32 sm:h-48 rounded-xl border-2 border-dashed border-white/20 flex items-center justify-center">
                  <span className="text-white/20 text-xs font-bold uppercase">{t('empty') as string}</span>
                </div>
              )}
              {gameState.deck.length > 1 && (
                <div className="absolute -top-1 -left-1 w-full h-full bg-indigo-800 rounded-xl -z-10 border border-white/10" />
              )}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{t('drawPile') as string} ({gameState.deck.length})</span>
          </div>

          {/* Discard Pile */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <AnimatePresence mode="popLayout">
                {topDiscard && (
                  <PlayingCard 
                    key={topDiscard.id}
                    card={topDiscard} 
                    className="shadow-2xl"
                  />
                )}
              </AnimatePresence>
              
              {/* Current Suit Indicator (if 8 was played) */}
              {gameState.currentSuit && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center z-20 border-2 border-emerald-500"
                >
                  <SuitIcon suit={gameState.currentSuit} className="w-6 h-6" />
                </motion.div>
              )}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{t('discardPile') as string}</span>
          </div>
        </div>

        {/* Player Hand */}
        <div className="w-full flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-white/60 mb-2">
            <User className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">{t('yourHand') as string} ({gameState.playerHand.length})</span>
          </div>
          <div className="flex -space-x-12 sm:-space-x-16 overflow-x-auto pb-4 max-w-full px-8 items-center h-48 sm:h-64 no-scrollbar">
            <AnimatePresence>
              {gameState.playerHand.map((card, index) => (
                <PlayingCard 
                  key={card.id} 
                  card={card} 
                  isPlayable={isCardPlayable(card)}
                  onClick={() => playCard(card.id, true)}
                  style={{ zIndex: index }}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Status Message */}
        <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 pointer-events-none flex flex-col items-center">
          <motion.div 
            key={message}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "bg-black/40 backdrop-blur-xl px-6 py-3 rounded-full border border-white/10 shadow-2xl transition-colors",
              message === t('yourTurn') && "bg-yellow-500/20 border-yellow-500/50"
            )}
          >
            <p className={cn(
              "text-sm sm:text-base font-medium transition-colors",
              message === t('yourTurn') ? "text-yellow-400 font-bold" : "text-emerald-100"
            )}>
              {message}
            </p>
          </motion.div>
        </div>
      </main>

      {/* Suit Selection Modal */}
      <AnimatePresence>
        {gameState.status === 'suit_selection' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-slate-900 border border-white/10 p-8 rounded-3xl max-w-md w-full text-center shadow-2xl"
            >
              <h2 className="text-2xl font-bold mb-2">{t('crazy8') as string}</h2>
              <p className="text-slate-400 mb-8">{t('chooseSuit') as string}</p>
              
              <div className="grid grid-cols-2 gap-4">
                {SUITS.map(suit => (
                  <button
                    key={suit}
                    onClick={() => selectSuit(suit)}
                    className="flex flex-col items-center gap-3 p-6 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all group active:scale-95"
                  >
                    <SuitIcon suit={suit} className="w-12 h-12 transition-transform group-hover:scale-110" />
                    <span className="text-xs font-bold uppercase tracking-widest opacity-60">{t(suit as any) as string}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Over Modal */}
      <AnimatePresence>
        {gameState.status === 'game_over' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.8, rotate: -5 }}
              animate={{ scale: 1, rotate: 0 }}
              className="bg-white text-slate-900 p-10 rounded-[2.5rem] max-w-sm w-full text-center shadow-[0_0_50px_rgba(255,255,255,0.1)]"
            >
              <div className={cn(
                "w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center",
                gameState.winner === 'player' ? "bg-yellow-100 text-yellow-600" : "bg-slate-100 text-slate-600"
              )}>
                <Trophy className="w-10 h-10" />
              </div>
              
              <h2 className="text-4xl font-black mb-2 uppercase tracking-tight">
                {gameState.winner === 'player' ? t('youWin') : t('aiWin')}
              </h2>
              <p className="text-slate-500 mb-8 font-medium">
                {gameState.winner === 'player' 
                  ? t('winMsg')
                  : t('loseMsg')}
              </p>
              
              <button
                onClick={initGame}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
              >
                {t('playAgain') as string}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Idle / Start Screen */}
      <AnimatePresence>
        {gameState.status === 'idle' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-emerald-950 p-4 overflow-hidden"
          >
            {/* Decorative Background Cards */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <motion.div 
                initial={{ rotate: -20, x: -100, y: 100, opacity: 0 }}
                animate={{ rotate: -15, x: -50, y: 50, opacity: 0.4 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2"
              >
                <PlayingCard 
                  card={{ id: '8-hearts', suit: 'hearts', rank: '8', value: 8 }} 
                  className="scale-110 sm:scale-150 opacity-40 shadow-2xl"
                />
              </motion.div>
              <motion.div 
                initial={{ rotate: 20, x: 100, y: -100, opacity: 0 }}
                animate={{ rotate: 15, x: 50, y: -50, opacity: 0.4 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2"
              >
                <PlayingCard 
                  card={{ id: '8-spades', suit: 'spades', rank: '8', value: 8 }} 
                  className="scale-110 sm:scale-150 opacity-40 shadow-2xl"
                />
              </motion.div>
              <motion.div 
                initial={{ rotate: -5, y: 200, opacity: 0 }}
                animate={{ rotate: -10, y: 0, opacity: 0.2 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-sm"
              >
                <PlayingCard 
                  card={{ id: '8-diamonds', suit: 'diamonds', rank: '8', value: 8 }} 
                  className="scale-[2] sm:scale-[3] opacity-20"
                />
              </motion.div>
            </div>

            <div className="max-w-lg w-full text-center relative z-10">
              <motion.div 
                initial={{ y: -50 }}
                animate={{ y: 0 }}
                className="mb-12 relative inline-block"
              >
                <div className="absolute -inset-4 bg-yellow-500 blur-2xl opacity-20 animate-pulse" />
                <h1 className="text-6xl sm:text-8xl font-black italic tracking-tighter text-white relative">
                  JOANNE<br/>
                  <span className="text-yellow-500">{language === 'en' ? 'CRAZY EIGHTS' : '疯狂 8 点'}</span>
                </h1>
              </motion.div>

              <div className="space-y-4">
                <button
                  onClick={initGame}
                  className="w-full py-6 bg-white text-emerald-950 rounded-2xl font-black text-xl shadow-2xl hover:bg-emerald-50 transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  {t('startGame') as string}
                  <ChevronRight className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setShowRules(true)}
                  className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold transition-all border border-white/10"
                >
                  {t('howToPlay') as string}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rules Modal */}
      <AnimatePresence>
        {showRules && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowRules(false)}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              onClick={e => e.stopPropagation()}
              className="bg-slate-900 border border-white/10 p-8 rounded-3xl max-w-md w-full shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{t('gameRules') as string}</h2>
                <button onClick={() => setShowRules(false)} className="text-white/40 hover:text-white">✕</button>
              </div>
              
              <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-emerald-500/20 text-emerald-500 rounded flex-shrink-0 flex items-center justify-center font-bold">1</div>
                  <p>{t('rule1') as string}</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-emerald-500/20 text-emerald-500 rounded flex-shrink-0 flex items-center justify-center font-bold">2</div>
                  <p>{t('rule2') as string}</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-yellow-500/20 text-yellow-500 rounded flex-shrink-0 flex items-center justify-center font-bold">8</div>
                  <p><strong>{language === 'en' ? '8s are Wild!' : '8 是万能牌！'}</strong> {t('rule3') as string}</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-emerald-500/20 text-emerald-500 rounded flex-shrink-0 flex items-center justify-center font-bold">3</div>
                  <p>{t('rule4') as string}</p>
                </div>
              </div>

              <button
                onClick={() => setShowRules(false)}
                className="w-full mt-8 py-4 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-all"
              >
                {t('gotIt') as string}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
