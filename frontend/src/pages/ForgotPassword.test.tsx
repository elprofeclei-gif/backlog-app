import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ForgotPassword from './ForgotPassword';

describe('ForgotPassword Page', () => {
  it('debe renderizar el título y el botón de enviar', () => {
    render(<ForgotPassword />);

    // Buscamos el título
    const title = screen.getByText(/Recuperar Contraseña/i);
    expect(title).toBeInTheDocument();

    // Buscamos el botón
    const button = screen.getByRole('button', { name: /Enviar Enlace/i });
    expect(button).toBeInTheDocument();
  });
});
