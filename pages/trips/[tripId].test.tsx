// import dependencies
import React from 'react'

// import react-testing methods
import { render, fireEvent, waitFor, screen } from '@testing-library/react'

// add custom jest matchers from jest-dom
import '@testing-library/jest-dom'
import TripPage from './[tripId]'
import '../../components/StopList';
import useOffline from '../../hooks/useOffline';
import useNetworkInformation from '../../hooks/useNetworkInformation';

jest.mock('../../components/StopList');
jest.mock('../../hooks/useOffline');
jest.mock('../../hooks/useNetworkInformation');

const mockUseOffline = useOffline as jest.MockedFunction<typeof useOffline>;
const mockUseNetworkInformation = useNetworkInformation as jest.MockedFunction<typeof useNetworkInformation>;

describe("<TripPage /> Page", () => {

    beforeAll(() => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date("2022-07-01"));

        mockUseOffline.mockReturnValue([true]);
        mockUseNetworkInformation.mockReturnValue(['wifi']);
    })

    describe("Offline Alert", () => {
        it("should show an alert when the user is offline", () => {
            mockUseOffline.mockReturnValue([true]);
            render(<TripPage
                fallback={{"https://example.com:/123": {
                    route: []
                }}}
                description={{ tripId: "123", route_number: "T1", calendar_date: "2022-07-22" }}
            />);
    
            const offlineAlert = screen.queryByTestId("offline-alert");
    
            expect(offlineAlert).not.toBeNull();
        })
    
        it("should not show an alert when the user is online", () => {
            mockUseOffline.mockReturnValue([false]);
            render(<TripPage
                fallback={{"https://example.com:/123": {
                    route: []
                }}}
                description={{ tripId: "123", route_number: "T1", calendar_date: "2022-07-22" }}
            />);
    
            const offlineAlert = screen.queryByTestId("offline-alert");
    
            expect(offlineAlert).toBeNull();
        })
    })

    describe("Wifi Alert", () => {
        it("should show an alert when the user is not connected with wifi", () => {
            mockUseNetworkInformation.mockReturnValue(['wifi']);
            render(<TripPage
                fallback={{"https://example.com:/123": {
                    route: []
                }}}
                description={{ tripId: "123", route_number: "T1", calendar_date: "2022-07-22" }}
            />);
    
            const wifiAlert = screen.queryByTestId("wifi-alert");
    
            expect(wifiAlert).not.toBeNull();
        })
    
        it("should not show an alert when the user is connected with wifi", () => {
            mockUseNetworkInformation.mockReturnValue(['cellular']);
            render(<TripPage
                fallback={{"https://example.com:/123": {
                    route: []
                }}}
                description={{ tripId: "123", route_number: "T1", calendar_date: "2022-07-22" }}
            />);
    
            const wifiAlert = screen.queryByTestId("wifi-alert");
    
            expect(wifiAlert).toBeNull();
        })

        it("should not show an alert when network information isn't supported", () => {
            mockUseNetworkInformation.mockReturnValue([undefined]);
            render(<TripPage
                fallback={{"https://example.com:/123": {
                    route: []
                }}}
                description={{ tripId: "123", route_number: "T1", calendar_date: "2022-07-22" }}
            />);
    
            const wifiAlert = screen.queryByTestId("wifi-alert");
    
            expect(wifiAlert).toBeNull();
        })
    })

});