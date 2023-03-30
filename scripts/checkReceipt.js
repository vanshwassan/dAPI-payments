const hre = require('hardhat');

async function main() {

  const PaymentsContract = await hre.deployments.get("Payments");
  const paymentsContract = new hre.ethers.Contract(
    PaymentsContract.address,
    PaymentsContract.abi,
    hre.ethers.provider.getSigner()
  );

  // Send in your Payment's Receipt ID
  const CheckR = await paymentsContract.checkReceipt('1');
  console.log(CheckR);

}
  main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });