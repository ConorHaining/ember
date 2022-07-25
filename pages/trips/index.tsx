import { NextPage } from "next";
import Link from "next/link";

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
                {trips.map(trip => {
                    const parsedDeparture = Date.parse(trip.departure);
                    const isActive = parsedDeparture < Date.now() && parsedDeparture < Date.now() + (6000 * 120);
                    return (
                        <div key={trip.uid} className="my-2 p-2 border border-slate-700">
                            {isActive ? <div className="text-green-700 font-semibold">
                                Active Journey *
                            </div>: null}
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
    const trips = await fetch("http://localhost:3000/api/trips").then(res => res.json());

    return {
        props: { trips }
    }
}

export default TripsListPage;