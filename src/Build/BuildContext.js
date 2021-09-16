const { Chunks } = require('../Chunks');
const Task = require('../tasks/Task');
const { Manifest } = require('./Manifest');

/**
 * Holds all the data necessary for the current build
 */
exports.BuildContext = class BuildContext {
    /**
     * @param {import('../Mix')} mix
     */
    constructor(mix) {
        /** @internal */
        this.mix = mix;

        /**
         * @public
         * @type {typeof mix.config}
         */
        this.config = Object.create(mix.config);

        /**
         * @public
         */
        this.chunks = new Chunks(mix);

        /**
         * @public
         */
        this.manifest = new Manifest();

        /**
         * @type {Task[]}
         * @internal
         **/
        this.tasks = [];

        /** Record<string, any> */
        this.metadata = {};
    }

    /**
     * Queue up a new task.
     * TODO: Add a "stage" to tasks so they can run at different points during the build
     *
     * @param {Task} task
     * @param {{ when: "before" | "during" | "after"}} options
     */
    addTask(task, options) {
        this.tasks.push(task);
    }

    /**
     * @returns {import("../../types/index")}
     */
    get api() {
        if (!this._api) {
            this._api = this.mix.registrar.installAll();

            // @ts-ignore
            this._api.inProduction = () => this.config.production;
        }

        // @ts-ignore
        return this._api;
    }
};
