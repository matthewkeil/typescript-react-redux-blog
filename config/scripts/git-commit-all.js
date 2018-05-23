const util = require('util');
const child_process = require('child_process');
const exec = util.promisify(child_process.exec);


const gitAddAll = () => exec('git add -A');

const gitCommit = () => exec(`git commit -m "${Date.now()}"`);

const gitAddAndCommitAll = async () => {
    try {
        const {stdout, stderr} = await gitAddAll();

        if (stderr.toString().length > 0) {
            console.error('git add all error:\n' + stderr.toString());
            return;
        }

        console.log('git add all output:\n' + stdout.toString());

        const response = await gitCommit();

        if (response.stderr.toString().length > 0) {
            console.error('git commit error:\n' + response.stderr.toString());
            return;
        }

        console.log('git commit output:\n' + response.stdout);

    } catch (err) {
        console.error('error committing changes to git');
    }
};

module.exports = (async function () {
    return await gitAddAndCommitAll();
})();


