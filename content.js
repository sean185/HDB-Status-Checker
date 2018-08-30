// HDB Status Checker

function getUnitsData() {
    var units = document.querySelectorAll(".tooltip.tip-bottom[data-selector^='#']");
    console.log('Found '+units.length);
    var res = [["Unit","Price","Sqm"]];
    units.forEach(unit => {
        var unit_id = unit.attributes['data-selector'].value;
        var pricesqm = unit.textContent.split('____________________');
        pricesqm[0] = pricesqm[0].slice(1).replace(',','');
        pricesqm[1] = pricesqm[1].slice(0,-4);
        res.push([unit_id].concat(pricesqm));
    });
    return res;
};

function getPagesToOpen() {
    var blocks = document.querySelectorAll("font.e-more-info.has-tip[data-selector*='tooltip']");
    var block_neigh_contract = document.querySelector("div[onclick*='checkBlk']").getAttribute('onclick').split("(")[1].split(")")[0].replace(/['"]+/g, '').split(',');
    var neigh = block_neigh_contract[1];
    var contract = block_neigh_contract[2];
    console.log('Found '+blocks.length+' blocks, opening for neighbourhood '+neigh+' and contract '+contract);
    
    var queryParams = window.location.search.split('?')[1].split('&').map(o=>o.split('=')).reduce((o,kv)=>{o[kv[0]]=kv[1]; return o},{});
    queryParams['Contract'] = contract;
    queryParams['Neighbourhood'] = neigh;
    queryParams['BonusFlats1'] = 'N';
    queryParams['EthnicA'] = 'Y';
    queryParams['EthnicC'] = '';
    queryParams['EthnicM'] = '';
    queryParams['EthnicO'] = '';
    queryParams['selectedTown'] = queryParams['Town']

    var links = [];
    blocks.forEach(item=>{
        blkid = item.querySelector('font').innerText;
        console.log('Opening block: '+blkid);
        queryParams['Block'] = blkid;
        var url = window.location.origin+window.location.pathname+'?'+Object.keys(queryParams).map(k=>k+'='+queryParams[k]).join('&');
        links.push([blkid,url]);
        })
    return links;
};

function getUnitStatus() {
    var blocknum = document.querySelector('#blockDetails > div:nth-child(2) > div.large-3.columns').innerText.trim();
    var units = document.querySelectorAll('td[onclick*="bookMarkCheck"]');
    var statuses = [];
    units.forEach(unit=>{
        var elem = unit.querySelector('font[color]');
        statuses.push([
            blocknum,
            elem.innerText.trim(), 
            elem.color == '#cc0000' ? 'booked' : 'available'
        ]);
    });
    console.log('Got these', statuses);
    return statuses;
};

chrome.runtime.onMessage.addListener( function (request, sender, sendResponse) {
	if (request.message === "get_blocks") {
        var res = getUnitsData();
        var csvexport = res
            .map(unit => unit.map(i => '"'+i+'"'))
            .map(unit => unit.join(',')).join('\n');
		sendResponse(csvexport);
	}
	else if (request.message === "get_all_units") {
        var res = getPagesToOpen();
		sendResponse(res);
	}
	else if (request.message === "get_unit_status") {
        var res = getUnitStatus();
		sendResponse(res);
	};
});

console.log("HDBScraper content.js init");