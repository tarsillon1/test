'use client';

import React, { useCallback, useEffect, useState } from 'react';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

type Position = {
  x: number;
  y: number;
};

const GRID_SIZE = 20;

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Position[]>([{ x: 5, y: 5 }]);
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [food, setFood] = useState<Position>({ x: 10, y: 10 });
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const moveSnake = useCallback(() => {
    if (gameOver) {
      return;
    }

    setSnake((prevSnake) => {
      const newSnake = [...prevSnake];
      const head = newSnake[0];
      let newHead: Position;

      switch (direction) {
        case 'UP':
          newHead = { x: head?.x ?? 0, y: (head?.y ?? 0) - 1 };
          break;
        case 'DOWN':
          newHead = { x: head?.x ?? 0, y: (head?.y ?? 0) + 1 };
          break;
        case 'LEFT':
          newHead = { x: (head?.x ?? 0) - 1, y: head?.y ?? 0 };
          break;
        case 'RIGHT':
          newHead = { x: (head?.x ?? 0) + 1, y: head?.y ?? 0 };
          break;
        default:
          newHead = { x: head?.x ?? 0, y: head?.y ?? 0 };
          break;
      }

      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        setGameOver(true);
        return prevSnake;
      }

      // Check for self-collision
      if (newSnake.slice(1).some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      newSnake.unshift(newHead);
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(score + 1);
        setFood({ x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) });
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, score, gameOver]);

  const changeDirection = useCallback((newDirection: Direction) => {
    setDirection(newDirection);
  }, [setDirection]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          changeDirection('UP');
          break;
        case 'ArrowDown':
          changeDirection('DOWN');
          break;
        case 'ArrowLeft':
          changeDirection('LEFT');
          break;
        case 'ArrowRight':
          changeDirection('RIGHT');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [changeDirection]);

  useEffect(() => {
    const interval = setInterval(moveSnake, 200);
    return () => clearInterval(interval);
  }, [moveSnake]);

  const renderGrid = () => {
    const rows = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      const cells = [];
      for (let x = 0; x < GRID_SIZE; x++) {
        const isSnake = snake.some(segment => segment.x === x && segment.y === y);
        const isFood = food.x === x && food.y === y;
        cells.push(
          <div
            key={`${x}-${y}`}
            className={`cell ${isSnake ? 'snake' : ''} ${isFood ? 'food' : ''}`}
            style={{ width: `${20}px`, height: `${20}px`, backgroundColor: isSnake ? 'green' : isFood ? 'red' : 'white' }}
          />,
        );
      }
      rows.push(
        <div key={y} className="row" style={{ display: 'flex' }}>
          {cells}
        </div>,
      );
    }
    return rows;
  };

  return (
    <div>
      <h1>Snake Game</h1>
      <div>
        Score:
        {score}
      </div>
      {gameOver && <div>Game Over!</div>}
      <div role="grid" className="grid" style={{ display: 'flex', flexDirection: 'column' }}>
        {renderGrid()}
      </div>
    </div>
  );
};

export default SnakeGame;
