export function countdownHourMinute(secondsLeft: number): string {
	const totalMinutes = secondsLeft / 60
	const minutes = totalMinutes % 60
	const totalHours = totalMinutes / 60

	const hourString = Math.floor(totalHours).toString()
	const minuteString = `${minutes < 10 ? '0' : ''}${Math.floor(minutes)}`

	return `${hourString}:${minuteString}`
}
