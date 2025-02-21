import React, { useCallback, useEffect, useRef, useState } from 'react';

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
  const gameBoardRef = useRef<HTMLDivElement>(null);

  const moveSnake = useCallback(() => {
    setSnake((prevSnake) => {
      const newSnake = [...prevSnake];
      const head = newSnake[0];
      let newHead;

      switch (direction) {
        case 'UP':
          newHead = { x: head.x, y: head.y - 1 };
          break;
        case 'DOWN':
          newHead = { x: head.x, y: head.y + 1 };
          break;
        case 'LEFT':
          newHead = { x: head.x - 1, y: head.y };
          break;
        case 'RIGHT':
          newHead = { x: head.x + 1, y: head.y };
          break;
      }

      // Check for collision with walls
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        // Game Over
        // eslint-disable-next-line no-alert
        alert(`Game Over! Your score: ${score}`);
        setSnake([{ x: 5, y: 5 }]);
        setDirection('RIGHT');
        setFood({ x: 10, y: 10 });
        setScore(0);
        return prevSnake;
      }

      // Check for collision with self
      if (newSnake.slice(1).some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        // Game Over
        // eslint-disable-next-line no-alert
        alert(`Game Over! Your score: ${score}`);
        setSnake([{ x: 5, y: 5 }]);
        setDirection('RIGHT');
        setFood({ x: 10, y: 10 });
        setScore(0);
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
  }, [direction, food, score]);

  const changeDirection = useCallback((newDirection: Direction) => {
    setDirection(newDirection);
  }, []);

  useEffect(() => {
    const interval = setInterval(moveSnake, 200);
    return () => clearInterval(interval);
  }, [moveSnake]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          direction !== 'DOWN' && changeDirection('UP');
          break;
        case 'ArrowDown':
          direction !== 'UP' && changeDirection('DOWN');
          break;
        case 'ArrowLeft':
          direction !== 'RIGHT' && changeDirection('LEFT');
          break;
        case 'ArrowRight':
          direction !== 'LEFT' && changeDirection('RIGHT');
          break;
      }
    };

    gameBoardRef.current?.focus();
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [changeDirection, direction]);

  return (
    <div
      ref={gameBoardRef}
      style={{ outline: 'none' }}
      data-testid="game-board"
    >
      <h1>Snake Game</h1>
      <div>
        Score:
        {' '}
        {score}
      </div>
      <div
        style={{
          width: `${GRID_SIZE * 20}px`,
          height: `${GRID_SIZE * 20}px`,
          border: '1px solid black',
          position: 'relative',
        }}
      >
        {snake.map(segment => (
          <div
            key={`${segment.x}-${segment.y}`}
            style={{
              position: 'absolute',
              top: `${segment.y * 20}px`,
              left: `${segment.x * 20}px`,
              width: '20px',
              height: '20px',
              backgroundColor: 'green',
            }}
          />
        ))}
        <div
          style={{
            position: 'absolute',
            top: `${food.y * 20}px`,
            left: `${food.x * 20}px`,
            width: '20px',
            height: '20px',
            backgroundColor: 'red',
          }}
        />
      </div>
    </div>
  );
};

export default SnakeGame;
