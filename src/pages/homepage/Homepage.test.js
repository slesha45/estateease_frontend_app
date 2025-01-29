import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { getPropertyCount, propertyPagination } from '../../apis/Api';
import Homepage from './Homepage';

// Mock the API calls
jest.mock('../../apis/Api', () => ({
    getPropertyCount: jest.fn(),
    propertyPagination: jest.fn(),
}));

describe('Homepage Component Tests', () => {

    beforeEach(() => {
        getPropertyCount.mockResolvedValue({ data: { propertyCount: 16 } });
        propertyPagination.mockResolvedValue({ data: { property: [{ _id: '1', title: 'Property 1', price: 100 }, { _id: '2', title: 'Property 2', price: 200 }] } });
    });

    test('Should render carousel images', () => {
        render(<Homepage />);
        const carouselImages = screen.getAllByRole('img');
        expect(carouselImages.length).toBe(3);
    });

    test('Should handle API errors gracefully', async () => {
        getPropertyCount.mockRejectedValue({ response: { data: { message: 'Error fetching property count' } } });
        render(<Homepage />);
        await waitFor(() => {
            expect(screen.getByText('Error fetching property count')).toBeInTheDocument();
        });
    });

    test('Should update search query and fetch properties', async () => {
        render(<Homepage />);
        fireEvent.change(screen.getByPlaceholderText('Search Area or Property ID'), { target: { value: 'New Query' } });
        await waitFor(() => {
            expect(propertyPagination).toHaveBeenCalledWith(1, 8, 'New Query', 'asc');
        });
    });

    test('Should update sort order and fetch properties', async () => {
        render(<Homepage />);
        fireEvent.click(screen.getByText('Sort by'));
        fireEvent.click(screen.getByText('Price : High to Low'));
        await waitFor(() => {
            expect(propertyPagination).toHaveBeenCalledWith(1, 8, '', 'desc');
        });
    });

    test('Should display error message when propertyPagination API fails', async () => {
        propertyPagination.mockRejectedValue({ response: { data: { message: 'Error fetching properties' } } });
        render(<Homepage />);
        await waitFor(() => {
            expect(screen.getByText('Error fetching properties')).toBeInTheDocument();
        });
    });

    test('Should reset search query and sort order on unmount', () => {
        const { unmount } = render(<Homepage />);
        unmount();
        expect(screen.queryByPlaceholderText('Search Area or Property ID')).not.toBeInTheDocument();
        expect(screen.queryByText('Sort by')).not.toBeInTheDocument();
    });
});
