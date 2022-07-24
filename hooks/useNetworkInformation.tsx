import { useEffect, useState } from "react";

const useNetworkInformation = () => {
    const [networkType, setNetworkType] = useState("unknown");
    const [effectiveNetworkType, setEffectiveNetworkType] = useState("unknown");

    const updateNetwork = (networkInformation) => {
        console.log(networkInformation)
        setNetworkType(prevState => networkInformation.type);
        setEffectiveNetworkType(prevState => networkInformation.effectiveType);
    }

    const onNetworkChange = (event) => {
        updateNetwork(event.target)
    }

    useEffect(() => {
        if(!navigator.connection) { return }

        updateNetwork(navigator.connection);

        navigator.connection.addEventListener("change", onNetworkChange);

        return () => {
            navigator.connection.removeEventListener("change", onNetworkChange);
        }
    }, []);

    return [networkType, effectiveNetworkType];
};

export default useNetworkInformation;