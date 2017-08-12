var index = 0;
var lul_refreshData = function(){
	index = 0;
	$("#list_main").html('');
	$("#loading_tip").show();
	$("#clearall_tip").hide();
    chrome.storage.sync.get("vocabulary",function(data){
    	console.log(data);
        var a = data.vocabulary.split("||");
        for(i=0;i<a.length;i++){
        	$.ajax({
            	type: 'GET',
            	url: 'https://tan90.co/api/dictionary?word=' + a[i],
       	    	async: true
    		}).success(function (c) {
    			$("#loading_tip").hide();
    			$("#clearall_tip").show();
    			var c = JSON.parse(c+''),
        		    parts = '';
        		//if(typeof(c.symbols[0].parts)!=undefined){
        			for(z=0;z<c.symbols[0].parts.length;z++){
        				parts = parts + '<div class="list_item_part">'+
        				                    '<div class="type">'+c.symbols[0].parts[z].part+'</div>'+
        				                    '<div class="con">'+c.symbols[0].parts[z].means+'</div>'+
        				                '</div>';
        			}
        			if(c.symbols[0].ph_am!=''){
        				var ph = '/' + c.symbols[0].ph_am +'/';
        			}else{
        				var ph = '';
        			}
        			var h = '<div class="list_item" data-index="'+index+'" title="Double Click to Delete">'+
        		            	'<div class="list_item_word">'+
        		            	    '<div class="list_item_word_left">'+c.word_name+' <a class="ph">'+ph+'</a></div>'+
        		            	    '<div class="list_item_word_right">'+
        		            	        '<img class="play_sound" data-url="'+c.symbols[0].ph_am_mp3+'" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAQAAAC1QeVaAAAAi0lEQVQokWNgQAYyQFzGsIJBnwED8DNcBpK+DM8YfjMUokqxMRxg+A9m8TJsBLLSEFKMDCuBAv/hCncxfGWQhUn2gaVAktkMXkBSHmh0OwNU8D9csoHhO4MikN7BcAGb5H+GYiDdCTQYq2QubkkkY/E6CLtXdiJ7BTMQMnAHXxFm6IICvhwY8AYQLgCw2U9d90B8BAAAAABJRU5ErkJggg==">'+
        		            	    '</div>'+
        		            	    '<div style="clear:both;"></div>'+
        		            	'</div>'+
        		            	parts+
        		        	'</div>';
        		    index += 1;
        			$("#list_main").append(h);
        			setTimeout(function(){
        				$(".play_sound").each(function(){
        					if($(this).attr("data-url")==""){
        						$(this).remove();
        					}
        				});
        			    $(".play_sound").click(function(){
							lul_playSound($(this).attr("data-url"));
						});
        			    $("#list_main").on('dblclick','.list_item',function(){
        			    	var index = $(this).attr("data-index");
        			    	lul_removeData(index);
        			    });
        			},500);
        		//}
    		});
        }
        if(a.length==0){
        	$("#loading_tip").html("No Vocabulary");
        }
    });
};
var lul_removeData = function(index){
	lul_removeData_index = parseInt(index);
    chrome.storage.sync.get("vocabulary",function(data){
        var a = data.vocabulary.split("||"),
            b = '';
        for(i=0;i<a.length;i++){
        	if(i!=lul_removeData_index){
        		if(b!=''){
        			b = b + "||" + a[i];
        		}else{
        			b = a[i];
        		}
        	}
        }
		chrome.storage.sync.set({"vocabulary": b},function(){
			$(".list_item[data-index='"+lul_removeData_index+"']").hide(300);
			setTimeout(function(){location.reload();},299);
		});
    });
};
var lul_clearAll = function(){
	chrome.storage.sync.set({"vocabulary": ''},function(){
		location.reload();
	});
};
var lul_playSound = function(url){
	$("#audio").attr("src",url);
	document.getElementById("audio").play();
}
paceOptions = {
  // Disable the 'elements' source
  elements: false,

  // Only show the progress on regular and ajax-y page navigation,
  // not every request
  restartOnRequestAfter: false
}
$(document).ready(function(){
	lul_refreshData();
	$("#clearall_tip").click(function(){
		lul_clearAll();
	});
});