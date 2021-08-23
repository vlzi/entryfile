if (window.alreadyFileIOImported && false) console.log("이미 파일 관련 블록을 불러오셨습니다.");
else (async function()
{
    if (~location.href.indexOf("ws/new")) return "새 프로젝트입니다. 저장하시고 다시 실행해주세요.";
    if (!confirm("코드를 불러오는 과정에서 저장하시지 않은 정보는 지워질 수 있습니다. 그러나 전에 코드를 불러오신 후 사용하시고 저장하신 후에 다시 코드를 불러오시지 않은 상태에서 저장하시면 저장된 코드가 지워집니다. 코드를 불러오시겠습니까?")) return "불러오기를 중지합니다.";
    window.alreadyFileIOImported = true;
    if (!Entry.engine.isState('stop')) await Entry.engine.stopButton.click();
    
    let files = [], uploadPopupOpen = false;
    
    const uploadPopup = document.getElementById('uploadPopup') 
        || document.createElement('div');
    uploadPopup.id = 'uploadPopup';
    uploadPopup.innerHTML = `<div class="dimmed__c1156"><div class="center__c1156"><div class="modal__c1156" style="min-height: unset;"><div class="head__c1156">
        <div class="text__c1156">파일 입력하기</div><div class="close__c1156" id="fileUploadClose"></div></div><div class="body__c1156">
        <img src="https://raw.githack.com/vlzi/entryfile/main/upload.svg" style="height: 40vh;" id="fileUploadImg">
        <p style="padding:  0 0 25px 0;">클릭하여 파일을 입력해주세요.</p></div><div class="footer__c1156"><div class="content__c1156">
        <div class="chart_button__c1156 stop__c1156" id="fileUploadStop">작품 정지하기</div></div></div></div></div></div>`;
    uploadPopup.style.display = "none"
    document.body.appendChild(uploadPopup);
    document.getElementById("fileUploadClose").onclick = () => {
        console.log('close');
        files = [];
        uploadPopup.style.display = "none";
        uploadPopupOpen = false
    }
    document.getElementById("fileUploadImg").onclick = () =>
    {
        console.log("img");
        const input = document.createElement("input");
        input.type = "file"; input.multiple = true;
        input.onchange = async () => {
            files = await Promise.all(Array.from(input.files).map(
                (file) => new Promise((res, rej) => {
                    const reader = new FileReader();
                    reader.onload = event => { res({name: file.name, bytes: new Uint8Array(event.target.result)}); }
                    reader.readAsArrayBuffer(file);
                })
            ));
            uploadPopup.style.display = "none";
            console.log(files);
            uploadPopupOpen = false
        };
        input.click();
    };
    document.getElementById("fileUploadStop").onclick = async () => 
    {
        console.log('stop');
        await Entry.engine.stopButton.click();
        files = [];
        uploadPopup.style.display = "none";
        uploadPopupOpen = false
    }
    Entry.block.ask_files_and_wait = {
        color: "#dd47d8",
        outerLine: "#b819b3",
        skeleton: "basic",
        statements: [],
        events: {},
        "class": "file",
        params: [
            {type: "Text", text: "파일 요청하고 기다리기", color: "#FFF"},
            {type: "Indicator", img: "block_icon/variable_icon.svg", size: 11}
        ],
        def: {params: [null, null], type: "ask_files_and_wait", category: "variable", id: "FILE0"},
        template: "%1%2",
        isFor: ["category_variable"],
        func: (spr,scr) => {
            if (scr.isWating)
            {
                if (uploadPopupOpen) return scr;
                else delete scr.isWating;
            }
            else
            {
                if (uploadPopupOpen) throw new Error("이미 파일을 요청중입니다.");
                uploadPopup.style.display = "block";
                uploadPopupOpen = true;
                scr.isWating = true;
                return scr;
            }
        }
    }
    Entry.block.files_count = {
        color: "#dd47d8",
        outerLine: "#b819b3",
        skeleton: "basic_string_field",
        statements: [],
        events: {},
        "class": "file",
        params: [
            {type: "Text", text: " 파일 수 ", color: "#FFF"}
        ],
        def: {params: [null], type: "files_count", category: "variable", id: "FILE1"},
        template: "%1",
        isFor: ["category_variable"],
        func: (spr,scr) => files.length
    }
    Entry.block.file_name = {
        color: "#dd47d8",
        outerLine: "#b819b3",
        skeleton: "basic_string_field",
        statements: [],
        events: {},
        "class": "file",
        params: [
            {type: "Block", accept: "string", defaultType: "number"},
            {type: "Text", text: "번째 파일의 이름", color: "#FFF"}
        ],
        def: {params: [1, null], type: "file_name", category: "variable", id: "FILE2"},
        paramsKeyMap: { index: 0},
        template: "%1%2",
        isFor: ["category_variable"],
        func: (spr,scr) => 
        {
            const index = scr.getValue("index", scr);
            if (index < 1 || index > files.length) throw new Error("범위 바깥입니다.");
            return files[index - 1].name;
        }
    }
    Entry.block.file_size = {
        color: "#dd47d8",
        outerLine: "#b819b3",
        skeleton: "basic_string_field",
        statements: [],
        events: {},
        "class": "file",
        params: [
            {type: "Block", accept: "string", defaultType: "number"},
            {type: "Text", text: "번째 파일의 크기", color: "#FFF"}
        ],
        def: {params: [1, null], type: "file_size", category: "variable", id: "FILE3"},
        paramsKeyMap: { index: 0},
        template: "%1%2",
        isFor: ["category_variable"],
        func: (spr,scr) => 
        {
            const index = scr.getValue("index", scr);
            if (index < 1 || index > files.length) throw new Error("범위 바깥입니다.");
            return files[index - 1].bytes.length;
        }
    }
    Entry.block.file_byte = {
        color: "#dd47d8",
        outerLine: "#b819b3",
        skeleton: "basic_string_field",
        statements: [],
        events: {},
        "class": "file",
        params: [
            {type: "Block", accept: "string", defaultType: "number"},
            {type: "Text", text: "번째 파일의", color: "#FFF"},
            {type: "Block", accept: "string", defaultType: "number"},
            {type: "Text", text: "번째 바이트", color: "#FFF"}
        ],
        def: {params: [{ type: "number", params: [1], id: "p1" }, null, { type: "number", params: [3], id: "p2"}, null], type: "file_byte", category: "variable", id: "FILE4"},
        paramsKeyMap: { fileIndex: 0, byteIndex: 2},
        template: "%1%2%3%4",
        isFor: ["category_variable"],
        func: (spr,scr) => 
        {
            const fileIndex = scr.getValue("fileIndex", scr);
            if (fileIndex < 1 || fileIndex > files.length) throw new Error("범위 바깥입니다.");
            const bytes = files[fileIndex - 1], byteIndex = scr.getValue("byteIndex", scr);
            if (byteIndex < 1 || byteIndex > bytes.length) throw new Error("범위 밖입니다.");
            console.log(fileIndex, byteIndex);
            return bytes[byteIndex - 1];
        }
    }
    Entry.playground.blockMenu._buildCategoryCodes(["ask_files_and_wait", "files_count", "file_name", "file_size", "file_byte"], "variable").forEach(function (t)
    {
        if (!t || !t[0]) {
            return;
        }
        Entry.playground.blockMenu._createThread(t);
    });
    Entry.playground.blockMenu.code.changeEvent.notify();
    const project = (await fetch("/graphql",
    {
        headers: { "Content-Type": "application/json" },
        body : JSON.stringify({
            query: `query($id: ID! $groupId: ID) { project(id: $id, groupId: $groupId) {
                objects scenes variables messages functions tables
                speed interface expansionBlocks aiUtilizeBlocks learning 
            } }`,
            variables: {
                id: location.href
                .match(/https:\/\/playentry\.org\/ws\/(?<pid>[0-9a-f]+)/).groups.pid
            }
        }),
        method: "POST"
    }).then(r=>r.json())).data.project;
    Entry.clearProject();
    Entry.loadProject(project);
    Entry.playground.showBlockMenu();
    return "완료되었습니다.";
})().then((m)=>console.log(m));
undefined;
