# Look-Up-Later
[For More Details](https://blog.tan90.co/LookUpLaterDevelopingPlan)

A Chrome extension helps you read, remember and learn efficiently.

>When reading a foreign language article, I find the most annoying thing is not vocabulary itself but the interruption form looking it up.

![Plenty vocabularies show up while reading](https://ws3.sinaimg.cn/large/006tKfTcgy1fi6wsof81gj31kw0zjkeo.jpg)

As we meet one new, we look it up, trying to remember all the translations listed as well as the rows of examples uses. We really DO NOT remember them all and these things slow down our reading speed, reduce our intersts of the article, gradually we will trun off the reading track and renounce the reading.

So I choose to skip the vocabulary and LOOK it UP LATER, But another problem show up. I couldn't find it. So awkward. That's why come up with this idea developing a chrome-extension which remembers your new vocabulary each webpage, makes a list of them, reminders you to look them up or even shows the translations, examples for you automaticly and sets a schedule to strengthen your memoties. The steps would be like:

![Efficient way to read, remember and learn with LoopUpLater](https://ws2.sinaimg.cn/large/006tKfTcgy1fi6xwxaeamj30r10chgm4.jpg)

Now I'm reading the [Developer Document](https://developer.chrome.com/apps/about_apps) the work will begin tomorrow.

>PS: This article will be updated continually, want to get the latest info about this project, subscribe our email update.

***

<b>04-08-2017 Update</b>

>Google has announced plans to gradually phase out support for Chrome apps on every platform except for Chrome OS. Starting in later 2016.

![icon](https://ws1.sinaimg.cn/large/006tNc79gy1fi7wxrrclmj30ic04q74l.jpg)

A Chrome extension needs a manifest file to tell Chrome about the app and require extra permissions. To learn more about the manifest, read the [Manifest File Format documentation](https://developer.chrome.com/extensions/manifest)

manifest.json

```javascript
{
	"manifest_version": 2,
	"name": "Look Up Later",
	"version": "1.0",
	"description": "To read, remember and learn efficiently.",
	"icons": {
        "16": "images/icon-16.png",
        "48": "images/icon-48.png",
        "128": "images/icon-128.png"
    },
    "content_scripts": [ {
      "js": ["js/content.js"],
      "matches": ["http://*/*", "https://*/*"],
      "run_at": "document_idle"
    } ],
	"browser_action": {
		"default_icon": {
            "19": "images/icon-16.png",
            "38": "images/icon-48.png"
        },
		"default_title": "Look Up Later",
		"default_popup": "popup.html"
	},
	"permissions": [
        "storage",
        "nativeMessaging",
        "cookies",
        "contextMenus",
        "http://*/*",
        "https://*/*"
    ],
    "background": {
        "scripts": ["js/background.js"]
    }
}
```

content.js is a JavaScript file that runs in the context of web pages. By using the standard Document Object Model (DOM), it can read details of the web pages the browser visits, or make changes to them.

I want LUL extension to have the function that make the selected vocabulary conspicuous to user. The code below shows how can we use `window.onmousedown` and `window.onmouseup` to change the selected text style and get the selected text content.

```javascript
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
window.onmousedown = function(){
    lul_setColor();
    window.onmouseup = function(){
        var selectedText = lul_getSelectedText();
    };
};
```
The result will be like:

![result_1](https://ws1.sinaimg.cn/large/006tNc79gy1fi7wlo3kjvj31kw0zjgyb.jpg)

***

<b>12-08-2017 Update</b>

How could I know whether have I marked certain vocabulary in the content? Scroll up and check the words marked before? Certainly not. So making the user have a direct feedback about all the words that are same as the ones being selected is necessary. By using <i>highlight.js</i> (by Johann Burkard) can we accomplish this.

```javascript
$('body').highlight("hello");
```
The code above can mark all the "hello" word in the body element. So I just use the plugin in the `window.onmouseup` function:

```javascript
window.onmousedown = function(){
    window.onmouseup = function(){
        var selectedText = lul_getSelectedText();
        if(selectedText!=''){
            lul_setColor();
            $('body').highlight( selectedText );
        }
    };
};
```
And the result is like:

![result_2](https://ws1.sinaimg.cn/large/006tNc79gy1figr8uzh96j31kw0zjqj6.jpg)

<b>Storage</b>

Require an extra permission in the manifest.json

```javascript
{
 "permissions": [
   "storage"
 ]
}
```

To store data via a Chrome extension, there are two way:

1. HTML5 localStorage
2. Chrome storage API

The different between those method are:

* User data can be automatically synced with Chrome sync (using storage.sync).
* Your extension's content scripts can directly access user data without the need for a background page.
* A user's extension settings can be persisted even when using split incognito behavior.
* It's asynchronous with bulk read and write operations, and therefore faster than the blocking and serial localStorage API.
* User data can be stored as objects (the localStorage API stores data in strings).
* Enterprise policies configured by the administrator for the extension can be read (using storage.managed with a schema).

I created 1 function (`lul_addVocabulary`) in content.js and 3 functions (`lul_refreshData`, `lul_removeData`, `lul_clearAll`)
using storage API.

[More Information](https://developer.chrome.com/extensions/storage)

<b>Translation API</b>

This extension will show the meaning and voice button in the popup.html, which will show up when you click the button on the top of you browser. The function is based on [Jinshan Dictionary API](http://open.iciba.com/index.php?c=wiki&t=cc).

<b>Processing Animation</b>

![result_3](https://ws2.sinaimg.cn/large/006tNc79gy1fih3sksci4j30nw0bit95.jpg)

Using [Pace.js](http://github.hubspot.com/pace/)

<b>Project Finished</b>

![](https://ws3.sinaimg.cn/large/006tNc79gy1fih3tg5znkj30nc0ven08.jpg)

> [Download .crx](https://tan90.co/Projects/LookUpLater.crx)
> 
> How to Install: Open `chrome://extensions/` and drag the .crx file into the browser
