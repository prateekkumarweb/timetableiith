const ical = require('ical-generator')

// Calendar object initialization
const cal = ical()
cal.domain('iith.prateekkumar.in')
cal.name('Timetable @ IITH')
cal.prodId('//IIT Hyderabad//Timetable Generator//EN')
cal.timezone('Asia/Kolkata')
cal.ttl(60)

// Load slots, courses, segments and holidays
const yaml = require('yamljs')
const slots = yaml.load('../config/slots.yaml')
const courses = yaml.load('../config/courses.yaml')
const segments = require('../config/segments.json')
const holidays = require('../config/holidays.json').map((s: string)=>{return new Date(s)})

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
Object.keys(courses).forEach((id)=>{
	let course = courses[id]

	// Find start and end segments
	// For eg. if segment given is 14, then startSegment = 0 and endSegment = 4(exclusive)
	let startSegment = Number(String(course['segment'])[0]) - 1;
	let endSegment = Number(String(course['segment'])[1]);

	// Find the slot of the course
	let slot = slots[course['slot']]

	// Iterate over each segment of the current course
	for (let i=startSegment; i<endSegment; i++) {
		let segment = segments[i]

		// Iterate over all days that the course is scheduled on
		Object.keys(slot).forEach((day)=>{
			// Find the start and end time of first day of the course
			let times = findStartAndEndTime(segment[0], day, slot[day])
			// Find the last day of the segment
			let lastDate = new Date(segment[1])
			lastDate.setHours(23, 59, 59, 0)

			// Create the event with repeating weekly until last date
			cal.createEvent({
				uid: id+'_'+lastDate.getFullYear()+'_'+i+'_'+course.slot+'_'+day.substring(0,2),
				start: times[0],
				end: times[1],
				summary: id+': '+course.name,
				location: 'CL No. '+course.classroom,
				repeating: {
					freq: 'WEEKLY',
					until: lastDate,
					exclude: holidays
				}
			})
		})
	}
}, cal)

let ttFile = '../out/tt.ics'
if (process.argv.length > 2) ttFile = process.argv[2]

// Save the calendar in the iCal format
cal.save(ttFile, (err: any)=>{
	if (err) console.log(err)
	else console.log('Created Timetable at '+ttFile)
})