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
// Stake 2.5 ETH
  const Withdraw = await paymentsContract.ownerWithdrawWETH();
  await Withdraw.wait();
  console.log("Withdrawal made!");

}
  main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });