const util = require('util');
const exec = util.promisify(require('child_process').exec);


const runCommand = async (command) => {
    const {stdout, stderr} = await exec(command);

    if (stderr.toString().length > 0) {
        console.error(`"${command}" threw an error: \n${stderr.toString()}`);
        process.exit(1);
    }

    console.log(`"${command}" output the following: \n${stdout.toString()}`)
};


const gitAddAndCommitAll = async () => {
    try {
        await runCommand('git add -A');
        await runCommand(`git commit -m 'automatic update at ${new Date.toString()}'`);

    } catch (err) {
        console.error('error committing changes to git');
    }
};

module.exports = (async () => await gitAddAndCommitAll())();


