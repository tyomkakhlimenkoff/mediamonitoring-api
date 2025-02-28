Mediamonitoring API project

Scenario 1: Adding a News Article
The system receives a URL of a news article on the Internet. It then fetches the HTML content from the given URL and creates an entity with the following fields.

Date – the current date
URL – the URL provided in the request
News Title – extracted from the <title> tag of the page
In response, the system returns the ID of the created entity.

Scenario 2: Retrieving the List of News Articles
The system returns a list (array) of previously created news entities, each containing the following fields:
- ID
- Date
- URL
- News Title

Scenario 3: Generating a Summary Report
The system receives an array of multiple IDs. Based on these IDs, it generates and saves a simple HTML file to disk, containing a structured list in the following format.
