import { main } from './cli.ts';

if (import.meta.main) {
    main([...Deno.args, '--smallweb']);
}
