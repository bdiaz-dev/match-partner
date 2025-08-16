import useMatchStoreSelectors from "@/app/hooks/data/useMatchStoreSelectors"

export default function HalfIndicator() {
    const {
        isHalfTime,
        isSecondHalf,
    } = useMatchStoreSelectors()

    return (
        <div>
            <span className="font-semibold">
                {isHalfTime ? "Descanso" : isSecondHalf ? "Segunda parte" : "Primera parte"}
            </span>
        </div>
    )
}