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

  const WMATIC = await hre.deployments.get("WMATIC");
  const WMATICAddress = WMATIC.address;

// Send 2.5 WETH
  const Pay = await paymentsContract.Payment(WETHAddress, '2500000000000000000');
  await Pay.wait();
  console.log("WETH Payment made!");

// Send 2.5 WMATIC
  const Pay2 = await paymentsContract.Payment(WMATICAddress, '2500000000000000000');
  await Pay2.wait();
  console.log("WMATIC Payment made!");

}
  main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });