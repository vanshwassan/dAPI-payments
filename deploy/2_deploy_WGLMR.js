const hre = require('hardhat');

module.exports = async function() {
  // Deploy WGLMR Token
    const WGLMR = await hre.deployments.deploy('WGLMR', {
        from: (await hre.getUnnamedAccounts())[0],
    } );
    console.log(`Deployed Wrapped GLMR at ${WGLMR.address}`);
    console.log(`Wrapped GLMR sent!`);
}
