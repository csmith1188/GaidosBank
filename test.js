// Set initial variables
let principal = 1000 // Initial principal amount
const interestRate = 1 // Annual interest rate (5%)
let minutes = 0

function convertMinutes(minutes) {
	const minutesPerDay = 24 * 60
	const minutesPerMonth = minutesPerDay * 30

	const months = Math.floor(minutes / minutesPerMonth)
	const days = Math.floor((minutes % minutesPerMonth) / minutesPerDay)
	const hours = Math.floor((minutes % minutesPerDay) / 60)
	const remainingMinutes = minutes % 60

	return { months, days, hours, minutes: remainingMinutes }
}

// Function to calculate and display the interest
console.log(interestRate / (365 * 24 * 60))
console.log(principal * interestRate / (365 * 24 * 60))
function calculateInterest() {
	minutes++
	const interest = (principal * interestRate) / (365 * 24 * 60) // Convert annual interest rate to per-second rate
	const totalAmount = principal + interest
	let time = convertMinutes(minutes)
	console.log(time)
	console.log(`After ${time.months}, ${time.days} days and ${time.hours}:${time.minutes} , the total amount is $${totalAmount.toFixed(2)}`)

	principal = totalAmount // Update principal to include the interest
}

// Call calculateInterest every second (1000 milliseconds)
// setInterval(calculateInterest, 1)