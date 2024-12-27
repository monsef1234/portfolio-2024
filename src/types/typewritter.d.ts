declare module "typewriter-effect/dist/core" {
  export default class Typewriter {
    constructor(element: HTMLElement | string, options?: TypewriterOptions);

    typeString(string: string): Typewriter;
    deleteAll(speed?: number): Typewriter;
    pauseFor(ms: number): Typewriter;
    start(): Typewriter;
    stop(): Typewriter;
    callFunction(callback: () => void): Typewriter;

    changeDelay(delay: number): Typewriter;
    changeDeleteSpeed(delay: number): Typewriter;
  }

  interface TypewriterOptions {
    strings?: string[];
    autoStart?: boolean;
    loop?: boolean;
    delay?: number;
    deleteSpeed?: number;
    cursor?: string;
  }
}
