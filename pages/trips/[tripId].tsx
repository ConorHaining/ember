import { GetServerSidePropsContext, NextPage } from "next";
import { StopPoint } from "../components/StopPoint";

type TripPageProps = {
    route: {
        id: number;
        departure: {
            scheduled: string;
            estimated: string;
            actual: string
        };
        location: {
            id: number;
            name: string;
        };
        skipped: boolean;
        booking_cut_off_mins: number
    }[]
};

const TripPage: NextPage<TripPageProps> = ({ route }) => {

    return (
        <>
            <header className="bg-teal-500 py-1 px-6">
                <h1 className="font-bold text-3xl">ember</h1>
            </header>
            <main>
                <section>
                    {route.map(point => (
                        <div className="my-4">
                            <StopPoint
                            key={point.location.id}
                            destination={point.location.name}
                            estimatedDepartureTime={point.departure.estimated}
                            actualDepartureTime={point.departure.actual}
                            scheduledDepartureTime={point.departure.scheduled}
                            isSkipped={point.skipped}
                            reservationCutoffInMinutes={point.booking_cut_off_mins} />
                        </div>
                    ))}
                </section>
            </main>
        </>
    )
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
    return {
        props: {
            route
        }, // will be passed to the page component as props
    }
}

export default TripPage;