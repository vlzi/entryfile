(function()
{
    if (~location.href.indexOf("new")) return "저장하시고 다시 실행해주세요.";
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
                    (file) => new Promise(async(res, rej) => {
                        const reader = new FileReader();
                        reader.onload = event => { res(Array.from(new Int8Array(event.target.result)).map(b=>b+128)); }
                        reader.readAsArrayBuffer(file);
                    })
                ));
                console.log(files, 345);
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
    const project = Entry.exportProject();
    Entry.clearProject();
    Entry.loadProject(project);
    Entry.playground.showBlockMenu();
})();
