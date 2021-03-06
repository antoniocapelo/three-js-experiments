import { FogExp2, LoadingManager, PerspectiveCamera, Scene } from "three";

/**
 * A Test base class.
 */

export default class Test {

    /**
     * Constructs a new Test.
     *
     * @param {EffectComposer} composer - An effect composer.
     */

    constructor(composer) {

        /**
         * An effect composer.
         *
         * @type {EffectComposer}
         */

        this.composer = composer;

        /**
         * A loading manager.
         *
         * @type {LoadingManager}
         */

        this.loadingManager = new LoadingManager();

        /**
         * An asset map.
         *
         * @type {Map}
         */

        this.assets = null;

        /**
         * A scene.
         *
         * @type {Scene}
         */

        this.scene = new Scene();
        this.scene.fog = new FogExp2(0x0d0d0d, 0.0025);

        /**
         * A camera.
         *
         * @type {PerspectiveCamera}
         */

        this.camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 2000);

        /**
         * Camera controls.
         *
         * @type {OrbitControls}
         */

        this.controls = null;

    }

    /**
     * Loads the Test. Override this method to load assets.
     *
     * @param {Function} callback - Call this function when all assets have been loaded.
     */

    load(callback) { callback(); }

    /**
     * Creates the scene.
     */

    initialise() {}

    /**
     * Updates this Test.
     *
     * @param {Number} delta - The time since the last frame in seconds.
     */

    update(delta) {}

    /**
     * Registers configuration options.
     *
     * @param {GUI} gui - A GUI.
     */

    configure(gui) {}

    /**
     * Resets this Test.
     *
     * @return {Test} This Test.
     */

    reset() {

        const fog = this.scene.fog;

        this.scene = new Scene();
        this.scene.fog = fog;

        if(this.controls !== null) {
            this.controls.dispose();
            this.controls = null;
        }

        return this;
    }
}
