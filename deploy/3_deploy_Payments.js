const hre = require("hardhat");

module.exports = async () => {

  const WETH = await hre.deployments.get("WETH");
  const WMATIC = await hre.deployments.get("WMATIC");

  const WETHAddress = WETH.address;
  const WMATICAddress = WMATIC.address;

  const ethUsdProxyContract = "0x26690F9f17FdC26D419371315bc17950a0FC90eD";
  const maticUsdProxyContract = "0x3ACccB328Db79Af1B81a4801DAf9ac8370b9FBF8";

    const PaymentsContract = await hre.deployments.deploy("Payments", {
      args: [],
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
    const setWETHDapi = await paymentsContract.setDapiProxy(WETHAddress, ethUsdProxyContract);
    await setWETHDapi.wait();
    console.log(`DAPI set for Wrapped ETH`);

    const setWMATICDapi = await paymentsContract.setDapiProxy(WMATICAddress, maticUsdProxyContract);
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
