/*=========================================================================
*Developer:Khoi Nguyen
*Date: 3/3/2017
*UCSD Code Bootcamp: Homework #7
In this assignment, attempting MVC design pattern
==========================================================================*/

/**
 *Data (model) to collect data structure from NYT api
 *Note: all properties are initialized as an empty array.
 *Push data accordingly when call back response from API.
 **/
var acquiredData = {
    title: [], 
    author: [],
    sectionName: [],
    pubDate: [], 
    webUrl: []
}
/**
 *Obj nyt used to manipulate the DOM (controller + view)
 */
var nyt = {
	authKey: "b9f91d369ff59547cd47b931d8cbc56b:0:74623931",
	queryURLBase: "http://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=",
	queryTerm: null,
	newUrl: null,
    numRec: 0,
	startYear: null,
    endYear: null,
    firstSearch: false,
    articleCounter: 1,
    //main controller 
	init: function () {
		this.cacheDom();
        this.bindEvents();
        this.render();
    },
    //caching the DOM so we are not searching through the DOM over and over again.
    cacheDom: function () {
    	this.$searchBtn = $("#search-btn");
        this.$clearBtn = $("#clear");
    	this.$searchTerm = $("#search");
        this.$startYear = $("#startYr");
        this.$endYear = $("#endYr");
        this.$wellSection = $("#well-section");
        this.$numRec = $("#num-records")
    },
    //method to bind the search and clear button events.
    bindEvents: function () {
        this.$searchBtn.on("click", this.runQuery.bind(this));
        this.$clearBtn.on("click", this.reset);
    },
    //method to append results from API response to the DOM.
    render: function () {
        console.log(this.startYear);
        if(this.firstSearch === true) {
            for(var i = 0; i < this.numRec; i++) {
                //case where user did not enter any start or end year.
                if( (acquiredData.title[i] !== undefined) && 
                    (this.startYear === "" || this.endYear === "")
                  ) {   
                    var newDiv = $("<div class='well'>");
                    newDiv.append(
                        "<h3 class='articleHeadline'><span class='label label-primary'>" +
                        (this.articleCounter) + "</span><strong> " +
                        acquiredData.title[i] + "</strong></h3>"
                        );
                    newDiv.append(
                        "<h5>" + acquiredData.author[i] + "</h5>" 
                        );
                    newDiv.append(
                        "<h5>" + acquiredData.sectionName[i] + "</h5>" 
                        );
                    newDiv.append(
                        "<h5>" + acquiredData.pubDate[i] + "</h5>" 
                        );
                    newDiv.append(
                        "<h5>" + acquiredData.webUrl[i] + "</h5>" 
                        );
                    this.$wellSection.append(newDiv);
                    this.articleCounter++;
                }
                //case for user entering optional start and end year.
                if( acquiredData.pubDate[i] !== undefined &&
                    parseInt(acquiredData.pubDate[i].slice(0,4)) >= parseInt(this.startYear) && 
                    parseInt(acquiredData.pubDate[i].slice(0,4)) <= parseInt(this.endYear) 
                  ) {
                    var newDiv = $("<div class='well'>");
                    newDiv.append(
                        "<h3 class='articleHeadline'><span class='label label-primary'>" +
                        (this.articleCounter) + "</span><strong> " +
                        acquiredData.title[i] + "</strong></h3>"
                        );
                    newDiv.append(
                        "<h5>" + acquiredData.author[i] + "</h5>" 
                        );
                    newDiv.append(
                        "<h5>" + acquiredData.sectionName[i] + "</h5>" 
                        );
                    newDiv.append(
                        "<h5>" + acquiredData.pubDate[i] + "</h5>" 
                        );
                    newDiv.append(
                        "<h5>" + acquiredData.webUrl[i] + "</h5>" 
                        );
                    this.$wellSection.append(newDiv);
                    this.articleCounter++;
                } 
            }   
        }
    },
    reset: function () {
        //poping the existing data from previous search.
        for(var i = 0; i < this.numRec; i++) {
            acquiredData.title.pop();
            acquiredData.author.pop();
            acquiredData.sectionName.pop();
            acquiredData.pubDate.pop();
            acquiredData.webUrl.pop();
        }
        //clearing the top articles previous search results.
        $("#well-section").empty();
        this.articleCounter = 1;
    },
    runQuery: function () {
    	//before running query and requesting from NYT API, clear out the search results.
        this.reset();
        //maintain context to nyt.
        var self = this; 
        this.queryTerm = this.$searchTerm.val().trim();
        this.startYear = this.$startYear.val().trim();
        this.endYear = this.$endYear.val().trim();
    	this.newUrl = this.queryURLBase + this.authKey + "&q=" + this.queryTerm;
        this.numRec = this.$numRec.val().trim();
        //clears the input fields after the search btn is clicked.
        $("form").trigger("reset");
        $.ajax({
			url: this.newUrl,
			method: "GET"
  		}).done(function(NYTData) {
  			console.log(NYTData);
            nyt.firstSearch = true;
            for(var i = 0; i < self.numRec; i++) {
                //sometimes response set of articles are not complete, i.e. 10 total, so check for articles that are null.
                if(NYTData.response.docs[i].byline !== null){
                    //pushing response data from API into model obj
                    acquiredData.title.push(NYTData.response.docs[i].headline.main);
                    acquiredData.author.push(NYTData.response.docs[i].byline.original);
                    acquiredData.sectionName.push(NYTData.response.docs[i].section_name);
                    acquiredData.pubDate.push(NYTData.response.docs[i].pub_date);
                    acquiredData.webUrl.push(NYTData.response.docs[i].web_url);
                }
            }
            self.render();
    	});
  	}
}
nyt.init();



