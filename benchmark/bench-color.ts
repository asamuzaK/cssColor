/**
 * bench-color.ts
 */

import process from 'node:process';
import { run, bench, group } from 'mitata';
import { resolve } from '../src/js/resolve.ts';

// 1. Get cache size from command line arguments (for display purposes)
let cacheSize = 4096;
const sizeArg = process.argv.find(arg => arg.startsWith('--size='));
if (sizeArg) {
  cacheSize = parseInt(sizeArg.split('=')[1], 10);
}

// 2. Generate complex color data for benchmarking
// Evaluate 1,000 unique colors in a single loop.
// Due to internal nesting (resolve, color-mix, var, color, lch),
// 1,000 unique colors x ~4 keys = ~4,000 cache keys generated at once.
const TOTAL_COLORS = 1000;
const colors = [];
for (let i = 0; i < TOTAL_COLORS; i++) {
  // Intentionally use strings that have high parsing overhead and generate multiple intermediate caches.
  colors.push(`color-mix(in srgb, var(--custom-${i}), lch(50% 50 ${i % 360}))`);
}

// Callback option to dynamically resolve var()
const customProperty = {
  callback: name => {
    // e.g., --custom-0 -> color(display-p3 0.0 0.5 0.5)
    const id = name.replace('--custom-', '');
    return `color(display-p3 0.${id} 0.5 0.5)`;
  }
};

console.log(`=======================================`);
console.log(`CSS Color Cache Benchmark (mitata)`);
console.log(`Cache Size: ${cacheSize}`);
console.log(`Unique Colors: ${TOTAL_COLORS}`);
console.log(
  `Estimated Cache Keys: ~${TOTAL_COLORS * 4} (Due to intermediate AST caching)`
);
console.log(`=======================================`);

// 5. Setup mitata benchmark
group(`CSS Color Resolve (Cache: ${cacheSize})`, () => {
  bench(`Resolve ${TOTAL_COLORS} complex colors x 5 iterations`, () => {
    // Simulate a scenario where multiple elements in the DOM evaluate the same CSS colors
    // by evaluating the same array (1,000 colors) 5 times.
    // If the cache capacity is insufficient, the first cached items will be evicted by the end of one loop,
    // resulting in a permanent cache miss state (thrashing).
    for (let iter = 0; iter < 5; iter++) {
      for (let i = 0; i < TOTAL_COLORS; i++) {
        resolve(colors[i], { customProperty });
      }
    }
  });
});

// Run the benchmark
await run({
  colors: true,
  json: false
});
