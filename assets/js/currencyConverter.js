/*
 * currencyConverter.js
 * 
 * when the user chooses a currency, the stores prices are displayed in the chosen currency dynamically.
 * 
 * */
 
// local storage
var selectedolditem = localStorage.getItem('selectedolditem');

// variables declaration
var to_currency="",amount="",id,currency_symbol;
var siteURL=document.getElementById("currency_converter").siteUrl.value;
var data;

// get the latest exchange rates from open exchange rates API
function getExchangeRates(obj)
{
	to_currency=obj.attr("data-currencycode");
	jQuery("ul.currency_switcher li a").removeClass("active");
	obj.addClass("active");
	id=obj.attr("id");
	localStorage.setItem("selectedolditem", id);
	var xmlFile =siteURL+"/wp-content/plugins/currency-converter/latest.json";
	// frequency - time limit to get the latest open exchange rates API data
	var frequency=document.getElementById("currency_converter").frequency.value;
	frequency=frequency*60*60;
		// AJAX Call
		var xmlhttp;
		if (window.XMLHttpRequest)
		{
			xmlhttp=new XMLHttpRequest();
		}
		else
		{
			xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		}
		xmlhttp.onreadystatechange=function()
		{
			if (xmlhttp.readyState==4 && xmlhttp.status==200)
			{
				data = JSON.parse( xmlhttp.responseText );
				var d1=new Date();
				var d2=new Date(xmlhttp.getResponseHeader("Last-Modified"));
				var diff=((d1-d2)/1000);
				if(diff>=frequency)
				{
					saveJsonData(xmlFile);
				}
				else
				{
					priceConversion();
				}
			}
		}
		xmlhttp.open("POST",""+xmlFile,true);
		xmlhttp.send();
}

// Save open exchange rates API data in local
function saveJsonData(jsonFilePath)
{
	jQuery(document).ready(function()
			{
				var app_Id=document.getElementById("currency_converter").appId.value;
				jQuery.ajax(
			    {
			    	type: "GET",
			        url: siteURL+"/wp-content/plugins/currency-converter/getJsonData.php?appId="+app_Id+"&path="+jsonFilePath,
			        success:function(data)
			        {
			        	priceConversion();
			        }
			    });
			});	
}

// change price
function priceConversion()
{
  jQuery(document).ready(function()
  {
	jQuery("span[class=amount]").each(function() {
		if(data!="")
		{
		  if(amount=jQuery(this).attr("title"))
		  {
			setPrice();
		  }
		  else
		  {
			  id=jQuery(this);
			  setOriginalPrice(id);
			  setPrice();
		  }
		  jQuery(this).html(currency_symbol+""+amount);
		}
		else
		{
			id=jQuery(this);
			  setOriginalPrice(id);
		}
	});
  });
}

function setOriginalPrice(obj)
{
	amount = obj.text();
	amount=amount.substring(amount.indexOf(""+amount.match(/\d+/)));
	amount=amount.replace(",","");
	obj.attr("title",""+amount);
}

// currency symbols
function setPrice()
{
	amount=data["rates"][""+to_currency]*amount;
 	amount=amount.toFixed(0);
 	if(to_currency=="INR")
	{
		currency_symbol="<i class='fa fa-rupee fa-fw'></i>";
	}
	else if(to_currency=="USD")
	{
		currency_symbol="$ ";
	}
	else if(to_currency=="EUR")
	{
		currency_symbol='€ ';
	}
	else if(to_currency=="JPY")
	{
		currency_symbol='¥ ';
	}
	else if(to_currency=="AUD")
	{
		currency_symbol="$ ";
	}
	else if(to_currency=="CNY")
	{
		currency_symbol='¥ ';
	}
}

function pageFullyLoaded(e) {
	jQuery(document).ready(function(){
		jQuery("#CNY, #USD, #INR, #EUR, #JPY, #AUD").click(function(){
			var selected_id=jQuery(this);
				getExchangeRates(selected_id);
		});
		jQuery("#mpcth_page_header_secondary_content").append(jQuery("#currency_converter"));
		jQuery("#currency_converter").css({"float":"right","margin-top":"-0.5%","margin-bottom":"-0.7%"});
		data="";
		priceConversion();
		if (selectedolditem != null) {
		    id=jQuery("#"+selectedolditem);
		    getExchangeRates(id);
		}
	});
}
window.addEventListener("load", pageFullyLoaded, false);
