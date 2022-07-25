import { useEffect, useState } from "react";

type WebShareButtonProps = {
    tripId: string;
}

const WebShareButton: React.FC<WebShareButtonProps> = ({tripId}) => {
    const [canShare, setCanShare] = useState(false);

    useEffect(() => {
        if (navigator.share) { setCanShare(true); }
    }, []);

    const onClickHandler =  async (e) => {
        const payload: ShareData = {
            text: "A journey aboard Ember",
            title: "A journey aboard Ember",
            url: `${process.env.APP_ROOT_URL}/trips/${tripId}`, // TODO make host aware
        };

        try {
            await navigator.share(payload)
        } catch (e) {
            console.error("Could not share", e)
        }
    }

    if (canShare) {
        return (
            <button
                data-testid="web-share" 
                className="bg-teal-400 hover:bg-teal-500 active:bg-teal-600 px-4 py-2 font-semibold"
                onClick={onClickHandler}
                >Share Journey</button>
        );
    }
}

export default WebShareButton;