# Timetable @ IITH

TypeScript (NodeJS) app to generate Timetable in ICal format.

## How to use

* Install NodeJS from [here](https://nodejs.org/en/download/).
* Clone this repository
  ```sh
  $ git clone https://github.com/prateekkumarweb/timetableiith.git
  ```
* Install the required packages
  ```sh
  $ yarn install
  ```
* Edit the files `config.yaml` file. An example is given in `config` folder.
* Generate JS files
  ```sh
  $ yarn build
  ```
* Run the program
  ```sh
  $ cd dist
  $ node index.js -c config.yaml -o filename.ics
  ```

The generated ICal file can be imported into [Google Calendar](https://support.google.com/calendar/answer/37118?hl=en) or [Microsoft Outlook](https://support.office.com/en-us/article/Import-or-subscribe-to-a-calendar-in-Outlook-com-cff1429c-5af6-41ec-a5b4-74f2c278e98c).
Instead of importing you can also host this file and keep Google Calendar or Microsoft Outlook in sync with it.

### How to keep the ICal file in sync with Google Calendar

* Fork this repository, make required changes and host the site using github pages.
* Next, in Google Calendar, click the **+** button below the overview month calendar and select **From URL**.
* Enter the URL of the hosted ics file and add the calendar.
* This will update the calendar whenever a change is made by pushing changes to the repository.
* Note that it may take upto 24 hours for Google Calendar to update the events from the hosted iCal file.


### Add pre-commit to Git so that `tt.ics` can be generated before committing

* Create a new file at `.git/hooks/pre-commit` with following content.
  ```sh
  #!/bin/sh
  yarn build
  cd dist
  node index.js -c ../config/config.yaml -o ../out/tt.ics
  git add tt.ics
  ```
* Change persimissions of the hook file.
  ```sh
  $ chmod +x .git/hooks/pre-commit
  ```
* After you commit, `tt.ics` will be auto generated and added to git.

---
### LICENSE

[MIT](https://github.com/prateekkumarweb/timetableiith/blob/master/LICENSE)

---
Copyright &copy; 2017-2019 Prateek Kumar
