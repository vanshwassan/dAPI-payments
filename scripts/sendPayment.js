const hre = require('hardhat');

async function main() {

  const PaymentsContract = await hre.deployments.get("Payments");
  const paymentsContract = new hre.ethers.Contract(
    PaymentsContract.address,
    PaymentsContract.abi,
    hre.ethers.provider.getSigner()
  );
  const WETH = await hre.deployments.get("WETH");
  const WETHAddress = WETH.address;

  const WGLMR = await hre.deployments.get("WGLMR");
  const WGLMRAddress = WGLMR.address;

// Send 2.5 WETH
  const Pay = await paymentsContract.Payment(WETHAddress, '2500000000000000000');
  await Pay.wait();
  console.log("WETH Payment made!");

// Send 2.5 WGLMR
  const Pay2 = await paymentsContract.Payment(WGLMRAddress, '2500000000000000000');
  await Pay2.wait();
  console.log("WGLMR Payment made!");

}
  main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });