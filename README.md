# Timetable @ IITH

NodeJS app to generate Timetable in ICal format.

## How to use

* Install NodeJS from [here](https://nodejs.org/en/download/).
* Clone this repository
  ```sh
  $ git clone https://github.com/prateekkumarweb/timetableiith.git
  ```
* Install the required packages
  ```sh
  $ npm install
  ```
* Edit the files `slots.yaml`, `courses.yaml` and `segments.json`.
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
* Run the program
  ```sh
  $ node index.js
  ```

This creates a `tt.ical` file which can be imported into [Google Calendar](https://support.google.com/calendar/answer/37118?hl=en). Instead of importing you can host this file and keep Google Calendar in sync with it.

### How to keep the ICal file in sync with Google Calendar

* Fork this repository, make required changes and host the site using github pages.
* Next, in Google Calendar, click the **+** button below the overview month calendar and select **From URL**.
* Enter the URL of the hosted ical file and add the calendar.
* This will update the calendar whenever a change is made by pushing changes to the repository.


### Add pre-commit to Git so that `tt.ical` can be generated before committing

* Create a new file at `.git/hooks/pre-commit` with following content.
  ```sh
  #!/bin/sh
  node index.js
  git add tt.ical
  ```
* Change persimissions of the hook file.
  ```sh
  $ chmod +x .git/hooks/pre-commit
  ```
* After you commit, `tt.ical` will be auto generated and added to git.

---
LICENSE: MIT
