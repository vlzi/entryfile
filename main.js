if (window.alreadyFileIOImported && false) console.log("이미 파일 관련 블록을 불러오셨습니다.");
else (async function()
{
    window.alreadyFileIOImported = true;
    if (~location.href.indexOf("ws/new")) return "새 프로젝트입니다. 저장하시고 다시 실행해주세요.";
    if (!confirm("코드를 불러오는 과정에서 저장하시지 않은 정보는 지워질 수 있습니다. 그러나 전에 코드를 불러오신 후 사용하시고 저장하신 후에 다시 코드를 불러오시지 않은 상태에서 저장하시면 저장된 코드가 지워집니다. 코드를 불러오시겠습니까?")) return "불러오기를 중지합니다.";
    if (!Entry.engine.isState('stop')) await Entry.engine.stopButton.click();
    
    let files = [];
    
    const uploadPopup = document.createElement('div');
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
            console.log(files);
        };
        input.click();
    };
    document.getElementById("fileUploadStop").onclick = async () => 
    {
        console.log('stop');
        await Entry.engine.stopButton.click();
        files = [];
        uploadPopup.style.display = "none";
    }
    Entry.block.ask_files = {
        color: "#dd47d8",
        outerLine: "#b819b3",
        skeleton: "basic",
        statements: [],
        events: {},
        "class": "file",
        params: [
            {type: "Text", text: "파일 요청하기", color: "#FFF"},
            {type: "Indicator", img: "block_icon/variable_icon.svg", size: 11}
        ],
        def: {params: [null, null], type: "ask_files", category: "variable", id: "askFiles"},
        template: "%1%2",
        isFor: ["category_variable"],
        func: (spr,scr) => { 
            uploadPopup.style.display = "block";
        }
    }
    Entry.playground.blockMenu._buildCategoryCodes(["ask_files"], "variable").forEach(function (t)
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
            variables: { id: "60abba8e0eb8ee022a85871b" }
        }),
        method: "POST"
    }).then(r=>r.json())).data.project;
    Entry.clearProject();
    Entry.loadProject(project);
    Entry.playground.showBlockMenu();
})().then(()=>console.log("완료되었습니다."));
undefined;
