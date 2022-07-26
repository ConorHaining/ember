import { GetServerSidePropsContext, NextPage } from "next";
import Link from "next/link";
import { SWRConfig } from 'swr';
import Alert from "../../components/Alert";
import StopList from "../../components/StopList";
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
        detailed_name: string;
    };
    skipped: boolean;
    booking_cut_off_mins: number;
};

type TripPageProps = {
    description: {
        calendar_date: string;
        route_number: string;
        tripId: string;
        notes_details?: {
            is_public: boolean;
            updated_at: string;
            rendered_notes: string;
        }
    },
    fallback: {
        [key: string]: {
            route: StopPointData[]
        }
    }
};

const TripPage: NextPage<TripPageProps> = ({ fallback, description }) => {

    const [isOffline] = useOffline();
    const [networkType] = useNetworkInformation();

    return (
        <>
            <header className="bg-teal-500 py-1 px-6">
                <Link href={"/trips"}>
                <a>
                    <h1 className="font-bold text-3xl">ember</h1>
                </a>
                </Link>
            </header>
            <main className="py-6 px-4">
                {isOffline && <div data-testid="offline-alert"><Alert variant="warning">Not connected to the internet. Live updates paused.</Alert></div>}
                {networkType && networkType !== 'wifi' && <div data-testid="wifi-alert">
                    <Alert variant="information">Our buses have superfast 5G onboard</Alert>
                </div>}
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
                    {description.notes_details?.is_public ? <Alert variant="danger"><span data-testid="journey-alert" dangerouslySetInnerHTML={{"__html": description.notes_details.rendered_notes}}></span></Alert> : null}
                        <SWRConfig value={{ fallback }}>
                            <StopList tripId={description.tripId} />
                        </SWRConfig>
                </section>
            </main>
        </>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {

    const tripId = context.params["tripId"];

    let data;
    try {
        data = await fetch(`https://api.ember.to/v1/trips/${tripId}/`).then(res => res.json());
    } catch (error) {
        console.error(error);
        return {
            notFound: true
        }
    }

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
            detailed_name: routeItem.location.detailed_name,
        },
        skipped: routeItem.skipped,
        booking_cut_off_mins: routeItem.booking_cut_off_mins
    }));

    const description = {
        route_number: data.description.route_number,
        calendar_date: data.description.calendar_date,
        tripId,
        ...(data.description.notes_details ? {notes_details: data.description.notes_details}: {})
    }

    const apiUrl = `https://api.ember.to/v1/trips/${tripId}/`;

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