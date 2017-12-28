const ical = require('ical-generator')
cal = ical({domain: 'iith.ac.in', name: 'Timetable @ IITH'})
cal.timezone('Asia/Kolkata')
cal.ttl(60);

const yaml = require('yamljs')
const slots = yaml.load('slots.yaml')
const courses = yaml.load('courses.yaml')
const segments = require('./segments.json')

let findStartAndEndTime = (date, day, times) => {
	date = new Date(date)
	day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursady', 'Friday', 'Saturday'].indexOf(day)
	date.setDate(date.getDate() + (day+7-date.getDay())%7)
	let start = times[0].split(':')
	let end = times[1].split(':')
	return [
		new Date(date.getFullYear(), date.getMonth(), date.getDate(), Number(start[0]), Number(start[1]), 0, 0),
		new Date(date.getFullYear(), date.getMonth(), date.getDate(), Number(end[0]), Number(end[1]), 0, 0)
	]
}

Object.keys(courses).forEach((id)=>{
	let course = courses[id]
	let startSegment = Number(String(course['segment'])[0]) - 1;
	let endSegment = Number(String(course['segment'])[1]);
	let slot = slots[course['slot']]
	for (let i=startSegment; i<endSegment; i++) {
		let segment = segments[i]
		Object.keys(slot).forEach((day)=>{
			let times = findStartAndEndTime(segment[0], day, slot[day])
			let lastDate = new Date(segment[1])
			lastDate.setHours(23, 59, 59, 0)
			cal.createEvent({
				start: times[0],
				end: times[1],
				summary: id+': '+course.name,
				location: 'CL No. '+course.classroom,
				repeating: {
					freq: 'WEEKLY',
					until: lastDate
				}
			})
		})
	}
}, cal)

cal.save('tt.ical', (err)=>{
	if (err) console.log(err)
	else console.log('Created Timetable')
})
