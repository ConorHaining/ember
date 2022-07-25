import { NextPage } from "next";
import Link from "next/link";
import Alert from "../../components/Alert";

type TripsListPageProps = {
    trips: {
        uid: string,
        departure: string
    }[]
}

const TripsListPage: NextPage<TripsListPageProps> = ({ trips }) => {


    return (
        <>
            <header className="bg-teal-500 py-1 px-6">
                <h1 className="font-bold text-3xl">ember</h1>
            </header>
            <main className="py-6 px-4">

                <div className="my-2 p-2 border border-slate-700">
                    <div>
                        <strong>UID: </strong> <Link href={`trips/hybD6XS9GbdvFuH5PyXdmv`}><a className="text-sky-700 underline">hybD6XS9GbdvFuH5PyXdmv</a></Link>
                    </div>
                    <div>
                    This trip which has ended - it was quite delayed and has trip notes.
                    </div>
                </div>

                <div className="my-2 p-2 border border-slate-700">
                    <div>
                        <strong>UID: </strong> <Link href={`trips/6WA7D6hnGi7EexmkxD5Znw`}><a className="text-sky-700 underline">6WA7D6hnGi7EexmkxD5Znw</a></Link>
                    </div>
                    <div>
                    This trip which is scheduled to start in the future
                    </div>
                </div>

                <div className="my-2 p-2 border border-slate-700">
                    <div>
                        <strong>UID: </strong> <Link href={`trips/NAaD775fjZzBe8isvXBqDR`}><a className="text-sky-700 underline">NAaD775fjZzBe8isvXBqDR</a></Link>
                    </div>
                    <div>
                    This trip which has ended and arrived slightly early
                    </div>
                </div>

                <h2 className="text-2xl">Upcoming Journeys</h2>
                <Alert variant="information">An &apos;Active Journey&apos; is one which has departed in the past two hours</Alert>
                {trips.map(trip => {
                    const parsedDeparture = Date.parse(trip.departure);
                    const isActive = parsedDeparture <= Date.now() && parsedDeparture + 1000 * 60 * 60 * 2 >= Date.now();
                    return (
                        <div key={trip.uid} className="my-2 p-2 border-b border-slate-700">
                            {isActive ? <div className="text-green-700 font-bold">
                                Active Journey *
                            </div> : null}
                            <div>
                                <strong>UID: </strong> <Link href={`trips/${trip.uid}`} prefetch={isActive}><a className="text-sky-700 underline">{trip.uid}</a></Link>
                            </div>
                            <div>
                                <strong>Departure Time: </strong> {trip.departure}
                            </div>
                        </div>
                    )
                })}
            </main>
        </>
    )
}

export async function getServerSideProps() {
    const trips = await fetch(`${process.env.APP_ROOT_URL}/api/trips`).then(res => res.json());

    return {
        props: { trips }
    }
}

export default TripsListPage;