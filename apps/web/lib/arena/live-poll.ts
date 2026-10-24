/** One in-flight read. Hidden/unmounted surfaces cancel their request, and
 * terminal responses stop. Injectable timers make the hourly count executable. */
export class LivePollError extends Error {
    terminal: boolean;
    constructor(terminal: boolean) { super("live_poll_failed"); this.terminal = terminal; }
}
export interface PollOptions<T> {
    load: (signal: AbortSignal) => Promise<{
        value: T;
        done: boolean;
    }>;
    onValue: (value: T) => void;
    onError: (terminal: boolean) => void;
    visible: () => boolean;
    setTimer?: (callback: () => void, ms: number) => ReturnType<typeof setTimeout>;
    clearTimer?: (id: ReturnType<typeof setTimeout>) => void;
}
export function createLivePoll<T>(options: PollOptions<T>) {
    const set = options.setTimer ?? setTimeout, clear = options.clearTimer ?? clearTimeout;
    let stopped = false, active: AbortController | null = null, timer: ReturnType<typeof setTimeout> | undefined, failures = 0;
    function unschedule() { if (timer !== undefined)
        clear(timer); timer = undefined; }
    function stop() { stopped = true; unschedule(); active?.abort(); active = null; }
    async function run() {
        unschedule();
        if (stopped || active || !options.visible())
            return;
        const controller = new AbortController();
        active = controller;
        const timeout = set(() => controller.abort(), 8000);
        try {
            const result = await options.load(controller.signal);
            if (stopped || active !== controller || controller.signal.aborted)
                return;
            failures = 0;
            options.onValue(result.value);
            if (result.done)
                stop();
        }
        catch (error) {
            if (stopped || active !== controller)
                return;
            const terminal = error instanceof LivePollError && error.terminal;
            failures++;
            options.onError(terminal);
            if (terminal)
                stop();
        }
        finally {
            clear(timeout);
            if (active === controller) {
                active = null;
                if (!stopped && options.visible())
                    timer = set(() => void run(), Math.min(30000, 2000 * 2 ** Math.min(failures, 4)));
            }
        }
    }
    function wake() {
        if (stopped)
            return;
        if (!options.visible()) {
            unschedule();
            active?.abort();
            active = null;
            return;
        }
        if (!active && timer === undefined)
            void run();
    }
    return { start: wake, wake, stop };
}
