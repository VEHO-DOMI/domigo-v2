import assert from "node:assert/strict";
import { it } from "node:test";
import { createLivePoll, LivePollError } from "./live-poll.ts";
class Clock {
    now = 0;
    next = 0;
    jobs = new Map<number, {
        at: number;
        run: () => void;
    }>();
    set = (run: () => void, ms: number) => { const id = ++this.next; this.jobs.set(id, { at: this.now + ms, run }); return id as unknown as ReturnType<typeof setTimeout>; };
    clear = (id: ReturnType<typeof setTimeout>) => { this.jobs.delete(id as unknown as number); };
    async flush() { for (let i = 0; i < 8; i++)
        await Promise.resolve(); }
    async until(end: number) { await this.flush(); for (;;) {
        const job = [...this.jobs].filter(([, j]) => j.at < end).sort((a, b) => a[1].at - b[1].at)[0];
        if (!job)
            break;
        this.now = job[1].at;
        this.jobs.delete(job[0]);
        job[1].run();
        await this.flush();
    } this.now = end; }
}
it("P01 one in-flight read, hidden pause and late answer cancellation", async () => {
    const clock = new Clock();
    let visible = true, calls = 0, values = 0, signal: AbortSignal | undefined, resolve: ((value: {
        value: number;
        done: boolean;
    }) => void) | undefined;
    const poll = createLivePoll<number>({ visible: () => visible, setTimer: clock.set, clearTimer: clock.clear, load: s => { calls++; signal = s; return new Promise(r => { resolve = r; }); }, onValue: () => { values++; }, onError: () => { } });
    poll.start();
    poll.wake();
    assert.equal(calls, 1);
    await clock.until(5000);
    assert.equal(calls, 1);
    visible = false;
    poll.wake();
    assert.equal(signal?.aborted, true);
    resolve!({ value: 1, done: false });
    await clock.flush();
    assert.equal(values, 0);
    await clock.until(20000);
    assert.equal(calls, 1);
    visible = true;
    poll.wake();
    assert.equal(calls, 2);
    poll.stop();
    assert.equal(signal?.aborted, true);
    resolve!({ value: 1, done: false });
    await clock.flush();
    assert.equal(values, 0);
    assert.equal(clock.jobs.size, 0);
});
it("P02 measured 25 pupils + one teacher, one hour: exactly 46800 poll requests", async () => {
    const clock = new Clock();
    let requests = 0;
    const polls = Array.from({ length: 26 }, () => createLivePoll<number>({ visible: () => true, setTimer: clock.set, clearTimer: clock.clear, load: async () => { requests++; return { value: 0, done: false }; }, onValue: () => { }, onError: () => { } }));
    polls.forEach(p => p.start());
    await clock.until(3600000);
    polls.forEach(p => p.stop());
    assert.equal(requests, 46800);
    assert.equal(clock.jobs.size, 0);
});
it("P03 completion and unavailable response stop permanently", async () => {
    for (const fail of [false, true]) {
        const clock = new Clock();
        let calls = 0, terminal = false;
        const poll = createLivePoll<number>({ visible: () => true, setTimer: clock.set, clearTimer: clock.clear, load: async () => { calls++; if (fail)
                throw new LivePollError(true); return { value: 0, done: true }; }, onValue: () => { }, onError: t => { terminal = t; } });
        poll.start();
        await clock.until(60000);
        poll.wake();
        assert.equal(calls, 1);
        assert.equal(terminal, fail);
        assert.equal(clock.jobs.size, 0);
    }
});
it("P04 failed reads back off, never retry faster than two seconds", async () => {
    const clock = new Clock(), times: number[] = [];
    const poll = createLivePoll<number>({ visible: () => true, setTimer: clock.set, clearTimer: clock.clear, load: async () => { times.push(clock.now); throw Error('synthetic'); }, onValue: () => { }, onError: () => { } });
    poll.start();
    await clock.until(60000);
    poll.stop();
    assert.deepEqual(times, [0, 4000, 12000, 28000, 58000]);
});
it("P05 hung read aborts at eight seconds and can recover", async () => {
    const clock = new Clock();
    let calls = 0;
    const poll = createLivePoll<number>({ visible: () => true, setTimer: clock.set, clearTimer: clock.clear, load: signal => { calls++; return new Promise((_r, reject) => signal.addEventListener('abort', () => reject(Error('timeout')))); }, onValue: () => { }, onError: () => { } });
    poll.start();
    await clock.until(8001);
    assert.equal(calls, 1);
    await clock.until(12001);
    assert.equal(calls, 2);
    poll.stop();
    await clock.flush();
    assert.equal(clock.jobs.size, 0);
});
