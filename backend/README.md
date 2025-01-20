# All endpoints

## User

- **/api/users/** (GET): get all users
- **/api/users/\<id>** (GET): get a user's info
- **/api/users/login** (POST): log in
- **/api/users/create** (POST): create a new user
- **/api/users/update/\<id>** (POST): update a user's data
- **/api/users/delete/\<id>** (DELETE): delete a user

## Event

- **/api/events/** (GET): get all events
- **/api/events/create** (POST): create a new event
- **/api/events/update/\<id>** (POST): update an event's data
- **/api/events/delete/\<id>** (DELETE): delete an event

## Result

- **/api/results/** (GET): get all results
- **/api/results/athlete/\<id>** (GET): get an athlete's results
- **/api/results/create** (POST): create a new result
- **/api/results/update/\<id>** (POST): update a result's data
- **/api/results/delete/\<id>** (DELETE): delete a result

## Event

- **/api/disciplines/** (GET): get all disciplines
- **/api/disciplines/create** (POST): create a new discipline
- **/api/disciplines/update/\<id>** (POST): update a discipline's data
- **/api/discipline/delete/\<id>** (DELETE): delete a discipline

## Other

- **/static/\<filename>** (GET)
- **/** (GET): index