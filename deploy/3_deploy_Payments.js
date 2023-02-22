const hre = require("hardhat");

module.exports = async () => {

  const WETH = await hre.deployments.get("WETH");
  const WMATIC = await hre.deployments.get("WMATIC");

  const WETHAddress = WETH.address;
  const WMATICAddress = WMATIC.address;

  const ethUsdBytes32 = "0x4554482f55534400000000000000000000000000000000000000000000000000";
  const maticUsdBytes32 = "0x4d415449432f5553440000000000000000000000000000000000000000000000";

    const dapiServerAddress = "0x71Da7A936fCaEd1Ee364Df106B12deF6D1Bf1f14";

    const PaymentsContract = await hre.deployments.deploy("Payments", {
      args: [dapiServerAddress],
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

  // Add allowed tokens
  const addWETH = await paymentsContract.addAllowedTokens(WETHAddress);
  await addWETH.wait();
  console.log(`Wrapped ETH added to allowed tokens!`);

  const addWMATIC = await paymentsContract.addAllowedTokens(WMATICAddress);
  await addWMATIC.wait();
  console.log(`Wrapped Matic added to allowed tokens!`);

    // Set DAPIs
    const setWETHDapi = await paymentsContract.setDapiName(WETHAddress, ethUsdBytes32);
    await setWETHDapi.wait();
    console.log(`DAPI set for Wrapped ETH`);

    const setWMATICDapi = await paymentsContract.setDapiName(WMATICAddress, maticUsdBytes32);
    await setWMATICDapi.wait();
    console.log(`DAPI set for Wrapped Matic`);

    // Approve Spending Limits
    const WETHContract = new hre.ethers.Contract(
      WETH.address,
      WETH.abi,
      hre.ethers.provider.getSigner()
    );
    const approve = await WETHContract.approve(PaymentsContract.address, '10000000000000000000');
    await approve.wait();
    console.log(`Approved to spend Wrapped ETH!`);

    const WMATICContract = new hre.ethers.Contract(
      WMATIC.address,
      WMATIC.abi,
      hre.ethers.provider.getSigner()
    );
    const _approve = await WMATICContract.approve(PaymentsContract.address, '10000000000000000000');
    await _approve.wait();
    console.log(`Approved to spend Wrapped Matic!`);

  };
