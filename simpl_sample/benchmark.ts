import { SimplSite } from "../mod.ts";
import { config } from "./config.ts";

function calculatePercentile(sortedArray: number[], percentile: number): number {
  const index = Math.ceil((percentile / 100) * sortedArray.length) - 1;
  return sortedArray[index];
}

async function runDetailedBenchmark(simplSite: SimplSite, path: string, warmupIterations: number, measuredIterations: number) {
  const times: number[] = [];

  // Warm-up phase
  for (let i = 0; i < warmupIterations; i++) {
    await simplSite.handleRequest(path);
  }

  // Measurement phase
  for (let i = 0; i < measuredIterations; i++) {
    const startTime = performance.now();
    await simplSite.handleRequest(path);
    const endTime = performance.now();
    times.push(endTime - startTime);
  }

  times.sort((a, b) => a - b);

  return {
    average: times.reduce((a, b) => a + b, 0) / times.length,
    median: calculatePercentile(times, 50),
    min: times[0],
    max: times[times.length - 1],
    p95: calculatePercentile(times, 95),
    p99: calculatePercentile(times, 99),
  };
}

async function main() {
  const warmupIterations = 50;
  const measuredIterations = 1000;
  const testPath = "/plugin-example";

  // Test with caching enabled
  const configWithCache = { ...config, caching: { enabled: true } };
  const siteWithCache = new SimplSite(configWithCache);
  console.log("Running benchmark with caching enabled...");
  const resultsWithCache = await runDetailedBenchmark(siteWithCache, testPath, warmupIterations, measuredIterations);

  // Clear cache and test with caching disabled
  siteWithCache.clearCache();
  const configWithoutCache = { ...config, caching: { enabled: false } };
  const siteWithoutCache = new SimplSite(configWithoutCache);
  console.log("Running benchmark with caching disabled...");
  const resultsWithoutCache = await runDetailedBenchmark(siteWithoutCache, testPath, warmupIterations, measuredIterations);

  console.log("Results with caching:");
  console.log(resultsWithCache);
  console.log("Results without caching:");
  console.log(resultsWithoutCache);

  const speedup = resultsWithoutCache.average / resultsWithCache.average;
  console.log(`Caching provides a ${speedup.toFixed(2)}x speedup on average`);

  if (resultsWithCache.max > resultsWithoutCache.max) {
    console.log("Note: The maximum response time with caching is higher than without caching.");
    console.log("This could be due to initial cache population or system variability.");
    console.log("Consider the median and 95th percentile for a more representative comparison.");
  }
}

main();
