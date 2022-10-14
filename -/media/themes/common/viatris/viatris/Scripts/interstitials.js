var SelfCertificationInterstitial = function () {
    this.Id = "";
    this.GatedUrls = [];
    this.GatedInternalUrls = [];
    this.Preempt = true;
};
var Interstitials = {
    SelfCertifications: [],
    Externals: [],
    Internals: [],
    AddSelfCertification: function (selfCert) {
        Interstitials.SelfCertifications.push(selfCert);
    }
}

function IsHcpLink(Urllink){

return getQueryStringValueFromUrl(Urllink,"hcp");
}

var localMarketsObj = new Object();

function getQueryStringValueFromUrl(Urllink,key){
	var vars = [], hash;
	var q = Urllink.split("?")[1];
	if(q != undefined){
		q = q.split('&');
		for(var i = 0; i < q.length; i++){
			hash = q[i].split('=');
			vars.push(hash[1]);
			vars[hash[0]] = hash[1];
		}
}
return vars[key];
}
function IsLocalMarketChange(currentpathArray, isInternalLink) {
    var lang;
	var linkLangCode;
    var urlSplit = window.location.href.split("index.html");
    var currentPagelangCode = getLangCodeFromHtml();
	if(isInternalLink){
		linkLangCode = currentpathArray[1].toLowerCase();
	}
    
	//var Linkdomain = currentpathArray[2].toLowerCase();
	var currentDomain = window.location.href.split("index.html")[2].toLowerCase();
	if(!isInternalLink){
	
	    localMarketsObj.change="false";
        return localMarketsObj;
	
	}
	
	/* if(currentDomain == Linkdomain){
		isInternalLink =true;
		linkLangCode = currentpathArray[3].toLowerCase();
	}
	if(!isInternalLink){
		if(Linkdomain != currentDomain){
	    localMarketsObj.change="false";
        return localMarketsObj;
	}
	} */
	if(isInternalLink){
		if( (currentpathArray[1]=="-") && (currentpathArray[2]=="media")){
        localMarketsObj.change="false";
        return localMarketsObj;
		}
	}
	
	if (currentPagelangCode != linkLangCode) {
        if (currentPagelangCode.indexOf('-') > -1 && linkLangCode.indexOf('-') > -1) {
            if ((currentPagelangCode.split("-")[1]) === (linkLangCode.split("-")[1])) {
                localMarketsObj.change="false";
                return localMarketsObj;
            } else {
				localMarketsObj.change="true";
				localMarketsObj.changeType="localMarkets";
                return localMarketsObj;
                
            }
        }
        if (!(currentPagelangCode.indexOf('-') > -1) && linkLangCode.indexOf('-') > -1) {
           localMarketsObj.change="true";
				localMarketsObj.changeType="localMarkets";
                return localMarketsObj;
        }
		 if (!(currentPagelangCode.indexOf('-') > -1) && !(linkLangCode.indexOf('-') > -1) && (linkLangCode !="en")) {
            localMarketsObj.change="true";
				localMarketsObj.changeType="localMarkets";
                return localMarketsObj;
        }
		 if (!(currentPagelangCode.indexOf('-') > -1) && !(linkLangCode.indexOf('-') > -1) && (linkLangCode =="en")) {
			
                localMarketsObj.change="true";
				localMarketsObj.changeType="corporate";
                return localMarketsObj;
        }
		
		if ((currentPagelangCode.indexOf('-') > -1) && !(linkLangCode.indexOf('-') > -1)) {
			//enable this after checking for en as many links in the footer and header are in en version
			if(linkLangCode !="en"){
				localMarketsObj.change="true";
				localMarketsObj.changeType="localMarkets";
                return localMarketsObj;
			}
			if(linkLangCode =="en"){
				localMarketsObj.change="true";
				localMarketsObj.changeType="corporate";
                return localMarketsObj;
			}
        
        }
    }
	 localMarketsObj.change="false";
	 return localMarketsObj;
	 
	
	}
	
