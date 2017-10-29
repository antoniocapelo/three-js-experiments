import { Clock, WebGLRenderer } from "three";
import dat from 'dat.gui/build/dat.gui.js'
import Stats from "stats.js";

import { EffectComposer } from "postprocessing";

import Bokeh from "./tests/Bokeh";

/**
 * A demo application.
 */

export default class Postprocessing {

    /**
     * Constructs a new demo application.
     */

    constructor() {

        /**
         * A clock.
         *
         * @type {Clock}
         * @private
         */

        this.clock = new Clock();

        /**
         * Effect composer.
         *
         * @type {EffectComposer}
         * @private
         */

        this.composer = (function() {

            const renderer = new WebGLRenderer({
                logarithmicDepthBuffer: true,
                antialias: true
            });

            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setClearColor(0x000000);
            renderer.setPixelRatio(window.devicePixelRatio);

            return new EffectComposer(renderer, {
                stencilBuffer: true,
                depthTexture: true
            });

        }());

        /**
         * Statistics.
         *
         * @type {Stats}
         * @private
         */

        this.stats = (function() {

            const stats = new Stats();
            stats.showPanel(0);
            stats.dom.id = "stats";

            return stats;

        }());

        /**
         * Available demos.
         *
         * @type {Map}
         * @private
         */

        this.demos = (function(composer) {

            const demos = new Map();

            demos.set("bokeh", new Bokeh(composer));

            return demos;

        }(this.composer));

        /**
         * The key of the current effect.
         *
         * @type {String}
         * @private
         */

        this.effect = (function(demos) {

            let key = window.location.hash.slice(1);

            if(key.length === 0 || !demos.has(key)) {

                key = demos.keys().next().value;

            }

            return key;

        }(this.demos));

    }

    /**
     * Initialises the demo.
     *
     * @param {HTMLElement} viewport - The viewport.
     * @param {HTMLElement} aside - A secondary DOM container.
     * @param {HTMLElement} loadingMessage - A loading message.
     */

    initialise(viewport, aside, loadingMessage) {

        const app = this;

        const composer = this.composer;
        const renderer = composer.renderer;
        const clock = this.clock;
        const stats = this.stats;
        const demos = this.demos;

        let demo = null;
        let gui = null;

        viewport.appendChild(renderer.domElement);
        aside.appendChild(stats.dom);

        /**
         * Activates the currently selected demo.
         *
         * @private
         */

        function activateDemo() {

            demo.initialise();

            demo.camera.aspect = window.innerWidth / window.innerHeight;
            demo.camera.updateProjectionMatrix();

            gui = new dat.GUI({ autoPlace: true });
            gui.add(app, "effect", Array.from(demos.keys())).onChange(loadDemo);
            demo.configure(gui);
            aside.appendChild(gui.domElement);

            loadingMessage.style.display = "none";
            renderer.domElement.style.visibility = "visible";

        }

        /**
         * Loads the currently selected demo.
         *
         * @private
         */

        function loadDemo() {

            const size = renderer.getSize();

            loadingMessage.style.display = "block";
            renderer.domElement.style.visibility = "hidden";

            if(gui !== null) {
                gui.destroy();
                aside.removeChild(gui.domElement);
            }

            if(demo !== null) {
                demo.reset();
                renderer.setSize(size.width, size.height);
                composer.replaceRenderer(renderer);
            }

            composer.reset();
            demo = demos.get(app.effect);
            demo.load(activateDemo);

            // Update the url.
            window.location.hash = app.effect;
        }

        loadDemo();

        /**
         * Toggles the visibility of the interface on alt key press.
         *
         * @private
         * @param {Event} event - An event.
         */

        document.addEventListener("keydown", function onKeyDown(event) {
            if(event.altKey) {
                event.preventDefault();
                aside.style.visibility = (aside.style.visibility === "hidden") ? "visible" : "hidden";
            }
        });

        /**
         * Handles browser resizing.
         *
         * @private
         * @param {Event} event - An event.
         */

        window.addEventListener("resize", (function() {

            let id = 0;

            function handleResize(event) {
                const width = event.target.innerWidth;
                const height = event.target.innerHeight;

                composer.setSize(width, height);
                demo.camera.aspect = width / height;
                demo.camera.updateProjectionMatrix();

                id = 0;

            }

            return function onResize(event) {

                if(id === 0) {

                    id = setTimeout(handleResize, 66, event);

                }

            };

        }()));

        /**
         * The main render loop.
         *
         * @private
         * @param {DOMHighResTimeStamp} now - An execution timestamp.
         */

        (function render(now) {

            const delta = clock.getDelta();

            requestAnimationFrame(render);

            stats.begin();

            demo.update(delta);
            composer.render(delta);

            stats.end();
        }());

    }

}

/**
 * Starts the program.
 *
 * @private
 * @param {Event} event - An event.
 */

window.addEventListener("load", function main(event) {

    const viewport = document.getElementById("viewport");
    const loadingMessage = viewport.children[0];
    const aside = document.getElementById("aside");

    const postprocessing = new Postprocessing();

    window.removeEventListener("load", main);
    aside.style.visibility = "visible";

    postprocessing.initialise(viewport, aside, loadingMessage);

});
