import useSWR from 'swr';
import { StopPoint } from "./StopPoint";
import useNetworkInformation from "../hooks/useNetworkInformation";

const fetcher = (...args) => fetch(...args).then(res => res.json());

const StopList: React.FC<{tripId: string}> = ({tripId}) => {

    const [networkType, effectiveNetworkType] = useNetworkInformation();

    let refreshInterval;
    if (networkType === 'wifi') {
        refreshInterval = 5000;
    } else if (effectiveNetworkType === '4g') {
        refreshInterval = 15000;
    } else {
        refreshInterval = 30000;
    }

    const { data, error } = useSWR(`https://api.ember.to/v1/trips/${tripId}`, fetcher, { refreshInterval });

    return (
        data.route.map((point, index, array) => (
            <div key={point.location.id}>
                <StopPoint
                    destination={point.location.name}
                    estimatedDepartureTime={point.departure.estimated}
                    actualDepartureTime={point.departure.actual}
                    scheduledDepartureTime={point.departure.scheduled}
                    actualArrivalTime={point.arrival.actual}
                    scheduledArrivalTime={point.arrival.scheduled}
                    isSkipped={point.skipped}
                    reservationCutoffInMinutes={point.booking_cut_off_mins}
                    isTerminating={array.length - 1 === index} 
                    isOrigin={index === 0} />
            </div>
        ))
    );
}

export default StopList;