function getLangCodeFromHtml(){

return $("html").attr("lang").toLowerCase();

}
jQuery(document).ready(function ($) {
   
    if ($(".interstitial")[0]) {
        //$(document).ready(function () {

            /*INTERSTITIAL POPUP*/
            $("body").append("<div id='interstitial-overlay' alt='Close Window' title='Close Window'></div>");

            var countryName;
		
            $("a").click(function (e) {
				
			
                var thishostname = window.location.hostname;
                var currentLink = $(this).attr('href');
				
			
                var protocolAgnosticLink = currentLink == undefined ? undefined : currentLink.replace(/http(s)?\:\/\//i, '');
                var currentId = $(this).attr('id');
                if (currentLink != undefined && currentLink != "" && currentLink != "/" && currentLink != "#" && !$(this).hasClass("interstitial-anchor") && !$(e.srcElement).hasClass("nav-toggle")) {
                    var currentpathArray = $.trim(currentLink).split('index.html');
                    var selfCertPreempt = false;
                    var selfCertTriggered = false;
					var isInternalLink = false;
					
				if(currentLink.startsWith("index.html")){
					isInternalLink =true;
				}
				
                if ($(this).parents().hasClass("locations")) {
                    countryName = $(this).html();
                }
                if ($(this).parents().hasClass("locations_sub")) {
                   
                    countryName = $(this).parent().parent().parent().get()[0].children[1].innerText;
                }
                    //// code to display pop up incase of local markets change has to corrected.
					
					if(!(currentLink.toLowerCase().startsWith("mailto")) && !(currentLink.startsWith("#")))
					{
					if (IsLocalMarketChange(currentpathArray, isInternalLink).change=="true" && IsLocalMarketChange(currentpathArray, isInternalLink).changeType == "localMarkets") {
						    console.log("local markets change");
							
						    $.each(Interstitials.SelfCertifications, function (i, el) {
                            if ($("#self_cert_interstitial_" + el.Id).children("div").hasClass("local-markets")) {
                            
                                $('.location-menu').removeClass('active')
                                $("#interstitial-overlay").show();
                                $( "span.country-name" ).html( countryName );
                                $("#self_cert_interstitial_" + el.Id).show();
                                $("#self_cert_interstitial_" + el.Id + " > .self-interstitial").show();
                                $("#self_cert_interstitial_" + el.Id + " .continue a").attr('href', currentLink);
                                var targetVal = '_self';
                                $("#self_cert_interstitial_" + el.Id + " .continue a").attr('target', targetVal);
                                selfCertPreempt = el.Preempt;
                                selfCertTriggered = true;
                                e.preventDefault();
                            }
                        });
                    }
					if (IsLocalMarketChange(currentpathArray, isInternalLink).change=="true" && IsLocalMarketChange(currentpathArray, isInternalLink).changeType == "corporate") {
						 console.log("corporate");
						   $.each(Interstitials.SelfCertifications, function (i, el) {
                            if ($("#self_cert_interstitial_" + el.Id).children("div").hasClass("corporate")) {
                               if (typeof selfCert_d0f6742b_c43a_46b2_9a79_ff11566dacd1.GatedInternalUrls != 'undefined' && $.inArray(currentLink, selfCert_d0f6742b_c43a_46b2_9a79_ff11566dacd1.GatedInternalUrls) > -1) return;
                                $('.location-menu').removeClass('active')
                                $("#interstitial-overlay").show();
                                $( "span.country-name" ).html( countryName );
                                $("#self_cert_interstitial_" + el.Id).show();
                                $("#self_cert_interstitial_" + el.Id + " > .self-interstitial").show();
                                $("#self_cert_interstitial_" + el.Id + " .continue a").attr('href', currentLink);
                                var targetVal = '_self';
                                $("#self_cert_interstitial_" + el.Id + " .continue a").attr('target', targetVal);
                                selfCertPreempt = el.Preempt;
                                selfCertTriggered = true;
                                e.preventDefault();
                            }
                        });
                    }
					
					if(IsHcpLink(($(this).attr("href")))){
						console.log("Hcp");
						$.each(Interstitials.SelfCertifications, function (i, el) {
                            if ($("#self_cert_interstitial_" + el.Id).children("div").hasClass("hcp")) {
                            
                                $('.location-menu').removeClass('active')
                                $("#interstitial-overlay").show();
                                $("#self_cert_interstitial_" + el.Id).show();
                                $("#self_cert_interstitial_" + el.Id + " > .self-interstitial").show();
                                $("#self_cert_interstitial_" + el.Id + " .continue a").attr('href', currentLink);
                                var targetVal = '_self';
								if( (currentLink.split('index.html')[1]=="-") && (currentLink.split('index.html')[2]=="media")){
									targetVal="_blank"
								}
                                $("#self_cert_interstitial_" + el.Id + " .continue a").attr('target', targetVal);
                                selfCertPreempt = el.Preempt;
                                selfCertTriggered = true;
                                e.preventDefault();
                            }
                        });
					}
					}
                   
                  
                    if (selfCertPreempt) return; /* Do not try to trigger the external interstitial if set to preempt - still experimental. Not suggested for production. */
                    var found1 = $.inArray('index.html', currentpathArray);
                    var found2 = $.inArray('index.html', currentpathArray);
                    if (found1 > -1 || found2 > -1) {
                        var currentdomain = currentpathArray[2];
                        if (typeof __externalInterstitialWhitelist != 'undefined' && $.inArray(currentdomain, __externalInterstitialWhitelist) > -1) return;
                        if (thishostname != currentdomain) {
							console.log("Exit");
                            $("#interstitial-overlay").show();
                            $(".external-interstitial").show();
                            $(".external-interstitial .continue a").attr('href', currentLink);
                            if (selfCertTriggered) {
                                $('.self-cert-interstitial .continue a').click(function (event) {
                                    event.preventDefault();
                                    $(this).closest('.self-cert-interstitial').hide();
                                });
                            }
                            e.preventDefault();
                        }
                    }
                }
            });
      
            $(document).keyup(function (e) {
                if (e.keyCode == 27) {
                    $("#interstitial-overlay").hide();
                    $(".interstitial").hide();
                }
            });
            $(".interstitial-exit-icon, .interstitial .left").click(function (e) {
                $("#interstitial-overlay").hide();
                $(".interstitial").hide();
                e.preventDefault();
            });
            $("#interstitial-overlay").click(function (e) {
                if ($('.self-cert-interstitial').is(":visible")) {
                    return;
                }
                $("#interstitial-overlay").hide();
                $(".interstitial").hide();
                e.preventDefault();
            });
            $(".interstitial .cancel a").click(function (e) {
                $("#interstitial-overlay").hide();
                $(".interstitial").hide();
                e.preventDefault();
            });
            /*$("#special").click(function (e) {
                alert('welcome special');
            });*/
            $(".interstitial .continue a").click(function (e) {
                if ($('.self-cert-interstitial').is(":visible")) {
                  //  localStorage.setItem("hcppopup", now);
                }
				$("#interstitial-overlay").hide();
                $(".interstitial").hide();
                if ($(".interstitial").filter(':visible').length < 1) {
                    $("#interstitial-overlay").hide();
                }
            });
        //});
    };
	
	if(getQueryStringValueFromUrl(window.location.href,"welome")!="undefined" && getQueryStringValueFromUrl(window.location.href,"welcome")== 1){
	
	$("#interstitial-overlay").show();
    $("#self_cert_interstitial_d0f6742b_c43a_46b2_9a79_ff11566dacd1").show();
    $("#self_cert_interstitial_d0f6742b_c43a_46b2_9a79_ff11566dacd1 > .external-interstitial").show();
	}
});