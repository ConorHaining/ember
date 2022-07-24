import { useEffect, useState } from "react";

const useOffline = () => {
    const [isOffline, setIsOffline] = useState(false);

    const onOnline = () => {
        setIsOffline(false);
    }

    const onOffline = () => {
        setIsOffline(true);
    }

    useEffect(() => {
        window.addEventListener("online", onOnline);
        window.addEventListener("offline", onOffline);

        return () => {
            window.removeEventListener("online", onOnline);
            window.removeEventListener("offline", onOffline);
        }
    }, []);

    return [isOffline];
}

export default useOffline;