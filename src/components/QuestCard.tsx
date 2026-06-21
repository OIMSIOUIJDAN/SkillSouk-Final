import React from 'react';
import { Quest } from '../types';

interface QuestCardProps {
  quest: Quest;
}

const QuestCard: React.FC<QuestCardProps> = ({ quest }) => {
  const progressPercentage = (quest.progress / quest.total) * 100;
  const isComplete = quest.progress >= quest.total;

  return (
    <div className={`glass rounded-xl p-4 transition-all duration-300 hover:bg-white/15 border ${isComplete ? 'border-gold' : 'border-white/10'}`}>
      <div className="flex items-start gap-4">
        {/* Emoji */}
        <div className="text-3xl flex-shrink-0">{quest.emoji}</div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className={`font-display font-bold text-sm md:text-base ${isComplete ? 'text-gold' : 'text-cream'}`}>
              {quest.title}
            </h4>
            <span className="text-cream/50 text-xs whitespace-nowrap">{quest.deadline}</span>
          </div>
          <p className="text-cream/60 text-xs mb-3">{quest.description}</p>

          {/* Progress Bar */}
          <div className="mb-2">
            <div className="h-2 bg-night-lighter/50 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isComplete
                    ? 'bg-gradient-to-r from-gold to-yellow-400'
                    : 'bg-gradient-to-r from-turquoise to-teal-400'
                }`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Progress Text & Rewards */}
          <div className="flex items-center justify-between text-xs">
            <span className={`${isComplete ? 'text-gold' : 'text-turquoise'}`}>
              {quest.progress} / {quest.total}
            </span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-cream/70">
                <span>🪙</span>
                <span className="text-gold">+{quest.reward}</span>
              </span>
              <span className="flex items-center gap-1 text-cream/70">
                <span>⚡</span>
                <span className="text-turquoise">+{quest.xpReward} XP</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestCard;
