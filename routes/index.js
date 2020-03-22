var express = require('express');
var router = express.Router();
const httpRequests = require('request-promise');
const cheerio = require('cheerio');

router.get('/', function(request, response) {
    httpRequests('https://www.mohfw.gov.in/', (error, res, html) => {
        if(!error && res.statusCode === 200) {
            const $ = cheerio.load(html);
            let output = {};
            let aggregateStat = {};
            let scrapedData = $('.information_row');

            scrapedData.find('.icount').each((i, e) => {
                //console.log($(e).text());
                let count = $(e).text();
                count = count.replace(/\D/g,'').trim();
                if(i===0)
                    aggregateStat.people_screened_at_airport = count;
                else if(i===1)
                    aggregateStat.active_cases = count;
                else if(i===2)
                    aggregateStat.discharged_cases = count;
                else if(i===3)
                    aggregateStat.death_cases = count;
                else if(i===4)
                    aggregateStat.migrated_cases = count;

                output.aggregateStat = aggregateStat;
            });

            let stateDataAll = [];
            scrapedData = $('div .newtab');
            scrapedData.find('tr').each((i, e) => {
                let stateData = [];
                $(e).find('td').each( (j,el) => {
                    stateData[j] = $(el).text().trim();
                });
                stateDataAll[i] = stateData;
            });
            stateDataAll.shift();
            output.stateData = stateDataAll;
            response.status(200).send(output);
        }
        else {
            response.status(400).send({
                status : false,
                message : error
            });
        }
    });
});

module.exports = router;


