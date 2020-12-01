class Storage {

    storage = window.localStorage;

    store(key,data) {
        this.storage.setItem(key, JSON.stringify(data));
    }

    load(key) {
       return JSON.parse(this.storage.getItem(key));
    }
}

class IH {
    tounfollow = [];
    storage = new Storage();

    scriptButton = null;
    textAreaDiv = null;

    convertCallback = null;

    constructor(convertCallback) {

        this.convertCallback = convertCallback;
        this.showScriptButton();
        this.startWatch();
        this.loadData();

        this.addXMLRequestCallback((request, event) => {
            if (request.status == "429") {
                alert("Keep pause");
            }
        })
    }

    showScriptButton(){
        this.scriptButton = this.stringToHTML(`
<div id="IH_pop">
Names: <span  id="ihh-count">0</span>
<button id="ihh-openw">+</button>
</div>
`);
        this.scriptButton.style.cssText=`
        position: fixed;
        top: 0;
        left: 0;
        background: red;
        display: inline-block;
        padding: 5px;
        `;
        document.body.appendChild(this.scriptButton);

        document.getElementById("ihh-openw").onclick = () => {

            if (document.getElementById("IH_in") == null) {
                this.showTextArea();
            } else {
                this.closeTextArea();
            }
        }
    }

    updateScriptButtonData() {
        document.getElementById("ihh-count").innerText = this.tounfollow.length.toString();
    }

    parseDataFromTextArea(){
        var data = document.getElementById("IH_area").value;
        this.closeTextArea();

        if (data == null || data.toString().trim().length < 1) return;

        var namesArray = data.split("\n");
        this.tounfollow = [];

        namesArray.forEach((line) => {
            // User ID,Username,Name,Incoming Status,Outgoing Status
            var s = this.convertCallback(line);
            var cleaned = s.substring(1, s.length-1);
            if (cleaned.length > 0) {
                this.tounfollow.push(cleaned);
            }
        });
        console.log("HI: added " + this.tounfollow.length + " names");
        this.updateScriptButtonData();
        this.saveData();
    }

    closeTextArea(){
        document.getElementById("IH_in").remove();
    }
    showTextArea(){
        this.textAreaDiv = this.stringToHTML(`
    <div id="IH_in">
        <textarea id="IH_area"></textarea>
        <button id="IH_close">OK</button>
    </div>`);
        this.textAreaDiv.style.cssText=`
        position: fixed;
        top: 0;
        left: 0;
        width: 400px
        height: 400px;
        background: red;
        display: inline-block;
        padding: 3px;
        `;

        document.body.appendChild(this.textAreaDiv);
        document.getElementById("IH_close").onclick = () => {
            this.parseDataFromTextArea();
        }

    }

    stringToHTML(str) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(str, 'text/html');
        return doc.body.children[0];
    }

    intervalId = null;
    startWatch() {
        this.followingPopupOpenedObserver = new MutationObserver( (mutationsList, observer) => {
            for(const mutation of mutationsList) {
                if (mutation.type === 'childList') {

                    if (this.isFollowingPopupOpen()) {

                        if (this.intervalId != null) return; // prevent multiple launches

                        setInterval(() => {
                            this.markPeopleFromList();
                        },300);
                    } else {
                        clearInterval(this.intervalId);
                        this.intervalId = null;
                    }
                    return;
                }
            }
        });
        this.followingPopupOpenedObserver.observe(document.body, {
            childList: true,
            attributes: false,
            subtree: false
        });
    }

    markPeopleFromList() {

        if (this.tounfollow.length < 1) return;

        var lis = document.querySelectorAll('[role="dialog"] li a');
        lis.forEach((item) => {

            if (this.tounfollow.includes(item.innerText)) {
                item.style.backgroundColor = "red";
            }
        })
    }

    isFollowingPopupOpen(){

        if (document.querySelectorAll("[role=presentation]").length <1) return false;
        var popups = document.querySelectorAll('[role="dialog"]');
        if (popups.length < 1) return false;
        var popup = popups[0];
        if (popup.querySelectorAll("h1").length < 1) return false;
        if (popup.querySelectorAll("h1")[0].innerText != "Following") return false;

        return true;
    }

    loadData(){
        this.tounfollow = this.storage.load('ihhdata');
        this.tounfollow = (this.tounfollow  == null ? [] : this.tounfollow );
        this.updateScriptButtonData();
        console.log("HI: data loaded into localstorage.");
        console.log("HI: loaded " + this.tounfollow.length + " names");
    }
    saveData(){
        this.storage.store('ihhdata', this.tounfollow);
        console.log("HI: data stored into localstorage.");
    }

    addXMLRequestCallback(callback){

        let send = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function() {
            this.addEventListener('readystatechange', function() {
                if (this.readyState === 4) {
                    callback(this);
                }
            }, false);
            send.apply(this, arguments);
        };
    }
}


var a = new IH((line)=>{
    return line.split(",")[1];
});
