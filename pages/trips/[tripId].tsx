import { GetServerSidePropsContext, NextPage } from "next";
import useSWR, { SWRConfig } from 'swr';
import { StopPoint } from "../../components/StopPoint";
import WebShareButton from "../../components/WebShareButton";
import useNetworkInformation from "../../hooks/useNetworkInformation";
import useOffline from "../../hooks/useOffline";

type StopPointData = {
    id: number;
    departure: {
        scheduled: string;
        estimated: string;
        actual: string;
    };
    arrival: {
        scheduled: string;
        estimated: string;
        actual: string;
    };
    location: {
        id: number;
        name: string;
    };
    skipped: boolean;
    booking_cut_off_mins: number;
};

type TripPageProps = {
    description: {
        calendar_date: string;
        route_number: string;
        tripId: string;
    },
    fallback: {
        route: StopPointData[]
    }
};

const fetcher = (...args) => fetch(...args).then(res => res.json());

const TripPage: NextPage<TripPageProps> = ({ fallback, description }) => {

    const [isOffline] = useOffline();
    const [networkType, effectiveNetworkType] = useNetworkInformation();

    return (
        <>
            <header className="bg-teal-500 py-1 px-6">
                <h1 className="font-bold text-3xl">ember</h1>
            </header>
            <main className="py-6 px-4">
                {isOffline && <div data-testid="offline-alert" className="bg-orange-400 py-2 px-4 text-orange-900 font-medium">Not connected to the internet. Live updates paused.</div>}
                {networkType && networkType === 'wifi' && <div data-testid="wifi-alert" className="bg-sky-400 py-2 px-4 text-sky-900 font-medium">Our buses have superfast 5G onboard</div>}
                <header className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold">Your journey on {description.route_number}</h2>
                        <h2 className="text-xl font-semibold text-slate-700">{description.calendar_date}</h2>
                    </div>
                    <div>
                        <WebShareButton tripId={description.tripId} />

                    </div>
                </header>
                <section>
                        <SWRConfig value={{ fallback }}>
                            <StopList tripId={description.tripId} />
                        </SWRConfig>
                </section>
            </main>
        </>
    )
}

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
            <div key={point.location.id} className="my-4">
                <StopPoint
                    destination={point.location.name}
                    estimatedDepartureTime={point.departure.estimated}
                    actualDepartureTime={point.departure.actual}
                    scheduledDepartureTime={point.departure.scheduled}
                    actualArrivalTime={point.arrival.actual}
                    scheduledArrivalTime={point.arrival.scheduled}
                    isSkipped={point.skipped}
                    reservationCutoffInMinutes={point.booking_cut_off_mins}
                    isTerminating={array.length - 1 === index} />
            </div>
        ))
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {

    const tripId = context.params["tripId"];

    // TODO error handle bad fetch
    const data = await fetch(`https://api.ember.to/v1/trips/${tripId}/`).then(res => res.json());

    /**
     * Thin out the request shave some bytes
     */
    const route = data["route"].map(routeItem => ({
        id: routeItem.id,
        departure: routeItem.departure,
        arrival: routeItem.arrival,
        location: {
            id: routeItem.location.id,
            name: routeItem.location.name,
        },
        skipped: routeItem.skipped,
        booking_cut_off_mins: routeItem.booking_cut_off_mins
    }));

    const description = {
        route_number: data.description.route_number,
        calendar_date: data.description.calendar_date,
        tripId
    }

    const apiUrl = `https://api.ember.to/v1/trips/${tripId}`;

    return {
        props: {
            fallback: {
                [apiUrl]: {
                    route
                }
            },
            description
        }, // will be passed to the page component as props
    }
}

export default TripPage;