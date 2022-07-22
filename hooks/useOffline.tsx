import { useEffect, useState } from "react";

const useOffline = () => {
    const [isOffline, setIsOffline] = useState(false);

    useEffect(() => {
        window.addEventListener("online", () => {
            setIsOffline(false);
        });
        window.addEventListener("offline", () => {
            setIsOffline(true);
        });
    }, []);

    return [isOffline];
}

export default useOffline;