// import dependencies
import React from 'react'

// import react-testing methods
import { render, fireEvent, waitFor, screen } from '@testing-library/react'

// add custom jest matchers from jest-dom
import '@testing-library/jest-dom'
import { StopPoint } from './StopPoint'

describe("<StopPoint /> Component", () => {

    beforeAll(() => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date("2022-07-01"));
    })

    describe("timeDifference", () => {
        it("should display how many minutes late the stop was", () => {
            render(<StopPoint
                destination={''}
                estimatedDepartureTime={''}
                actualDepartureTime={'2022-06-02T13:00:00+00:00'}
                scheduledDepartureTime={'2022-06-02T12:58:00+00:00'}
                isSkipped={false}
                reservationCutoffInMinutes={0}
                isTerminating={false} actualArrivalTime={''} scheduledArrivalTime={''} />)

            const timestamp = screen.queryByTestId("timestamp")

            expect(timestamp.innerHTML).toContain("(-2)");
        });

        it("should display how many minutes early the stop was", () => {
            render(<StopPoint
                destination={''}
                estimatedDepartureTime={''}
                actualDepartureTime={'2022-06-02T13:00:00+00:00'}
                scheduledDepartureTime={'2022-06-02T13:05:00+00:00'}
                isSkipped={false}
                reservationCutoffInMinutes={0}
                isTerminating={false} actualArrivalTime={''} scheduledArrivalTime={''} />)

            const timestamp = screen.queryByTestId("timestamp")

            expect(timestamp.innerHTML).toContain("(+5)");
        });

        it("should not display a difference if it is a minute early", () => {
            render(<StopPoint
                destination={''}
                estimatedDepartureTime={''}
                actualDepartureTime={'2022-06-02T13:00:00+00:00'}
                scheduledDepartureTime={'2022-06-02T13:01:00+00:00'}
                isSkipped={false}
                reservationCutoffInMinutes={0}
                isTerminating={false} actualArrivalTime={''} scheduledArrivalTime={''} />)

            const timestamp = screen.queryByTestId("timestamp")

            expect(timestamp.innerHTML).not.toContain("(+1)");
        });

        it("should not display a difference if it is a minute late", () => {
            render(<StopPoint
                destination={''}
                estimatedDepartureTime={''}
                actualDepartureTime={'2022-06-02T13:00:00+00:00'}
                scheduledDepartureTime={'2022-06-02T12:59:00+00:00'}
                isSkipped={false}
                reservationCutoffInMinutes={0}
                isTerminating={false} actualArrivalTime={''} scheduledArrivalTime={''} />)

            const timestamp = screen.queryByTestId("timestamp")

            expect(timestamp.innerHTML).not.toContain("(+1)");
        });

        describe("Arriving", () => {
            it("should display how many minutes early the stop was when arriving", () => {
                render(<StopPoint
                    destination={''}
                    estimatedDepartureTime={''}
                    actualDepartureTime={''}
                    scheduledDepartureTime={''}
                    isSkipped={false}
                    reservationCutoffInMinutes={0}
                    isTerminating={true}
                    actualArrivalTime={'2022-06-02T13:00:00+00:00'}
                    scheduledArrivalTime={'2022-06-02T13:05:00+00:00'} />)
    
                const timestamp = screen.queryByTestId("timestamp")
    
                expect(timestamp.innerHTML).toContain("(+5)");
            });
    
            it("should display how many minutes late the stop was when arriving", () => {
                render(<StopPoint
                    destination={''}
                    estimatedDepartureTime={''}
                    actualDepartureTime={''}
                    scheduledDepartureTime={''}
                    isSkipped={false}
                    reservationCutoffInMinutes={0}
                    isTerminating={true}
                    actualArrivalTime={'2022-06-02T13:05:00+00:00'}
                    scheduledArrivalTime={'2022-06-02T13:00:00+00:00'} />)
    
                const timestamp = screen.queryByTestId("timestamp")
    
                expect(timestamp.innerHTML).toContain("(-5)");
            });

            it("should not display how many minutes late the stop was when arriving and it is less than a minute", () => {
                render(<StopPoint
                    destination={''}
                    estimatedDepartureTime={''}
                    actualDepartureTime={''}
                    scheduledDepartureTime={''}
                    isSkipped={false}
                    reservationCutoffInMinutes={0}
                    isTerminating={true}
                    actualArrivalTime={'2022-06-02T13:01:00+00:00'}
                    scheduledArrivalTime={'2022-06-02T13:00:00+00:00'} />)
    
                const timestamp = screen.queryByTestId("timestamp")
    
                expect(timestamp.innerHTML).not.toContain("(-1)");
            });

            it("should not display how many minutes early the stop was when arriving and it is less than a minute", () => {
                render(<StopPoint
                    destination={''}
                    estimatedDepartureTime={''}
                    actualDepartureTime={''}
                    scheduledDepartureTime={''}
                    isSkipped={false}
                    reservationCutoffInMinutes={0}
                    isTerminating={true}
                    actualArrivalTime={'2022-06-02T13:00:00+00:00'}
                    scheduledArrivalTime={'2022-06-02T13:01:00+00:00'} />)
    
                const timestamp = screen.queryByTestId("timestamp")
    
                expect(timestamp.innerHTML).not.toContain("(+1)");
            });
        })
    })

    describe("calculateStopVerb", () => {

        it("should use the 'Scheduled' verb when a scheduled time is present & in the future", () => {
            render(<StopPoint
                destination={''}
                estimatedDepartureTime={''}
                actualDepartureTime={''}
                scheduledDepartureTime={"2022-07-02T13:00:00+00:00"}
                isSkipped={false}
                reservationCutoffInMinutes={0}
                isTerminating={false} actualArrivalTime={''} scheduledArrivalTime={''} />)

            const timestamp = screen.queryByTestId("timestamp")

            expect(timestamp.innerHTML).toContain("Scheduled at");
        });

        it("should use the 'Departed' verb when an actual time is present & in the past", () => {
            render(<StopPoint
                destination={''}
                estimatedDepartureTime={''}
                actualDepartureTime={'2022-06-02T13:00:00+00:00'}
                scheduledDepartureTime={''}
                isSkipped={false}
                reservationCutoffInMinutes={0}
                isTerminating={false} actualArrivalTime={''} scheduledArrivalTime={''} />)

            const timestamp = screen.queryByTestId("timestamp")

            expect(timestamp.innerHTML).toContain("Departed at");
        });

        it("should use the 'Estimated' verb when an estimate time is present & in the future", () => {
            render(<StopPoint
                destination={''}
                estimatedDepartureTime={'2022-07-02T13:00:00+00:00'}
                actualDepartureTime={''}
                scheduledDepartureTime={''}
                isSkipped={false}
                reservationCutoffInMinutes={0}
                isTerminating={false} actualArrivalTime={''} scheduledArrivalTime={''} />)

            const timestamp = screen.queryByTestId("timestamp")

            expect(timestamp.innerHTML).toContain("Estimated at");
        });

        it("should not render if a stop has been skipped", () => {
            render(<StopPoint
                destination={''}
                estimatedDepartureTime={'2022-07-02T13:00:00+00:00'}
                actualDepartureTime={''}
                scheduledDepartureTime={''}
                isSkipped={true}
                reservationCutoffInMinutes={0}
                isTerminating={false} actualArrivalTime={''} scheduledArrivalTime={''} />)

            const timestamp = screen.queryByTestId("timestamp")

            expect(timestamp).toBeNull();
        })
    });
});