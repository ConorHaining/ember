import useSWR from 'swr';
import { StopPoint } from "./StopPoint";
import useNetworkInformation from "../hooks/useNetworkInformation";
import Alert from './Alert';
import useOffline from '../hooks/useOffline';

const fetcher = async (
    input: RequestInfo,
    init: RequestInit,
    ...args: any[]
  ) => {
    const res = await fetch(input, init);
    return res.json();
  };

const StopList: React.FC<{ tripId: string }> = ({ tripId }) => {

    const [networkType, effectiveNetworkType] = useNetworkInformation();
    const [isOffline] = useOffline();

    let refreshInterval;
    if (networkType === 'wifi') {
        refreshInterval = 5000;
    } else if (effectiveNetworkType === '4g') {
        refreshInterval = 15000;
    } else {
        refreshInterval = 30000;
    }

    const { data, error, isValidating } = useSWR(`https://api.ember.to/v1/trips/${tripId}`, fetcher, { refreshInterval });

    if (error) {
        return (<Alert variant='danger'>We are unable to get information about this trip right now.</Alert>)
    }

    const alertText = () => {
        if (isOffline) return null;

        if (isValidating) {
            return "Fetching latest trip updates";
        } else {
            return "Trip information is up to date";
        }
    }

    return (
        <div className='my-2'>
            {alertText() ? <Alert variant='information'>{alertText()}</Alert> : null}
            {data.route.map((point, index, array) => (
                <div key={point.location.id}>
                    <StopPoint
                        destination={point.location.name}
                        detailedName={point.location.detailed_name}
                        estimatedDepartureTime={point.departure.estimated}
                        actualDepartureTime={point.departure.actual}
                        scheduledDepartureTime={point.departure.scheduled}
                        estimatedArrivalTime={point.arrival.estimated}
                        actualArrivalTime={point.arrival.actual}
                        scheduledArrivalTime={point.arrival.scheduled}
                        isSkipped={point.skipped}
                        isTerminating={array.length - 1 === index}
                        isOrigin={index === 0} />
                </div>
            ))}
        </div>
    );
}

export default StopList;