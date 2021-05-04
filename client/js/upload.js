/**
 * Format bytes as human-readable text.
 *
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 *
 * @return Formatted string.
 */
function humanFileSize(bytes, si = false, dp = 1) {
    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }

    const units = si
        ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10**dp;

    do {
        bytes /= thresh;
        ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

    return bytes.toFixed(dp) + ' ' + units[u];
}

function createElement(tag, classes = [], content) {
    const $elem = document.createElement(tag);
    if (classes.length) $elem.classList.add(...classes);
    if (content) $elem.textContent = content;
    return $elem;
}

const wsConnection = new WebSocket("ws://localhost:5001/");
wsConnection.binaryType = "arraybuffer";
wsConnection.onopen  = () => { console.log("Connection opened"); };
wsConnection.onclose = e => {
    if (e.wasClean) console.log("Connection successfully closed")
    else console.log("Break connection"); // например, "убит" процесс сервера
    console.log(`Code: ${e.code} reason: ${e.reason}`);
};
wsConnection.onerror = e => console.error(`Error: ${e.message}`);
// on message received
wsConnection.onmessage = e => {
    const json = JSON.parse(e.data);
    console.log("Message: ", json);
}
const wsSend = (connection, message = {}) => {
    if (typeof message === "object") connection.send(JSON.stringify(message));
    else connection.send(message);
}

export function upload(selector, options = {}) {
    let files = [];
    const {onUpload = () => {}} = options;

    // native input
    const $input = document.querySelector(selector);
    if (options.multi) $input.setAttribute("multiple", true);
    if (options.accept && Array.isArray(options.accept))
        $input.setAttribute("accept", options.accept.join(","));
    const onInputChangeHandler = event => {
        if (!event.target.files.length) return;

        $upload.style.display = "inline-block";
        files = Object.values(event.target.files);

        $images.innerHTML = "";
        files.forEach(file => {
            if (!file.type.match("image")) return;

            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.addEventListener("load", e => {
                const src = e.target.result;
                $images.insertAdjacentHTML("afterbegin", `
                    <div class="preview">
                        <div class="preview__remove" data-name="${file.name}">&times;</div>
                        <div class="preview__info">
                            <span>${file.name}</span>
                            <span>${humanFileSize(file.size)}</span>
                        </div>
                        <img class="preview__image" src="${src}" alt="${file.name}" />
                    </div>
                `);
            })
        });
    };
    $input.addEventListener("change", onInputChangeHandler);

    // images
    const $images = createElement("div", ["upload-image__images"]);
    $input.insertAdjacentElement("afterend", $images);
    // delete images
    $images.addEventListener("click", e => {
        if (e.target.classList.contains("preview__remove")) {
            const fileName = e.target.dataset.name;
            files = files.filter(f => f.name !== fileName);
            if (files.length === 0) $upload.style.display = "none";
            const $preview = e.target.closest(".preview");
            $preview.classList.add("preview_removing");
            setTimeout(() => $preview.remove(), 200);
        }
    });

    // button open
    const $open = createElement("button", ["upload-image__btn"], "Open");
    $input.insertAdjacentElement("afterend", $open);
    $open.addEventListener("click", () => $input.click());

    // button upload
    const $upload = createElement("button", ["upload-image__btn", "upload-image__btn_primary"], "Upload");
    $open.insertAdjacentElement("afterend", $upload);
    $upload.style.display = "none";
    $upload.addEventListener("click", () => {
        $images.querySelectorAll(".preview__remove").forEach(e => e.remove());
        const $previewInfo = $images.querySelectorAll(".preview__info");
        $previewInfo.forEach(el => {
            el.style.bottom = "0";
            el.innerHTML = '<div class="preview__progress"></div>'
        });
        onUpload(files, $previewInfo);
    });

    // Test btn
    const $testBtn = createElement("button", ["upload-image__btn"], "Test WS");
    $upload.insertAdjacentElement("afterend", $testBtn);
    $testBtn.addEventListener("click", e => {
        // wsSend(wsConnection, { event: "chat-message", payload: { userName: "Ilia", message: "Test" }});
        files.forEach(file => {
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file);
            fileReader.addEventListener("load", e => {
                let rawData = new ArrayBuffer();
                rawData = e.target.result;
                // wsSend(wsConnection, { event: "image", payload: rawData });
                wsConnection.send(rawData);
                console.log("File transferred");
                console.log("Data", rawData);
            });

        })
    });
}
