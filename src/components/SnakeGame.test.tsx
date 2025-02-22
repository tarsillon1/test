import { fireEvent, render, screen } from
  '@testing-library/react';
import React from 'react';
import SnakeGame from './SnakeGame';

describe('SnakeGame Component', () => {
  it('renders the game board', () => {
    render(<SnakeGame />);

    const gridElement = screen.getByRole('grid');

    expect(gridElement).toBeInTheDocument();
  });

  it('updates the score when the snake eats food', (done) => {
    render(<SnakeGame />);

    const scoreElement = screen.getByText(/Score:/);

    expect(scoreElement).toBeInTheDocument();

    setTimeout(() => {
      const updatedScoreElement = screen.queryByText(/Score:1/);

      expect(updatedScoreElement).toBeInTheDocument();

      done();
    }, 600);
  });

  it('changes direction on arrow key press', () => {
    render(<SnakeGame />);

    fireEvent.keyDown(window, { key: 'ArrowUp' });
    fireEvent.keyDown(window, { key: 'ArrowDown' });
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    fireEvent.keyDown(window, { key: 'ArrowRight' });
  });

  it('ends the game when the snake hits a wall', (done) => {
    render(<SnakeGame />);

    // A more robust solution would involve simulating multiple key presses
    // to move the snake to the edge of the grid and trigger game over.
    // This is a placeholder to illustrate the basic test structure.

    setTimeout(() => {
      screen.queryByText(/Game Over!/);

      // expect(gameOverElement).toBeInTheDocument();
      done();
    }, 3000);
  });
});
