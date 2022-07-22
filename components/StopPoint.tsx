type StopPointProps = {
    destination: string;
    estimatedDepartureTime: string;
    actualDepartureTime: string;
    scheduledDepartureTime: string;
    isSkipped: boolean;
    reservationCutoffInMinutes: number;
};

// TODO reorder props
export const StopPoint: React.FC<StopPointProps> = ({ destination, estimatedDepartureTime, actualDepartureTime, scheduledDepartureTime, isSkipped, reservationCutoffInMinutes }) => {

    const calculateStopVerb = () => {
        const now = Date.now();
        const scheduledDate = Date.parse(scheduledDepartureTime);
        const actualDate = Date.parse(actualDepartureTime);
        const estimatedDate = Date.parse(estimatedDepartureTime);

        if (scheduledDepartureTime && scheduledDate > now) {
            return "Scheduled";
        }

        if (actualDepartureTime && actualDate < now) {
            return "Departed";
        }

        if (estimatedDepartureTime && estimatedDate > now) {
            return "Estimated";
        }
    };

    const timeString = () => {
        const date = new Date(scheduledDepartureTime);
        return date.toLocaleTimeString('en-GB', { timeZone: "Europe/London" });
    };

    const timeDifference = () => {
        const scheduledDate = Date.parse(scheduledDepartureTime);
        const actualDate = Date.parse(actualDepartureTime);

        if (scheduledDate && actualDate) {
            const diffrence = scheduledDate - actualDate;
            const isLate = diffrence < 0;
            if (diffrence > -6000 && diffrence < 6000) {
                return null;
            }
            return <span className={`font-bold ${isLate ? "text-red-500" : "text-green-600"}`}>({(isLate ? "" : "+")}{Math.round(diffrence / 1000 / 60)})</span>;
        }
    };

    return (
        <div className={`grid grid-cols-4 grid-rows-auto ${isSkipped ? "text-slate-500" : ""}`}>
            <span className="row-span-full col-span-1">X</span>
            <span className="col-start-2 col-span-full text-2xl font-semibold">{destination}</span>
            {!isSkipped && <span data-testid="timestamp" className="col-start-2 col-span-full">{calculateStopVerb()} at {timeString()} {timeDifference()}</span>}
            {isSkipped && <span className="col-start-2 col-span-full font-bold">SKIPPED</span>}
        </div>
    );
};
