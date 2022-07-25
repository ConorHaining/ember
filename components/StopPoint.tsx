import styles from "./StopPoint.module.css";

type StopPointProps = {
    destination: string;
    estimatedDepartureTime: string;
    actualDepartureTime: string;
    scheduledDepartureTime: string;
    actualArrivalTime: string;
    scheduledArrivalTime: string;
    isSkipped: boolean;
    reservationCutoffInMinutes: number;
    isTerminating: boolean;
    isOrigin: boolean;
};

// TODO reorder props
export const StopPoint: React.FC<StopPointProps> = ({ destination, estimatedDepartureTime, actualDepartureTime, scheduledDepartureTime, actualArrivalTime, scheduledArrivalTime, isSkipped, reservationCutoffInMinutes, isTerminating, isOrigin }) => {

    const parseDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-GB', { timeZone: "Europe/London" });
    };

    let displayedTime = parseDate(scheduledDepartureTime);
    let stopVerb = "Scheduled";

    const now = Date.now();
    const scheduledDate = Date.parse(scheduledDepartureTime);
    const actualDate = Date.parse(actualDepartureTime);
    const estimatedDate = Date.parse(estimatedDepartureTime);

    if (isTerminating && actualArrivalTime) {
        displayedTime = parseDate(actualArrivalTime);
        stopVerb = "Arrived";
    } else if (isTerminating && !actualArrivalTime) {
        displayedTime = parseDate(scheduledArrivalTime);
        stopVerb = "Arriving";
    } else if (estimatedDepartureTime && estimatedDate > now) {
        displayedTime = parseDate(estimatedDepartureTime)
        stopVerb = "Estimated";
    } else if (scheduledDepartureTime && scheduledDate > now) {
        stopVerb = "Scheduled";
    } else if (actualDepartureTime && actualDate < now) {
        displayedTime = parseDate(actualDepartureTime)
        stopVerb = "Departed";
    }


    let lateIndicator = null;
    let expectedTime;
    let actualTime;
    switch (stopVerb) {
        case "Arrived":
            expectedTime = new Date(scheduledArrivalTime);
            actualTime = new Date(actualArrivalTime);
            break;
        case "Scheduled":

            break;
        case "Departed":
            expectedTime = new Date(scheduledDepartureTime);
            actualTime = new Date(actualDepartureTime);
            break;

        case "Estimated":
            expectedTime = new Date(scheduledDepartureTime);
            actualTime = new Date(estimatedDepartureTime);
            break;

        default:
            break;
    }

    // const scheduledDate = Date.parse(scheduledDepartureTime);
    // const actualDate = Date.parse(actualDepartureTime);

    if (expectedTime && actualTime) {
        const diffrence = expectedTime - actualTime;
        const isLate = diffrence < 0;
        if (diffrence < -60000 || diffrence > 60000) {
            lateIndicator = <span className={`font-bold ${isLate ? "text-red-500" : "text-green-600"}`}>({(isLate ? "" : "+")}{Math.round(diffrence / 1000 / 60)})</span>;
        }
    }

    const timeDifference = () => {
        const scheduledDate = Date.parse(scheduledDepartureTime);
        const actualDate = Date.parse(actualDepartureTime);

        if (scheduledDate && actualDate) {
            const diffrence = scheduledDate - actualDate;
            const isLate = diffrence < 0;
            if (diffrence >= -60000 && diffrence <= 60000) {
                return null;
            }
            return <span className={`font-bold ${isLate ? "text-red-500" : "text-green-600"}`}>({(isLate ? "" : "+")}{Math.round(diffrence / 1000 / 60)})</span>;
        }
    };

    const calculateStopDot = () => {
        if (isSkipped) {
            return styles.skippedDot;
        }

        if (isTerminating) {
            return styles.terminatingDot;
        }

        if (isOrigin) {
            return styles.originDot;
        }

        return styles.stopDot;
    }

    return (
        <div className={`grid grid-cols-4 grid-rows-auto ${isSkipped ? "text-slate-500" : ""}`}>
            <span data-testid="stop-dot" className={`row-span-2 col-span-1 ${styles.dot} ${calculateStopDot()}`}></span>
            <span className="col-start-2 col-span-full text-2xl font-semibold pt-4">{destination}</span>
            {!isSkipped && <span data-testid="timestamp" className="col-start-2 col-span-full">{stopVerb} at {displayedTime} {lateIndicator}</span>}
            {isSkipped && <span className="col-start-2 col-span-full font-bold">SKIPPED</span>}
        </div>
    );
};
