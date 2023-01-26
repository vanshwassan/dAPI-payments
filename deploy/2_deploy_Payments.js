const hre = require("hardhat");

module.exports = async () => {

  const WETH = await hre.deployments.get("WETH");
  const WETHAddress = WETH.address;
  const ethUsdBytes32 = "0x4554482f55534400000000000000000000000000000000000000000000000000";

    const dapiServerAddress = "0x71Da7A936fCaEd1Ee364Df106B12deF6D1Bf1f14";

    const PaymentsContract = await hre.deployments.deploy("Payments", {
      args: [dapiServerAddress, WETHAddress],
      from: (await hre.getUnnamedAccounts())[0],
      log: true,
    });
    console.log(`Deployed PaymentsContract at ${PaymentsContract.address}`);
    console.log(`PaymentsContract contract deployed!`);
    const paymentsContract = new hre.ethers.Contract(
        PaymentsContract.address,
        PaymentsContract.abi,
      hre.ethers.provider.getSigner()
    );

    const setWETHDapi = await paymentsContract.setDapiName(WETHAddress, ethUsdBytes32);
    await setWETHDapi.wait();
    console.log(`DAPI set for Wrapped ETH`);

    // Approve Spending Limits
    const WETHContract = new hre.ethers.Contract(
      WETH.address,
      WETH.abi,
      hre.ethers.provider.getSigner()
    );
    const approve = await WETHContract.approve(PaymentsContract.address, '10000000000000000000');
    await approve.wait();
    console.log(`Approved to spend Wrapped ETH!`);

  };