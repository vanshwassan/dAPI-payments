const hre = require("hardhat");

module.exports = async () => {

  const WETH = await hre.deployments.get("WETH");
  const WGLMR = await hre.deployments.get("WGLMR");

  const WETHAddress = WETH.address;
  const WGLMRAddress = WGLMR.address;

  const ethUsdProxyContract = "0x26690F9f17FdC26D419371315bc17950a0FC90eD";
  const glmrUsdProxyContract = "0xc257C06197330D8EeB9b403b021D984aF46b20DE";

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

  const addWGLMR = await paymentsContract.addAllowedTokens(WGLMRAddress);
  await addWGLMR.wait();
  console.log(`Wrapped GLMR added to allowed tokens!`);

    // Set DAPIs
    const setWETHDapi = await paymentsContract.setDapiProxy(WETHAddress, ethUsdProxyContract);
    await setWETHDapi.wait();
    console.log(`DAPI set for Wrapped ETH`);

    const setWGLMRDapi = await paymentsContract.setDapiProxy(WGLMRAddress, glmrUsdProxyContract);
    await setWGLMRDapi.wait();
    console.log(`DAPI set for Wrapped GLMR`);

    // Approve Spending Limits
    const WETHContract = new hre.ethers.Contract(
      WETH.address,
      WETH.abi,
      hre.ethers.provider.getSigner()
    );
    const approve = await WETHContract.approve(PaymentsContract.address, '10000000000000000000');
    await approve.wait();
    console.log(`Approved to spend Wrapped ETH!`);

    const WGLMRContract = new hre.ethers.Contract(
      WGLMR.address,
      WGLMR.abi,
      hre.ethers.provider.getSigner()
    );
    const _approve = await WGLMRContract.approve(PaymentsContract.address, '10000000000000000000');
    await _approve.wait();
    console.log(`Approved to spend Wrapped GLMR!`);

  };
