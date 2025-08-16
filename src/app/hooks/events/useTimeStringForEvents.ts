import useMatchStoreSelectors from "../data/useMatchStoreSelectors"

export default function useTimeStringForEvents() {

    const {
        isExtraTime,
        isSecondHalf,
        extraTimeFirstHalf,
        extraTimeSecondHalf,
        matchLongTime,
    } = useMatchStoreSelectors()

    const time = ({minutes, seconds} : {minutes: string, seconds: string}) => {
        if (isExtraTime) {
            if (!isSecondHalf && extraTimeFirstHalf !== undefined) {
                return `${matchLongTime / 2} : 00 + ${extraTimeFirstHalf}'`
            } else if (isSecondHalf && extraTimeSecondHalf !== undefined) {
                return `${matchLongTime} : 00 + ${extraTimeSecondHalf}'`
            }
        }
        return `${minutes} : ${seconds}`
    }

    return {time}

}