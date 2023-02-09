# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Breakdown
*(I will be using an Agile effort estimation in which 1pt is equal to one days work for one developer)*
1. ### Generate new nickname table
	  **Context:** In order to allow our facilities to identify agents they work with, we are going to be creating a new table in our DB.

	  *(Assuming our database is relational)*
	  #### Create the following table on dev db following team standard practices
	  ```Table: FacilityAgentNickname
	      FacilityID  | AgentID     | Nickname
	      FOREIGN KEY | FOREIGN KEY | String
	  ```
	 *(assuming we are using an MVC framework)*
	  - Add a function `(AgentNickname(agent))` to our Facility model that returns a given agent's nickname for that facility or `null` if none exists.
	  - Write a unit test describing the expected responses from our new Facility function. Test for an existing nickname and for an absent nickname.
	  - Work with person/team responsible for deployment to ensure successful migration of new table to Prod DB during deployment.

	  **Things to consider:** Is there a future scenario where facilities may ask for a per-shift Agent nickname?

	  **Estimated level of effort:** .5 for a developer experienced in the project's backend. Could be a good 1pt task for a junior dev getting acquainted with our DB architecture or testing framework.

2. ### Update `getShiftsByFacility()` function to query new table
	  **Context:** We have a new way to represent agents from the perspective of Facilities. Now we need to expose this new data to end-users by updating our `getShiftsByFacility` function

	  - Once `FacilityAgentNickname` table has been created on Prod db, update `getShiftsByFacility` function so that the shift metadata it returns includes the related agent's nickname when present and the agent's `FOREIGN KEY` *(current functionality)* when not.
	  - Update existing `FacilityAgentNickname` unit test to account for both cases.

	  **Estimated level of effort:** .5 max, could be a .25 for developers familiar with the application

3. ### Ensure `generateReport()` function works properly with new metadata, update if not.
	  **Context:** We've recently updated the structure of the data returned by `FacilityAgentNickname`, as a result we should confirm that the PDF output created downstream of this change is uneffected.
	  - Confirm that building a PDF with `generateReport` for a facility that has nicknamed some agents but not others, works successfully and that the formatting remains unchanged.
	  - *Do we have specs to test the output of our PDFs?* If so, update as needed, if not, look into a means of automated testing of PDF output.

	  **Estimated level of effort:** Depending on how the second bullet is interpreted this could be a subtask of ticket #2 or a 1pt exploration of incorporating PDF format testing into our test suite.

4. ### Expose endpoint to add agent nicknames per facility
	  **Context:** We have a great new data structure for nicknaming agents on a per facility basis but no way for end users (facilities) to utilize this new functionality.

	  *(making lots of assumptions about structure of application obviously)*
	  *(Assuming users are able to navigate application as Facilities )*
	  - Create routes for adding/updating `FacilityAgentNickname` relationship
	  - Create a form component for adding/updating a given Facility's nickname for a given agent.
	  - *(Assuming an agent metadata page exists for facilities users)* Add nickname form component to this page. Changing nickname on this form should trigger an update to our new `FacilityAgentNickname` route.
	  - Assuming the team uses end to end testing, write a test to confirm that this new addition to the UI behaves as expected.

	  **Things to consider:**
	  - Are there illegal characters for an agent nickname?
	  - Do we need to worry about sql injection?
	  - Are there other kinds of Agent metadata that Facilities are able to edit/is this an existing workflow?
	  - Should the route creation be broken into a separate ticket?

	  **Estimated level of effort:** .5 for developers acquainted with our frontend and backend frameworks. 1pt otherwise, but a valuable fullstack learning experience.
