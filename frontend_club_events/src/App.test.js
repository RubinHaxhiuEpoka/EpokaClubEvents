

import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Events from './components/Events/Events';
import axios from './__mocks__/axios';

test('renders Navbar component', () => {
 const { getByAltText, getByText } = render(<MemoryRouter>
  <Navbar />
</MemoryRouter>);
 const logo = getByAltText(/logo/i);
 const myEventsLink = getByText(/My Events/i);
 const logoutLink = getByText(/Logout/i);

 expect(logo).toBeInTheDocument();
 expect(myEventsLink).toBeInTheDocument();
 expect(logoutLink).toBeInTheDocument();
});

test('Logout function works correctly', () => {
  render(<MemoryRouter>
    <Navbar />
  </MemoryRouter>);
  const logoutLink = screen.getByText('Logout');
  fireEvent.click(logoutLink);
  expect(localStorage.getItem('token')).toBeNull();
 });
 
 test('Logout function works without a token', () => {
  localStorage.removeItem('token');
  render(<MemoryRouter>
    <Navbar />
  </MemoryRouter>);
  const logoutLink = screen.getByText('Logout');
  fireEvent.click(logoutLink);

 });