class ProgressBar {
	constructor(value, maxValue, barSize) {
		this.value = value;
		this.maxValue = maxValue;
		this.barSize = barSize;
	}

	createBar(message, showPercentage = true) {
		const percentage = this.value / this.maxValue; // Calculate the percentage of the bar
		const progress = Math.round(this.barSize * percentage); // Calculate the number of square caracters to fill the progress side.
		const emptyProgress = this.barSize - progress; // Calculate the number of dash caracters to fill the empty progress side.

		const progressText = `[▰](${message.url.replace(message.id, '')})`.repeat(progress); // Repeat is creating a string with progress * caracters in it
		const emptyProgressText = '▱'.repeat(emptyProgress); // Repeat is creating a string with empty progress * caracters in it
		const percentageText = `${Math.round(percentage * 100)}%`; // Displaying the percentage of the bar

		const bar = `${progressText}${emptyProgressText}${showPercentage ? ` ${percentageText}` : ''}`; // Creating the bar
		return bar;
	}
}

module.exports = ProgressBar;
