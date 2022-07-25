import { ReactNode } from "react";

type AlertProps = {
    variant: "warning" | "danger" | "information";
    children: ReactNode;
}

const Alert: React.FC<AlertProps> = ({variant, children}) => {

    const calculateClassColours = () => {
        switch (variant) {
            case "warning":

                return "text-orange-900 bg-orange-500";

            case "danger":

                return "text-red-900 bg-red-200";

            case "information":

                return "text-sky-900 bg-sky-500";

            default:

                return "text-orange-900 bg-orange-500";
        }
    }

    return (
        <div className={`py-2 px-4 font-medium ${calculateClassColours()}`}>{children}</div>
    )
}

export default Alert;