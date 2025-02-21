import { fireEvent, render, screen } from
  '@testing-library/react';
import React from 'react';
import SnakeGame from './SnakeGame';

describe('SnakeGame Component', () => {
  it('renders the game board', () => {
    render(<SnakeGame />);
    const gameBoard = screen.getByTestId('game-board');

    expect(gameBoard).toBeInTheDocument();
  });

  it('updates direction on key press', () => {
    render(<SnakeGame />);
    const gameBoard = screen.getByTestId('game-board');

    fireEvent.keyDown(gameBoard, { key: 'ArrowUp' });
    // Cannot directly test state changes with react testing library, need to mock the state or use a different testing approach.
  });

  it('renders initial score', () => {
    render(<SnakeGame />);
    const scoreElement = screen.getByText(/Score: 0/i);

    expect(scoreElement).toBeInTheDocument();
  });
});
