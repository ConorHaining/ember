// import dependencies
import React from 'react'

// import react-testing methods
import { render, fireEvent, waitFor, screen } from '@testing-library/react'

// add custom jest matchers from jest-dom
import '@testing-library/jest-dom'
import TripPage from './[tripId]'
import useOffline from '../../hooks/useOffline';

jest.mock('../../hooks/useOffline');
const mockUseOffline = useOffline as jest.MockedFunction<typeof useOffline>;

describe("<TripPage /> Page", () => {

    beforeAll(() => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date("2022-07-01"));
    })

    it("should show an alert when the user is offline", () => {
        mockUseOffline.mockReturnValue([true]);
        render(<TripPage
            route={[]}
            description={{ route_number: "T1", calendar_date: "2022-07-22" }}
        />);

        const offlineAlert = screen.queryByTestId("offline-alert");

        expect(offlineAlert).not.toBeNull();
    })

    it("should not show an alert when the user is online", () => {
        mockUseOffline.mockReturnValue([false]);
        render(<TripPage
            route={[]}
            description={{ route_number: "T1", calendar_date: "2022-07-22" }}
        />);

        const offlineAlert = screen.queryByTestId("offline-alert");

        expect(offlineAlert).toBeNull();
    })

});