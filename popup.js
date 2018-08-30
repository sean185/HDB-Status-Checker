// HDB Status Checker

// UTILITY FUNCTIONS HERE

function parseURL(url){
    var parsed_URL = {};
    var url_arr = url.split('?');
    if(url_arr.length == 1)
        return "nothing to do!";

    parsed_URL["domain"] = url_arr[0];

    url_arr[1].split('&').forEach(function(param){
        var param_arr = param.split('=');
        parsed_URL[decodeURIComponent(param_arr[0])] = decodeURIComponent(param_arr[1]);
    });
    return parsed_URL;
};

function linearizeJSON(jsonObj, nl_delim){
    if(typeof jsonObj != "object")
        return "nothing to do!";
    var linearString = "";
    for(key in jsonObj){
        if(linearString != "")
            linearString += nl_delim;
        linearString += (key + ": " + jsonObj[key]);
    };
    return linearString;
};

function createOrUpdateElement(elem_id, tab_id, stuff){
    if($(elem_id + ' #tab_'+tab_id).length>0)
        $(elem_id + ' #tab_'+tab_id).text(stuff);
    else{
        $(elem_id).append('<div id="tab_'+tab_id+'"></div>')
        $(elem_id + ' #tab_'+tab_id).text(stuff);
    }
}

function refreshPageDetails(){
	chrome.tabs.query({active : true, currentWindow : true}, function (tabs) {
		var activeTab = tabs[0];
		document.getElementById('current_page').innerHTML = activeTab.url;
		document.getElementById('url_breakdown').innerHTML = linearizeJSON(parseURL(activeTab.url),"<br/>");
	});
};

// WHAT TO DO WHEN POPUP IS LOADED

document.addEventListener('DOMContentLoaded', function () {

    refreshPageDetails()
    var get_page_details = document.getElementById('get_page_details');
    get_page_details.addEventListener('click', refreshPageDetails());

    var get_blocks = document.getElementById('get_blocks');
    get_blocks.addEventListener('click', function () {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                "message" : "get_blocks"
            }, function(response){
                console.log("get_blocks", response);
                document.getElementById('export_blocks').value = response;
            });
        });
    }, false);

    var get_all_units = document.getElementById('get_all_units');
    get_all_units.addEventListener('click', function () {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                "message" : "get_all_units"
            }, function(response){
                console.log("get_all_units", response);
                var all_units = document.getElementById('all_units');
                response.forEach(unit => {
                    var node = document.createElement('a');
                    node.innerText = unit[0];
                    node.href = unit[1];
                    var wrapper = document.createElement('div');
                    wrapper.className = 'unit';
                    wrapper.appendChild(node);
                    all_units.appendChild(wrapper);
                })
            });
        });
    }, false);

    var scrape_all_units = document.getElementById('scrape_all_units');
    scrape_all_units.addEventListener('click', () => {
        var hdbpages = [];
        var OpenedWindows = [];
        var all_units = document.querySelectorAll('#all_units > .unit > a');
        var links = []
        all_units.forEach(unit => { links.push(unit.href) });
        // open all tabs in a window and store them
        chrome.windows.create({ url:links }, window => {
            chrome.extension.getBackgroundPage().hdbpages = window.tabs.map(p => p.id);
        });
        // set listener to detect load completion
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            var hdbpages = chrome.extension.getBackgroundPage().hdbpages;
            if(changeInfo.status == "complete" && hdbpages.filter(item => item == tabId).length > 0){
                console.log("I'm done changing.");
                chrome.tabs.sendMessage(tabId, {
                    "message" : "get_unit_status"
                }, response => {
                    // send the data back to popup html
                    var csv = response.map(item => item.join(',')).join('\n')
                    document.getElementById('export_unit_status').value += csv+'\n';
                });
            }
        });
    }, false);
    
}, false);

console.log("HDBScraper popup.js init");