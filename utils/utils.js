export const timestampToDate = (timestamp) => {
    const iso = timestamp.toDate()
    const date = iso.toDateString()

    const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    const time = iso.toLocaleTimeString('en-gb', options)
    
    return {date: date, time: time}
}