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

    describe("Lateness Indicator", () => {
        it("should display how many minutes late the stop was", () => {
            render(<StopPoint
                destination={''}
                estimatedDepartureTime={''}
                actualDepartureTime={'2022-06-02T13:00:00+00:00'}
                scheduledDepartureTime={'2022-06-02T12:58:00+00:00'}
                isSkipped={false}
                reservationCutoffInMinutes={0}
                isTerminating={false} actualArrivalTime={''} scheduledArrivalTime={''} isOrigin={false} estimatedArrivalTime={''} />)

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
                isTerminating={false} actualArrivalTime={''} scheduledArrivalTime={''} isOrigin={false} estimatedArrivalTime={''} />)

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
                isTerminating={false} actualArrivalTime={''} scheduledArrivalTime={''} isOrigin={false} estimatedArrivalTime={''} />)

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
                isTerminating={false} actualArrivalTime={''} scheduledArrivalTime={''} isOrigin={false} estimatedArrivalTime={''} />)

            const timestamp = screen.queryByTestId("timestamp")

            expect(timestamp.innerHTML).not.toContain("(+1)");
        });

        describe("Arriving", () => {
            it("should display how many minutes early the stop was when arriving (actual)", () => {
                render(<StopPoint
                    destination={''}
                    estimatedDepartureTime={''}
                    actualDepartureTime={''}
                    scheduledDepartureTime={''}
                    isSkipped={false}
                    reservationCutoffInMinutes={0}
                    isTerminating={true}
                    actualArrivalTime={'2022-06-02T13:00:00+00:00'}
                    scheduledArrivalTime={'2022-06-02T13:05:00+00:00'} isOrigin={false} estimatedArrivalTime={''} />)
    
                const timestamp = screen.queryByTestId("timestamp")
    
                expect(timestamp.innerHTML).toContain("(+5)");
            });
    
            it("should display how many minutes late the stop was when arriving (actual)", () => {
                render(<StopPoint
                    destination={''}
                    estimatedDepartureTime={''}
                    actualDepartureTime={''}
                    scheduledDepartureTime={''}
                    isSkipped={false}
                    reservationCutoffInMinutes={0}
                    isTerminating={true}
                    actualArrivalTime={'2022-06-02T13:05:00+00:00'}
                    scheduledArrivalTime={'2022-06-02T13:00:00+00:00'} isOrigin={false} estimatedArrivalTime={''} />)
    
                const timestamp = screen.queryByTestId("timestamp")
    
                expect(timestamp.innerHTML).toContain("(-5)");
            });

            it("should display how many minutes early the stop was when arriving (estimated)", () => {
                render(<StopPoint
                    destination={''}
                    estimatedDepartureTime={''}
                    actualDepartureTime={''}
                    scheduledDepartureTime={''}
                    isSkipped={false}
                    reservationCutoffInMinutes={0}
                    isTerminating={true}
                    actualArrivalTime={''}
                    scheduledArrivalTime={'2022-06-02T13:05:00+00:00'} isOrigin={false} estimatedArrivalTime={'2022-06-02T13:00:00+00:00'} />)
    
                const timestamp = screen.queryByTestId("timestamp")
    
                expect(timestamp.innerHTML).toContain("(+5)");
            });
    
            it("should display how many minutes late the stop was when arriving (estimated)", () => {
                render(<StopPoint
                    destination={''}
                    estimatedDepartureTime={''}
                    actualDepartureTime={''}
                    scheduledDepartureTime={''}
                    isSkipped={false}
                    reservationCutoffInMinutes={0}
                    isTerminating={true}
                    actualArrivalTime={''}
                    scheduledArrivalTime={'2022-06-02T13:00:00+00:00'} isOrigin={false} estimatedArrivalTime={'2022-06-02T13:05:00+00:00'} />)
    
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
                    scheduledArrivalTime={'2022-06-02T13:00:00+00:00'} isOrigin={false} estimatedArrivalTime={''} />)
    
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
                    scheduledArrivalTime={'2022-06-02T13:01:00+00:00'} isOrigin={false} estimatedArrivalTime={''} />)
    
                const timestamp = screen.queryByTestId("timestamp")
    
                expect(timestamp.innerHTML).not.toContain("(+1)");
            });
        })
    })

    describe("calculateStopVerb", () => {

        it("should use the 'Arrived' verb when isTerminating is true, and there is an actual time", () => {
            render(<StopPoint
                destination={''}
                estimatedDepartureTime={''}
                actualDepartureTime={''}
                scheduledDepartureTime={""}
                isSkipped={false}
                reservationCutoffInMinutes={0}
                isTerminating={true}
                actualArrivalTime={'2022-07-02T13:05:00+00:00'}
                scheduledArrivalTime={'2022-07-02T13:00:00+00:00'} isOrigin={false} estimatedArrivalTime={''} />)

            const timestamp = screen.queryByTestId("timestamp")

            expect(timestamp.innerHTML).toContain("Arrived at");
        });

        it("should use the 'Arriving' verb when isTerminating is true, there is a scheduled time but no actual time", () => {
            render(<StopPoint
                destination={''}
                estimatedDepartureTime={''}
                actualDepartureTime={''}
                scheduledDepartureTime={""}
                isSkipped={false}
                reservationCutoffInMinutes={0}
                isTerminating={true}
                actualArrivalTime={''}
                scheduledArrivalTime={'2022-07-02T13:00:00+00:00'} isOrigin={false} estimatedArrivalTime={''} />)

            const timestamp = screen.queryByTestId("timestamp")

            expect(timestamp.innerHTML).toContain("Arriving at");
        });

        it("should use the 'Scheduled' verb when a scheduled time is present & in the future", () => {
            render(<StopPoint
                destination={''}
                estimatedDepartureTime={''}
                actualDepartureTime={''}
                scheduledDepartureTime={"2022-07-02T13:00:00+00:00"}
                isSkipped={false}
                reservationCutoffInMinutes={0}
                isTerminating={false} actualArrivalTime={''} scheduledArrivalTime={''} isOrigin={false} estimatedArrivalTime={''} />)

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
                isTerminating={false} actualArrivalTime={''} scheduledArrivalTime={''} isOrigin={false} estimatedArrivalTime={''} />)

            const timestamp = screen.queryByTestId("timestamp")

            expect(timestamp.innerHTML).toContain("Departed at");
        });

        it("should use the 'Estimated' verb when a depature estimate time is present & in the future, and it is not terminating", () => {
            render(<StopPoint
                destination={''}
                estimatedDepartureTime={'2022-07-02T13:00:00+00:00'}
                actualDepartureTime={''}
                scheduledDepartureTime={''}
                isSkipped={false}
                reservationCutoffInMinutes={0}
                isTerminating={false} actualArrivalTime={''} scheduledArrivalTime={''} isOrigin={false} estimatedArrivalTime={''} />)

            const timestamp = screen.queryByTestId("timestamp")

            expect(timestamp.innerHTML).toContain("Estimated at");
        });

        it("should use the 'Estimated' verb when an arrival estimate time is present & in the future, and it is not terminating", () => {
            render(<StopPoint
                destination={''}
                estimatedDepartureTime={''}
                actualDepartureTime={''}
                scheduledDepartureTime={''}
                isSkipped={false}
                reservationCutoffInMinutes={0}
                isTerminating={true} actualArrivalTime={''} scheduledArrivalTime={''} isOrigin={false} estimatedArrivalTime={'2022-07-02T13:00:00+00:00'} />)

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
                isTerminating={false} actualArrivalTime={''} scheduledArrivalTime={''} isOrigin={false} estimatedArrivalTime={''} />)

            const timestamp = screen.queryByTestId("timestamp")

            expect(timestamp).toBeNull();
        })
    });

    describe("calculateStopDots", () => {
        it("should always include the dot class to position the dots", () => {
            render(<StopPoint
                destination={''}
                estimatedDepartureTime={''}
                actualDepartureTime={''}
                scheduledDepartureTime={""}
                isSkipped={false}
                reservationCutoffInMinutes={0}
                isTerminating={true}
                actualArrivalTime={'2022-07-02T13:05:00+00:00'}
                scheduledArrivalTime={'2022-07-02T13:00:00+00:00'}
                isOrigin={false} estimatedArrivalTime={''} />)

            const stopDot = screen.queryByTestId("stop-dot")

            expect(stopDot.classList.value).toContain("dot");
        });

        it("should display a origin dot when isOrigin is true", () => {
            render(<StopPoint
                destination={''}
                estimatedDepartureTime={''}
                actualDepartureTime={''}
                scheduledDepartureTime={""}
                isSkipped={false}
                reservationCutoffInMinutes={0}
                isTerminating={false}
                actualArrivalTime={'2022-07-02T13:05:00+00:00'}
                scheduledArrivalTime={'2022-07-02T13:00:00+00:00'}
                isOrigin={true} estimatedArrivalTime={''} />)

            const stopDot = screen.queryByTestId("stop-dot")

            expect(stopDot.classList.value).toContain("originDot");
        });

        it("should display a terminating dot when isTerminating is true", () => {
            render(<StopPoint
                destination={''}
                estimatedDepartureTime={''}
                actualDepartureTime={''}
                scheduledDepartureTime={""}
                isSkipped={false}
                reservationCutoffInMinutes={0}
                isTerminating={true}
                actualArrivalTime={'2022-07-02T13:05:00+00:00'}
                scheduledArrivalTime={'2022-07-02T13:00:00+00:00'}
                isOrigin={false} estimatedArrivalTime={''} />)

            const stopDot = screen.queryByTestId("stop-dot")

            expect(stopDot.classList.value).toContain("terminatingDot");
        });

        it("should display a skipped dot when isSkipped is true", () => {
            render(<StopPoint
                destination={''}
                estimatedDepartureTime={''}
                actualDepartureTime={''}
                scheduledDepartureTime={""}
                isSkipped={true}
                reservationCutoffInMinutes={0}
                isTerminating={false}
                actualArrivalTime={'2022-07-02T13:05:00+00:00'}
                scheduledArrivalTime={'2022-07-02T13:00:00+00:00'}
                isOrigin={false} estimatedArrivalTime={''} />)

            const stopDot = screen.queryByTestId("stop-dot")

            expect(stopDot.classList.value).toContain("skippedDot");
        });

        it("should display a regular dot when isSkipped, isOrigin, and isTerminating are all false", () => {
            render(<StopPoint
                destination={''}
                estimatedDepartureTime={''}
                actualDepartureTime={''}
                scheduledDepartureTime={""}
                isSkipped={false}
                reservationCutoffInMinutes={0}
                isTerminating={false}
                actualArrivalTime={'2022-07-02T13:05:00+00:00'}
                scheduledArrivalTime={'2022-07-02T13:00:00+00:00'}
                isOrigin={false} estimatedArrivalTime={''} />)

            const stopDot = screen.queryByTestId("stop-dot")

            expect(stopDot.classList.value).toContain("stopDot");
        });
    });
});