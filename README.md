# HDB-Status-Checker
Helps to scrape HDB units information from the pages, meant for the IT savvy youths from the era of "anything also data science"

# Setup / Installation / HELP ME WTF!?

1. Clone this repo.
2. Go to chrome://extensions/
3. Click "Load unpacked" (as of [65.0.3325](https://en.wikipedia.org/wiki/Google_Chrome_version_history)) or "Load Unpacked Extension" for earlier versions. [StackOverflow explains](https://stackoverflow.com/questions/24577024/install-chrome-extension-not-in-the-store).
4. DONE!!

# Usage

1. Getting details of a block's units (like price, sqm.):
   1. Navigate to the block's page.
   2. Click **Get** button in the "Scrape Current Available Units" section.
   3. Copy the nicely formatted CSV text out.
   4. Apply two decades worth of excel skills on data.
2. Getting availability status of all blocks in a cluster:
   1. Navigate to the page that displays the blocks in a project, e.g [this page](https://services2.hdb.gov.sg/webapp/BP13AWFlatAvail/BP13EBSFlatSearch?Town=Sengkang&Flat_Type=BTO&DesType=A&ethnic=Y&Flat=4-Room&ViewOption=A&dteBallot=201805&projName=).
   2. Click on the extension icon.
   3. Click **Get...** button in the "Scrape All Units in Cluster" section.
   4. The blocks should appear. Like ~magic~ it should.
   5. Click **Scrape** button, and a new window should open up, loading the tabs.
   6. Do NOT close the popup (the mini tab that opened when you clicked the extension icon).
   7. Be patient as the data populates into the textarea in the popup.
   8. Apply two decades worth of excel skills on data.

# Credits

1. [HDB](https://services2.hdb.gov.sg/webapp/BP13AWFlatAvail/BP13SEstateSummary?sel=BTO)
   - For providing for generations of Singaporeans.
   - For having a site that has vital information hidden in tooltips...
   - For inspiring my desire for data export functionalities...
2. [Extensionizr](https://extensionizr.com)
   - For being an awesome boilerplate for Chrome Extensions.
   - Mainly used it for educational purposes, and the neat default icon (TODO: Change it)
3. [Chrome Extensions](https://developer.chrome.com/extensions/api_index)
   - For having an intruiging extension structure that makes writing extensions feel like playing chess.
   - For having actually pretty decent documentation (once you get past the tangle of where does what go)
4. StackOverflow
   - Duh.
