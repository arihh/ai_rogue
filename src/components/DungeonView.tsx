// Dungeon View Component for Agentダンジョン

import { DungeonCell, Player, Enemy, Item } from '../types/game';
import { positionsEqual } from '../utils/gameUtils';

interface DungeonViewProps {
  dungeon: DungeonCell[][];
  player: Player;
  enemies: Enemy[];
  items: Item[];
}

export function DungeonView({ dungeon, player, enemies, items }: DungeonViewProps) {
  const renderCell = (cell: DungeonCell, rowIndex: number, colIndex: number) => {
    const position = { x: colIndex, y: rowIndex };
    
    // Check what's at this position
    const isPlayer = positionsEqual(player.position, position);
    const enemy = enemies.find(e => positionsEqual(e.position, position));
    const item = items.find(i => positionsEqual(i.position, position));
    
    let cellContent = '';
    let cellClass = `dungeon-cell ${cell.type}`;
    
    if (isPlayer) {
      cellContent = player.symbol;
      cellClass += ' player-cell';
    } else if (enemy) {
      cellContent = enemy.symbol;
      cellClass += ' enemy-cell';
    } else if (item) {
      cellContent = item.symbol;
      cellClass += ' item-cell';
    } else {
      switch (cell.type) {
        case 'wall':
          cellContent = '🧱';
          break;
        case 'floor':
          cellContent = '⬜';
          break;
        case 'goal':
          cellContent = '🎯';
          break;
        default:
          cellContent = '⬜';
      }
    }
    
    return (
      <div 
        key={`${rowIndex}-${colIndex}`}
        className={cellClass}
        data-x={colIndex}
        data-y={rowIndex}
      >
        {cellContent}
      </div>
    );
  };

  return (
    <div className="dungeon-view">
      <div className="dungeon-grid">
        {dungeon.map((row, rowIndex) => (
          <div key={rowIndex} className="dungeon-row">
            {row.map((cell, colIndex) => renderCell(cell, rowIndex, colIndex))}
          </div>
        ))}
      </div>
    </div>
  );
}