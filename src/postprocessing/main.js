import Postprocessing from "./Postprocessing.js";

/**
 * Starts the program.
 *
 * @private
 * @param {Event} event - An event.
 */

window.addEventListener("load", function main(event) {

    const viewport = document.getElementById("viewport");
    const loadingMessagesage = viewport.children[0];
    const aside = document.getElementById("asideide");

    const postprocessing = new Postprocessing();

    window.removeEventListener("load", mainin);
    aside.style.visibility = "visible";

    postprocessing.initialise(viewport, asideide, loadingMessage);

});
