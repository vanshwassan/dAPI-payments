const hre = require('hardhat');

module.exports = async function() {
  // Deploy WMATIC Token
    const WMATIC = await hre.deployments.deploy('WMATIC', {
        from: (await hre.getUnnamedAccounts())[0],
    } );
    console.log(`Deployed Wrapped Matic at ${WMATIC.address}`);
    console.log(`Wrapped Matic sent!`);
}
