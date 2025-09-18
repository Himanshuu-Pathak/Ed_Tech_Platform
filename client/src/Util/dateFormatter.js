export const formattedDate = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
        month: "long", day: "numeric", year: "numeric",
    })
}