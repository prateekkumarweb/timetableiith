# Timetable @ IITH

NodeJS app to generate Timetable in ICal format.

## How to use

1. Install NodeJS from [here](https://nodejs.org/en/download/).
1. Clone this repository
  ```sh
  $ git clone https://github.com/prateekkumarweb/timetableiith.git
  ```
1. Install the required packages
  ```sh
  $ npm install
  ```
1. Edit the files `slots.yaml`, `courses.yaml` and `segments.json`.
  Note that `segments.yaml` is of this format:
  ```json
  [
    ["segment1 start date", "segement1 end date"],
    ["segment2 start date", "segement2 end date"],
    ["segment3 start date", "segement3 end date"],
    ["segment4 start date", "segement4 end date"],
    ["segment5 start date", "segement5 end date"],
    ["segment6 start date", "segement6 end date"]
  ]
  ```
1. Run the program
  ```sh
  $ node index.js
  ```

This creates a `tt.ical` file which can be imported into [Google Calendar](https://support.google.com/calendar/answer/37118?hl=en). Instead of importing you can host this file and keep Google Calendar in sync with it.

### How to keep the ICal file in sync with Google Calendar

1. Fork this repository, make required changes and host the site using github pages.
1. Next, in Google Calendar, click the **+** button below the overview month calendar and select **From URL**.
1. Enter the URL of the hosted ical file and add the calendar.
1. This will update the calendar whenever a change is made by pushing changes to the repository.

---
LICENSE: MIT
