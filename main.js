(async function()
{
    if (~location.href.indexOf("ws/new")) return "새 프로젝트입니다. 저장하시고 다시 실행해주세요.";
    if (!confirm("코드를 불러오는 과정에서 저장하시지 않은 정보는 지워질 수 있습니다. 그러나 전에 코드를 불러오신 후 사용하시고 저장하신 후에 다시 코드를 불러오시지 않은 상태에서 저장하시면 저장된 코드가 지워집니다. 코드를 불러오시겠습니까?")) return "불러오기를 중지합니다.";
    if (Entry.engine.isState('run')) await Entry.engine.stopButton.click();
    let files = [];
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
            const input = document.createElement("input");
            input.type = "file"; input.multiple = true;
            input.onchange = async () => {
                files = await Promise.all(Array.from(input.files).map(
                    (file) => new Promise((res, rej) => {
                        const reader = new FileReader();
                        reader.onload = event => { res({name: file.name, bytes: Array.from(new Int8Array(event.target.result)).map(b=>b+128)}); }
                        reader.readAsArrayBuffer(file);
                    })
                ));
                console.log(files, 567);
            };
            input.click();
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
