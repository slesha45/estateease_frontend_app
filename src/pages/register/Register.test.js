import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Register from './Register'; // Adjust the import path as necessary

// Mock the toast module
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));
 

describe('Register Component Tests', () => {

  test('Should show validation errors when required fields are empty', async () => {
    render(<Register />);

    fireEvent.click(screen.getByText('Register'));

    await waitFor(() => {
      expect(screen.getByText('First name is required!')).toBeInTheDocument();
      expect(screen.getByText('Last name is required!')).toBeInTheDocument();
      expect(screen.getByText('Email is required!')).toBeInTheDocument();
      expect(screen.getByText('Phone Number is required!')).toBeInTheDocument();
      expect(screen.getByText('Password is required!')).toBeInTheDocument();
      expect(screen.getByText('Confirm password is required!')).toBeInTheDocument();
    });
  });

  test('Should show validation errors when password and confirm password do not match', async () => {
    render(<Register />);

    fireEvent.change(screen.getByPlaceholderText('Enter your first name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your last name'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'test@email' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your phone number'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'password' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), { target: { value: 'password1' } });
    fireEvent.click(screen.getByText('Register'));
  })

  test('Should display error message if API call fails', async () => {
    render(<Register />);
    fireEvent.click(screen.getByText('Register'));
  })
});
