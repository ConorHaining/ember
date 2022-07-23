// import dependencies
import React from 'react'

// import react-testing methods
import { render, fireEvent, waitFor, screen } from '@testing-library/react'

// add custom jest matchers from jest-dom
import '@testing-library/jest-dom'
import TripPage from './[tripId]'

describe("<TripPage /> Page", () => {

    beforeAll(() => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date("2022-07-01"));
    })

    it.todo("should show an alert when the user is offline", () => {
        const goOffline = new window.Event('offline');
        window.dispatchEvent(goOffline);
        render(<TripPage
            route={[]}
            description={{ route_number: "T1", calendar_date: "2022-07-22" }}
        />);

        const offlineAlert = screen.queryByTestId("offline-alert");

        expect(offlineAlert).not.toBeNull();
    })

    it("should not show an alert when the user is online", () => {
        render(<TripPage
            route={[]}
            description={{ route_number: "T1", calendar_date: "2022-07-22" }}
        />);

        const offlineAlert = screen.queryByTestId("offline-alert");

        expect(offlineAlert).toBeNull();
    })

});