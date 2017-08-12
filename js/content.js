jQuery.fn.highlight = function(pat) {
 function innerHighlight(node, pat) {
  var skip = 0;
  if (node.nodeType == 3) {
   var pos = node.data.toUpperCase().indexOf(pat);
   if (pos >= 0) {
    var spannode = document.createElement('span');
    //spannode.className = 'highlight';
    spannode.style.cssText = "color:#000";
    spannode.style.background = "rgba(255,255,0,0.3)";
    var middlebit = node.splitText(pos);
    var endbit = middlebit.splitText(pat.length);
    var middleclone = middlebit.cloneNode(true);
    spannode.appendChild(middleclone);
    middlebit.parentNode.replaceChild(spannode, middlebit);
    skip = 1;
   }
  }
  else if (node.nodeType == 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
   for (var i = 0; i < node.childNodes.length; ++i) {
    i += innerHighlight(node.childNodes[i], pat);
   }
  }
  return skip;
 }
 return this.each(function() {
  innerHighlight(this, pat.toUpperCase());
 });
};
jQuery.fn.removeHighlight = function() {
 function newNormalize(node) {
    for (var i = 0, children = node.childNodes, nodeCount = children.length; i < nodeCount; i++) {
        var child = children[i];
        if (child.nodeType == 1) {
            newNormalize(child);
            continue;
        }
        if (child.nodeType != 3) { continue; }
        var next = child.nextSibling;
        if (next == null || next.nodeType != 3) { continue; }
        var combined_text = child.nodeValue + next.nodeValue;
        new_node = node.ownerDocument.createTextNode(combined_text);
        node.insertBefore(new_node, child);
        node.removeChild(child);
        node.removeChild(next);
        i--;
        nodeCount--;
    }
 }
 return this.find("span.highlight").each(function() {
    var thisParent = this.parentNode;
    thisParent.replaceChild(this.firstChild, this);
    newNormalize(thisParent);
 }).end();
};
var lul_getSelectedText = function(){
    if(window.getSelection){
       return window.getSelection().toString();
    }else if(document.getSelection){
       return document.getSelection();
    }else if(document.selection){
       return document.selection.createRange().text;
    }
};
var lul_setColor = function(){
    if(document.selection){
        var tr = document.selection.createRange();
        tr.execCommand("ForeColor", false, "#000");
        tr.execCommand("BackColor", false, "rgba(255,255,0,0.3)");
    }else{
        var tr = window.getSelection().getRangeAt(0);
        var span = document.createElement("span");
        span.style.cssText = "color:#000";
        span.style.background = "rgba(255,255,0,0.3)";
        tr.surroundContents(span);
    }
};
var lul_addVocabulary = function(selectedText){
    chrome.storage.sync.get("vocabulary",function(data){
        if(data.vocabulary!=""&&typeof(data.vocabulary)!=undefined&&data.vocabulary!=undefined){
            var a = data.vocabulary.split("||"),
                b = 0;
            for(i=0;i<a.length;i++){
                if(a[i]==selectedText){
                    b = 1;
                }
            }
            if(b!=1){
                var str = '';
                if(typeof(data.vocabulary)==undefined){
                    str = selectedText;
                }else{
                    str = data.vocabulary + "||" + selectedText;
                }
                chrome.storage.sync.set({"vocabulary": str},function(){
                    //console.log("保存完毕");
                });
            }
        }else{
            chrome.storage.sync.set({"vocabulary": selectedText},function(){
                //console.log("保存完毕");
            });
        }
    });
};
window.onmousedown = function(){
    //lul_setColor();
    window.onmouseup = function(){
        var selectedText = lul_getSelectedText();
        if(selectedText.indexOf(" ")>=0){
            selectedText = '';
        }
        if(selectedText.indexOf("\r")>=0){
            selectedText = '';
        }
        if(selectedText.indexOf("\n")>=0){
            selectedText = '';
        }
        var reg = /[\u4E00-\u9FA5]/g;
        var selectedText = selectedText.replace(reg,'');
        var re = /[123456789？。《》「」、～·！@¥……（）0`./\%|[~#^$@%&!*()<>:;'"{}【】  ]/gi;  
        if(re.test(selectedText)){  
            selectedText = ''; 
        }
        if(selectedText!=''){
            lul_setColor();
            $('body').highlight( selectedText );
            selectedText = selectedText.toLowerCase();
            lul_addVocabulary(selectedText);
        }
    };
};