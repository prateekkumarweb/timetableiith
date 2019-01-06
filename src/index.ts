const ArgumentParser = require('argparse').ArgumentParser
const parser = new ArgumentParser({
	addHelp: true
})

parser.addArgument(['-c', '--config'], {
	help: 'Config file'
})
parser.addArgument(['-o', '--output'], {
	help: 'Output file'
})

const args = parser.parseArgs()


const ical = require('ical-generator')

// Calendar object initialization
const cal = ical({
	domain: 'iith.prateekkumar.in',
	prodId: '//IIT Hyderabad//Timetable Generator//EN',
	name: 'Timetable @ IITH',
	timezone: 'Asia/Kolkata'
})

// Load slots, courses, segments and holidays
const yaml = require('yamljs')
const config = yaml.load(args.config)

// Function to find start and end date time
// First find the next date on or after given @date
// whose day is @day
// Next Generate two date objects with given @times
let findStartAndEndTime = (date_str: string, day_str: string, times: any[]) => {
	let date = new Date(date_str)
	let day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursady', 'Friday', 'Saturday'].indexOf(day_str)
	date.setDate(date.getDate() + (day+7-date.getDay())%7)
	let start = times[0].split(':')
	let end = times[1].split(':')
	return [
		new Date(date.getFullYear(), date.getMonth(), date.getDate(), Number(start[0]), Number(start[1]), 0, 0),
		new Date(date.getFullYear(), date.getMonth(), date.getDate(), Number(end[0]), Number(end[1]), 0, 0)
	]
}

// For all courses, create events in the calendar object
Object.keys(config.courses).forEach((id)=>{
	let course = config.courses[id]
	id = course.code

	// Find start and end segments
	// For eg. if segment given is 14, then startSegment = 0 and endSegment = 4(exclusive)
	let startSegment = Number(String(course['segment'])[0]) - 1;
	let endSegment = Number(String(course['segment'])[1]);

	// Find the slot of the course
	let slot = course.slot
	let slot_name = 'custom'

	if (typeof slot === 'string') {
		slot_name = slot
		slot = config.slots[slot]
	}

	// Iterate over each segment of the current course
	for (let i=startSegment; i<endSegment; i++) {
		let segment = config.segments[i]

		// Iterate over all days that the course is scheduled on
		Object.keys(slot).forEach((day)=>{
			// Find the start and end time of first day of the course
			let times = findStartAndEndTime(segment['start'], day, slot[day])
			// Find the last day of the segment
			let lastDate = new Date(segment['end'])
			lastDate.setHours(23, 59, 59, 0)

			// Create the event with repeating weekly until last date
			cal.createEvent({
				uid: id+'_'+lastDate.getFullYear()+'_'+i+'_'+slot_name+'_'+day.substring(0,2),
				start: times[0],
				end: times[1],
				summary: id+': '+course.name,
				location: ''+course.classroom,
				repeating: {
					freq: 'WEEKLY',
					until: lastDate,
					exclude: config.holidays
				}
			})
		})
	}
}, cal)

let ttFile = args.output

// Save the calendar in the iCal format
cal.save(ttFile, (err: any)=>{
	if (err) console.log(err)
	else console.log('Created Timetable at '+ttFile)
})
