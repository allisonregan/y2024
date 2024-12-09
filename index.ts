import { exec } from 'child_process';

console.log(`Running: ${process.argv[2]}`);

exec(`cd ${process.argv[2]} && npx tsx src.ts`, (error, stdout, stderr) => {
    if (error) {
        console.log(stdout);
        console.error(`exec error: ${error}`);
        return;
    }
    console.log(stdout);
});

