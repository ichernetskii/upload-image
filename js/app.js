import "../style/style.scss";
import {upload} from "./upload.js";

upload(".file", {
    multi: true,
    accept: [".png", ".jpg", ".jpeg", ".gif", ".webp", ".bmp"]
});
