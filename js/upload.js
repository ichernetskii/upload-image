export function upload(selector, options = {}) {
    const $input = document.querySelector(selector);
    if (options.multi) $input.setAttribute("multiple", true);
    if (options.accept && Array.isArray(options.accept))
        $input.setAttribute("accept", options.accept.join(","));

    const $open = document.createElement("button");
    $open.classList.add("btn");
    $open.textContent = "Open";

    $input.insertAdjacentElement("afterend", $open);

    $open.addEventListener("click", () => $input.click());

    const onInputChangeHandler = event => {
        if (!event.target.files.length) return;

        const files = Object.values(event.target.files);
        files.forEach(file => {
            if (!file.type.match("image")) return;

            const fileReader = new FileReader();



        });
    };
    $input.addEventListener("change", onInputChangeHandler);
}
