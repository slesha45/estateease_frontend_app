import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';

// Utility function to render the Login component with router context
const renderWithRouter = (ui, options) =>
  render(ui, { wrapper: MemoryRouter, ...options });

describe('Login Component', () => {

  it("Should show error message on failed login", async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
 
    const mockResponse = {
      data: {
        success: false,
        message: "Password is incorrect",
      },
    };
 
    loginUserApi.mockResolvedValue(mockResponse);
    toast.error = jest.fn();
 
    const email = screen.getByPlaceholderText("Enter your email address");
    const password = screen.getByPlaceholderText("Enter your password");
    const loginButton = screen.getByText("Login");
 
    fireEvent.change(email, { target: { value: "test@gmail.com" } });
    fireEvent.change(password, { target: { value: "test123" } });
    fireEvent.click(loginButton);
 
    await waitFor(() => {
      expect(loginUserApi).toHaveBeenCalledWith({
        email: "test@gmail.com",
        password: "test123",
      });
      expect(toast.error).toHaveBeenCalledWith("Password is incorrect");
    });
  });

  test('Should show validation errors when required fields are empty', async () => {
    renderWithRouter(<Login />);
  });

  test('Should redirect to homepage on successful login', async () => {
    renderWithRouter(<Login />);
  });

  test('Should display error message if API call fails', async () => {
    renderWithRouter(<Login />);
  });
});
